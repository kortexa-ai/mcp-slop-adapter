# MCP to SLOP adapter

A simple adapter that converts MCP (Model Context Protocol) messages to SLOP (Simple Language Open Protocol) messages. This adapter allows MCP clients like Claude Desktop to interact with any SLOP-compatible server.

## Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build
```

## Features

This adapter proxies between MCP and SLOP by:

- Converting MCP tool requests to SLOP API calls
- Exposing SLOP resources as MCP resources
- Providing MCP tools for SLOP-specific endpoints (chat, memory, pay)
- Handling error conversion between protocols

## Usage Options

### 1. Using with npx

You can run the adapter directly with npx:

```bash
npx @kortexa-ai/mcp-slop-adapter http://localhost:3000
```

### 2. Running from source

```bash
git clone https://github.com/kortexa-ai/mcp-slop-adapter.git
cd mcp-slop-adapter
npm install
npm run build
node dist/server.js http://localhost:3000
```

### 3. Setting the SLOP URL

You can specify the SLOP server URL in three ways (in order of precedence):

1. Command line argument: `npm start -- http://localhost:3000`
2. Environment variable: `SLOP_URL=http://localhost:3000 npm start`
3. Default fallback: `http://localhost:3000`

## Connecting to Claude Desktop

You can use the MCP to SLOP adapter to add SLOP servers to Claude Desktop:

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

Make sure your SLOP server is up and running before you start Claude Desktop.

## Debugging with MCP Inspector

You can use the [MCP Inspector](https://github.com/modelcontextprotocol/inspector) to connect to the MCP to SLOP adapter and inspect your SLOP server:

```bash
npx @modelcontextprotocol/inspector npx @kortexa-ai/mcp-slop-adapter http://localhost:3000
```

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

Then connect the adapter to this server:

```bash
npm start -- http://localhost:3000
```

## License

MIT