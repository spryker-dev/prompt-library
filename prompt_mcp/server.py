from mcp.server.fastmcp import FastMCP
from .prompt_loader import PromptLoader
import logging

# Initialize logger
logger = logging.getLogger(__name__)

# Initialize prompt loader
prompt_loader = PromptLoader()


def _initialize_prompts():
    """Initialize prompts with error handling."""
    try:
        prompt_loader.load_prompts()
        return True
    except Exception as e:
        logger.error(f"Failed to initialize prompts: {e}")
        return False


# Initialize prompts on startup
_initialize_prompts()

mcp = FastMCP("Spryker Prompts MCP")


@mcp.tool()
def get_prompt(filename: str) -> dict:
    """Get a specific prompt by filename."""
    try:
        prompt = prompt_loader.get_prompt_by_filename(filename)

        if not prompt:
            return {"error": f"Prompt '{filename}' not found."}

        return {
            "filename": prompt["filename"],
            "title": prompt["title"],
            "description": prompt["description"],
            "tags": prompt["tags"],
            "when_to_use": prompt.get("when_to_use"),
            "author": prompt.get("author"),
            "content": prompt["content"],
        }
    except Exception as e:
        logger.error(f"Error retrieving prompt '{filename}': {e}")
        return {"error": f"Failed to retrieve prompt: {str(e)}"}


@mcp.tool()
def list_prompts() -> dict:
    """List all available prompts with brief descriptions."""
    try:
        # Get fresh data from prompt_loader instead of using global variable
        all_prompts = prompt_loader.get_all_prompts()

        return {
            "prompts": [
                {
                    "filename": p["filename"],
                    "title": p["title"],
                    "description": p["description"],
                    "tags": p["tags"],
                    "when_to_use": p.get("when_to_use"),
                    "author": p.get("author"),
                }
                for p in all_prompts
            ]
        }
    except Exception as e:
        logger.error(f"Error listing prompts: {e}")
        return {"error": f"Failed to list prompts: {str(e)}"}


@mcp.tool()
def reload_prompts() -> dict:
    """Reload all prompts from disk."""
    try:
        prompt_loader.force_reload()
        all_prompts = prompt_loader.get_all_prompts()

        return {
            "status": "reloaded",
            "prompt_count": len(all_prompts)
        }
    except Exception as e:
        logger.error(f"Error reloading prompts: {e}")
        return {
            "status": "error",
            "error": f"Failed to reload prompts: {str(e)}"
        }


@mcp.tool()
def search_prompts(query: str) -> dict:
    """Search prompts by title, description, or tags."""
    try:
        all_prompts = prompt_loader.get_all_prompts()
        query_lower = query.lower()

        matching_prompts = []
        for prompt in all_prompts:
            # Search in title, description, tags, when_to_use, and author
            if (query_lower in prompt["title"].lower() or
                query_lower in prompt["description"].lower() or
                any(query_lower in tag.lower() for tag in prompt.get("tags", [])) or
                (prompt.get("when_to_use") and query_lower in prompt["when_to_use"].lower()) or
                (prompt.get("author") and query_lower in prompt["author"].lower())):
                matching_prompts.append({
                    "filename": prompt["filename"],
                    "title": prompt["title"],
                    "description": prompt["description"],
                    "tags": prompt["tags"],
                    "when_to_use": prompt.get("when_to_use"),
                    "author": prompt.get("author"),
                })

        return {
            "query": query,
            "matches": matching_prompts,
            "count": len(matching_prompts)
        }
    except Exception as e:
        logger.error(f"Error searching prompts: {e}")
        return {"error": f"Failed to search prompts: {str(e)}"}
