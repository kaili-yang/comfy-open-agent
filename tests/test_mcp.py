import asyncio

from comfy_open_agent.mcp.server import MCPServer
from comfy_open_agent.tools.registry import Tool, ToolImage, ToolOutput, ToolRegistry, schema


def _server():
    registry = ToolRegistry()
    registry.register(Tool("pic", "Picture", schema({}), lambda a, c: ToolOutput("ok", [ToolImage("image/png", "AA==")])))
    registry.register(Tool("boom", "Fails", schema({}), lambda a, c: 1 / 0))
    return MCPServer(registry)


def call(server, method, params=None, msg_id=1):
    msg = {"jsonrpc": "2.0", "method": method, "params": params or {}}
    if msg_id is not None:
        msg["id"] = msg_id
    return asyncio.run(server.handle(msg, None))


def test_initialize_negotiates_version():
    server = _server()
    assert call(server, "initialize", {"protocolVersion": "2024-11-05"})["result"]["protocolVersion"] == "2024-11-05"
    assert call(server, "initialize", {"protocolVersion": "1999-01-01"})["result"]["protocolVersion"] == "2025-06-18"


def test_tools_list_and_call_with_image():
    server = _server()
    names = [t["name"] for t in call(server, "tools/list")["result"]["tools"]]
    assert names == ["pic", "boom"]
    result = call(server, "tools/call", {"name": "pic", "arguments": {}})["result"]
    assert result["isError"] is False
    assert result["content"][1] == {"type": "image", "data": "AA==", "mimeType": "image/png"}


def test_tool_exception_becomes_error_result():
    result = call(_server(), "tools/call", {"name": "boom"})["result"]
    assert result["isError"] is True and "ZeroDivisionError" in result["content"][0]["text"]


def test_unknown_tool_and_method_errors():
    server = _server()
    assert call(server, "tools/call", {"name": "nope"})["error"]["code"] == -32602
    assert call(server, "bogus")["error"]["code"] == -32601


def test_notifications_get_no_response():
    assert call(_server(), "notifications/initialized", msg_id=None) is None


def test_skills_as_resources():
    server = _server()
    resources = call(server, "resources/list")["result"]["resources"]
    uri = next(r["uri"] for r in resources if r["name"] == "basic-workflow-builder")
    text = call(server, "resources/read", {"uri": uri})["result"]["contents"][0]["text"]
    assert "load_workflow" in text
    assert call(server, "resources/read", {"uri": "skill://missing"})["error"]["code"] == -32002
