# 🚀 Smart Prompt Tags

## Problem
Copy-pasting prompts is slow and error-prone.

## Solution  
Use `#tags` to auto-load prompts! 

## Setup (1 command)

```bash
curl -s https://raw.githubusercontent.com/spryker-dev/prompt-library/main/scripts/setup-project.sh | bash
```

Done! 🎯

## Manual Setup (Alternative)

```bash
# Copy AI rules (optional but recommended)
mkdir -p .windsurf
if [ -f .windsurf/rules.md ]; then
    echo "# Prompt Library Integration" >> .windsurf/rules.md
    cat .ai-prompts/.windsurf/rules.md >> .windsurf/rules.md
else
    cp .ai-prompts/.windsurf/rules.md .windsurf/rules.md
fi

# Add to .gitignore
echo "prompt-tags.json" >> .gitignore
```

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

1. Setup copies AI rules to `.windsurf/rules.md`
2. AI detects `#tag` and loads corresponding prompt
3. Prompt is applied to your request automatically

## Benefits

✅ **Zero setup** - one command  
✅ **Always current** - auto-generated from prompts  
✅ **Team consistency** - same prompts for everyone  
✅ **Fast development** - no copy-paste needed

## Update

```bash
# Update prompt library to latest version
git submodule update --remote .ai-prompts
bash .ai-prompts/scripts/generate-tags.sh
```

That's it! 🎯
