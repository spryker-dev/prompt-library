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

echo "📋 To enable tag-based prompts, add these rules to Windsurf:"
echo "   Settings → Customizations → Rules → Global Rules"
echo ""
echo "📄 Copy this content:"
echo "----------------------------------------"
cat ai-prompts/.windsurf/rules.md
echo "----------------------------------------"
echo ""
echo "� After adding rules, test with: 'Create plugin #plugin'"

echo ""
echo "✅ Setup complete!"

# Add to .gitignore
echo "📝 Updating .gitignore..."
if ! grep -q "prompt-tags.json" .gitignore 2>/dev/null; then
    echo "" >> .gitignore
    echo "# AI Prompt Library - auto-generated files" >> .gitignore
    echo "prompt-tags.json" >> .gitignore
    echo "ai-prompts/" >> .gitignore
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
