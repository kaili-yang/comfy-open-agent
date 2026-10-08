"""Agent loop: drives an LLM through tool calls and streams progress events."""

import asyncio
import json
import time
import uuid
from collections import OrderedDict
from dataclasses import dataclass, field
from typing import Any, Awaitable, Callable, Dict, List, Optional, Tuple

from ..llm.providers import LLMError, LLMProvider, ToolCall, create_provider
from ..skills.manager import get_skills_manager
from ..tools import ToolContext, ToolOutput, get_registry

MAX_CONVERSATIONS = 50
DEFAULT_MAX_STEPS = 30
MAX_TOOL_TEXT = 60_000

Emit = Callable[[Dict[str, Any]], Awaitable[None]]

SYSTEM_PROMPT = """You are Comfy Open Agent, an assistant built into ComfyUI. You build, edit, run and debug \
ComfyUI workflows on the user's canvas by calling tools.

How to work:
- You call the tools yourself. Never ask the user to call a tool or to paste canvas contents.
- Look before you edit: call get_canvas to see the current workflow. Node ids and slot names come from there.
- Do not guess node class names, input names or combo values. Find node types with search_nodes, read their \
inputs and outputs with get_node_info, and pick model files that exist on this machine with list_models.
- To build a new workflow from scratch, prefer load_workflow with a complete API-format workflow. It replaces \
the canvas, so if the canvas already holds work the user may want to keep, ask first. For changes to an \
existing workflow use add_node, connect, set_widgets and remove_node.
- After queue_workflow, call get_run_status to wait for the result. If the run fails, read the error, fix the \
workflow and try again when the fix is clear; otherwise explain the problem. Use view_image to check outputs \
when their look matters.
- Only queue a workflow when the user asked for a result or agreed to run it.
- Keep replies short: say what you changed and why. Don't paste workflow JSON unless asked.
- Reply in the user's language."""


def build_system_prompt() -> str:
    skills = get_skills_manager().list_skills()
    if not skills:
        return SYSTEM_PROMPT
    lines = "\n".join(f"- {s['name']}: {s['description']}" for s in skills)
    return (
        f"{SYSTEM_PROMPT}\n\nSkills: instruction packs for specific tasks. When one matches the request, "
        f"load it with read_skill before starting.\n{lines}"
    )


@dataclass
class Conversation:
    id: str
    provider_key: Tuple[str, str, str]
    messages: List[Dict[str, Any]] = field(default_factory=list)
    lock: asyncio.Lock = field(default_factory=asyncio.Lock)
    cancel_requested: bool = False
    updated_at: float = field(default_factory=time.time)


class ConversationStore:
    def __init__(self, capacity: int = MAX_CONVERSATIONS) -> None:
        self.capacity = capacity
        self._items: "OrderedDict[str, Conversation]" = OrderedDict()

    def get(self, conv_id: str) -> Optional[Conversation]:
        conv = self._items.get(conv_id)
        if conv is not None:
            self._items.move_to_end(conv_id)
        return conv

    def get_or_create(self, conv_id: Optional[str], provider_key: Tuple[str, str, str]) -> Tuple[Conversation, bool]:
        """Return the conversation and whether its history was reset."""
        conv = self.get(conv_id) if conv_id else None
        if conv is not None and conv.provider_key == provider_key:
            return conv, False
        reset = conv is not None
        conv = Conversation(conv_id or uuid.uuid4().hex, provider_key)
        self._items[conv.id] = conv
        self._items.move_to_end(conv.id)
        while len(self._items) > self.capacity:
            self._items.popitem(last=False)
        return conv, reset

    def delete(self, conv_id: str) -> None:
        self._items.pop(conv_id, None)


conversations = ConversationStore()


def _summarize(output: ToolOutput, limit: int = 400) -> str:
    text = output.text
    if len(text) > limit:
        text = text[:limit] + " …"
    if output.images:
        text += f" [+{len(output.images)} image(s)]"
    return text


def _clip(output: ToolOutput) -> ToolOutput:
    if len(output.text) <= MAX_TOOL_TEXT:
        return output
    clipped = output.text[:MAX_TOOL_TEXT] + f"\n… [truncated {len(output.text) - MAX_TOOL_TEXT} characters]"
    return ToolOutput(clipped, output.images, output.is_error)


async def _run_tools(conv: Conversation, calls: List[ToolCall], ctx: ToolContext, emit: Emit) -> List[Tuple[ToolCall, ToolOutput]]:
    registry = get_registry()
    results: List[Tuple[ToolCall, ToolOutput]] = []
    for call in calls:
        if conv.cancel_requested:
            output = ToolOutput.error("Cancelled by the user before this tool ran.")
        elif call.parse_error:
            output = ToolOutput.error(call.parse_error)
        else:
            await emit({"type": "tool_call", "id": call.id, "name": call.name, "arguments": call.arguments})
            output = _clip(await registry.call(call.name, call.arguments, ctx))
            await emit({"type": "tool_result", "id": call.id, "name": call.name,
                        "ok": not output.is_error, "summary": _summarize(output)})
        results.append((call, output))
    return results


async def run_turn(
    conv: Conversation,
    provider: LLMProvider,
    user_text: str,
    ctx: ToolContext,
    emit: Emit,
    max_steps: int = DEFAULT_MAX_STEPS,
) -> None:
    """Run one user turn to completion. History stays valid even when cancelled or failing."""
    tools = get_registry().all()
    system = build_system_prompt()
    conv.cancel_requested = False
    conv.messages.append(provider.user_message(user_text))

    for _ in range(max_steps):
        if conv.cancel_requested:
            await emit({"type": "notice", "message": "Stopped."})
            return
        result, history = await provider.step(system, tools, conv.messages)
        conv.messages.extend(history)
        conv.updated_at = time.time()

        if result.text:
            await emit({"type": "text", "text": result.text})
        if result.refusal:
            await emit({"type": "notice", "message": f"The model declined: {result.refusal}"})
            return
        if not result.tool_calls:
            if result.stop_reason in ("max_tokens", "length"):
                await emit({"type": "notice", "message": "The reply was cut off by the output token limit."})
            return

        results = await _run_tools(conv, result.tool_calls, ctx, emit)
        conv.messages.extend(provider.tool_results(results))

    await emit({"type": "notice",
                "message": f"Stopped after {max_steps} steps. Send 'continue' to let the agent keep going."})


@dataclass
class TurnRequest:
    message: str
    conversation_id: Optional[str]
    provider: str
    model: str
    base_url: str
    api_key: str
    client_id: Optional[str]
    max_steps: int = DEFAULT_MAX_STEPS

    @classmethod
    def from_json(cls, data: Dict[str, Any]) -> "TurnRequest":
        try:
            max_steps = int(data.get("max_steps") or DEFAULT_MAX_STEPS)
        except (TypeError, ValueError):
            max_steps = DEFAULT_MAX_STEPS
        return cls(
            message=str(data.get("message", "")).strip(),
            conversation_id=data.get("conversation_id") or None,
            provider=str(data.get("provider") or "local"),
            model=str(data.get("model") or ""),
            base_url=str(data.get("base_url") or ""),
            api_key=str(data.get("api_key") or ""),
            client_id=data.get("client_id") or None,
            max_steps=max(1, min(max_steps, 100)),
        )


async def start_turn(req: TurnRequest) -> Tuple[Conversation, "asyncio.Queue[Optional[Dict[str, Any]]]"]:
    """Start a turn as a background task and return a queue of its events (None marks the end).

    The task is detached from the HTTP request so a closed tab cannot interrupt
    it between a tool call and its result.
    """
    provider = create_provider(req.provider, req.model, req.base_url, req.api_key)
    key = (req.provider, provider.model, provider.base_url)
    conv, reset = conversations.get_or_create(req.conversation_id, key)
    if conv.lock.locked():
        await provider.close()
        raise LLMError("This conversation is still working on the previous message.")

    queue: "asyncio.Queue[Optional[Dict[str, Any]]]" = asyncio.Queue()

    async def emit(event: Dict[str, Any]) -> None:
        await queue.put(event)

    async def runner() -> None:
        async with conv.lock:
            try:
                await emit({"type": "start", "conversation_id": conv.id, "model": provider.model,
                            "provider": req.provider})
                if reset:
                    await emit({"type": "notice", "message": "Model settings changed, starting a new conversation."})
                await run_turn(conv, provider, req.message, ToolContext(client_id=req.client_id), emit, req.max_steps)
            except LLMError as e:
                await emit({"type": "error", "message": str(e)})
            except Exception as e:
                print(f"[comfy-open-agent] Agent turn failed: {e!r}")
                await emit({"type": "error", "message": f"{type(e).__name__}: {e}"})
            finally:
                await provider.close()
                await emit({"type": "done"})
                await queue.put(None)

    asyncio.get_running_loop().create_task(runner())
    return conv, queue


def encode_event(event: Dict[str, Any]) -> bytes:
    return (json.dumps(event, ensure_ascii=False, default=str) + "\n").encode("utf-8")
