"""Tool registry shared by the built-in chat agent and the MCP endpoint."""

import inspect
import json
from dataclasses import dataclass, field
from typing import Any, Awaitable, Callable, Dict, List, Optional, Union


@dataclass
class ToolImage:
    """An image attached to a tool result, base64 encoded."""

    media_type: str
    data: str


@dataclass
class ToolOutput:
    """Provider-neutral tool result."""

    text: str
    images: List[ToolImage] = field(default_factory=list)
    is_error: bool = False

    @classmethod
    def from_value(cls, value: Any) -> "ToolOutput":
        if isinstance(value, ToolOutput):
            return value
        if isinstance(value, str):
            return cls(text=value)
        return cls(text=json.dumps(value, ensure_ascii=False, indent=1, default=str))

    @classmethod
    def error(cls, message: str) -> "ToolOutput":
        return cls(text=f"Error: {message}", is_error=True)


@dataclass
class ToolContext:
    """Per-call context: which browser tab should receive canvas operations."""

    client_id: Optional[str] = None


Handler = Callable[[Dict[str, Any], ToolContext], Union[Any, Awaitable[Any]]]


@dataclass
class Tool:
    name: str
    description: str
    input_schema: Dict[str, Any]
    handler: Handler

    async def run(self, arguments: Dict[str, Any], ctx: ToolContext) -> ToolOutput:
        try:
            result = self.handler(arguments or {}, ctx)
            if inspect.isawaitable(result):
                result = await result
            return ToolOutput.from_value(result)
        except ToolError as e:
            return ToolOutput.error(str(e))
        except Exception as e:  # Surface unexpected failures to the model instead of crashing the loop
            return ToolOutput.error(f"{type(e).__name__}: {e}")


class ToolError(Exception):
    """Raised by tool handlers for expected, user-facing failures."""


class ToolRegistry:
    def __init__(self) -> None:
        self._tools: Dict[str, Tool] = {}

    def register(self, tool: Tool) -> None:
        self._tools[tool.name] = tool

    def get(self, name: str) -> Optional[Tool]:
        return self._tools.get(name)

    def all(self) -> List[Tool]:
        return list(self._tools.values())

    async def call(self, name: str, arguments: Dict[str, Any], ctx: ToolContext) -> ToolOutput:
        tool = self.get(name)
        if tool is None:
            return ToolOutput.error(f"Unknown tool '{name}'")
        return await tool.run(arguments, ctx)


def schema(properties: Dict[str, Any], required: Optional[List[str]] = None) -> Dict[str, Any]:
    """Build a JSON object schema."""
    out: Dict[str, Any] = {"type": "object", "properties": properties}
    if required:
        out["required"] = required
    return out
