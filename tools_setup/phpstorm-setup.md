# How to Set Up PHPStorm for Backend Development
This guide helps you configure PhpStorm to use Copilot.
If you want to integrate Prompt library, please check [Readme](README.md) first, since some sections of this document might not be needed.

## Table of Contents

1. [Install GitHub Copilot Plugin](#1-install-github-copilot-plugin)
2. [AI Configuration for Efficient Development](#2-ai-configuration-for-efficient-development)
   - [AI Rules](#ai-rules)
   - [MCP Servers Setup](#mcp-servers-setup)

## 1. Install GitHub Copilot Plugin

- [Install the PHPStorm plugin](https://plugins.jetbrains.com/plugin/17718-github-copilot)
- Authorize yourself as a GitHub user in the `Preferences->Languages and Frameworks-> GitHub Copilot`:

![GitHub Copilot Auth](images/1d7088d1-83ee-4c32-9a3e-fff0879c98c2.avif)

- To ensure that GitHub Copilot is installed, you can right-click in PHPStorm, see the GitHub Copilot option in the context menu and its features, as shown in the screenshot below:

![GitHub Copilot Valdation](images/07081cdc-a0a2-4929-8b32-b01eabe7ce2d.avif)

## 2. AI Configuration for Efficient Development

### AI Rules

- Click on the GitHub Copilot icon at the bottom and choose `Edit Settings`.

![GitHub Copilot Settings Image](images/phpstorm_github_copilot_settings.png)

- Go to `Customizations`, here you can set up `Global` and `Workspace` instructions and also add specific instruction files for different tasks.

- **Use rules from this prompt library as a base**: You can find ready-to-use AI rules in the [`rules/`](../rules/) directory of this repository. These rules can be:
  - Combined in one file and added as either Global or Workspace instructions depending on their scope
  - Used individually as instruction files for specific file types or development scenarios
  - Mixed and matched based on your project needs

![GitHub Copilot Settings Rules Image](images/phpstorm_github_copilot_rules.png)

**Custom Instructions**

- **Global Instructions**: Add rules that can be applicable for all projects you're working on. These are applied across all workspaces.
  
- **Workspace Instructions**: Add rules specific to the current project only. These are applied only to the current workspace. 

- **Instruction Files**: Use these for rules that should be applied in specific cases. For example:
  - Specific rules for writing `.twig` files or `.ts` files
  - For the prompt library, cypress-specific rules can be placed here

### MCP Servers Setup

There are two options on how to configure MCP server for PHPStorm + GitHub Copilot.

1. **Use GitHub Copilot Settings**:
   
   - Click on the GitHub Copilot icon at the bottom and choose `Edit Settings`.
   - Go to `Model Context Protocol (MCP)` and click `Configure` button.
   
   ![GitHub Copilot Settings MCP Image](images/phpstorm_github_copilot_settings_mcp.png)

2. **Use Configure Tools in Chat**:
   
   - Click on `Configure tools` button in the chat.
   
   ![GitHub Copilot Settings MCP Alt Image](images/phpstorm_github_copilot_settings_mcp_alt.png)

The file with MCP configuration will be opened, you can start MCP server from here, adjust configuration or add another one.

![GitHub Copilot Settings MCP Config Image](images/phpstorm_github_copilot_settings_mcp_config.png)
