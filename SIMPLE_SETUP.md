# 🚀 Smart Prompt Tags

## Overview
Auto-load expert prompts using hashtags in your messages. Instead of copy-pasting prompts, just type `#data-import` (example) and the AI automatically applies the relevant template knowledge to your request.

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
Go to: **Settings → Customizations → Rules → Global Rules**

Copy and paste the AI rules content displayed by the setup script.

Done! 🎯

## Usage

```
You: "Create plugin #plugin"
AI: [Auto-loads plugin prompt and generates code]

You: "Setup data import #data-import"
AI: [Auto-loads import prompt and creates module]
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
