#!/bin/bash
# Setup script for integrating prompt library into a new project

echo "🚀 Setting up Prompt Library Integration..."

# 1. Add git submodule
echo "📦 Adding prompt library as submodule..."
git submodule add https://github.com/spryker-dev/prompt-library ai-prompts

# 2. Generate tag index
echo "🏷️  Generating tag index..."
bash ai-prompts/scripts/generate-tags.sh

# 3. Setup AI assistant rules
echo "🤖 Setting up AI assistant rules..."
mkdir -p .windsurf
mkdir -p ~/.windsurf

# Setup local rules
if [ -f .windsurf/rules.md ]; then
    echo "⚠️  Found existing .windsurf/rules.md"
    echo "📋 Appending prompt library rules..."
    echo "" >> .windsurf/rules.md
    echo "# Prompt Library Integration (Auto-added)" >> .windsurf/rules.md
    cat ai-prompts/.windsurf/rules.md >> .windsurf/rules.md
    echo "✅ Rules appended to existing file"
else
    echo "📋 Creating new rules file..."
    cp ai-prompts/.windsurf/rules.md .windsurf/rules.md
    echo "✅ Rules file created"
fi

# Setup global rules
GLOBAL_RULES_PATH="$HOME/.codeium/windsurf/memories/global_rules.md"
if [ -f "$GLOBAL_RULES_PATH" ]; then
    echo "🌍 Updating global AI rules..."
    if ! grep -q "Prompt Library Integration" "$GLOBAL_RULES_PATH"; then
        echo "" >> "$GLOBAL_RULES_PATH"
        echo "# Prompt Library Integration (Auto-added)" >> "$GLOBAL_RULES_PATH"
        cat ai-prompts/.windsurf/rules.md >> "$GLOBAL_RULES_PATH"
        echo "✅ Global rules updated"
    else
        echo "ℹ️  Global rules already contain prompt library integration"
    fi
else
    echo "🌍 Creating global AI rules..."
    mkdir -p "$(dirname "$GLOBAL_RULES_PATH")"
    cp ai-prompts/.windsurf/rules.md "$GLOBAL_RULES_PATH"
    echo "✅ Global rules created"
fi
echo ""
echo "💡 You can also manage these through Windsurf UI:"
echo "   Settings → Customizations → Rules → Global Rules"

echo ""
echo "✅ Setup complete!"

# Add to .gitignore
echo "📝 Updating .gitignore..."
if ! grep -q "prompt-tags.json" .gitignore 2>/dev/null; then
    echo "" >> .gitignore
    echo "# AI Prompt Library - auto-generated files" >> .gitignore
    echo "prompt-tags.json" >> .gitignore
    echo "ai-prompts/" >> .gitignore
    echo ".windsurf/rules.md" >> .gitignore
    echo "✅ Added prompt library files to .gitignore"
else
    echo "ℹ️  Prompt library files already in .gitignore"
fi

echo ""
echo "📖 Usage:"
echo "  - Use #tag in your messages to auto-load prompts"
echo "  - Example: 'Create plugin #plugin'"
echo "  - Available tags:"
grep '".*":' prompt-tags.json | sed 's/.*"\(.*\)".*/    #\1/' | head -10
echo ""
echo "🔄 To update: git submodule update --remote && bash ai-prompts/scripts/generate-tags.sh"
