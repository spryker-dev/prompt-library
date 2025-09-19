# How to Set Up Windsurf for Backend Development

## Table of Contents

1. [Install Windsurf](#1-install-windsurf)
2. [Install Recommended Extensions](#2-install-recommended-extensions)
   - [Development](#development)
   - [Git & Database](#git--database)
   - [Familiar Shortcuts](#familiar-shortcuts)
3. [Configure Basic Options](#3-configure-basic-options)
4. [Set Up PHP Debugging](#4-set-up-php-debugging)
5. [AI Configuration for Efficient Development](#5-ai-configuration-for-efficient-development)
   - [AI Rules](#ai-rules)
   - [MCP Servers Setup](#mcp-servers-setup)

## 1. Install Windsurf

**Windsurf**: https://codeium.com/windsurf

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

- Create `.windsurfrules` file in project root for project-specific Spryker guidelines
  - Configure global rules via Settings > AI Rules for consistent behavior across projects
  - Set up coding standards, architectural patterns, and development preferences
  - **Use rules from this prompt library as a base**: You can find ready-to-use AI rules in the [`rules/`](../rules/) directory of this repository
  - Documentation: https://docs.windsurf.com/windsurf/cascade/memories#memories-and-rules

![Windsurf AI Rules](images/5e8dadfe-2e30-44cd-9b1f-6ffaf1555fea.png)

### MCP Servers Setup

- Go to Windsurf Settings and search for MCP and click "Manage MCP" button

![Windsurf MCP Manage](images/64528034-0c6f-4933-b7e4-945496de79c4.png)

- Click "View Raw Config" and you will see file with the configuration

![Windsurf MCP Config](images/6b836bc3-9f0f-4f05-af47-20ae0b360438.png)

- Add MCP server configuration

![Windsurf MCP Add](images/6ca4a594-4aa5-426d-9190-5a4066717a29.png)

- Go back to **Manage MCP servers** and click "Refresh" button. MCP server configuration will be available here and can be managed.

![Windsurf MCP List](images/7120f3b8-dc21-481a-afe0-c3400cf862bb.png)