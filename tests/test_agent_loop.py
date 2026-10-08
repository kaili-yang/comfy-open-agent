import asyncio

from comfy_open_agent.agent import loop
from comfy_open_agent.agent.loop import Conversation, ConversationStore, run_turn
from comfy_open_agent.llm.providers import LLMProvider, StepResult, ToolCall
from comfy_open_agent.tools.registry import Tool, ToolContext, ToolRegistry, schema


class ScriptedProvider(LLMProvider):
    """Plays back a list of StepResults and records history in a simple format."""

    def __init__(self, steps):
        super().__init__("m", "u", "")
        self.steps = list(steps)

    async def step(self, system, tools, messages):
        result = self.steps.pop(0)
        return result, [{"role": "assistant", "text": result.text, "calls": [c.id for c in result.tool_calls]}]

    def tool_results(self, results):
        return [{"role": "tool", "id": c.id, "text": o.text, "error": o.is_error} for c, o in results]


def _registry(monkeypatch, seen):
    registry = ToolRegistry()

    async def echo(args, ctx):
        seen.append((args, ctx.client_id))
        return {"echo": args}

    registry.register(Tool("echo", "Echo", schema({}), echo))
    monkeypatch.setattr(loop, "get_registry", lambda: registry)


def _run(conv, provider, emit_events, **kw):
    async def emit(e):
        emit_events.append(e)

    asyncio.run(run_turn(conv, provider, "hello", ToolContext(client_id="tab"), emit, **kw))


def test_tool_round_trip(monkeypatch):
    seen, events = [], []
    _registry(monkeypatch, seen)
    provider = ScriptedProvider([
        StepResult("", [ToolCall("1", "echo", {"x": 1}), ToolCall("2", "missing", {})]),
        StepResult("All done"),
    ])
    conv = Conversation("c", ("p", "m", "u"))
    _run(conv, provider, events)

    assert seen == [({"x": 1}, "tab")]
    assert [e["type"] for e in events] == ["tool_call", "tool_result", "tool_call", "tool_result", "text"]
    assert events[3]["ok"] is False
    roles = [m["role"] for m in conv.messages]
    assert roles == ["user", "assistant", "tool", "tool", "assistant"]


def test_parse_errors_are_reported_without_running(monkeypatch):
    seen, events = [], []
    _registry(monkeypatch, seen)
    provider = ScriptedProvider([
        StepResult("", [ToolCall("1", "echo", {}, parse_error="invalid JSON arguments")]),
        StepResult("ok"),
    ])
    conv = Conversation("c", ("p", "m", "u"))
    _run(conv, provider, events)
    assert seen == []
    assert conv.messages[2]["error"] is True


def test_step_limit_emits_notice(monkeypatch):
    seen, events = [], []
    _registry(monkeypatch, seen)
    provider = ScriptedProvider([StepResult("", [ToolCall(str(i), "echo", {})]) for i in range(2)])
    _run(Conversation("c", ("p", "m", "u")), provider, events, max_steps=2)
    assert events[-1]["type"] == "notice" and "2 steps" in events[-1]["message"]


def test_cancel_fills_remaining_tool_results(monkeypatch):
    seen, events = [], []
    registry = ToolRegistry()
    conv = Conversation("c", ("p", "m", "u"))

    async def cancel_after(args, ctx):
        conv.cancel_requested = True
        return "ran"

    registry.register(Tool("echo", "Echo", schema({}), cancel_after))
    monkeypatch.setattr(loop, "get_registry", lambda: registry)
    provider = ScriptedProvider([StepResult("", [ToolCall("1", "echo", {}), ToolCall("2", "echo", {})])])
    _run(conv, provider, events)

    tool_msgs = [m for m in conv.messages if m["role"] == "tool"]
    # Every tool call still gets a result so the history stays valid
    assert [m["error"] for m in tool_msgs] == [False, True]
    assert events[-1] == {"type": "notice", "message": "Stopped."}


def test_refusal_stops_turn(monkeypatch):
    _registry(monkeypatch, [])
    events = []
    _run(Conversation("c", ("p", "m", "u")), ScriptedProvider([StepResult("", refusal="no")]), events)
    assert events == [{"type": "notice", "message": "The model declined: no"}]


def test_store_resets_on_provider_change_and_evicts():
    store = ConversationStore(capacity=2)
    conv, reset = store.get_or_create(None, ("a", "m", "u"))
    assert not reset
    same, reset = store.get_or_create(conv.id, ("a", "m", "u"))
    assert same is conv and not reset
    fresh, reset = store.get_or_create(conv.id, ("b", "m", "u"))
    assert reset and fresh is not conv and fresh.id == conv.id
    store.get_or_create(None, ("a", "m", "u"))
    store.get_or_create(None, ("a", "m", "u"))
    assert store.get(conv.id) is None
