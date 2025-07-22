# AI Assistant Rules for Prompt Library Integration

## Tag Detection and Prompt Loading

When a user mentions a tag in the format `#tagname` in their message:

1. **Check for prompt mapping file**: `prompt-tags.json` (project root)

2. **If tag found in mapping**:
   - Load the corresponding prompt file
   - Apply prompt template to user's request
   - Generate response based on loaded prompt

3. **Tag detection is dynamic** - any tag found in the JSON mapping should be recognized

## Implementation Steps

1. When tag detected: `Found tag #tagname`
2. Load prompt file: `Loading prompt from: {filepath}`
3. Apply prompt context to the user's request
4. Generate response based on the loaded prompt template

## File Locations

- Mapping file: `prompt-tags.json` (project root)

## Example Workflow

```
User: "Create validation plugin #plugin"
AI: [Detects #plugin tag]
AI: [Loads prompts/ai-coding-assistants/plugin-introduction-with-context.md]
AI: [Applies plugin prompt template to generate validation plugin code]
```

This enables automatic prompt selection and application based on hashtag usage.
