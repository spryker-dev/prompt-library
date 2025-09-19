# How to Set Up Cursor for Backend Development

## Table of Contents

1. [Install Cursor](#1-install-cursor)
2. [Install Recommended Extensions](#2-install-recommended-extensions)
   - [Development](#development)
   - [Git & Database](#git--database)
   - [Familiar Shortcuts](#familiar-shortcuts)
3. [Configure Basic Options](#3-configure-basic-options)
4. [Set Up PHP Debugging](#4-set-up-php-debugging)
5. [AI Configuration for Efficient Development](#5-ai-configuration-for-efficient-development)
   - [AI Rules](#ai-rules)
   - [Models Configuration](#models-configuration)
   - [MCP Servers Setup](#mcp-servers-setup)

## 1. Install Cursor

**Cursor**: https://www.cursor.com/

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

- Create `.cursor/rules` directory
  - Define your rules in .mdc files - the example of rule structure is in the image below
  - **Use rules from this prompt library as a base**: You can find ready-to-use AI rules in the [`rules/`](../rules/) directory of this repository
  - Documentation: https://docs.cursor.com/en/context/rules

![Cursor Rules Structure](images/747bf4b9-c39b-4f8f-8249-54a8bccedb42.png)

### Models Configuration

Cursor allows you to enable/disable MAX mode, which extends the context window. Some of the models are available only in this mode. You can find it in Cursor Settings → Models. Here you can also enable/disable preferred models.

![Cursor Models Configuration](images/75d3b5d4-aec7-4fe3-8f86-38ff7f17d501.png)

### MCP Servers Setup

- Open Cursor Settings → Tools & Integrations and click "Add custom MCP"

![Cursor MCP Tools](images/7bd25d4c-fb59-4769-a72d-f287b063a02f.png)

- Add the configuration of the MCP server

![Cursor MCP Add](images/7d1e3998-a987-4b48-8bee-313f56edc048.png)

- After returning back to Tools & Integrations you will find your custom MCP server with available tools. It can be managed from here.

![Cursor MCP List](images/997a5146-155d-4db8-ae23-fefbfda1ebbe.png)