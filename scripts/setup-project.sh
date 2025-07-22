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
cat << 'EOF'
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
EOF
echo "----------------------------------------"
echo ""
echo "💡 After adding rules, test with: 'Create data import #data-import'"

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
