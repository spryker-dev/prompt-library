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

![Auto-save Settings](images/6b836bc3-9f0f-4f05-af47-20ae0b360438.png)

2. Enable indexing of files present in .gitignore (remove all check marks):

![Indexing Settings](images/6ca4a594-4aa5-426d-9190-5a4066717a29.png)

***If you face any issues with indexing files inside the vendor folder, removing "**/.git" pattern may also be an option.**

## 4. Set Up PHP Debugging

1. Go to `Run and Debug` section and create a `.vscode/launch.json` configuration file:

![VS Code Debug Configuration](images/64528034-0c6f-4933-b7e4-945496de79c4.png)

2. Add the following debug configurations:

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

![Debug Session Panel](images/293f94cf-c14d-46e1-9a0d-0cb4652a9654.png)

## 5. AI Configuration for Efficient Development

### AI Rules

Create a `.windsurfrules` file in the root of your project:

![Windsurf AI Rules](images/997a5146-155d-4db8-ae23-fefbfda1ebbe.png)

Configure global rules via Settings > AI Rules for consistent behavior across projects. Set up coding standards, architectural patterns, and development preferences.

**Use rules from this prompt library as a base**: You can find ready-to-use AI rules in the [`rules/`](../rules/) directory of this repository.

Documentation: https://docs.windsurf.com/windsurf/cascade/memories#memories-and-rules

### MCP Servers Setup

1. Go to Windsurf Settings and search for MCP and click "Manage MCP" button:

![Windsurf MCP Manage](images/5e8dadfe-2e30-44cd-9b1f-6ffaf1555fea.png)

2. Click "View Raw Config" and you will see file with the configuration:

![Windsurf MCP Config](images/bbe94912-09df-4788-b6a0-ba06164c8f05.png)

3. Add MCP server configuration:

![Windsurf MCP Add](images/a16abd0b-8ec7-4bf3-88e1-3f5004c735a3.png)

4. Go back to Manage MCP servers and click "Refresh" button. MCP server configuration will be available here and can be managed:

![Windsurf MCP List](images/7bd25d4c-fb59-4769-a72d-f287b063a02f.png)