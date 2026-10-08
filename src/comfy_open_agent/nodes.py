"""Comfy Open Agent - Main node definitions."""

import json
import asyncio
from typing import Dict, Any, Tuple, Optional

from .llm.providers import LLMProviderFactory
from .graph.operations import GraphOperations
from .skills.manager import get_skills_manager


class OpenAgentNode:
    """Main agent node for Comfy Open Agent."""

    def __init__(self):
        self.agent_state = {}
        self.skills_manager = get_skills_manager()

    @classmethod
    def INPUT_TYPES(cls) -> Dict[str, Any]:
        return {
            "required": {
                "agent_chat": ("AGENT_CHAT", {}),
            },
            "optional": {
                "llm_provider": (["local", "openai", "anthropic"], {"default": "local"}),
                "model_name": ("STRING", {"default": "llama3.2"}),
                "api_key": ("STRING", {"default": ""}),
                "api_endpoint": ("STRING", {"default": "http://localhost:11434/api/chat"}),
            },
        }

    RETURN_TYPES = ("IMAGE", "STRING")
    RETURN_NAMES = ("output_image", "workflow_json")
    OUTPUT_NODE = True
    FUNCTION = "run"
    CATEGORY = "agent/open_agent"

    def run(
        self,
        agent_chat: Dict[str, Any],
        llm_provider: str = "local",
        model_name: str = "llama3.2",
        api_key: str = "",
        api_endpoint: str = "http://localhost:11434/api/chat",
    ) -> Tuple[Optional[Any], str]:
        """
        Execute the agent based on chat input.

        Args:
            agent_chat: Chat data from the Vue component
            llm_provider: LLM provider to use
            model_name: Model name
            api_key: API key for cloud providers
            api_endpoint: API endpoint URL

        Returns:
            Tuple of (output_image, workflow_json)
        """
        print(f"[OpenAgent] Running with provider: {llm_provider}, model: {model_name}")

        # Extract chat messages
        messages = agent_chat.get("messages", [])
        if not messages:
            return None, json.dumps({})

        # Get the last user message
        last_message = messages[-1]
        user_input = last_message.get("content", "")

        print(f"[OpenAgent] User input: {user_input}")

        # Process the input through the agent
        # This will be implemented with LLM integration
        result = self._process_agent_input(
            user_input, llm_provider, model_name, api_key, api_endpoint
        )

        # Return the result
        # For now, return empty - will be populated with actual execution
        return None, json.dumps(result, indent=2)

    def _process_agent_input(
        self,
        user_input: str,
        llm_provider: str,
        model_name: str,
        api_key: str,
        api_endpoint: str,
    ) -> Dict[str, Any]:
        """
        Process user input through the agent.

        This method will:
        1. Send the input to the LLM
        2. Parse the response for graph operations
        3. Execute the operations on the canvas
        4. Return the result

        Args:
            user_input: User's natural language input
            llm_provider: LLM provider
            model_name: Model name
            api_key: API key
            api_endpoint: API endpoint

        Returns:
            Result dictionary with operations performed
        """
        try:
            # Create LLM provider
            provider = LLMProviderFactory.create_provider(
                llm_provider,
                api_key=api_key,
                base_url=api_endpoint,
            )

            # Prepare system prompt
            system_prompt = """You are an AI assistant for ComfyUI, a node-based image generation workflow system.
Your task is to help users build and edit workflows by understanding their natural language requests and converting them into graph operations.

Available operations:
- add_node: Add a new node to the graph
- remove_node: Remove a node from the graph
- connect_nodes: Connect two nodes
- disconnect_nodes: Disconnect two nodes
- set_widget_value: Set a widget value on a node

When responding, format your answer as a JSON object with an "operations" array containing the operations to perform.
Example:
{
  "operations": [
    {"type": "add_node", "node_type": "KSampler", "pos": [100, 100]},
    {"type": "connect_nodes", "from_node_id": "1", "from_slot": 0, "to_node_id": "2", "to_slot": 0}
  ]
}

If you need more information, ask the user for clarification."""

            # Prepare messages
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_input},
            ]

            # Get LLM response (run in event loop)
            loop = asyncio.get_event_loop()
            response = loop.run_until_complete(
                provider.chat_completion(messages, model_name)
            )

            # Close the provider
            loop.run_until_complete(provider.close())

            # Parse response for operations
            operations = self._parse_llm_response(response)

            # Execute operations (if ComfyUI app is available)
            executed_operations = []
            # @ts-ignore
            if hasattr(self, 'app') and self.app:
                graph_ops = GraphOperations(self.app)
                for op in operations:
                    try:
                        result = graph_ops.edit_graph(op)
                        executed_operations.append({
                            "type": op.get("operation"),
                            "description": result.get("message", ""),
                            "status": result.get("status", "unknown"),
                        })
                    except Exception as e:
                        executed_operations.append({
                            "type": op.get("operation"),
                            "description": str(e),
                            "status": "error",
                        })

            return {
                "status": "success",
                "message": response,
                "operations": executed_operations,
                "user_input": user_input,
            }

        except Exception as e:
            print(f"[OpenAgent] Error processing input: {e}")
            return {
                "status": "error",
                "message": str(e),
                "operations": [],
                "user_input": user_input,
            }

    def _parse_llm_response(self, response: str) -> list:
        """
        Parse LLM response for operations.

        Args:
            response: LLM response text

        Returns:
            List of operations
        """
        try:
            # Try to extract JSON from the response
            import re
            json_match = re.search(r'\{[\s\S]*\}', response)
            if json_match:
                data = json.loads(json_match.group())
                return data.get("operations", [])
        except Exception as e:
            print(f"[OpenAgent] Error parsing response: {e}")

        return []


class MCPBridgeNode:
    """MCP bridge node for external agent integration."""

    def __init__(self):
        pass

    @classmethod
    def INPUT_TYPES(cls) -> Dict[str, Any]:
        return {
            "required": {
                "mcp_request": ("MCP_REQUEST", {}),
            },
        }

    RETURN_TYPES = ("MCP_RESPONSE",)
    RETURN_NAMES = ("response",)
    FUNCTION = "run"
    CATEGORY = "agent/open_agent"

    def run(self, mcp_request: Dict[str, Any]) -> Tuple[Dict[str, Any]]:
        """
        Handle MCP requests from external agents.

        Args:
            mcp_request: MCP request object

        Returns:
            MCP response
        """
        print(f"[MCPBridge] Received request: {mcp_request}")

        # Process MCP request
        # This will implement the full MCP protocol
        response = self._handle_mcp_request(mcp_request)

        return (response,)

    def _handle_mcp_request(self, request: Dict[str, Any]) -> Dict[str, Any]:
        """Handle an MCP request."""
        method = request.get("method", "")
        params = request.get("params", {})

        # MCP method handlers
        handlers = {
            "initialize": self._handle_initialize,
            "tools/list": self._handle_tools_list,
            "tools/call": self._handle_tools_call,
            "resources/list": self._handle_resources_list,
            "prompts/list": self._handle_prompts_list,
        }

        handler = handlers.get(method, self._handle_unknown)
        return handler(params)

    def _handle_initialize(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Handle MCP initialize request."""
        return {
            "jsonrpc": "2.0",
            "id": params.get("id"),
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

    def _handle_tools_list(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Handle tools/list request."""
        return {
            "jsonrpc": "2.0",
            "id": params.get("id"),
            "result": {
                "tools": [
                    {
                        "name": "get_canvas",
                        "description": "Get the current canvas state",
                        "inputSchema": {"type": "object"},
                    },
                    {
                        "name": "edit_graph",
                        "description": "Edit the node graph",
                        "inputSchema": {
                            "type": "object",
                            "properties": {
                                "operation": {"type": "string"},
                                "data": {"type": "object"},
                            },
                        },
                    },
                    {
                        "name": "run_workflow",
                        "description": "Run the current workflow",
                        "inputSchema": {"type": "object"},
                    },
                ]
            },
        }

    def _handle_tools_call(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Handle tools/call request."""
        tool_name = params.get("name", "")
        arguments = params.get("arguments", {})

        # Execute the tool
        result = self._execute_tool(tool_name, arguments)

        return {
            "jsonrpc": "2.0",
            "id": params.get("id"),
            "result": {"content": [{"type": "text", "text": json.dumps(result)}]},
        }

    def _handle_resources_list(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Handle resources/list request."""
        return {
            "jsonrpc": "2.0",
            "id": params.get("id"),
            "result": {"resources": []},
        }

    def _handle_prompts_list(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Handle prompts/list request."""
        return {
            "jsonrpc": "2.0",
            "id": params.get("id"),
            "result": {"prompts": []},
        }

    def _handle_unknown(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Handle unknown methods."""
        return {
            "jsonrpc": "2.0",
            "id": params.get("id"),
            "error": {"code": -32601, "message": "Method not found"},
        }

    def _execute_tool(self, tool_name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a tool."""
        # Use GraphOperations for tool execution
        # @ts-ignore
        if hasattr(self, 'app') and self.app:
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
                return handler(arguments)

        return {"status": "not_implemented", "tool": tool_name}


NODE_CLASS_MAPPINGS = {
    "OpenAgent": OpenAgentNode,
    "MCPBridge": MCPBridgeNode,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "OpenAgent": "Open Agent",
    "MCPBridge": "MCP Bridge",
}
