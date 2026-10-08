"""Tools that run in the ComfyUI Python process (node catalog, models, runs, images)."""

import asyncio
import base64
import io
import os
from typing import Any, Dict, List, Optional, Tuple

from .registry import Tool, ToolContext, ToolError, ToolImage, ToolOutput, ToolRegistry, schema

WIDGET_TYPES = {"INT", "FLOAT", "STRING", "BOOLEAN", "COMBO"}
MAX_COMBO_OPTIONS = 40
MAX_IMAGE_SIDE = 1024


def node_info(node_type: str) -> Dict[str, Any]:
    """Return ComfyUI's /object_info entry for a node class."""
    import nodes

    cls = nodes.NODE_CLASS_MAPPINGS.get(node_type)
    if cls is None:
        raise ToolError(f"Unknown node type '{node_type}'. Use search_nodes to find the exact name.")

    try:
        from comfy_api.internal import _ComfyNodeInternal

        if issubclass(cls, _ComfyNodeInternal):
            return cls.GET_NODE_INFO_V1()
    except ImportError:
        pass

    return {
        "input": cls.INPUT_TYPES(),
        "output": list(cls.RETURN_TYPES),
        "output_name": list(getattr(cls, "RETURN_NAMES", None) or cls.RETURN_TYPES),
        "output_is_list": list(getattr(cls, "OUTPUT_IS_LIST", None) or [False] * len(cls.RETURN_TYPES)),
        "name": node_type,
        "display_name": nodes.NODE_DISPLAY_NAME_MAPPINGS.get(node_type, node_type),
        "description": getattr(cls, "DESCRIPTION", ""),
        "category": getattr(cls, "CATEGORY", "sd"),
        "output_node": bool(getattr(cls, "OUTPUT_NODE", False)),
        "deprecated": bool(getattr(cls, "DEPRECATED", False)),
    }


def compact_input(name: str, spec: Any, required: bool) -> Dict[str, Any]:
    """Reduce an INPUT_TYPES entry to what an LLM needs to wire the node."""
    if not isinstance(spec, (list, tuple)) or not spec:
        return {"name": name, "type": "*", "required": required, "widget": False}

    type_spec = spec[0]
    opts = spec[1] if len(spec) > 1 and isinstance(spec[1], dict) else {}
    out: Dict[str, Any] = {"name": name, "required": required}

    options = None
    if isinstance(type_spec, (list, tuple)):
        options = list(type_spec)
        out["type"] = "COMBO"
    else:
        out["type"] = str(type_spec)
        if out["type"] == "COMBO":
            options = list(opts.get("options") or [])

    out["widget"] = out["type"] in WIDGET_TYPES and not opts.get("forceInput", False)
    if options is not None:
        out["options"] = options[:MAX_COMBO_OPTIONS]
        if len(options) > MAX_COMBO_OPTIONS:
            out["options_total"] = len(options)
    for key in ("default", "min", "max", "step", "multiline"):
        if key in opts:
            out[key] = opts[key]
    if opts.get("tooltip"):
        out["tooltip"] = str(opts["tooltip"])[:200]
    return out


def compact_node_info(info: Dict[str, Any]) -> Dict[str, Any]:
    inputs: List[Dict[str, Any]] = []
    for section, required in (("required", True), ("optional", False)):
        for name, spec in (info.get("input", {}).get(section) or {}).items():
            inputs.append(compact_input(name, spec, required))

    outputs = []
    names = info.get("output_name") or info.get("output") or []
    for i, out_type in enumerate(info.get("output") or []):
        out_type = "COMBO" if isinstance(out_type, (list, tuple)) else out_type
        outputs.append({"index": i, "name": names[i] if i < len(names) else out_type, "type": out_type})

    result = {
        "name": info.get("name"),
        "display_name": info.get("display_name"),
        "category": info.get("category"),
        "description": info.get("description") or "",
        "inputs": inputs,
        "outputs": outputs,
        "output_node": info.get("output_node", False),
    }
    if info.get("deprecated"):
        result["deprecated"] = True
    return result


def search_nodes(args: Dict[str, Any], _ctx: ToolContext) -> Dict[str, Any]:
    import nodes

    query = str(args.get("query", "")).strip().lower()
    limit = max(1, min(int(args.get("limit", 20)), 100))
    if not query:
        raise ToolError("query is required")
    terms = query.split()

    scored: List[Tuple[int, str]] = []
    for name, cls in nodes.NODE_CLASS_MAPPINGS.items():
        display = nodes.NODE_DISPLAY_NAME_MAPPINGS.get(name, name)
        category = str(getattr(cls, "CATEGORY", ""))
        haystack = f"{name} {display} {category}".lower()
        if not all(t in haystack for t in terms):
            continue
        score = 0
        if query in (name.lower(), display.lower()):
            score += 100
        if name.lower().startswith(terms[0]) or display.lower().startswith(terms[0]):
            score += 20
        score -= len(name) // 8
        if getattr(cls, "DEPRECATED", False):
            score -= 50
        scored.append((score, name))

    scored.sort(key=lambda s: (-s[0], s[1]))
    results = []
    for _, name in scored[:limit]:
        cls = nodes.NODE_CLASS_MAPPINGS[name]
        results.append({
            "name": name,
            "display_name": nodes.NODE_DISPLAY_NAME_MAPPINGS.get(name, name),
            "category": getattr(cls, "CATEGORY", ""),
        })
    return {"query": query, "total_matches": len(scored), "nodes": results}


def get_node_info(args: Dict[str, Any], _ctx: ToolContext) -> Dict[str, Any]:
    names = args.get("node_types") or ([args["node_type"]] if args.get("node_type") else [])
    if not names:
        raise ToolError("node_types is required")
    return {"nodes": [compact_node_info(node_info(str(n))) for n in names[:10]]}


def list_models(args: Dict[str, Any], _ctx: ToolContext) -> Dict[str, Any]:
    import folder_paths

    folder = args.get("folder")
    if not folder:
        folders = {}
        for key in sorted(folder_paths.folder_names_and_paths):
            if key in ("custom_nodes", "configs"):
                continue
            try:
                folders[key] = len(folder_paths.get_filename_list(key))
            except Exception:
                continue
        return {"folders": folders, "hint": "Call list_models with folder=<name> to list files."}

    if folder not in folder_paths.folder_names_and_paths:
        raise ToolError(f"Unknown model folder '{folder}'")
    files = folder_paths.get_filename_list(folder)
    query = str(args.get("query", "")).lower()
    if query:
        files = [f for f in files if query in f.lower()]
    return {"folder": folder, "total": len(files), "files": files[:200]}


def _history_entry(prompt_id: str) -> Optional[Dict[str, Any]]:
    from server import PromptServer

    history = PromptServer.instance.prompt_queue.get_history(prompt_id=prompt_id)
    return history.get(prompt_id)


def _queue_state(prompt_id: str) -> Optional[str]:
    from server import PromptServer

    running, queued = PromptServer.instance.prompt_queue.get_current_queue_volatile()
    if any(item[1] == prompt_id for item in running):
        return "running"
    if any(item[1] == prompt_id for item in queued):
        return "queued"
    return None


def summarize_history(prompt_id: str, entry: Dict[str, Any]) -> Dict[str, Any]:
    status = entry.get("status") or {}
    result: Dict[str, Any] = {
        "prompt_id": prompt_id,
        "status": status.get("status_str") or ("success" if status.get("completed") else "unknown"),
    }

    images = []
    other_outputs: Dict[str, List[str]] = {}
    for node_id, output in (entry.get("outputs") or {}).items():
        for key, items in output.items():
            if key in ("images", "gifs", "videos", "audio") and isinstance(items, list):
                for item in items:
                    if isinstance(item, dict) and "filename" in item:
                        images.append({
                            "node_id": node_id,
                            "kind": key,
                            "filename": item["filename"],
                            "subfolder": item.get("subfolder", ""),
                            "type": item.get("type", "output"),
                        })
            elif key not in ("animated",):
                other_outputs.setdefault(node_id, []).append(key)
    result["files"] = images
    if other_outputs:
        result["other_outputs"] = other_outputs

    for event, data in status.get("messages") or []:
        if event == "execution_error":
            result["error"] = {
                "node_id": data.get("node_id"),
                "node_type": data.get("node_type"),
                "message": data.get("exception_message", "").strip(),
            }
        elif event == "execution_interrupted":
            result["status"] = "interrupted"
    return result


async def get_run_status(args: Dict[str, Any], _ctx: ToolContext) -> Dict[str, Any]:
    prompt_id = str(args.get("prompt_id", "")).strip()
    if not prompt_id:
        raise ToolError("prompt_id is required")
    wait = max(0.0, min(float(args.get("wait_seconds", 60)), 600.0))

    deadline = asyncio.get_running_loop().time() + wait
    while True:
        entry = _history_entry(prompt_id)
        if entry is not None:
            return summarize_history(prompt_id, entry)
        state = _queue_state(prompt_id)
        if state is None:
            return {"prompt_id": prompt_id, "status": "unknown",
                    "hint": "Not in the queue or history. It may have been cleared."}
        if asyncio.get_running_loop().time() >= deadline:
            return {"prompt_id": prompt_id, "status": state,
                    "hint": "Still in progress. Call get_run_status again to keep waiting."}
        await asyncio.sleep(0.5)


def _resolve_image_path(filename: str, subfolder: str, kind: str) -> str:
    import folder_paths

    base_dirs = {
        "output": folder_paths.get_output_directory(),
        "temp": folder_paths.get_temp_directory(),
        "input": folder_paths.get_input_directory(),
    }
    if kind not in base_dirs:
        raise ToolError("type must be one of output, temp, input")
    base = os.path.abspath(base_dirs[kind])
    path = os.path.abspath(os.path.join(base, subfolder or "", filename))
    if os.path.commonpath([base, path]) != base:
        raise ToolError("Path escapes the ComfyUI directory")
    if not os.path.isfile(path):
        raise ToolError(f"File not found: {os.path.join(subfolder or '', filename)} ({kind})")
    return path


def encode_image_for_llm(path: str, max_side: int = MAX_IMAGE_SIDE) -> Tuple[ToolImage, Tuple[int, int]]:
    from PIL import Image

    with Image.open(path) as img:
        original_size = img.size
        img.seek(0)
        frame = img.convert("RGBA" if img.mode in ("RGBA", "LA", "P") else "RGB")
        frame.thumbnail((max_side, max_side))
        buf = io.BytesIO()
        if frame.mode == "RGBA":
            frame.save(buf, format="PNG")
            media_type = "image/png"
        else:
            frame.save(buf, format="JPEG", quality=85)
            media_type = "image/jpeg"
    return ToolImage(media_type, base64.b64encode(buf.getvalue()).decode("ascii")), original_size


def view_image(args: Dict[str, Any], _ctx: ToolContext) -> ToolOutput:
    filename = str(args.get("filename", ""))
    if not filename:
        raise ToolError("filename is required")
    path = _resolve_image_path(filename, str(args.get("subfolder", "")), str(args.get("type", "output")))
    image, (w, h) = encode_image_for_llm(path)
    return ToolOutput(text=f"Image {filename} ({w}x{h}) is attached.", images=[image])


def register(registry: ToolRegistry) -> None:
    registry.register(Tool(
        "search_nodes",
        "Search installed ComfyUI node types by keywords (matches class name, display name and category). "
        "Returns exact class names to use with get_node_info / add_node.",
        schema({
            "query": {"type": "string", "description": "Keywords, e.g. 'ksampler', 'load image', 'upscale model'"},
            "limit": {"type": "integer", "description": "Max results (default 20)"},
        }, ["query"]),
        search_nodes,
    ))
    registry.register(Tool(
        "get_node_info",
        "Get the inputs (with types, defaults, ranges and combo options), outputs and description of node types. "
        "Always check this before adding or wiring an unfamiliar node.",
        schema({
            "node_types": {"type": "array", "items": {"type": "string"}, "description": "Exact node class names (max 10)"},
        }, ["node_types"]),
        get_node_info,
    ))
    registry.register(Tool(
        "list_models",
        "List model folders (checkpoints, loras, vae, ...) with file counts, or the files inside one folder.",
        schema({
            "folder": {"type": "string", "description": "Folder name, e.g. 'checkpoints'. Omit to list folders."},
            "query": {"type": "string", "description": "Optional substring filter on file names"},
        }),
        list_models,
    ))
    registry.register(Tool(
        "get_run_status",
        "Get the status of a queued workflow run, waiting up to wait_seconds for it to finish. "
        "Returns status, generated files and any execution error.",
        schema({
            "prompt_id": {"type": "string"},
            "wait_seconds": {"type": "number", "description": "How long to wait for completion (default 60, max 600)"},
        }, ["prompt_id"]),
        get_run_status,
    ))
    registry.register(Tool(
        "view_image",
        "Look at an image file produced or used by ComfyUI (downscaled). Use the filename/subfolder/type "
        "values returned by get_run_status.",
        schema({
            "filename": {"type": "string"},
            "subfolder": {"type": "string"},
            "type": {"type": "string", "enum": ["output", "temp", "input"]},
        }, ["filename"]),
        view_image,
    ))
