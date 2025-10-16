export interface Prompt {
  filename: string
  content: string
  title: string
  description: string
  tags: string[]
  when_to_use?: string
  author?: string
}

export interface PromptMetadata {
  filename: string
  title: string
  description: string
  tags: string[]
  when_to_use?: string
  author?: string
}

export interface ToolResponse {
  error?: string
  [key: string]: any
}

export interface ListPromptsResponse extends ToolResponse {
  prompts: PromptMetadata[]
}

export interface GetPromptResponse extends ToolResponse {
  filename?: string
  title?: string
  description?: string
  tags?: string[]
  when_to_use?: string
  author?: string
  content?: string
}

export interface SearchPromptsResponse extends ToolResponse {
  query: string
  matches: PromptMetadata[]
  count: number
}

export interface ReloadPromptsResponse extends ToolResponse {
  status: 'reloaded' | 'error'
  prompt_count?: number
}
