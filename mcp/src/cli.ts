#!/usr/bin/env node

import { SprykerPromptsMcpServer } from './server.js'

async function main() {
  const server = new SprykerPromptsMcpServer()

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.error('\n👋 Shutting down Spryker Prompts MCP Server...')
    process.exit(0)
  })

  process.on('SIGTERM', () => {
    console.error('\n👋 Shutting down Spryker Prompts MCP Server...')
    process.exit(0)
  })

  try {
    await server.run()
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// Only run if this file is being executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Unhandled error:', error)
    process.exit(1)
  })
}
