from pathlib import Path

import pytest

from comfy_open_agent.skills.manager import SkillsManager, parse_skill


def test_frontmatter_takes_precedence():
    parsed = parse_skill("---\nname: upscale\ndescription: Upscale images\n---\n# Body\n", "dir-name")
    assert parsed["name"] == "upscale"
    assert parsed["description"] == "Upscale images"
    assert parsed["body"].startswith("# Body")


@pytest.mark.parametrize("line", ["**Description**: Build things", "Description: Build things"])
def test_description_line_formats(line):
    assert parse_skill(f"# Title\n\n{line}\n", "x")["description"] == "Build things"


def test_falls_back_to_first_line_and_dir_name():
    parsed = parse_skill("# My Skill\nmore", "my-skill")
    assert parsed == {"name": "my-skill", "description": "My Skill", "body": "# My Skill\nmore"}


def _make_skill(root: Path, name: str, text: str) -> Path:
    d = root / name
    (d / "references").mkdir(parents=True)
    (d / "SKILL.md").write_text(text, encoding="utf-8")
    (d / "references" / "wf.json").write_text("{}", encoding="utf-8")
    return d


def test_load_lists_references_and_later_dirs_override(tmp_path):
    a, b = tmp_path / "a", tmp_path / "b"
    _make_skill(a, "s", "Description: from a")
    _make_skill(b, "s", "Description: from b")
    manager = SkillsManager([a, b])
    skill = manager.get_skill("s")
    assert skill.description == "from b"
    assert skill.references == ["references/wf.json"]
    assert manager.read_reference("s", "references/wf.json") == "{}"


def test_read_reference_blocks_path_traversal(tmp_path):
    _make_skill(tmp_path, "s", "Description: x")
    (tmp_path / "secret.txt").write_text("nope")
    with pytest.raises(KeyError):
        SkillsManager([tmp_path]).read_reference("s", "../secret.txt")


def test_builtin_skills_load():
    names = {s["name"] for s in SkillsManager().list_skills()}
    assert "basic-workflow-builder" in names
