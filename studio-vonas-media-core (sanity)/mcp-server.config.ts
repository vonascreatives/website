#!/usr/bin/env node

import { SanityMCPServer } from '@sanity/mcp-server'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.mcp file
dotenv.config({ path: path.resolve(process.cwd(), '.env.mcp') })

if (!process.env.SANITY_API_TOKEN) {
  throw new Error('Missing required environment variable: SANITY_API_TOKEN')
}

const server = new SanityMCPServer({
  projectId: process.env.SANITY_PROJECT_ID || '5cywtc7a',
  dataset: process.env.SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-08-26',
})

// Start the server
server.run().catch((error: Error) => {
  console.error('Failed to start MCP server:', error)
  process.exit(1)
})
