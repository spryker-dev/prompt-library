# 🚀 Spryker Prompt Library Integration

## Overview
Auto-load expert prompts using hashtags. Instead of copy-pasting prompts, just type `#data-import` (example) and the AI automatically applies the relevant template knowledge to your request.

> **Multi-editor support:** This system works with Windsurf, Cursor, GitHub Copilot, and other AI assistants.

## Setup

### Option 1: Automatic Setup (Recommended)
Navigate to your project directory and run:
```bash
cd your-project-directory
bash <(curl -s https://raw.githubusercontent.com/spryker-dev/prompt-library/main/bin/setup-project)
```

### Option 2: Manual Setup
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

### Configure AI Assistant Rules
```bash
Choose your AI editor and follow the corresponding setup:

#### **Windsurf**
Go to: **Settings → Customizations → Rules → Global Rules**

#### **Cursor**
Go to: **Settings → Rules** or create `.cursor/rules` files in your project

#### **VS Code + GitHub Copilot**
Create file: `.github/copilot-instructions.md` in your project root

#### **PhpStorm + GitHub Copilot**
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

## Usage

```
You: "Create data-import module #data-import for Review entity"
AI: [Auto-loads data-import prompt and generates complete module]
```

## Find Available Tags

```bash
# See all available tags
cat ai-prompts/prompt-tags.json | jq -r 'keys[]' | sed 's/^/#/'

# Or just look at the keys
grep '".*":' ai-prompts/prompt-tags.json
```

## How It Works

1. Setup adds prompt library as git submodule and generates tag mapping
2. You add AI rules to settings
3. AI detects `#tag` (example) and loads corresponding prompt
4. Prompt is applied to your request automatically

## Benefits

✅ **Easy setup** - one command <br>
✅ **Always current** - auto-generated from prompts <br>
✅ **Team consistency** - same prompts for everyone <br>
✅ **Fast development** - no copy-paste needed <br>

## Update

```bash
# Update prompt library to latest version
git submodule update --remote ai-prompts
bash ai-prompts/bin/generate-tags
```

That's it! 🎯
