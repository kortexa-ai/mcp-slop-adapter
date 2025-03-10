# MCP to SLOP adapter

A simple adapter that converts MCP (Model Context Protocol) messages to SLOP (Simple Language Open Protocol) messages. This adapter allows MCP clients like Claude Desktop to interact with any SLOP-compatible server.

## SLOP

[GitHub Repository](https://github.com/agnt-gg/slop)
[Discord Community](https://discord.com/invite/nwXJMnHmXP)

## Features

This adapter proxies between MCP and SLOP by:

- Converting MCP tool requests to SLOP API calls
- Exposing SLOP resources as MCP resources
- Providing MCP tools for SLOP-specific endpoints (chat, memory, pay)
- Handling error conversion between protocols

## Connecting to Claude Desktop

You can use the MCP to SLOP adapter to add SLOP servers to Claude Desktop.
Make sure your SLOP server is up and running before you start Claude Desktop.
Change the path to the adapter with the path to the adapter on your system, and the URL to your SLOP server.

```json
{
    "mcpServers": {
        "mcp-slop-adapter": {
            "command": "node",
            "args": [
                "//wsl.localhost/Ubuntu/home/francip/src/mcp-slop-adapter/dist/server.js",
                "http://localhost:4000"
            ]
        },
    }
}
```

## Debugging with MCP Inspector

You can use the [MCP Inspector](https://github.com/modelcontextprotocol/inspector) to connect to the MCP to SLOP adapter and inspect your SLOP server

## Exposed MCP Capabilities

This adapter exposes the following MCP capabilities:

1. **Tools**:
   - Native SLOP tools from the `/tools` endpoint
   - `chat` - Send messages to SLOP chat endpoint
   - `memory-store` - Store key-value pairs
   - `memory-get` - Retrieve memory values
   - `pay` - Process payments

2. **Resources**:
   - All resources from the SLOP `/resources` endpoint

## Running the Example SLOP Server

This repository includes a simple SLOP server for testing:

```bash
# Install dependencies for the example server
cd simple-slop-server
npm install

# Run the server
node slop.js
```
## License

MIT