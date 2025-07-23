# 🚀 Spryker Prompt Library Integration for Windsurf

## Overview
Auto-load expert prompts using hashtags in your Windsurf messages. Instead of copy-pasting prompts, just type `#data-import` (example) and the AI automatically applies the relevant template knowledge to your request.

> **Note:** This setup is specifically designed for Windsurf AI editor. For other editors like Cursor, see separate setup guides.

## Setup

### 1. Run Setup Script
Navigate to your project directory and run:
```bash
cd your-project-directory
bash <(curl -s https://raw.githubusercontent.com/spryker-dev/prompt-library/main/scripts/setup-project.sh)
```

This will:
- Add prompt library as git submodule in `ai-prompts/`
- Generate `prompt-tags.json` with available tags
- Update `.gitignore` to exclude generated files

### 2. Add AI Rules to Windsurf
Go to: **Windsurf Settings → Customizations → Rules → Global Rules**

Copy and paste this content:

```markdown
# AI Assistant Rules for Prompt Library Integration

## Natural Tag-Based Prompt Enhancement

When you encounter hashtags (e.g., `#tag1`, `#tag2`, `#tag3` - examples) in user messages:

1. **Check for available prompts**: Look for `prompt-tags.json` in the project root
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
1. Read `prompt-tags.json` in project root to get tag → prompt file mappings
2. For hashtag `#example` (example), look up the corresponding prompt file path
3. Load the actual prompt content from `ai-prompts/prompts/[category]/[filename].md`
4. Values can be strings (single prompt) or arrays (multiple prompts to choose from)

**File structure:**
- Mapping: `prompt-tags.json` (project root)
- Prompts: `ai-prompts/prompts/[category]/[filename].md`

## File Location

- Prompt mapping: `prompt-tags.json` (project root)

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
cat prompt-tags.json | jq -r 'keys[]' | sed 's/^/#/'

# Or just look at the keys
grep '".*":' prompt-tags.json
```

## How It Works

1. Setup adds prompt library as git submodule and generates tag mapping
2. You add AI rules to Windsurf global settings
3. AI detects `#tag` (example) and loads corresponding prompt
4. Prompt is applied to your request automatically

## Benefits

✅ **Zero setup** - one command
✅ **Always current** - auto-generated from prompts
✅ **Team consistency** - same prompts for everyone
✅ **Fast development** - no copy-paste needed

## Update

```bash
# Update prompt library to latest version
git submodule update --remote ai-prompts
bash ai-prompts/scripts/generate-tags.sh
```

That's it! 🎯
