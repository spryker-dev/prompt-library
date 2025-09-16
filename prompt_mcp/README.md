# 🚀 Spryker Prompt MCP Server

MCP server for Spryker Prompt Library.

## Installation
1. Pull the repository
2. Install [uv](https://docs.astral.sh/uv/#installation).
3. `cd /<path to prompt-library dir>/prompt-library && uv pip install`
4. Add the following configuration to your `mcpServers`:
```json
{
    "mcpServers": {
        "spryker-prompts": {
            "command": "uv",
            "args": [
                "--directory",
                "/<path to prompt-library dir>/prompt-library",
                "run",
                "prompt-mcp"
            ]
        }
    }
}
```
