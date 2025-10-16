import { readFileSync } from 'fs';
import { glob } from 'glob';
import { join, dirname, resolve } from 'path';
import matter from 'gray-matter';
import type { Prompt } from './types';

export class PromptLoader {
  private prompts: Prompt[] = [];
  private filenameMap: Map<string, Prompt> = new Map();
  private readonly promptsDir: string;

  constructor(promptsDir?: string) {
    // Get the prompts directory relative to the mcp folder
    const mcpDir = dirname(resolve(__dirname));
    this.promptsDir = promptsDir || join(dirname(mcpDir), 'prompts');
  }

  /**
   * Load prompts if not already loaded
   */
  async loadPrompts(): Promise<void> {
    if (this.prompts.length > 0) {
      return;
    }
    await this.reloadPrompts();
  }

  /**
   * Force reload all prompts from disk
   */
  async forceReload(): Promise<void> {
    await this.reloadPrompts();
  }

  /**
   * Internal method to reload prompts
   */
  private async reloadPrompts(): Promise<void> {
    this.prompts = [];
    this.filenameMap.clear();

    try {
      const pattern = join(this.promptsDir, '**/*.md');
      const files = await glob(pattern, { absolute: true });

      for (const file of files) {
        try {
          const content = readFileSync(file, 'utf-8');
          const prompt = this.parsePromptFile(content, file);
          if (!prompt) {
            continue;
          }

          this.prompts.push(prompt);
          this.filenameMap.set(prompt.filename, prompt);
        } catch (error) {
          console.error(`Error reading file ${file}:`, error);
        }
      }
    } catch (error) {
      console.error('Error loading prompts:', error);
      throw new Error(`Failed to load prompts: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parse a prompt markdown file
   */
  private parsePromptFile(content: string, filePath: string): Prompt | null {
    const filename = filePath.split('/').pop() || '';

    try {
      const parsed = matter(content);
      const frontmatter = parsed.data;

      return {
        filename,
        content: parsed.content,
        title: frontmatter.title || '',
        description: frontmatter.description || '',
        tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
        when_to_use: frontmatter.when_to_use,
        author: frontmatter.author,
      };
    } catch (error) {
      console.error(`Error parsing frontmatter in ${filename}:`, error);
      return null;
    }
  }

  /**
   * Get all prompts
   */
  getAllPrompts(): Prompt[] {
    return this.prompts;
  }

  /**
   * Get a prompt by filename
   */
  getPromptByFilename(filename: string): Prompt | undefined {
    return this.filenameMap.get(filename);
  }
}
