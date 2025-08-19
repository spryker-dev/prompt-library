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
For a better experience we recomment to add `Use spryker prompts` to the end of the prompt. \
#### Example:
```text
Please give me a prompt to implement a customer data import module with basic fields. Use spryker prompts.
```
Agent will return a prompt from mcp and modify it to fit your needs.

## Upgrade package
Run the command.
```shell
uvx --from git+https://github.com/spryker-dev/prompt-library@feature/prompt-mcp-improvements prompt-mcp
```
Wait until the command is finished. It should look like this:
```text
uvx --from git+https://github.com/spryker-dev/prompt-library prompt-mcp
Updated https://github.com/spryker-dev/prompt-library (d2b45720795cd18522a2bd07045915def1c13d41)
Built prompt-library @ git+https://github.com/spryker-dev/prompt-library@d2b45720795cd18522a2bd07045915def1c13d41
Installed 34 packages in 47ms
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
