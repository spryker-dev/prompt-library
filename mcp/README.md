# Spryker Prompts MCP Server (Node.js)

A Model Context Protocol (MCP) server implementation for the Spryker Prompt Library, written in Node.js/TypeScript.

## Features

- **Get Prompt**: Retrieve a specific prompt by filename
- **List Prompts**: Get all available prompts with metadata
- **Search Prompts**: Search prompts by title, description, or tags
- **Reload Prompts**: Force reload prompts from disk
- **TypeScript Support**: Full type safety and IntelliSense
- **NPX Support**: Use directly with `npx` without installation

## Installation

### Global Installation

```bash
npm install -g @spryker-dev/prompts-mcp
```

### Using with NPX (Recommended)

```bash
npx @spryker-dev/prompts-mcp
```

### Local Development

```bash
# Clone the repository
git clone https://github.com/spryker-dev/prompt-library.git
cd prompt-library/mcp

# Install dependencies
npm install

# Build the project
npm run build

# Run the server
npm start
```

## Usage

### Configuration for MCP Clients

Add the following configuration to your MCP client:

```json
{
  "mcpServers": {
    "spryker-prompts": {
      "command": "npx",
      "args": ["@spryker-dev/prompts-mcp"]
    }
  }
}
```

Or if installed globally:

```json
{
  "mcpServers": {
    "spryker-prompts": {
      "command": "spryker-prompts-mcp"
    }
  }
}
```

### Available Tools

1. **get_prompt**: Get a specific prompt by filename
   ```json
   {
     "name": "get_prompt",
     "arguments": {
       "filename": "example.md"
     }
   }
   ```

2. **list_prompts**: List all available prompts
   ```json
   {
     "name": "list_prompts",
     "arguments": {}
   }
   ```

3. **search_prompts**: Search prompts by query
   ```json
   {
     "name": "search_prompts",
     "arguments": {
       "query": "testing"
     }
   }
   ```

4. **reload_prompts**: Reload prompts from disk
   ```json
   {
     "name": "reload_prompts",
     "arguments": {}
   }
   ```

## Development

### Scripts

- `npm run build` - Build TypeScript to JavaScript
- `npm run dev` - Run in development mode with tsx
- `npm start` - Run the built server
- `npm test` - Run tests
- `npm run lint` - Lint the code
- `npm run format` - Format the code

### Project Structure

```
mcp/
├── src/
│   ├── cli.ts           # CLI entry point
│   ├── server.ts        # MCP server implementation
│   ├── prompt-loader.ts # Prompt loading logic
│   ├── types.ts         # TypeScript type definitions
│   └── index.ts         # Main exports
├── dist/                # Built JavaScript files
├── package.json
├── tsconfig.json
└── README.md
```

## Requirements

- Node.js >= 18.0.0
- Access to the prompts directory (../prompts relative to this package)

## License

MIT

## Contributing

See the main [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.