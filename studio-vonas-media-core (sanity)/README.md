# Vonas Media Core - Sanity Studio

This is the Sanity Studio for Vonas Media, configured with TypeScript and the Model Context Protocol (MCP) server for AI integration.

## Quick Start

```bash
npm run dev
```

Your Sanity Studio will be running at http://localhost:3333

## MCP Server Setup

The MCP server allows AI models to interact with your Sanity content. To set it up:

### 1. Create API Token

1. Go to https://sanity.io/manage/personal/tokens
2. Create a new token with read/write permissions for your project
3. Copy the token

### 2. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API token:

```
SANITY_API_TOKEN=your_actual_token_here
SANITY_PROJECT_ID=5cywtc7a
SANITY_DATASET=production
```

### 3. Run the MCP Server

```bash
npm run mcp-server
```

This will start the Sanity MCP server that can be used with AI tools and workflows.

## Schema

The studio includes schema for:

- **Posts**: Blog posts with title, body, images, categories
- **Authors**: Author profiles with bio and image

Categories align with Vonas Media content areas:
- Business
- Education  
- Entertainment
- Sports
- Subculture
- Technology

## AI Integration

With the MCP server running, AI models can:

- Query content from your Sanity dataset
- Create and update posts and authors
- Analyze content patterns and trends
- Generate content recommendations

## Setup with Dummy Content

### 1. Generate API Token

```bash
npm run generate-token
```

This will guide you through creating an API token.

### 2. Import Dummy Content

Once you have your API token in `.env.local`:

```bash
npm run import-data
```

This will import:
- 3 sample authors (Alex Chen, Sarah Martinez, Marcus Johnson)
- 6 blog posts covering all Vonas Media categories
- Realistic content about digital media trends

## Media Bucket

The studio includes a **Media Asset** document type for organizing files:

- **Categories**: Images, Documents, Videos, Audio, Graphics, Templates
- **File Support**: PDF, DOC, XLS, PPT, ZIP, MP3, MP4, and more
- **Organization**: Tags, descriptions, and automatic upload timestamps
- **Built-in CDN**: Sanity provides automatic image optimization and CDN delivery

### File Storage Features:
- Automatic image resizing and optimization
- Global CDN delivery
- Hotspot cropping for images  
- File versioning
- Asset pipeline integration

## Development

- `npm run dev` - Start the Studio
- `npm run build` - Build the Studio for production
- `npm run deploy` - Deploy the Studio
- `npm run mcp-server` - Run the MCP server
- `npm run import-data` - Import dummy content
- `npm run generate-token` - Help create API token

## Learn More

- [Sanity Documentation](https://www.sanity.io/docs)
- [Sanity MCP Server Documentation](https://www.sanity.io/blog/introducing-sanity-model-context-protocol-server)
- [Model Context Protocol](https://modelcontextprotocol.io)
