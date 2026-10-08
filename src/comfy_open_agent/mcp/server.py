"""MCP (Model Context Protocol) server over Streamable HTTP, JSON responses only."""

import uuid
from typing import Any, Dict, List, Optional

from ..skills.manager import get_skills_manager
from ..tools import ToolContext, ToolOutput, ToolRegistry, get_registry

SERVER_INFO = {"name": "comfy-open-agent", "version": "0.2.0"}
SUPPORTED_VERSIONS = ("2025-06-18", "2025-03-26", "2024-11-05")
SKILL_URI_PREFIX = "skill://"

INSTRUCTIONS = (
    "Tools to inspect and edit the workflow open in a ComfyUI browser tab, queue it, and read results. "
    "Canvas tools (get_canvas, load_workflow, add_node, connect, set_widgets, queue_workflow, ...) need the "
    "ComfyUI web UI to be open. Use search_nodes / get_node_info / list_models instead of guessing names. "
    "Skills with task-specific instructions are available as resources and through read_skill."
)


class JsonRpcError(Exception):
    def __init__(self, code: int, message: str):
        super().__init__(message)
        self.code = code
        self.message = message


def tool_output_to_mcp(output: ToolOutput) -> Dict[str, Any]:
    content: List[Dict[str, Any]] = [{"type": "text", "text": output.text}]
    for img in output.images:
        content.append({"type": "image", "data": img.data, "mimeType": img.media_type})
    return {"content": content, "isError": output.is_error}


class MCPServer:
    def __init__(self, registry: Optional[ToolRegistry] = None):
        self._registry = registry
        self.sessions: Dict[str, Dict[str, Any]] = {}

    @property
    def registry(self) -> ToolRegistry:
        return self._registry or get_registry()

    async def handle(self, message: Dict[str, Any], session_id: Optional[str]) -> Optional[Dict[str, Any]]:
        """Handle one JSON-RPC message. Returns None for notifications."""
        msg_id = message.get("id")
        method = message.get("method")
        is_notification = "id" not in message

        if message.get("jsonrpc") != "2.0" or not isinstance(method, str):
            if is_notification:
                return None
            return _error(msg_id, -32600, "Invalid Request")

        try:
            result = await self._dispatch(method, message.get("params") or {}, session_id)
        except JsonRpcError as e:
            return None if is_notification else _error(msg_id, e.code, e.message)
        except Exception as e:
            return None if is_notification else _error(msg_id, -32603, f"{type(e).__name__}: {e}")
        return None if is_notification else {"jsonrpc": "2.0", "id": msg_id, "result": result}

    def new_session(self, params: Dict[str, Any]) -> str:
        session_id = uuid.uuid4().hex
        self.sessions[session_id] = {"client": params.get("clientInfo", {})}
        return session_id

    async def _dispatch(self, method: str, params: Dict[str, Any], session_id: Optional[str]) -> Any:
        if method == "initialize":
            requested = params.get("protocolVersion")
            version = requested if requested in SUPPORTED_VERSIONS else SUPPORTED_VERSIONS[0]
            return {
                "protocolVersion": version,
                "capabilities": {"tools": {"listChanged": False}, "resources": {"listChanged": False}},
                "serverInfo": SERVER_INFO,
                "instructions": INSTRUCTIONS,
            }
        if method == "ping" or method.startswith("notifications/"):
            return {}
        if method == "tools/list":
            return {"tools": [
                {"name": t.name, "description": t.description, "inputSchema": t.input_schema}
                for t in self.registry.all()
            ]}
        if method == "tools/call":
            name = params.get("name")
            if not isinstance(name, str) or self.registry.get(name) is None:
                raise JsonRpcError(-32602, f"Unknown tool: {name}")
            arguments = params.get("arguments") or {}
            if not isinstance(arguments, dict):
                raise JsonRpcError(-32602, "arguments must be an object")
            output = await self.registry.call(name, arguments, ToolContext())
            return tool_output_to_mcp(output)
        if method == "resources/list":
            return {"resources": [
                {"uri": SKILL_URI_PREFIX + s["name"], "name": s["name"], "description": s["description"],
                 "mimeType": "text/markdown"}
                for s in get_skills_manager().list_skills()
            ]}
        if method == "resources/templates/list":
            return {"resourceTemplates": []}
        if method == "resources/read":
            uri = str(params.get("uri", ""))
            skill = get_skills_manager().get_skill(uri[len(SKILL_URI_PREFIX):]) if uri.startswith(SKILL_URI_PREFIX) else None
            if skill is None:
                raise JsonRpcError(-32002, f"Resource not found: {uri}")
            return {"contents": [{"uri": uri, "mimeType": "text/markdown", "text": skill.content}]}
        if method == "prompts/list":
            return {"prompts": []}
        raise JsonRpcError(-32601, f"Method not found: {method}")


def _error(msg_id: Any, code: int, message: str) -> Dict[str, Any]:
    return {"jsonrpc": "2.0", "id": msg_id, "error": {"code": code, "message": message}}


mcp_server = MCPServer()
