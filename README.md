# Spryker Prompt Library

Welcome to the Spryker Prompt Library! This is a shared knowledge base of **proven and reusable prompts** to accelerate your development workflows using AI tools like ChatGPT, GitHub Copilot, Cursor, Windsurfe, and more.

## Table of Contents

- [🚀 Purpose](#-purpose)
- [🛠️ Before You Start - IDE Setup Guides](#️-before-you-start---ide-setup-guides)
- [⚡ Key Capabilities](#-key-capabilities)
  - [📚 Comprehensive Prompt Library](#-comprehensive-prompt-library)
  - [🔌 MCP Server Integration](#-mcp-server-integration)
  - [🏷️ Hashtag Integration](#️-hashtag-integration)
  - [🤖 AI Agent Rules](#-ai-agent-rules)
    - [Overview](#overview)
    - [Download rules](#download-rules)
- [🏃‍♂️ Quick Start](#️-quick-start)
  - [MCP Server Integration](#mcp-server-integration)
  - [Hashtag Integration](#hashtag-integration)
- [Structure](#structure)
- [Contributing](#contributing)
- [Issues / Suggestions](#issues--suggestions)


## 🚀 Purpose

This library helps engineering teams:
- Write better code faster with AI tools.
- Share best practices across projects.
- Keep prompt knowledge centralized and searchable.
- Reduce repeated prompt crafting.
- Standardize coding conventions with AI agent rules for Spryker development.

## 🛠️ Before You Start - IDE Setup Guides

**New to AI-powered development?** We recommend checking our comprehensive IDE setup guides first. These guides will help you configure your development environment for optimal AI assistance:

| IDE | Setup Guide |
|-----|-------------|
| 🌪️ **Windsurf** | [Setup Guide](tools_setup/windsurf-setup.md) |
| 🎯 **Cursor** | [Setup Guide](tools_setup/cursor-setup.md) |
| 💻 **VS Code + GitHub Copilot** | [Setup Guide](tools_setup/vscode-setup.md) |
| 🧠 **PHPStorm + GitHub Copilot** | [Setup Guide](tools_setup/phpstorm-setup.md) |

> 💡 **Why setup matters**: Proper IDE configuration ensures you get the maximum benefit from this prompt library and enables seamless integration with AI tools.

## ⚡ Key Capabilities

### 📚 Comprehensive Prompt Library
- **Domain-organized**: Prompts grouped by functionality (coding, testing, documentation, etc.)
- **Battle-tested**: Real-world prompts proven in production environments
- **Continuously updated**: Community-driven improvements and additions
- **Template-based**: Consistent structure with context, examples, and usage guidelines
- **AI agent rules**: Comprehensive coding standards and conventions for Spryker development

### 🔌 MCP Server Integration

### What is MCP (Model Context Protocol)?
https://modelcontextprotocol.io/docs/getting-started/intro

- **Intelligent prompt discovery**: AI assistant automatically searches and applies relevant prompts based on your request context
- **Semantic matching**: No need to remember specific tags - just describe what you need
- **Real-time access**: Direct integration with MCP-compatible AI assistants
- **Dynamic adaptation**: Prompts are contextually modified to fit your specific project needs

### 🏷️ Hashtag Integration
- **One universal tag**: Just use `#prompts` - AI intelligently selects the right prompt for you
- **Context-aware**: AI analyzes your request to find the most relevant prompt automatically
- **Smart assistance**: When uncertain, AI offers 2-3 best options to choose from
- **Multi-editor support**: Works with Windsurf, Cursor, GitHub Copilot, and other AI assistants

### 🤖 AI Agent Rules

#### Overview

This library includes **AI-Coding Agent rules** covering Spryker conventions 📜, organized into:

| Rule File | Description |
|-----------|-------------|
| [`general.md`](rules/shared/general.md) | General coding guidelines and best practices |
| [`application-layers.md`](rules/shared/application-layers.md) | Application layer architecture rules |
| [`components.md`](rules/shared/components.md) | Component design and implementation rules |
| [`layers.md`](rules/shared/layers.md) | Layer separation and organization rules |
| [`cypress-tests.md`](rules/cypress/cypress-tests.md) | Cypress testing rules |
| [`Demo_Development_Rules.md`](rules/RFC/Demo_Development_Rules.md) | Rules for demo development |
| [`Product_Development_Rules.md`](rules/RFC/Product_Development_Rules.md) | Rules for product development |
| [`Project_Development_Rules.md`](rules/RFC/Project_Development_Rules.md) | Rules for project development |


**✨ Benefits:**
- ✅ **Consistent development** - Standardized conventions across all projects
- ✅ **Best practices** - Proven approaches gathered from team experience
- ✅ **Accepted RFCs** - Community-approved standards and patterns
- ✅ **Enhanced AI assistance** - Better code generation and suggestions

Use these rules in your workflows to ensure consistent and convention-compliant development! We're looking forward to your feedback and suggestions 💡.

#### Download rules.

It will save rules to the local file. Where you can copy them and set tot you tool.
```shell
sh <(curl -s https://raw.githubusercontent.com/spryker-dev/prompt-library/main/bin/get-rules)
```

## 🏃‍♂️ Quick Start

**Ready to integrate with your project?** See our [Getting Started Guide](GETTING_STARTED.md) for detailed setup instructions:

### MCP Server Integration
- AI assistant accesses prompts through MCP server
- Requires MCP-compatible AI assistants
- ⚠️ **Note**: MCP server usage can consume additional credits - consider disabling when not in use

### Hashtag Integration
- One-command setup with automatic AI assistant integration
- Use single `#prompts` tag - AI intelligently selects relevant prompts
- Support for Windsurf, Cursor, GitHub Copilot and other AI editors

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
