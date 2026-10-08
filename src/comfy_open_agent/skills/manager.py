"""Agent skills manager for Comfy Open Agent."""

import os
import json
from pathlib import Path
from typing import Dict, List, Optional, Any


class Skill:
    """Represents an agent skill."""

    def __init__(self, name: str, description: str, content: str, references: Optional[List[str]] = None):
        """
        Initialize a skill.

        Args:
            name: Skill name
            description: Skill description
            content: Skill content (SKILL.md content)
            references: List of reference file paths
        """
        self.name = name
        self.description = description
        self.content = content
        self.references = references or []

    def to_dict(self) -> Dict[str, Any]:
        """Convert skill to dictionary."""
        return {
            "name": self.name,
            "description": self.description,
            "content": self.content,
            "references": self.references,
        }


class SkillsManager:
    """Manager for agent skills."""

    def __init__(self, skills_dir: Optional[str] = None):
        """
        Initialize skills manager.

        Args:
            skills_dir: Directory containing skills
        """
        if skills_dir is None:
            # Default to skills directory in the package
            self.skills_dir = Path(__file__).parent.parent.parent.parent / "skills"
        else:
            self.skills_dir = Path(skills_dir)

        self.skills: Dict[str, Skill] = {}
        self._load_skills()

    def _load_skills(self):
        """Load all skills from the skills directory."""
        if not self.skills_dir.exists():
            print(f"[SkillsManager] Skills directory not found: {self.skills_dir}")
            return

        for skill_path in self.skills_dir.iterdir():
            if skill_path.is_dir():
                skill_file = skill_path / "SKILL.md"
                if skill_file.exists():
                    skill = self._load_skill(skill_path, skill_file)
                    if skill:
                        self.skills[skill.name] = skill
                        print(f"[SkillsManager] Loaded skill: {skill.name}")

    def _load_skill(self, skill_dir: Path, skill_file: Path) -> Optional[Skill]:
        """
        Load a single skill.

        Args:
            skill_dir: Skill directory
            skill_file: SKILL.md file path

        Returns:
            Skill instance or None
        """
        try:
            with open(skill_file, 'r', encoding='utf-8') as f:
                content = f.read()

            # Extract name and description from content
            name = skill_dir.name
            description = self._extract_description(content)

            # Load references if they exist
            references_dir = skill_dir / "references"
            references = []
            if references_dir.exists():
                for ref_file in references_dir.iterdir():
                    if ref_file.is_file():
                        references.append(str(ref_file))

            return Skill(name, description, content, references)

        except Exception as e:
            print(f"[SkillsManager] Error loading skill from {skill_dir}: {e}")
            return None

    def _extract_description(self, content: str) -> str:
        """
        Extract description from skill content.

        Args:
            content: Skill content

        Returns:
            Description string
        """
        # Look for a description line or use the first paragraph
        lines = content.split('\n')
        for line in lines:
            if line.lower().startswith('description:'):
                return line.split(':', 1)[1].strip()

        # If no description line, use first non-empty line
        for line in lines:
            if line.strip():
                return line.strip()[:200]  # First 200 chars

        return "No description available"

    def get_skill(self, name: str) -> Optional[Skill]:
        """
        Get a skill by name.

        Args:
            name: Skill name

        Returns:
            Skill instance or None
        """
        return self.skills.get(name)

    def list_skills(self) -> List[Dict[str, Any]]:
        """
        List all available skills.

        Returns:
            List of skill dictionaries
        """
        return [skill.to_dict() for skill in self.skills.values()]

    def search_skills(self, query: str) -> List[Skill]:
        """
        Search for skills by name or description.

        Args:
            query: Search query

        Returns:
            List of matching skills
        """
        query_lower = query.lower()
        results = []

        for skill in self.skills.values():
            if (query_lower in skill.name.lower() or
                query_lower in skill.description.lower() or
                query_lower in skill.content.lower()):
                results.append(skill)

        return results

    def get_skill_content(self, name: str) -> Optional[str]:
        """
        Get the full content of a skill.

        Args:
            name: Skill name

        Returns:
            Skill content or None
        """
        skill = self.get_skill(name)
        if skill:
            return skill.content
        return None

    def get_skill_references(self, name: str) -> List[str]:
        """
        Get reference file paths for a skill.

        Args:
            name: Skill name

        Returns:
            List of reference file paths
        """
        skill = self.get_skill(name)
        if skill:
            return skill.references
        return []


# Global skills manager instance
_skills_manager: Optional[SkillsManager] = None


def get_skills_manager(skills_dir: Optional[str] = None) -> SkillsManager:
    """
    Get the global skills manager instance.

    Args:
        skills_dir: Optional skills directory

    Returns:
        SkillsManager instance
    """
    global _skills_manager
    if _skills_manager is None:
        _skills_manager = SkillsManager(skills_dir)
    return _skills_manager
