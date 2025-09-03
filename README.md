# Spryker Prompt Library

Welcome to the Spryker Prompt Library! This is a shared knowledge base of **proven and reusable prompts** to accelerate your development workflows using AI tools like ChatGPT, GitHub Copilot, Cursor, Windsurfe, and more.

## 🚀 Purpose

This library helps engineering teams:
- Write better code faster with AI tools.
- Share best practices across projects.
- Keep prompt knowledge centralized and searchable.
- Reduce repeated prompt crafting.

## 🏃‍♂️ Quick Start

**Ready to integrate with your project?** See our [Getting Started Guide](GETTING_STARTED.md) for two approaches:

### Hashtag Integration
- One-command setup with automatic AI assistant integration
- How to use hashtags like `#data-import` to auto-load prompts
- Support for Windsurf, Cursor, GitHub Copilot and other AI editors

### MCP Server Integration
- AI assistant accesses prompts through MCP server
- Requires MCP-compatible AI assistants
- ⚠️ **Note**: MCP server usage can consume additional credits - consider disabling when not in use

## Structure

Prompts are grouped by domain (feel free to introduce a new domain if needed):

| Category        | Description                                 |
|----------------|---------------------------------------------|
| `ai-coding-assistants/` | Prompts for Copilot, ChatGPT, etc. |
| `code-review/`          | Automated review and suggestions   |
| `documentation/`        | Docs and comment generation        |
| `testing/`              | Generating unit, integration, E2E tests |
| `templates/`            | Reusable prompt scaffolds          |

Each file contains:
- Prompt
- Context / When to use
- Example output
- Author (optional)

## Contributing

We welcome contributions from the team!

- Follow the [Prompt Template](prompts/templates/prompt-template.md).
- Use a new branch for your prompts.
- Open a pull request with the prompt's use case in the title.
- Include a real usage example if available.

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## Issues / Suggestions

Use the [New Prompt Suggestion form](../../issues/new?template=new_prompt_suggestion.yml) to propose:
- A new category
- Prompt improvements
- General feedback

---

Let’s build smarter—together!
