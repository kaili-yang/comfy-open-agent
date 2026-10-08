"""Comfy Open Agent - Open-source ComfyUI agent with MCP support."""

__all__ = [
    "NODE_CLASS_MAPPINGS",
    "NODE_DISPLAY_NAME_MAPPINGS",
    "WEB_DIRECTORY",
]

__author__ = "Comfy Open Agent Contributors"
__email__ = ""
__version__ = "0.1.0"

from .src.comfy_open_agent.nodes import NODE_CLASS_MAPPINGS
from .src.comfy_open_agent.nodes import NODE_DISPLAY_NAME_MAPPINGS

WEB_DIRECTORY = "./web"
