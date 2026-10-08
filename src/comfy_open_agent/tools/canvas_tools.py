"""Graph-editing tools. They are executed by the browser tab through the canvas bridge."""

from typing import Any, Dict

from ..bridge import BridgeError, bridge
from .registry import Tool, ToolContext, ToolError, ToolRegistry, schema

SLOT = {"type": "string", "description": "Slot name (preferred) or numeric index"}
NODE_ID = {"type": "string", "description": "Node id from get_canvas / add_node"}


def _forward(op: str):
    async def handler(args: Dict[str, Any], ctx: ToolContext) -> Any:
        try:
            return await bridge.call(op, args, client_id=ctx.client_id)
        except BridgeError as e:
            raise ToolError(str(e))

    return handler


CANVAS_TOOLS = [
    (
        "get_canvas",
        "Read the current workflow on the canvas: every node with id, type, title, widget values, "
        "input links and outputs. Call this before editing an existing workflow.",
        schema({}),
    ),
    (
        "load_workflow",
        "Replace the whole canvas with a workflow in ComfyUI API format "
        "({\"<id>\": {\"class_type\": ..., \"inputs\": {...}, \"_meta\": {\"title\": ...}}}). "
        "Links are written as [\"<source id>\", <output index>]. Best way to build a new workflow from scratch.",
        schema({
            "workflow": {"type": "object", "description": "API-format workflow"},
        }, ["workflow"]),
    ),
    (
        "add_node",
        "Add one node to the canvas. Returns its id and its input/output slots.",
        schema({
            "node_type": {"type": "string", "description": "Exact node class name"},
            "title": {"type": "string"},
            "pos": {"type": "array", "items": {"type": "number"}, "description": "[x, y]; omitted = placed right of the existing nodes"},
            "widgets": {"type": "object", "description": "Initial widget values by name"},
        }, ["node_type"]),
    ),
    (
        "remove_node",
        "Remove a node (and its links) from the canvas.",
        schema({"node_id": NODE_ID}, ["node_id"]),
    ),
    (
        "connect",
        "Link an output slot of one node to an input slot of another. Replaces any existing link on that input. "
        "Connecting to a widget name converts that widget into an input.",
        schema({
            "from_node": NODE_ID,
            "from_output": SLOT,
            "to_node": NODE_ID,
            "to_input": SLOT,
        }, ["from_node", "from_output", "to_node", "to_input"]),
    ),
    (
        "disconnect",
        "Remove the link going into an input slot.",
        schema({"node_id": NODE_ID, "input": SLOT}, ["node_id", "input"]),
    ),
    (
        "set_widgets",
        "Set widget values on a node (prompt text, seed, steps, model file, ...). "
        "Combo values must be one of the allowed options.",
        schema({
            "node_id": NODE_ID,
            "values": {"type": "object", "description": "Widget name -> value"},
        }, ["node_id", "values"]),
    ),
    (
        "queue_workflow",
        "Queue the current canvas workflow for execution. Returns prompt_id, or validation errors per node. "
        "Follow up with get_run_status.",
        schema({}),
    ),
]


def register(registry: ToolRegistry) -> None:
    for name, description, input_schema in CANVAS_TOOLS:
        registry.register(Tool(name, description, input_schema, _forward(name)))
