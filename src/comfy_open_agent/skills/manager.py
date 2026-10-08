"""Agent skills: SKILL.md instruction packs with optional reference files."""

import os
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List, Optional

PACKAGE_ROOT = Path(__file__).resolve().parents[3]
BUILTIN_SKILLS_DIR = PACKAGE_ROOT / "skills"
EXTRA_SKILLS_ENV = "COMFY_OPEN_AGENT_SKILLS_DIR"
MAX_REFERENCE_BYTES = 200_000

_FRONTMATTER = re.compile(r"\A---\s*\n(.*?)\n---\s*\n", re.DOTALL)
_DESCRIPTION_LINE = re.compile(r"^\s*(?:\*\*)?description(?:\*\*)?\s*:\s*(?:\*\*)?\s*(.+)$", re.IGNORECASE)


@dataclass
class Skill:
    name: str
    description: str
    content: str
    directory: Path
    references: List[str] = field(default_factory=list)

    def to_summary(self) -> Dict[str, str]:
        return {"name": self.name, "description": self.description}


def parse_skill(text: str, default_name: str) -> Dict[str, str]:
    """Extract name/description from YAML-ish frontmatter or a 'Description:' line."""
    meta: Dict[str, str] = {}
    body = text
    match = _FRONTMATTER.match(text)
    if match:
        body = text[match.end():]
        for line in match.group(1).splitlines():
            if ":" in line and not line.startswith((" ", "\t")):
                key, value = line.split(":", 1)
                meta[key.strip().lower()] = value.strip().strip("'\"")

    description = meta.get("description", "")
    if not description:
        for line in body.splitlines():
            m = _DESCRIPTION_LINE.match(line)
            if m:
                description = m.group(1).strip()
                break
    if not description:
        description = next((l.strip("# ").strip() for l in body.splitlines() if l.strip()), "")

    return {"name": meta.get("name") or default_name, "description": description[:300], "body": body}


class SkillsManager:
    def __init__(self, skill_dirs: Optional[List[Path]] = None):
        if skill_dirs is None:
            skill_dirs = [BUILTIN_SKILLS_DIR]
            extra = os.environ.get(EXTRA_SKILLS_ENV)
            if extra:
                skill_dirs += [Path(p) for p in extra.split(os.pathsep) if p]
        self.skill_dirs = skill_dirs

    def load(self) -> Dict[str, Skill]:
        """Scan skill directories. Later directories override earlier ones by name."""
        skills: Dict[str, Skill] = {}
        for root in self.skill_dirs:
            if not root.is_dir():
                continue
            for skill_dir in sorted(p for p in root.iterdir() if p.is_dir()):
                skill_file = skill_dir / "SKILL.md"
                if not skill_file.is_file():
                    continue
                try:
                    text = skill_file.read_text(encoding="utf-8")
                except OSError as e:
                    print(f"[comfy-open-agent] Could not read {skill_file}: {e}")
                    continue
                parsed = parse_skill(text, skill_dir.name)
                references = sorted(
                    str(p.relative_to(skill_dir)).replace(os.sep, "/")
                    for p in skill_dir.rglob("*")
                    if p.is_file() and p.name != "SKILL.md" and not p.name.startswith(".")
                )
                skills[parsed["name"]] = Skill(
                    parsed["name"], parsed["description"], parsed["body"], skill_dir, references
                )
        return skills

    def list_skills(self) -> List[Dict[str, str]]:
        return [s.to_summary() for s in self.load().values()]

    def get_skill(self, name: str) -> Optional[Skill]:
        return self.load().get(name)

    def read_reference(self, name: str, relative_path: str) -> str:
        skill = self.get_skill(name)
        if skill is None:
            raise KeyError(f"Unknown skill '{name}'")
        root = skill.directory.resolve()
        path = (root / relative_path).resolve()
        if root not in path.parents or not path.is_file():
            raise KeyError(f"Skill '{name}' has no file '{relative_path}'")
        data = path.read_bytes()[:MAX_REFERENCE_BYTES]
        return data.decode("utf-8", errors="replace")


_skills_manager: Optional[SkillsManager] = None


def get_skills_manager() -> SkillsManager:
    global _skills_manager
    if _skills_manager is None:
        _skills_manager = SkillsManager()
    return _skills_manager
