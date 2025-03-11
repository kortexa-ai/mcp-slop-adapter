# MCP to SLOP Adapter

A lightweight adapter that connects [MCP](https://modelcontextprotocol.io/) (Model Context Protocol) clients like Claude Desktop with any [SLOP](https://github.com/agnt-gg/slop) (Simple Language Open Protocol) compatible server.

## What is MCP and SLOP?

- **MCP (Model Context Protocol)**: A proprietary protocol developed by Anthropic that enables AI models to access tools and resources. [Learn more about MCP](https://modelcontextprotocol.io/).
- **SLOP (Simple Language Open Protocol)**: A simple open-source REST-based pattern for AI APIs with 5 basic endpoints. [Learn more about SLOP](https://github.com/agnt-gg/slop) or join the [SLOP Discord community](https://discord.com/invite/nwXJMnHmXP).

## Features

This adapter bridges MCP and SLOP by:

- Converting MCP tool requests to SLOP API calls
- Exposing SLOP resources as MCP resources
- Providing MCP tools for SLOP-specific endpoints (chat, memory, pay)
- Handling error conversion between protocols

## Installation & Usage

### Using npx

You can run the adapter directly using npx:

```bash
npx @kortexa-ai/mcp-slop-adapter http://your-slop-server-url
```

### Global Installation

```bash
npm install -g @kortexa-ai/mcp-slop-adapter
mcp-slop-adapter http://your-slop-server-url
```

## Configuring Claude Desktop

To connect Claude Desktop with a SLOP server:

1. Make sure your SLOP server is running
2. Edit Claude Desktop's configuration file:
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
3. Add the following configuration:

```json
{
    "mcpServers": {
        "mcp-slop-adapter": {
            "command": "npx",
            "args": [
                "@kortexa-ai/mcp-slop-adapter",
                "http://your-slop-server-url"
            ]
        }
    }
}
```

Replace `http://your-slop-server-url` with the URL of your SLOP server.

## Debugging

You can use the [MCP Inspector](https://github.com/modelcontextprotocol/inspector) to connect to the adapter and inspect your SLOP server.

## Exposed MCP Capabilities

This adapter exposes:

- **Tools**: Native SLOP tools from `/tools` endpoint, plus `chat`, `memory-store`, `memory-get`, and `pay`
- **Resources**: All resources from the SLOP `/resources` endpoint

## License

MIT