from pathlib import Path
from typing import List, Dict, Any, Optional
import frontmatter

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
            try:
                with open(file, "r", encoding="utf-8") as f:
                    post = frontmatter.load(f)

                prompt = {
                    "filename": file.name,
                    "content": post.content,
                    "title": post.metadata.get("title", ""),
                    "description": post.metadata.get("description", ""),
                    "tags": post.metadata.get("tags", []) if isinstance(post.metadata.get("tags"), list) else [],
                    "when_to_use": post.metadata.get("when_to_use"),
                    "author": post.metadata.get("author"),
                }
                self.prompts.append(prompt)
                self.filename_map[file.name] = prompt
            except Exception as e:
                print(f"Error parsing {file.name}: {e}")

    def get_all_prompts(self) -> List[Dict[str, Any]]:
        """Return all parsed prompts."""
        return self.prompts

    def get_prompt_by_filename(self, filename: str) -> Optional[Dict[str, Any]]:
        """Return a prompt by its filename, or None if not found."""
        return self.filename_map.get(filename)
