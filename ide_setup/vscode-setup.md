# How to Set Up VS Code for Backend Development

## Table of Contents

1. [Install VS Code](#1-install-vs-code)
2. [Install Recommended Extensions](#2-install-recommended-extensions)
   - [Development](#development)
   - [Git & Database](#git--database)
   - [Familiar Shortcuts](#familiar-shortcuts)
3. [Configure Basic Options](#3-configure-basic-options)
4. [Set Up PHP Debugging](#4-set-up-php-debugging)
5. [AI Configuration for Efficient Development](#5-ai-configuration-for-efficient-development)
   - [AI Rules](#ai-rules)
   - [MCP Servers Setup](#mcp-servers-setup)

## 1. Install VS Code

**VS Code**: https://code.visualstudio.com/

For VS Code, also install:
• GitHub Copilot: https://marketplace.visualstudio.com/items?itemName=GitHub.copilot
• GitHub Copilot Chat: https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat

## 2. Install Recommended Extensions

### Development

- **PHP Tools** - https://marketplace.visualstudio.com/items?itemName=DEVSENSE.phptools-vscode
- **PHP Debug** - https://marketplace.visualstudio.com/items?itemName=felixfbecker.php-debug
- **PHP Intelephense** - https://marketplace.visualstudio.com/items?itemName=bmewburn.vscode-intelephense-client
- **Twig** - https://marketplace.visualstudio.com/items?itemName=mblode.twig-language-2
- **Cypress** - https://marketplace.visualstudio.com/items?itemName=shevtsov.vscode-cy-helper
- **XML** - https://marketplace.visualstudio.com/items?itemName=DotJoshJohnson.xml

### Git & Database

- **GitLens** - https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens
- **GitHub Pull Requests** - https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-pull-request-github
- **MySQL Client** - https://marketplace.visualstudio.com/items?itemName=cweijan.vscode-mysql-client2

### Familiar Shortcuts

- **IntelliJ Keybindings** - https://marketplace.visualstudio.com/items?itemName=k--kato.intellij-idea-keybindings

## 3. Configure Basic Options

1. Enable autosave:

![Auto-save Settings](images/293f94cf-c14d-46e1-9a0d-0cb4652a9654.png)

2. Enable indexing of files present in .gitignore (remove all check marks):

![Indexing Settings](images/349c94c8-413f-429e-bf7a-54560610ebd2.png)

***If you face any issues with indexing files inside the vendor folder, removing "**/.git" pattern may also be an option.**

## 4. Set Up PHP Debugging

1. Create `.vscode/launch.json` in your project root manually or by clicking the link as in the image:

![VS Code Debug Configuration](images/557d9815-574d-415a-b05a-f3efca944ee0.png)

2. Place this configuration inside the file:

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Listen for Xdebug",
            "type": "php",
            "request": "launch",
            "port": 9003,
            "runtimeExecutable": "/absolute/path/php/bin",
            "pathMappings": {
                "/data": "${workspaceFolder}"
            },
            "log": true,
            "xdebugSettings": {
                "max_data": 65535,
                "show_hidden": 1,
                "max_children": 100,
                "max_depth": 5
            }
        }
    ]
}
```

3. To start a debug session, you need to press the green Play button, and when the session is started, you can see this panel as in the image:

![Debug Session Panel](images/5d923be5-686f-4a82-b541-f34b3bc50f0c.png)

## 5. AI Configuration for Efficient Development

### AI Rules

- Create `.github/copilot-instructions.md` file in project root
- Provide Spryker-specific context and coding guidelines
- Configure project requirements and development patterns
- **Use rules from this prompt library as a base**: You can find ready-to-use AI rules in the [`rules/`](../rules/) directory of this repository
- Documentation: https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions

### MCP Servers Setup

There are two options on how to configure MCP server for VS Code + GitHub Copilot.

1. Configure with GitHub Copilot
   1. Click Configure Tools button in GitHub Copilot chat
   
   ![VS Code Copilot Configure](images/a16abd0b-8ec7-4bf3-88e1-3f5004c735a3.png)
   
   2. Then click Add MCP Server button
   
   ![VS Code MCP Add](images/a7873179-282e-44d9-81ff-d0fb9e1b255c.png)
   
   3. Select the type of MCP server and specify where to install it - either Global or Workspace, depending on where you need it to be available.
   4. The file with MCP configuration will be opened, you can start MCP server from here, adjust configuration or add another one.
   
   ![VS Code MCP Config](images/bbe94912-09df-4788-b6a0-ba06164c8f05.png)

2. Another option to set up the MCP server is to manually create mcp.json in the `.vscode` directory and insert the config. This MCP server will be available within your current workspace.

For additional information, please see the [official documentation](https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp/extend-copilot-chat-with-mcp).