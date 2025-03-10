# MCP to SLOP Adapter - Architecture

This document describes how the adapter maps between the Model Context Protocol (MCP) and the Simple Language Open Protocol (SLOP).

## Protocol Comparison

| MCP Concept | SLOP Equivalent | Implementation |
|-------------|-----------------|----------------|
| Tools | `/tools/:id` endpoints | Direct proxying with schema conversion |
| Resources | `/resources` endpoints | URI-based resource mapping |
| Prompts | Not applicable | Not implemented |
| Roots | Not applicable | Not implemented |

## Protocol Flow

```
+----------------+                  +--------------------+                  +----------------+
|                |  MCP Request     |                    |  HTTP Request    |                |
|   MCP Client   | ---------------> |  MCP-SLOP Adapter  | ---------------> |  SLOP Server   |
| (Claude, etc.) |                  |                    |                  |                |
|                |  MCP Response    |                    |  HTTP Response   |                |
|                | <--------------- |                    | <--------------- |                |
+----------------+                  +--------------------+                  +----------------+
```

## Mapping Details

### 1. Tools

MCP tools are mapped to SLOP endpoints as follows:

- MCP's `tools/list` → SLOP's `GET /tools`
- MCP's `tools/call` → SLOP's `POST /tools/:id`

The adapter:
1. Discovers available tools from SLOP
2. Exposes them as MCP tools with appropriate schemas
3. Proxies tool calls to the corresponding SLOP endpoints

Additionally, the adapter creates MCP tools to access SLOP-specific features:
- `chat` - Access to SLOP's chat functionality
- `memory-store` and `memory-get` - Access to SLOP's memory capabilities
- `pay` - Access to SLOP's payment processing

### 2. Resources

MCP resources are mapped to SLOP resources:

- MCP's `resources/list` → SLOP's `GET /resources`
- MCP's `resources/read` → SLOP's `GET /resources/:id`

Each SLOP resource is assigned a URI in the format `slop://resources/{resource_id}` to fit into MCP's resource addressing scheme.

### 3. Error Handling

The adapter translates between different error reporting formats:

- SLOP returns HTTP status codes and error messages in response bodies
- MCP has a standardized error reporting mechanism

The adapter handles this conversion transparently, ensuring that SLOP errors are properly represented in the MCP protocol.

## Implementation

The adapter is implemented using:

- TypeScript/Node.js
- MCP SDK for protocol handling
- Axios for HTTP requests to SLOP servers

The core of the implementation is in `src/server.ts`, which:

1. Sets up an MCP server with appropriate capabilities
2. Configures handlers for MCP protocol messages
3. Translates these into SLOP HTTP calls
4. Converts responses back to MCP format

## Configuration

The adapter can be configured by:

1. Command-line arguments (highest priority)
2. Environment variables (medium priority)
3. Default values (lowest priority)

Key configuration options:
- `SLOP_URL` - URL of the SLOP server

## Future Improvements

Potential enhancements:
- Add streaming support for chat responses
- Implement more sophisticated error handling
- Add schema inference for SLOP tools
- Support for SLOP's WebSocket mode