# Prompt MCP

## Getting Started
A short guide to quickly start using the Spryker Prompts MCP server.

### Quick Start
1. Install [uv](https://docs.astral.sh/uv/#installation). \
    When using [uv](https://docs.astral.sh/uv/) no specific installation is needed. \
    We will use [uvx](https://docs.astral.sh/uv/guides/tools/) to directly run prompt_mcp.
2. Add the following configuration to your `mcpServers`:
    ```json
    {
        "mcpServers": {
            "spryker-prompts": {
                  "command": "path-to/uvx",
                  "args": [
                    "--from",
                    "git+https://github.com/spryker-dev/prompt-library",
                    "prompt-mcp"
                  ]
            }
        }
    }
    ```
3. Use it. \
For example, you want to generate some module with spryker-prompt mcp.
For a better experience we recomment to add `Use spryker prompts` to the end of the prompt.

## Upgrade package
```shell
uv tool upgrade prompt-mcp --from git+https://github.com/spryker-dev/prompt-library
```

## Installation for development
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
