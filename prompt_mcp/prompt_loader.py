from pathlib import Path
from typing import List, Dict, Any, Optional

PROMPTS_DIR = Path(__file__).parent.parent / "prompts"

class PromptLoader:
    def __init__(self, prompts_dir: Path = PROMPTS_DIR):
        self.prompts_dir = prompts_dir
        self.prompts: List[Dict[str, Any]] = []
        self.filename_map: Dict[str, Dict[str, Any]] = {}

    def load_prompts(self):
        """Scan the prompts directory and parse all .md files, only if not already loaded."""
        if self.prompts:
            return
        self._reload_prompts()

    def force_reload(self):
        """Force reload prompts from disk, even if already loaded."""
        self._reload_prompts()

    def _reload_prompts(self):
        self.prompts = []
        self.filename_map = {}
        for file in self.prompts_dir.glob("**/*.md"):
            with open(file, "r", encoding="utf-8") as f:
                content = f.read()
                title = ""
                description = ""
                tags = []
                lines = content.splitlines()
                description_lines = []
                parsing_description = False
                for line in lines:
                    if line.startswith("# "):
                        title = line[2:].strip()
                    elif line.startswith("## Description"):
                        parsing_description = True
                    elif line.startswith("## Tags (comma-separated)"):
                        parsing_description = False
                    elif line.startswith("##"):
                        parsing_description = False
                    elif parsing_description and line.strip():
                        description_lines.append(line.strip())
                try:
                    tags_heading_index = lines.index("## Tags (comma-separated)")
                    if tags_heading_index + 1 < len(lines):
                        tags_line = lines[tags_heading_index + 1]
                        tags = [tag.strip() for tag in tags_line.split(",") if tag.strip()]
                except ValueError:
                    pass  # No tags section found
                description = " ".join(description_lines)
                prompt = {
                    "filename": file.name,
                    "content": content,
                    "title": title,
                    "description": description,
                    "tags": tags,
                }
                self.prompts.append(prompt)
                self.filename_map[file.name] = prompt

    def get_all_prompts(self) -> List[Dict[str, Any]]:
        """Return all parsed prompts."""
        return self.prompts

    def get_prompt_by_filename(self, filename: str) -> Optional[Dict[str, Any]]:
        """Return a prompt by its filename, or None if not found."""
        return self.filename_map.get(filename)
