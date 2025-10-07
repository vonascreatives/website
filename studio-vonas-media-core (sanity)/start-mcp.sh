#!/bin/bash

# Load environment variables
export $(grep -v '^#' .env.mcp | xargs)

# Set required environment variables
export MCP_USER_ROLE=developer
export MCP_PORT=${MCP_PORT:-3000}

# Start the MCP server
npx @sanity/mcp-server
