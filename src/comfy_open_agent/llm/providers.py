"""LLM providers with native tool calling.

Each provider keeps the conversation in its own wire format, so assistant turns
(including thinking blocks) are replayed exactly as the API returned them.
"""

import json
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional, Tuple

from ..tools.registry import Tool, ToolOutput

PROVIDER_DEFAULTS: Dict[str, Dict[str, str]] = {
    "local": {"base_url": "http://localhost:11434/v1", "model": "qwen3"},
    "openai": {"base_url": "https://api.openai.com/v1", "model": "gpt-5"},
    "anthropic": {"base_url": "https://api.anthropic.com", "model": "claude-opus-5-5"},
}

ANTHROPIC_MAX_TOKENS = 16000
ANTHROPIC_FALLBACK_BETA = "server-side-fallback-2026-07-01"
# Models that accept server-side `fallbacks: "default"` on the first-party API
ANTHROPIC_FALLBACK_MODELS = {"claude-fable-5-1", "claude-opus-5-5", "claude-opus-5", "claude-sonnet-5-5"}
ANTHROPIC_EFFORT_PREFIXES = (
    "claude-fable-5", "claude-mythos-5", "claude-opus-5", "claude-sonnet-5", "claude-haiku-5",
    "claude-opus-4-6", "claude-opus-4-7", "claude-opus-4-8", "claude-sonnet-4-6",
)


class LLMError(Exception):
    """A provider failure with a message suitable for the end user."""


@dataclass
class ToolCall:
    id: str
    name: str
    arguments: Dict[str, Any]
    parse_error: Optional[str] = None


@dataclass
class StepResult:
    text: str
    tool_calls: List[ToolCall] = field(default_factory=list)
    stop_reason: str = ""
    refusal: Optional[str] = None


class LLMProvider:
    name = "base"

    def __init__(self, model: str, base_url: str, api_key: str):
        self.model = model
        self.base_url = base_url
        self.api_key = api_key

    def user_message(self, text: str) -> Dict[str, Any]:
        return {"role": "user", "content": text}

    async def step(
        self, system: str, tools: List[Tool], messages: List[Dict[str, Any]]
    ) -> Tuple[StepResult, List[Dict[str, Any]]]:
        """Run one model turn. Returns the result and the messages to append to history."""
        raise NotImplementedError

    def tool_results(self, results: List[Tuple[ToolCall, ToolOutput]]) -> List[Dict[str, Any]]:
        raise NotImplementedError

    async def close(self) -> None:
        pass


class OpenAICompatibleProvider(LLMProvider):
    """OpenAI Chat Completions API. Also covers Ollama, LM Studio, vLLM, OpenRouter, ..."""

    name = "openai"

    def __init__(self, model: str, base_url: str, api_key: str, require_key: bool):
        super().__init__(model, base_url, api_key)
        try:
            import openai
            from openai import AsyncOpenAI
        except ImportError:
            raise LLMError("The 'openai' package is not installed. Run: pip install -r requirements.txt")
        # Local servers ignore the key but the SDK insists on one
        key = api_key or (None if require_key else "not-needed")
        try:
            self.client = AsyncOpenAI(api_key=key, base_url=base_url)
        except openai.OpenAIError as e:
            if require_key and not api_key:
                raise LLMError("No OpenAI API key: set one in Settings → Open Agent → API key, "
                               "or OPENAI_API_KEY on the ComfyUI server.")
            raise LLMError(f"Could not create the OpenAI client: {e}")

    async def step(self, system, tools, messages):
        import openai

        request_messages = [{"role": "system", "content": system}, *messages]
        tool_defs = [
            {"type": "function", "function": {"name": t.name, "description": t.description, "parameters": t.input_schema}}
            for t in tools
        ]
        try:
            resp = await self.client.chat.completions.create(
                model=self.model, messages=request_messages, tools=tool_defs
            )
        except openai.AuthenticationError:
            raise LLMError("Authentication failed: check the API key in the Open Agent settings.")
        except openai.NotFoundError as e:
            raise LLMError(f"Model or endpoint not found ({self.model} @ {self.base_url}): {e.message}")
        except openai.RateLimitError:
            raise LLMError("Rate limited by the provider. Wait a moment and try again.")
        except openai.APIStatusError as e:
            raise LLMError(f"Provider returned HTTP {e.status_code}: {e.message}")
        except openai.APIConnectionError:
            raise LLMError(f"Could not connect to {self.base_url}. Is the server running?")

        if not resp.choices:
            raise LLMError("The provider returned no choices.")
        choice = resp.choices[0]
        msg = choice.message
        calls: List[ToolCall] = []
        native_calls = []
        for tc in msg.tool_calls or []:
            if getattr(tc, "type", "function") != "function":
                continue
            raw_args = tc.function.arguments or "{}"
            try:
                args = json.loads(raw_args)
                error = None if isinstance(args, dict) else "arguments must be a JSON object"
            except json.JSONDecodeError as e:
                args, error = {}, f"invalid JSON arguments: {e}"
            calls.append(ToolCall(tc.id, tc.function.name, args if isinstance(args, dict) else {}, error))
            native_calls.append({"id": tc.id, "type": "function",
                                 "function": {"name": tc.function.name, "arguments": raw_args}})

        text = msg.content or ""
        if not calls and text:
            # Small local models sometimes write the call into the reply instead of a tool_calls entry
            for i, (name, args) in enumerate(extract_text_tool_calls(text, {t.name for t in tools})):
                call_id = f"text_call_{len(messages)}_{i}"
                calls.append(ToolCall(call_id, name, args))
                native_calls.append({"id": call_id, "type": "function",
                                     "function": {"name": name, "arguments": json.dumps(args, ensure_ascii=False)}})

        assistant: Dict[str, Any] = {"role": "assistant", "content": text}
        if native_calls:
            assistant["tool_calls"] = native_calls
        refusal = getattr(msg, "refusal", None)
        return StepResult(text, calls, choice.finish_reason or "", refusal), [assistant]

    def tool_results(self, results):
        out: List[Dict[str, Any]] = []
        image_parts: List[Dict[str, Any]] = []
        for call, output in results:
            out.append({"role": "tool", "tool_call_id": call.id, "content": output.text})
            for img in output.images:
                image_parts.append({"type": "image_url",
                                    "image_url": {"url": f"data:{img.media_type};base64,{img.data}"}})
        # Tool messages cannot carry images, so attach them in a user turn after the batch
        if image_parts:
            out.append({"role": "user",
                        "content": [{"type": "text", "text": "Images returned by the tool calls above:"}, *image_parts]})
        return out

    async def close(self):
        await self.client.close()


class AnthropicProvider(LLMProvider):
    """Anthropic Messages API via the official SDK."""

    name = "anthropic"

    def __init__(self, model: str, base_url: str, api_key: str):
        super().__init__(model, base_url, api_key)
        try:
            from anthropic import AsyncAnthropic
        except ImportError:
            raise LLMError("The 'anthropic' package is not installed. Run: pip install -r requirements.txt")
        # An empty key lets the SDK resolve ANTHROPIC_API_KEY / an `ant auth login` profile
        self.client = AsyncAnthropic(api_key=api_key or None, base_url=base_url)
        self.first_party = base_url.rstrip("/") == PROVIDER_DEFAULTS["anthropic"]["base_url"]

    async def step(self, system, tools, messages):
        import anthropic

        kwargs: Dict[str, Any] = {
            "model": self.model,
            "max_tokens": ANTHROPIC_MAX_TOKENS,
            "system": system,
            "tools": [{"name": t.name, "description": t.description, "input_schema": t.input_schema} for t in tools],
            "messages": messages,
            "cache_control": {"type": "ephemeral"},
        }
        if self.model.startswith(ANTHROPIC_EFFORT_PREFIXES):
            kwargs["output_config"] = {"effort": "medium"}

        try:
            if self.first_party and self.model in ANTHROPIC_FALLBACK_MODELS:
                resp = await self.client.beta.messages.create(
                    **kwargs, betas=[ANTHROPIC_FALLBACK_BETA], fallbacks="default"
                )
            else:
                resp = await self.client.messages.create(**kwargs)
        except anthropic.AuthenticationError:
            raise LLMError("Authentication failed: set a valid Anthropic API key in the Open Agent settings "
                           "or ANTHROPIC_API_KEY on the ComfyUI server.")
        except anthropic.NotFoundError as e:
            raise LLMError(f"Model not found ({self.model}): {e.message}")
        except anthropic.RateLimitError:
            raise LLMError("Rate limited by Anthropic. Wait a moment and try again.")
        except anthropic.APIStatusError as e:
            raise LLMError(f"Anthropic returned HTTP {e.status_code}: {e.message}")
        except anthropic.APIConnectionError:
            raise LLMError(f"Could not connect to {self.base_url}.")
        except TypeError as e:
            # The SDK raises TypeError when no credentials can be resolved
            if not self.api_key:
                raise LLMError("No Anthropic API key: set one in Settings → Open Agent → API key, "
                               "or ANTHROPIC_API_KEY on the ComfyUI server.")
            raise LLMError(f"Anthropic client error: {e}")

        content = [block.model_dump(mode="json", exclude_none=True) for block in resp.content]
        text = "".join(b.get("text", "") for b in content if b.get("type") == "text")
        calls = [ToolCall(b["id"], b["name"], b.get("input") or {}) for b in content if b.get("type") == "tool_use"]

        refusal = None
        if resp.stop_reason == "refusal":
            details = getattr(resp, "stop_details", None)
            refusal = getattr(details, "explanation", None) or "The model declined this request."

        history = [{"role": "assistant", "content": content}] if content else []
        return StepResult(text, calls, resp.stop_reason or "", refusal), history

    def tool_results(self, results):
        blocks = []
        for call, output in results:
            content: List[Dict[str, Any]] = [{"type": "text", "text": output.text}]
            for img in output.images:
                content.append({"type": "image",
                                "source": {"type": "base64", "media_type": img.media_type, "data": img.data}})
            block: Dict[str, Any] = {"type": "tool_result", "tool_use_id": call.id, "content": content}
            if output.is_error:
                block["is_error"] = True
            blocks.append(block)
        return [{"role": "user", "content": blocks}]

    async def close(self):
        await self.client.close()


def extract_text_tool_calls(text: str, tool_names: set) -> List[Tuple[str, Dict[str, Any]]]:
    """Find {"name": <tool>, "arguments"|"parameters": {...}} objects written as plain text."""
    decoder = json.JSONDecoder()
    found: List[Tuple[str, Dict[str, Any]]] = []
    pos = text.find("{")
    while pos != -1:
        try:
            obj, end = decoder.raw_decode(text, pos)
        except json.JSONDecodeError:
            pos = text.find("{", pos + 1)
            continue
        if isinstance(obj, dict) and obj.get("name") in tool_names:
            args = obj.get("arguments", obj.get("parameters", {}))
            if isinstance(args, str):
                try:
                    args = json.loads(args)
                except json.JSONDecodeError:
                    args = None
            if isinstance(args, dict):
                found.append((obj["name"], args))
        pos = text.find("{", end)
    return found


def normalize_base_url(provider: str, base_url: str) -> str:
    url = (base_url or "").strip().rstrip("/") or PROVIDER_DEFAULTS[provider]["base_url"]
    # Older settings pointed at Ollama's native endpoint; the OpenAI-compatible one lives at /v1
    if provider != "anthropic" and url.endswith("/api/chat"):
        url = url[: -len("/api/chat")] + "/v1"
    return url


def create_provider(provider: str, model: str = "", base_url: str = "", api_key: str = "") -> LLMProvider:
    if provider not in PROVIDER_DEFAULTS:
        raise LLMError(f"Unknown provider '{provider}'. Use one of: {', '.join(PROVIDER_DEFAULTS)}")
    model = (model or "").strip() or PROVIDER_DEFAULTS[provider]["model"]
    url = normalize_base_url(provider, base_url)
    api_key = (api_key or "").strip()
    if provider == "anthropic":
        return AnthropicProvider(model, url, api_key)
    return OpenAICompatibleProvider(model, url, api_key, require_key=provider == "openai")
