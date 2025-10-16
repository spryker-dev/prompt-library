import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js'
import { PromptLoader } from './prompt-loader.js'
import type {
  GetPromptResponse,
  ListPromptsResponse,
  ReloadPromptsResponse,
  SearchPromptsResponse,
} from './types'

export class SprykerPromptsMcpServer {
  private server: Server
  private promptLoader: PromptLoader

  constructor() {
    this.server = new Server(
      {
        name: 'spryker-prompts',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    )

    this.promptLoader = new PromptLoader()
    this.setupHandlers()
  }

  private setupHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'get_prompt',
          description: 'Get a specific prompt by filename.',
          inputSchema: {
            type: 'object',
            properties: {
              filename: {
                type: 'string',
                description: 'The filename of the prompt to retrieve',
              },
            },
            required: ['filename'],
          },
        },
        {
          name: 'list_prompts',
          description:
            'List all available prompts with brief descriptions. Use if you did not find prompts by search_prompts',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'reload_prompts',
          description: 'Reload all prompts from disk.',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'search_prompts',
          description: 'Search prompts by title, description, or tags.',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'The search query to match against prompts',
              },
            },
            required: ['query'],
          },
        },
      ],
    }))

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params
      const buildTextResponse = (text: string) => ({
        content: [
          {
            type: 'text',
            text,
          },
        ],
      })

      try {
        switch (name) {
          case 'get_prompt':
            return buildTextResponse(
              JSON.stringify(await this.getPrompt(args?.filename as string), null, 2)
            )

          case 'list_prompts':
            return buildTextResponse(JSON.stringify(await this.listPrompts(), null, 2))

          case 'reload_prompts':
            return buildTextResponse(JSON.stringify(await this.reloadPrompts(), null, 2))

          case 'search_prompts':
            return buildTextResponse(
              JSON.stringify(await this.searchPrompts(args?.query as string), null, 2)
            )

          default:
            throw new Error(`Unknown tool: ${name}`)
        }
      } catch (error) {
        return buildTextResponse(
          JSON.stringify(
            {
              error: `Tool execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
            null,
            2
          )
        )
      }
    })
  }

  private async getPrompt(filename: string): Promise<GetPromptResponse> {
    try {
      await this.promptLoader.loadPrompts()
      const prompt = this.promptLoader.getPromptByFilename(filename)

      if (!prompt) {
        return { error: `Prompt '${filename}' not found.` }
      }

      return {
        filename: prompt.filename,
        title: prompt.title,
        description: prompt.description,
        tags: prompt.tags,
        when_to_use: prompt.when_to_use,
        author: prompt.author,
        content: prompt.content,
      }
    } catch (error) {
      console.error(`Error retrieving prompt '${filename}':`, error)
      return {
        error: `Failed to retrieve prompt: ${error instanceof Error ? error.message : 'Unknown error'}`,
      }
    }
  }

  private async listPrompts(): Promise<ListPromptsResponse> {
    try {
      await this.promptLoader.loadPrompts()
      const allPrompts = this.promptLoader.getAllPrompts()

      return {
        prompts: allPrompts.map((p) => ({
          filename: p.filename,
          title: p.title,
          description: p.description,
          tags: p.tags,
          when_to_use: p.when_to_use,
          author: p.author,
        })),
      }
    } catch (error) {
      console.error('Error listing prompts:', error)
      return {
        error: `Failed to list prompts: ${error instanceof Error ? error.message : 'Unknown error'}`,
        prompts: [],
      }
    }
  }

  private async reloadPrompts(): Promise<ReloadPromptsResponse> {
    try {
      await this.promptLoader.forceReload()
      const allPrompts = this.promptLoader.getAllPrompts()

      return {
        status: 'reloaded',
        prompt_count: allPrompts.length,
      }
    } catch (error) {
      console.error('Error reloading prompts:', error)
      return {
        status: 'error',
        error: `Failed to reload prompts: ${error instanceof Error ? error.message : 'Unknown error'}`,
      }
    }
  }

  private async searchPrompts(query: string): Promise<SearchPromptsResponse> {
    try {
      await this.promptLoader.loadPrompts()
      const allPrompts = this.promptLoader.getAllPrompts()
      const queryLower = query.toLowerCase()

      const matchingPrompts = allPrompts.filter((prompt) => {
        return (
          prompt.title.toLowerCase().includes(queryLower) ||
          prompt.description.toLowerCase().includes(queryLower) ||
          prompt.tags.some((tag) => tag.toLowerCase().includes(queryLower)) ||
          (prompt.when_to_use && prompt.when_to_use.toLowerCase().includes(queryLower)) ||
          (prompt.author && prompt.author.toLowerCase().includes(queryLower))
        )
      })

      return {
        query,
        matches: matchingPrompts.map((p) => ({
          filename: p.filename,
          title: p.title,
          description: p.description,
          tags: p.tags,
          when_to_use: p.when_to_use,
          author: p.author,
        })),
        count: matchingPrompts.length,
      }
    } catch (error) {
      console.error('Error searching prompts:', error)
      return {
        query,
        matches: [],
        count: 0,
        error: `Failed to search prompts: ${error instanceof Error ? error.message : 'Unknown error'}`,
      }
    }
  }

  async run(): Promise<void> {
    // Initialize prompts on startup
    try {
      await this.promptLoader.loadPrompts()
      console.error('✅ Prompts loaded successfully')
    } catch (error) {
      console.error('⚠️ Failed to initialize prompts:', error)
    }

    const transport = new StdioServerTransport()
    await this.server.connect(transport)
    console.error('🚀 Spryker Prompts MCP Server running on stdio')
  }
}
