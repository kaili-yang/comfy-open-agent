import asyncio
from types import SimpleNamespace

import pytest

from comfy_open_agent.llm import providers
from comfy_open_agent.llm.providers import (
    AnthropicProvider,
    OpenAICompatibleProvider,
    ToolCall,
    create_provider,
    normalize_base_url,
)
from comfy_open_agent.tools.registry import Tool, ToolImage, ToolOutput

IMG = ToolImage("image/png", "aGk=")


@pytest.mark.parametrize("provider,url,expected", [
    ("local", "", "http://localhost:11434/v1"),
    ("local", "http://host:11434/api/chat", "http://host:11434/v1"),
    ("openai", "https://x.example/v1/", "https://x.example/v1"),
    ("anthropic", "", "https://api.anthropic.com"),
])
def test_normalize_base_url(provider, url, expected):
    assert normalize_base_url(provider, url) == expected


def test_create_provider_defaults_and_unknown():
    p = create_provider("anthropic", api_key="k")
    assert isinstance(p, AnthropicProvider) and p.model == "claude-opus-5-5"
    local = create_provider("local")
    assert isinstance(local, OpenAICompatibleProvider) and local.model == "qwen3"
    with pytest.raises(providers.LLMError):
        create_provider("nope")


def test_openai_tool_results_put_images_after_all_tool_messages():
    p = create_provider("local")
    msgs = p.tool_results([
        (ToolCall("a", "view_image", {}), ToolOutput("img", [IMG])),
        (ToolCall("b", "get_canvas", {}), ToolOutput("{}")),
    ])
    assert [m["role"] for m in msgs] == ["tool", "tool", "user"]
    assert msgs[2]["content"][1]["image_url"]["url"] == "data:image/png;base64,aGk="


def test_anthropic_tool_results_single_user_message_with_images_and_errors():
    p = create_provider("anthropic", api_key="k")
    msgs = p.tool_results([
        (ToolCall("a", "view_image", {}), ToolOutput("img", [IMG])),
        (ToolCall("b", "x", {}), ToolOutput.error("bad")),
    ])
    assert len(msgs) == 1 and msgs[0]["role"] == "user"
    first, second = msgs[0]["content"]
    assert first["tool_use_id"] == "a" and first["content"][1]["type"] == "image"
    assert second["is_error"] is True and "is_error" not in first


class _Block:
    def __init__(self, **data):
        self.data = data

    def model_dump(self, **_):
        return dict(self.data)


class _FakeMessages:
    def __init__(self, response):
        self.response = response
        self.calls = []

    async def create(self, **kwargs):
        self.calls.append(kwargs)
        return self.response


def _anthropic_with_fake(model, base_url="https://api.anthropic.com"):
    p = AnthropicProvider(model, base_url, "k")
    response = SimpleNamespace(
        content=[
            _Block(type="thinking", thinking="", signature="sig"),
            _Block(type="text", text="Adding nodes"),
            _Block(type="tool_use", id="t1", name="add_node", input={"node_type": "KSampler"}),
        ],
        stop_reason="tool_use",
    )
    fake = _FakeMessages(response)
    fake_beta = _FakeMessages(response)
    p.client = SimpleNamespace(messages=fake, beta=SimpleNamespace(messages=fake_beta))
    return p, fake, fake_beta


TOOLS = [Tool("add_node", "d", {"type": "object", "properties": {}}, lambda a, c: None)]


def test_anthropic_step_uses_fallbacks_for_first_party_opus_and_keeps_raw_blocks():
    p, plain, beta = _anthropic_with_fake("claude-opus-5-5")
    result, history = asyncio.run(p.step("sys", TOOLS, [{"role": "user", "content": "hi"}]))
    assert not plain.calls
    call = beta.calls[0]
    assert call["fallbacks"] == "default"
    assert call["betas"] == [providers.ANTHROPIC_FALLBACK_BETA]
    assert call["output_config"] == {"effort": "medium"}
    assert result.text == "Adding nodes"
    assert result.tool_calls[0].arguments == {"node_type": "KSampler"}
    # Thinking blocks must be replayed unchanged
    assert history[0]["content"][0] == {"type": "thinking", "thinking": "", "signature": "sig"}


@pytest.mark.parametrize("model,base_url", [
    ("claude-haiku-4-5", "https://api.anthropic.com"),
    ("claude-opus-5-5", "https://proxy.example"),
])
def test_anthropic_step_without_fallbacks(model, base_url):
    p, plain, beta = _anthropic_with_fake(model, base_url)
    asyncio.run(p.step("sys", TOOLS, []))
    assert plain.calls and not beta.calls
    assert "fallbacks" not in plain.calls[0]
    assert ("output_config" in plain.calls[0]) == model.startswith(providers.ANTHROPIC_EFFORT_PREFIXES)


def test_openai_step_parses_tool_calls_and_bad_json():
    p = create_provider("local")
    message = SimpleNamespace(
        content="",
        refusal=None,
        tool_calls=[
            SimpleNamespace(id="c1", type="function", function=SimpleNamespace(name="get_canvas", arguments="{}")),
            SimpleNamespace(id="c2", type="function", function=SimpleNamespace(name="add_node", arguments="{oops")),
        ],
    )
    response = SimpleNamespace(choices=[SimpleNamespace(message=message, finish_reason="tool_calls")])
    p.client = SimpleNamespace(chat=SimpleNamespace(completions=_FakeMessages(response)))
    result, history = asyncio.run(p.step("sys", TOOLS, []))
    assert [c.parse_error is None for c in result.tool_calls] == [True, False]
    assert history[0]["tool_calls"][1]["function"]["arguments"] == "{oops"


def test_extract_text_tool_calls_from_reply_text():
    text = ('KSampler 的 id 是 "70"。\nleton\n'
            '{"name": "set_widgets", "arguments": {"node_id": "70", "values": {"steps": 25}}}\n</tool_call>')
    assert providers.extract_text_tool_calls(text, {"set_widgets"}) == [
        ("set_widgets", {"node_id": "70", "values": {"steps": 25}})
    ]


def test_extract_text_tool_calls_ignores_unknown_and_plain_json():
    text = 'workflow: {"1": {"class_type": "KSampler"}} {"name": "rm_rf", "arguments": {}} ' \
           '{"name": "get_canvas", "parameters": "{}"}'
    assert providers.extract_text_tool_calls(text, {"get_canvas"}) == [("get_canvas", {})]


def test_openai_step_recovers_tool_call_written_as_text():
    p = create_provider("local")
    message = SimpleNamespace(
        content='Calling it now {"name": "add_node", "arguments": {"node_type": "KSampler"}}',
        refusal=None, tool_calls=None,
    )
    response = SimpleNamespace(choices=[SimpleNamespace(message=message, finish_reason="stop")])
    p.client = SimpleNamespace(chat=SimpleNamespace(completions=_FakeMessages(response)))
    result, history = asyncio.run(p.step("sys", TOOLS, []))
    assert [(c.name, c.arguments) for c in result.tool_calls] == [("add_node", {"node_type": "KSampler"})]
    # The synthesized call must be in history so the following tool message is valid
    assert history[0]["tool_calls"][0]["id"] == result.tool_calls[0].id


def test_openai_without_key_gives_settings_hint(monkeypatch):
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    monkeypatch.delenv("OPENAI_ADMIN_KEY", raising=False)
    with pytest.raises(providers.LLMError, match="Settings"):
        create_provider("openai")
