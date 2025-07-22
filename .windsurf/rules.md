# AI Assistant Rules for Prompt Library Integration

## Natural Tag-Based Prompt Enhancement

When you encounter hashtags (e.g., `#tag1`, `#tag2`, `#tag3`) in user messages:

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
2. For hashtag `#example`, look up the corresponding prompt file path
3. Load the actual prompt content from `ai-prompts/prompts/[category]/[filename].md`
4. Values can be strings (single prompt) or arrays (multiple prompts to choose from)

**File structure:**
- Mapping: `prompt-tags.json` (project root)
- Prompts: `ai-prompts/prompts/[category]/[filename].md`

## File Location

- Prompt mapping: `prompt-tags.json` (project root)

This system enhances your natural capabilities while preserving your intelligent, contextual approach to problem-solving.
