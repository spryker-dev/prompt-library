import { PromptLoader } from '../prompt-loader'
import { join } from 'path'

describe('PromptLoader', () => {
  let promptLoader: PromptLoader

  beforeEach(() => {
    // Use the actual prompts directory for testing
    const promptsDir = join(__dirname, '../../../prompts')
    promptLoader = new PromptLoader(promptsDir)
  })

  test('should load prompts successfully', async () => {
    await promptLoader.loadPrompts()
    const prompts = promptLoader.getAllPrompts()

    expect(Array.isArray(prompts)).toBe(true)
    expect(prompts.length).toBeGreaterThan(0)
  })

  test('should parse prompt metadata correctly', async () => {
    await promptLoader.loadPrompts()
    const prompts = promptLoader.getAllPrompts()

    const firstPrompt = prompts[0]
    expect(firstPrompt).toHaveProperty('filename')
    expect(firstPrompt).toHaveProperty('title')
    expect(firstPrompt).toHaveProperty('description')
    expect(firstPrompt).toHaveProperty('tags')
    expect(firstPrompt).toHaveProperty('content')

    expect(typeof firstPrompt.filename).toBe('string')
    expect(typeof firstPrompt.title).toBe('string')
    expect(typeof firstPrompt.description).toBe('string')
    expect(Array.isArray(firstPrompt.tags)).toBe(true)
    expect(typeof firstPrompt.content).toBe('string')
  })

  test('should find prompt by filename', async () => {
    await promptLoader.loadPrompts()
    const prompts = promptLoader.getAllPrompts()

    if (prompts.length > 0) {
      const firstPrompt = prompts[0]
      const foundPrompt = promptLoader.getPromptByFilename(firstPrompt.filename)

      expect(foundPrompt).toBeDefined()
      expect(foundPrompt?.filename).toBe(firstPrompt.filename)
    }
  })

  test('should return undefined for non-existent prompt', async () => {
    await promptLoader.loadPrompts()
    const foundPrompt = promptLoader.getPromptByFilename('non-existent.md')

    expect(foundPrompt).toBeUndefined()
  })

  test('should force reload prompts', async () => {
    await promptLoader.loadPrompts()
    const initialCount = promptLoader.getAllPrompts().length

    await promptLoader.forceReload()
    const reloadedCount = promptLoader.getAllPrompts().length

    expect(reloadedCount).toBe(initialCount)
  })
})
