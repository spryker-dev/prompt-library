from mcp.server.fastmcp import FastMCP
from .prompt_loader import PromptLoader
from .semantic_search import SemanticSearch

prompt_loader = PromptLoader()
prompt_loader.load_prompts()
prompts = prompt_loader.get_all_prompts()
semantic_search = SemanticSearch(prompts)

def reload_semantic_search():
    global prompts, semantic_search
    prompt_loader.force_reload()
    prompts = prompt_loader.get_all_prompts()
    semantic_search = SemanticSearch(prompts)

mcp = FastMCP("Spryker Prompts MCP")

@mcp.tool()
def search_prompts(query: str, limit: int = 3):
    """Semantic search for prompts. Returns full prompt content for top matches."""
    results = semantic_search.search(query, limit)

    return {
        "results": [
            {
                "filename": p["filename"],
                "title": p["title"],
                "description": p["description"],
                "tags": p["tags"],
                "content": p["content"],
                "score": score,
            }
            for p, score in results
        ]
    }

@mcp.tool()
def get_prompt(filename: str):
    """Get a specific prompt by filename."""
    prompt = prompt_loader.get_prompt_by_filename(filename)

    if not prompt:
        return {"error": f"Prompt '{filename}' not found."}

    return {
        "filename": prompt["filename"],
        "title": prompt["title"],
        "description": prompt["description"],
        "tags": prompt["tags"],
        "content": prompt["content"],
    }

@mcp.tool()
def list_prompts():
    """List all available prompts with brief descriptions."""

    return {
        "prompts": [
            {
                "filename": p["filename"],
                "title": p["title"],
                "description": p["description"],
                "tags": p["tags"],
            }
            for p in prompts
        ]
    }

@mcp.tool()
def reload_prompts():
    """Reload all prompts from disk and update semantic search."""
    reload_semantic_search()
    return {"status": "reloaded", "prompt_count": len(prompts)}

