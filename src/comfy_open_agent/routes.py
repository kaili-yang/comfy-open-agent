"""HTTP routes registered on ComfyUI's PromptServer."""

import json
from urllib.parse import urlparse

from aiohttp import web

from .agent.loop import TurnRequest, conversations, encode_event, start_turn
from .bridge import bridge
from .llm.providers import PROVIDER_DEFAULTS, LLMError
from .mcp.server import SUPPORTED_VERSIONS, mcp_server
from .skills.manager import get_skills_manager

PREFIX = "/comfy-open-agent"


async def _json_body(request: web.Request) -> dict:
    try:
        data = await request.json()
    except (json.JSONDecodeError, UnicodeDecodeError):
        raise web.HTTPBadRequest(text="Body must be JSON")
    if not isinstance(data, dict):
        raise web.HTTPBadRequest(text="Body must be a JSON object")
    return data


async def chat(request: web.Request) -> web.StreamResponse:
    req = TurnRequest.from_json(await _json_body(request))
    if not req.message:
        return web.json_response({"error": "message is required"}, status=400)
    try:
        _conv, queue = await start_turn(req)
    except LLMError as e:
        return web.json_response({"error": str(e)}, status=400)

    response = web.StreamResponse(headers={"Content-Type": "application/x-ndjson", "Cache-Control": "no-cache"})
    await response.prepare(request)
    try:
        while True:
            event = await queue.get()
            if event is None:
                break
            await response.write(encode_event(event))
    except (ConnectionResetError, ConnectionError):
        # The tab went away; the detached turn keeps running and finishes on its own
        pass
    return response


async def chat_stop(request: web.Request) -> web.Response:
    data = await _json_body(request)
    conv = conversations.get(str(data.get("conversation_id", "")))
    if conv is not None:
        conv.cancel_requested = True
    return web.json_response({"ok": conv is not None})


async def chat_reset(request: web.Request) -> web.Response:
    data = await _json_body(request)
    conversations.delete(str(data.get("conversation_id", "")))
    return web.json_response({"ok": True})


async def bridge_register(request: web.Request) -> web.Response:
    data = await _json_body(request)
    client_id = str(data.get("client_id", "")).strip()
    if not client_id:
        return web.json_response({"error": "client_id is required"}, status=400)
    bridge.register_client(client_id)
    return web.json_response({"ok": True})


async def bridge_result(request: web.Request) -> web.Response:
    data = await _json_body(request)
    accepted = bridge.resolve(str(data.get("call_id", "")), data)
    return web.json_response({"ok": accepted})


async def info(_request: web.Request) -> web.Response:
    return web.json_response({
        "providers": PROVIDER_DEFAULTS,
        "skills": get_skills_manager().list_skills(),
        "browser_connected": bridge.has_client(),
    })


def _origin_allowed(request: web.Request) -> bool:
    # Protect the MCP endpoint against DNS rebinding from other web pages
    origin = request.headers.get("Origin")
    if not origin:
        return True
    return urlparse(origin).netloc == request.host


async def mcp_post(request: web.Request) -> web.Response:
    if not _origin_allowed(request):
        return web.json_response({"error": "Origin not allowed"}, status=403)
    try:
        payload = await request.json()
    except (json.JSONDecodeError, UnicodeDecodeError):
        return web.json_response(
            {"jsonrpc": "2.0", "id": None, "error": {"code": -32700, "message": "Parse error"}}, status=400
        )

    session_id = request.headers.get("Mcp-Session-Id")
    messages = payload if isinstance(payload, list) else [payload]
    headers = {}
    if any(isinstance(m, dict) and m.get("method") == "initialize" for m in messages):
        init = next(m for m in messages if isinstance(m, dict) and m.get("method") == "initialize")
        session_id = mcp_server.new_session(init.get("params") or {})
        headers["Mcp-Session-Id"] = session_id

    responses = []
    for message in messages:
        if not isinstance(message, dict):
            responses.append({"jsonrpc": "2.0", "id": None, "error": {"code": -32600, "message": "Invalid Request"}})
            continue
        reply = await mcp_server.handle(message, session_id)
        if reply is not None:
            responses.append(reply)

    if not responses:
        return web.Response(status=202, headers=headers)
    body = responses if isinstance(payload, list) else responses[0]
    return web.json_response(body, headers=headers)


async def mcp_get(_request: web.Request) -> web.Response:
    # No server-initiated messages, so no SSE stream
    return web.Response(status=405, headers={"Allow": "POST, DELETE"})


async def mcp_delete(request: web.Request) -> web.Response:
    mcp_server.sessions.pop(request.headers.get("Mcp-Session-Id", ""), None)
    return web.Response(status=204)


def register_routes() -> None:
    from server import PromptServer

    routes = PromptServer.instance.routes
    routes.post(f"{PREFIX}/chat")(chat)
    routes.post(f"{PREFIX}/chat/stop")(chat_stop)
    routes.post(f"{PREFIX}/chat/reset")(chat_reset)
    routes.post(f"{PREFIX}/bridge/register")(bridge_register)
    routes.post(f"{PREFIX}/bridge/result")(bridge_result)
    routes.get(f"{PREFIX}/info")(info)
    routes.post(f"{PREFIX}/mcp")(mcp_post)
    routes.get(f"{PREFIX}/mcp")(mcp_get)
    routes.delete(f"{PREFIX}/mcp")(mcp_delete)
    print(f"[comfy-open-agent] Routes ready. MCP endpoint: {PREFIX}/mcp "
          f"(protocol {', '.join(SUPPORTED_VERSIONS)})")
