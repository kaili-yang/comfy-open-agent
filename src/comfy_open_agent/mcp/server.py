"""MCP server implementation for Comfy Open Agent."""

import json
import asyncio
from typing import Dict, Any, List, Optional
from aiohttp import web, WSMsgType


class MCPServer:
    """MCP server for external agent integration."""

    def __init__(self, comfy_app):
        """
        Initialize MCP server.

        Args:
            comfy_app: ComfyUI application instance
        """
        self.app = comfy_app
        self.sessions: Dict[str, Dict[str, Any]] = {}
        self.routes = web.RouteTableDef()

        self._setup_routes()

    def _setup_routes(self):
        """Setup MCP HTTP routes."""
        self.routes.post('/mcp')(self.handle_mcp_request)

    async def handle_mcp_request(self, request: web.Request) -> web.Response:
        """
        Handle MCP HTTP request.

        Args:
            request: aiohttp request

        Returns:
            web.Response with MCP response
        """
        try:
            data = await request.json()

            # Check for session ID
            session_id = request.headers.get('Mcp-Session-Id')
            if session_id:
                data['session_id'] = session_id

            # Process the request
            response = await self._process_request(data)

            return web.json_response(response)
        except Exception as e:
            print(f"[MCP] Error handling request: {e}")
            return web.json_response(
                {
                    "jsonrpc": "2.0",
                    "error": {"code": -32603, "message": str(e)},
                },
                status=500
            )

    async def _process_request(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process an MCP request.

        Args:
            request_data: Request data

        Returns:
            Response data
        """
        method = request_data.get('method', '')
        params = request_data.get('params', {})
        request_id = request_data.get('id')

        # Handle session initialization
        if method == 'initialize':
            return self._handle_initialize(params, request_id)

        # Method handlers
        handlers = {
            'tools/list': self._handle_tools_list,
            'tools/call': self._handle_tools_call,
            'resources/list': self._handle_resources_list,
            'resources/read': self._handle_resources_read,
            'prompts/list': self._handle_prompts_list,
            'prompts/get': self._handle_prompts_get,
        }

        handler = handlers.get(method)
        if handler:
            return await handler(params, request_id)

        return {
            "jsonrpc": "2.0",
            "id": request_id,
            "error": {"code": -32601, "message": "Method not found"},
        }

    def _handle_initialize(self, params: Dict[str, Any], request_id: Any) -> Dict[str, Any]:
        """Handle initialize request."""
        session_id = params.get('session_id', 'default')

        self.sessions[session_id] = {
            'initialized': True,
            'capabilities': params.get('capabilities', {}),
        }

        return {
            "jsonrpc": "2.0",
            "id": request_id,
            "result": {
                "protocolVersion": "2024-11-05",
                "capabilities": {
                    "tools": {},
                    "resources": {},
                    "prompts": {},
                },
                "serverInfo": {
                    "name": "comfy-open-agent",
                    "version": "0.1.0",
                },
            },
        }

    async def _handle_tools_list(self, params: Dict[str, Any], request_id: Any) -> Dict[str, Any]:
        """Handle tools/list request."""
        return {
            "jsonrpc": "2.0",
            "id": request_id,
            "result": {
                "tools": self._get_available_tools()
            },
        }

    async def _handle_tools_call(self, params: Dict[str, Any], request_id: Any) -> Dict[str, Any]:
        """Handle tools/call request."""
        tool_name = params.get('name', '')
        arguments = params.get('arguments', {})

        try:
            result = await self._execute_tool(tool_name, arguments)
            return {
                "jsonrpc": "2.0",
                "id": request_id,
                "result": {
                    "content": [
                        {
                            "type": "text",
                            "text": json.dumps(result, indent=2)
                        }
                    ]
                },
            }
        except Exception as e:
            return {
                "jsonrpc": "2.0",
                "id": request_id,
                "error": {"code": -32603, "message": str(e)},
            }

    async def _handle_resources_list(self, params: Dict[str, Any], request_id: Any) -> Dict[str, Any]:
        """Handle resources/list request."""
        return {
            "jsonrpc": "2.0",
            "id": request_id,
            "result": {"resources": []},
        }

    async def _handle_resources_read(self, params: Dict[str, Any], request_id: Any) -> Dict[str, Any]:
        """Handle resources/read request."""
        return {
            "jsonrpc": "2.0",
            "id": request_id,
            "error": {"code": -32601, "message": "Not implemented"},
        }

    async def _handle_prompts_list(self, params: Dict[str, Any], request_id: Any) -> Dict[str, Any]:
        """Handle prompts/list request."""
        return {
            "jsonrpc": "2.0",
            "id": request_id,
            "result": {"prompts": []},
        }

    async def _handle_prompts_get(self, params: Dict[str, Any], request_id: Any) -> Dict[str, Any]:
        """Handle prompts/get request."""
        return {
            "jsonrpc": "2.0",
            "id": request_id,
            "error": {"code": -32601, "message": "Not implemented"},
        }

    def _get_available_tools(self) -> List[Dict[str, Any]]:
        """Get list of available MCP tools."""
        return [
            {
                "name": "get_canvas",
                "description": "Get the current canvas state with all nodes and connections",
                "inputSchema": {
                    "type": "object",
                    "properties": {},
                },
            },
            {
                "name": "edit_graph",
                "description": "Edit the node graph (add, remove, modify nodes)",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "operation": {
                            "type": "string",
                            "enum": ["add_node", "remove_node", "connect_nodes", "disconnect_nodes", "set_widget_value"],
                        },
                        "data": {"type": "object"},
                    },
                    "required": ["operation", "data"],
                },
            },
            {
                "name": "run_workflow",
                "description": "Run the current workflow",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "node_id": {"type": "string", "description": "Optional node ID to start from"},
                    },
                },
            },
            {
                "name": "get_workflow",
                "description": "Get the current workflow as JSON",
                "inputSchema": {
                    "type": "object",
                    "properties": {},
                },
            },
            {
                "name": "inspect_image",
                "description": "Inspect an image output",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "node_id": {"type": "string"},
                        "output_index": {"type": "number"},
                    },
                    "required": ["node_id"],
                },
            },
            {
                "name": "list_models",
                "description": "List available models",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "model_type": {"type": "string"},
                    },
                },
            },
        ]

    async def _execute_tool(self, tool_name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute an MCP tool.

        Args:
            tool_name: Name of the tool to execute
            arguments: Tool arguments

        Returns:
            Tool execution result
        """
        # Import graph operations here to avoid circular imports
        from ..graph.operations import GraphOperations

        graph_ops = GraphOperations(self.app)

        tool_handlers = {
            'get_canvas': graph_ops.get_canvas,
            'edit_graph': graph_ops.edit_graph,
            'run_workflow': graph_ops.run_workflow,
            'get_workflow': graph_ops.get_workflow,
            'inspect_image': graph_ops.inspect_image,
            'list_models': graph_ops.list_models,
        }

        handler = tool_handlers.get(tool_name)
        if handler:
            if asyncio.iscoroutinefunction(handler):
                return await handler(arguments)
            return handler(arguments)

        return {
            "status": "error",
            "message": f"Unknown tool: {tool_name}",
        }


def setup_mcp_server(comfy_app) -> MCPServer:
    """
    Setup and return MCP server instance.

    Args:
        comfy_app: ComfyUI application instance

    Returns:
        MCPServer instance
    """
    return MCPServer(comfy_app)
