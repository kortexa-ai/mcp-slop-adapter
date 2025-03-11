#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import axios from 'axios';
import type { AxiosError } from 'axios';
import { loadEnv } from './config/dotenv.js';
import { z } from 'zod';

// Load environment variables
loadEnv();

// Get SLOP server URL from arguments or environment
const args = process.argv.slice(2);
let slopUrl = args[0] || process.env.SLOP_URL || 'http://localhost:4000';

// Ensure URL has proper format
if (!slopUrl.startsWith('http')) {
  slopUrl = `http://${slopUrl}`;
}

// Create axios instance for SLOP API calls
const slopApi = axios.create({
  baseURL: slopUrl,
  timeout: 30000
});

// Create MCP server with resources and tools capabilities
const mcpServer = new McpServer({
  name: 'mcp-slop-adapter',
  version: "1.0.0"
}, {
  capabilities: {
    resources: {},
    tools: {}
  }
});

// Define types for SLOP responses
interface SlopErrorResponse {
  error?: string;
  status?: number;
}

interface SlopToolResponse {
  result: unknown;
}

interface SlopResourceResponse {
  content: unknown;
}

interface SlopTool {
  id: string;
  description?: string;
}

interface SlopResource {
  id: string;
  name?: string;
}

// Helper function to convert SLOP error responses to MCP format
function handleSlopError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<SlopErrorResponse>;
    const message = axiosError.response?.data?.error || axiosError.message || 'Unknown error';
    const status = axiosError.response?.status || 500;
    return `SLOP server error (${status}): ${message}`;
  }
  return `Unknown error: ${String(error)}`;
}

// Initialize the server by:
// 1. Fetch all SLOP tools and register them as MCP tools
// 2. Fetch all SLOP resources and register them with the MCP server
async function initializeServer(): Promise<void> {
  try {
    // Fetch and register SLOP tools
    const toolsResponse = await slopApi.get('/tools');
    const slopTools = toolsResponse.data.tools as SlopTool[] || [];
    
    // Register each SLOP tool as an MCP tool
    slopTools.forEach((slopTool: SlopTool) => {
      mcpServer.tool(
        slopTool.id,
        slopTool.description || `SLOP tool: ${slopTool.id}`,
        {
          // Create a generic schema since SLOP doesn't provide detailed schemas
          // A better solution would be to infer schemas from tool usage patterns
          "params": z.string().describe('Tool parameters')
        },
        async (args) => {
          try {
            // Call the corresponding SLOP tool endpoint
            const response = await slopApi.post<SlopToolResponse>(`/tools/${slopTool.id}`, JSON.parse(args.params));
            
            // Convert SLOP response to MCP format
            return {
              content: [{
                type: 'text',
                text: typeof response.data.result === 'object' 
                  ? JSON.stringify(response.data.result, null, 2)
                  : String(response.data.result)
              }]
            };
          } catch (error) {
            // Handle SLOP tool errors
            const errorMessage = handleSlopError(error);
            return {
              isError: true,
              content: [{
                type: 'text',
                text: errorMessage
              }]
            };
          }
        }
      );
    });
    
    // Register SLOP-specific endpoint tools
    registerSlopSpecificTools();
    
    // Fetch SLOP resources
    const resourcesResponse = await slopApi.get('/resources');
    const slopResources = resourcesResponse.data.resources as SlopResource[] || [];
    
    // Register each SLOP resource
    for (const resource of slopResources) {
      await registerSlopResource(resource);
    }
  } catch (error) {
    console.error(`Failed to initialize server: ${handleSlopError(error)}`);
    throw error;
  }
}

// Register a SLOP resource for use with MCP
async function registerSlopResource(resource: SlopResource): Promise<void> {
  const resourceId = resource.id;
  const resourceUri = `slop://resources/${resourceId}`;
  
  try {
    // Fetch the resource content to determine its schema
    const resourceResponse = await slopApi.get<SlopResourceResponse>(`/resources/${resourceId}`);
    let content = resourceResponse.data.content;
    
    // Ensure content is a string
    if (typeof content === 'object') {
      content = JSON.stringify(content, null, 2);
    } else if (content === undefined) {
      content = JSON.stringify(resourceResponse.data, null, 2);
    }
    
    // Register the resource with the MCP server
    mcpServer.resource(
      resource.name || resourceId,
      resourceUri,
      async () => ({
        contents: [
          {
            uri: resourceUri,
            text: String(content),
            mimeType: 'text/plain'
          }
        ]
      })
    );
  } catch (error) {
    console.error(`Failed to register resource ${resourceId}: ${handleSlopError(error)}`);
  }
}

// Register additional tools for SLOP-specific endpoints
function registerSlopSpecificTools(): void {
  // Store memory
  mcpServer.tool(
    'memory-store',
    'Store a key-value pair in SLOP memory',
    {
      key: z.string().describe('Memory key'),
      value: z.any().describe('Memory value to store')
    },
    async ({ key, value }) => {
      try {
        const response = await slopApi.post('/memory', { key, value });
        return {
          content: [{
            type: 'text',
            text: `Successfully stored value for key "${key}": ${response.data.status}`
          }]
        };
      } catch (error) {
        return {
          isError: true,
          content: [{
            type: 'text',
            text: `Failed to store memory: ${handleSlopError(error)}`
          }]
        };
      }
    }
  );

  // Retrieve memory
  mcpServer.tool(
    'memory-get',
    'Retrieve a value by key from SLOP memory',
    {
      key: z.string().describe('Memory key to retrieve')
    },
    async ({ key }) => {
      try {
        const response = await slopApi.get(`/memory/${key}`);
        const value = response.data.value;
        return {
          content: [{
            type: 'text',
            text: typeof value === 'object' 
              ? JSON.stringify(value, null, 2) 
              : String(value ?? 'null')
          }]
        };
      } catch (error) {
        return {
          isError: true,
          content: [{
            type: 'text',
            text: `Failed to retrieve memory: ${handleSlopError(error)}`
          }]
        };
      }
    }
  );

  // Send a chat message to the SLOP server
  mcpServer.tool(
    'chat',
    'Send a message to the SLOP chat endpoint',
    {
      message: z.string().describe('Message content to send')
    },
    async ({ message }) => {
      try {
        const response = await slopApi.post('/chat', {
          messages: [{ role: 'user', content: message }]
        });
        
        return {
          content: [{
            type: 'text',
            text: response.data.message?.content || JSON.stringify(response.data, null, 2)
          }]
        };
      } catch (error) {
        return {
          isError: true,
          content: [{
            type: 'text',
            text: `Chat failed: ${handleSlopError(error)}`
          }]
        };
      }
    }
  );

  // Process payment through SLOP pay endpoint
  mcpServer.tool(
    'pay',
    'Process a payment through SLOP',
    {
      amount: z.number().describe('Payment amount'),
      currency: z.string().optional().describe('Currency code (optional)')
    },
    async ({ amount, currency }) => {
      try {
        const response = await slopApi.post('/pay', { amount, currency });
        
        return {
          content: [{
            type: 'text',
            text: `Payment processed. Transaction ID: ${response.data.transaction_id}, Status: ${response.data.status}`
          }]
        };
      } catch (error) {
        return {
          isError: true,
          content: [{
            type: 'text',
            text: `Payment failed: ${handleSlopError(error)}`
          }]
        };
      }
    }
  );
}

// Initialize the server by registering all SLOP components
await initializeServer();

// Connect to MCP client using stdio transport
const transport = new StdioServerTransport();
await mcpServer.connect(transport);
