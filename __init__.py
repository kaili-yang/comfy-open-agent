"""Comfy Open Agent - open-source ComfyUI agent with MCP support."""

__version__ = "0.2.0"

# No custom nodes: the agent lives in a sidebar panel and HTTP routes
NODE_CLASS_MAPPINGS = {}
NODE_DISPLAY_NAME_MAPPINGS = {}
WEB_DIRECTORY = "./web/dist"

try:
    from .src.comfy_open_agent.routes import register_routes

    register_routes()
except ImportError as e:
    # Allows importing the package outside a running ComfyUI (e.g. in tests)
    print(f"[comfy-open-agent] Routes not registered: {e}")

__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS", "WEB_DIRECTORY"]
