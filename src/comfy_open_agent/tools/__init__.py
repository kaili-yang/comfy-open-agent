"""Agent tools."""

from typing import Optional

from . import canvas_tools, comfy_tools, skill_tools
from .registry import Tool, ToolContext, ToolError, ToolImage, ToolOutput, ToolRegistry

_registry: Optional[ToolRegistry] = None


def get_registry() -> ToolRegistry:
    global _registry
    if _registry is None:
        _registry = ToolRegistry()
        canvas_tools.register(_registry)
        comfy_tools.register(_registry)
        skill_tools.register(_registry)
    return _registry


__all__ = ["Tool", "ToolContext", "ToolError", "ToolImage", "ToolOutput", "ToolRegistry", "get_registry"]
