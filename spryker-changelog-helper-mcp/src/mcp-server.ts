import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { ImpactAnalysisService } from './analysis/analysis-service';
import { execSync } from 'child_process';

const server = new Server(
  {
    name: 'spryker-changelog-helper-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'list_changed_files',
        description: 'Lists all files that changed in a git diff with their status (Added, Modified, Deleted). Quick overview before detailed analysis. Returns a simple list similar to "git diff --name-status".',
        inputSchema: {
          type: 'object',
          properties: {
            root: {
              type: 'string',
              description: 'Root directory of the git repository',
            },
            diff: {
              type: 'string',
              description: 'Git reference to compare against (e.g., origin/master, HEAD~1)',
            },
          },
          required: ['root', 'diff'],
        },
      },
      {
        name: 'analyze_spryker_changes',
        description: 'Analyzes all changes in Spryker modules (PHP, Twig, TypeScript, SCSS, transfers, schemas, composer) to identify what changed, categorize by impact, and provide structured data for changelog generation. Returns detailed change information including breaking changes, improvements, and version recommendations.',
        inputSchema: {
          type: 'object',
          properties: {
            root: {
              type: 'string',
              description: 'Root directory of the Spryker module or repository to analyze (e.g., /path/to/vendor/spryker/spryker-shop)',
            },
            diff: {
              type: 'string',
              description: 'Git reference to compare against (e.g., origin/master, HEAD~1, main)',
            },
            modules: {
              type: 'string',
              description: 'Optional: Comma-separated list of module names to filter (e.g., "ShopUi,ProductDetailPage")',
            },
            exclude: {
              type: 'string',
              description: 'Optional: Comma-separated patterns to exclude (e.g., "tests,vendor")',
            },
            includeTests: {
              type: 'boolean',
              description: 'Optional: Include test files in analysis (default: false)',
            },
          },
          required: ['root', 'diff'],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === 'list_changed_files') {
      if (!args) throw new Error('Missing arguments');
      
      const root = args.root as string;
      const diff = args.diff as string;
      
      try {
        const output = execSync(`git diff ${diff} --name-status`, {
          cwd: root,
          encoding: 'utf-8',
        }).toString();
        
        const lines = output.trim().split('\n').filter(line => line.trim());
        const files = lines.map(line => {
          const parts = line.split(/\t/);
          const status = parts[0];
          const file = parts[1];
          
          let statusText = 'Modified';
          if (status === 'A') statusText = 'Added';
          else if (status === 'D') statusText = 'Deleted';
          else if (status.startsWith('R')) statusText = 'Renamed';
          else if (status === 'M') statusText = 'Modified';
          
          return { status: statusText, file };
        });
        
        const result = {
          totalFiles: files.length,
          files: files,
          summary: {
            added: files.filter(f => f.status === 'Added').length,
            modified: files.filter(f => f.status === 'Modified').length,
            deleted: files.filter(f => f.status === 'Deleted').length,
            renamed: files.filter(f => f.status === 'Renamed').length,
          }
        };
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        throw new Error(`Git command failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    
    if (name === 'analyze_spryker_changes') {
      if (!args) throw new Error('Missing arguments');
      
      const service = new ImpactAnalysisService();
      const analysisResult = await service.analyze({
        root: args.root as string,
        diff: args.diff as string,
        modules: args.modules ? (args.modules as string).split(',').map(m => m.trim()) : undefined,
        excludes: args.exclude ? (args.exclude as string).split(',').map(e => e.trim()) : undefined,
        includeTests: args.includeTests as boolean,
        debug: false,
      });

      const report = await service.generateReport(analysisResult, args.root as string);
      
      const { ChangelogFormatter } = require('./reporting/formatters/changelog-formatter');
      const formatter = new ChangelogFormatter();
      const changelog = formatter.format(report, report.moduleReports);
      const json = formatter.formatAsJson(changelog);

      return {
        content: [
          {
            type: 'text',
            text: json,
          },
        ],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Spryker Changelog Helper MCP Server v1.0.0 running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
