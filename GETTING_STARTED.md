# 🚀 Spryker Prompt Library Integration

## Overview
We provide two ways to integrate the Spryker Prompt Library with your AI development workflow:

1. **MCP Server Integration** - AI assistant accesses prompts through MCP server
2. **Hashtag Integration** - Auto-load prompts using hashtags like `#data-import`

Choose the approach that best fits your needs.

---

## Option 1: MCP Server Integration

A guide to quickly start using the Spryker Prompts MCP server.

> ⚠️ **Important**: MCP server usage can consume additional credits during operation. Consider disabling the server when not actively using prompts to avoid unnecessary credit usage.

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
For a better experience we recommend adding `Use spryker prompts` to the end of the prompt. \
#### Example:
```text
Please give me a prompt to implement a customer data import module with basic fields. Use spryker prompts.
```
Agent will return a prompt from mcp and modify it to fit your needs.

### Benefits

✅ **Intelligent discovery** - AI finds relevant prompts automatically \
✅ **Semantic matching** - No need to remember specific tags \
✅ **Real-time access** - Direct integration with MCP-compatible assistants \
✅ **Dynamic adaptation** - Prompts contextually modified for your needs \

### Upgrade package
Run the command.
```shell
uvx --from git+https://github.com/spryker-dev/prompt-library prompt-mcp
```
Wait until the command is finished. It should look like this:
```text
uvx --from git+https://github.com/spryker-dev/prompt-library prompt-mcp
Updated https://github.com/spryker-dev/prompt-library (d2b45720795cd18522a2bd07045915def1c13d41)
Built prompt-library @ git+https://github.com/spryker-dev/prompt-library@d2b45720795cd18522a2bd07045915def1c13d41
Installed 34 packages in 47ms
```

### Installation for development
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

---

#### Configure AI Assistant Rules
Choose your AI editor and follow the corresponding setup:

**Windsurf**
Go to: **Settings → Customizations → Rules → Global Rules**

**Cursor**
Go to: **Settings → Rules** or create `.cursor/rules` files in your project

**VS Code + GitHub Copilot**
Create file: `.github/copilot-instructions.md` in your project root

**PhpStorm + GitHub Copilot**
Go to: **Settings → Languages & Frameworks → GitHub Copilot → Custom Instructions**

**Copy and paste this content into your chosen location:**

```markdown
# AI Assistant Rules for Prompt Library Integration

## Natural Tag-Based Prompt Enhancement

When you encounter hashtags (e.g., `#tag1`, `#tag2`, `#tag3` - examples) in user messages:

1. **Check for available prompts**: Look for `prompt-tags.json` in ai-prompts submodule
2. **If relevant prompts exist**: Naturally incorporate them into your analysis and response
3. **Maintain your workflow**: Continue your natural exploration, project analysis, and contextual approach

## Key Principles

- **Keep your natural behavior** - explore project structure, analyze patterns, ask clarifying questions
- **Enhance, don't replace** - use prompts to enrich your knowledge, not override your intelligence
- **Stay contextual** - adapt prompts to the specific project and user needs
- **Be organic** - no robotic announcements, just better-informed responses

## Implementation

- Prompts are templates and guidelines, not rigid scripts
- Your natural project exploration and analysis approach is valuable - keep it
- Use hashtags as hints for additional context, not commands to follow blindly
- Combine prompt knowledge with your understanding of the current project

## Technical Details

**How to use the mapping:**
1. Read `prompt-tags.json` in ai-prompts submodule to get tag → prompt file mappings
2. For hashtag `#example` (example), look up the corresponding prompt file path
3. Load the actual prompt content from `ai-prompts/prompts/[category]/[filename].md`
4. Values can be strings (single prompt) or arrays (multiple prompts to choose from)

**File structure:**
- Mapping: `prompt-tags.json` (ai-prompts submodule)
- Prompts: `ai-prompts/prompts/[category]/[filename].md`

## File Location

- Prompt mapping: `prompt-tags.json` (ai-prompts submodule)

This system enhances your natural capabilities while preserving your intelligent, contextual approach to problem-solving.
```

Done! 🎯

### Usage

```
You: "Create data-import module #data-import for Review entity"
AI: [Auto-loads data-import prompt and generates complete module]
```

### Find Available Tags

```bash
# See all available tags
cat ai-prompts/prompt-tags.json | jq -r 'keys[]' | sed 's/^/#/'

# Or just look at the keys
grep '".*":' ai-prompts/prompt-tags.json
```

### How It Works

1. Setup adds prompt library as git submodule and generates tag mapping
2. You add AI rules to settings
3. AI detects `#tag` (example) and loads corresponding prompt
4. Prompt is applied to your request automatically

### Benefits

✅ **Easy setup** - one command \
✅ **Always current** - auto-generated from prompts \
✅ **Team consistency** - same prompts for everyone \
✅ **Fast development** - no copy-paste needed \

### Update

```bash
# Update prompt library to latest version
git submodule update --remote ai-prompts
bash ai-prompts/bin/generate-tags
```

That's it! 🎯

---

## Option 2: Hashtag Integration

Auto-load expert prompts using hashtags. Instead of copy-pasting prompts, just type `#data-import` (example) and the AI automatically applies the relevant template knowledge to your request.

> **Multi-editor support:** This system works with Windsurf, Cursor, GitHub Copilot, and other AI assistants.

### Setup

#### Automatic Setup (Recommended)
Navigate to your project directory and run:
```bash
cd your-project-directory
bash <(curl -s https://raw.githubusercontent.com/spryker-dev/prompt-library/main/bin/setup-project)
```

#### Manual Setup
If you prefer manual installation:

```bash
# 1. Add as git submodule
git submodule add https://github.com/spryker-dev/prompt-library ai-prompts

# 2. Generate tags mapping
bash ai-prompts/bin/generate-tags
```

Both methods will:
- Add prompt library as git submodule in `ai-prompts/`
- Generate `prompt-tags.json` with available tags
