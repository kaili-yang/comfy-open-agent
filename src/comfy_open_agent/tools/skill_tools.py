"""Tools that expose agent skills to the model."""

from typing import Any, Dict

from ..skills.manager import get_skills_manager
from .registry import Tool, ToolContext, ToolError, ToolRegistry, schema


def read_skill(args: Dict[str, Any], _ctx: ToolContext) -> str:
    name = str(args.get("name", ""))
    manager = get_skills_manager()
    skill = manager.get_skill(name)
    if skill is None:
        available = ", ".join(s["name"] for s in manager.list_skills()) or "none"
        raise ToolError(f"Unknown skill '{name}'. Available: {available}")

    file = args.get("file")
    if file:
        try:
            return manager.read_reference(name, str(file))
        except KeyError as e:
            raise ToolError(str(e))

    text = f"# Skill: {skill.name}\n\n{skill.content}"
    if skill.references:
        text += "\n\nReference files (read with file=<path>):\n" + "\n".join(f"- {r}" for r in skill.references)
    return text


def register(registry: ToolRegistry) -> None:
    registry.register(Tool(
        "read_skill",
        "Load the full instructions of an agent skill listed in the system prompt, or one of its reference files.",
        schema({
            "name": {"type": "string"},
            "file": {"type": "string", "description": "Optional reference file path inside the skill"},
        }, ["name"]),
        read_skill,
    ))
