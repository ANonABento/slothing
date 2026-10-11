import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ApiError, createApiClient, type ApiClient } from "./api-client.js";
import { allTools, type AnyToolDefinition } from "./tools/index.js";
import type { ServerConfig } from "./config.js";

export const SERVER_NAME = "@slothing/mcp";
export const SERVER_VERSION = "0.1.0";

export interface BuildServerOptions {
  config: ServerConfig;
  /** Optional fetch override (useful for tests). */
  fetchImpl?: typeof fetch;
  /** Optional pre-built API client (overrides config-derived one — for tests). */
  apiClient?: ApiClient;
}

/**
 * Construct a fully-wired MCP server with every tool registered. The server
 * is returned in an unconnected state — the caller chooses a transport
 * (stdio in production, InMemoryTransport in tests) and calls `connect()`.
 */
export function buildServer(options: BuildServerOptions): McpServer {
  const client =
    options.apiClient ??
    createApiClient({
      baseUrl: options.config.baseUrl,
      token: options.config.token,
      fetchImpl: options.fetchImpl,
    });

  const server = new McpServer(
    { name: SERVER_NAME, version: SERVER_VERSION },
    {
      capabilities: { tools: {} },
      instructions:
        "Slothing MCP server. Exposes the authenticated user's profile, opportunities (jobs + hackathons), and answer-bank entries. Auth is a single extension token (SLOTHING_TOKEN); minted via POST /api/extension/auth on the user's Slothing instance.",
    },
  );

  for (const tool of allTools) {
    registerTool(server, tool, client);
  }

  return server;
}

function registerTool(
  server: McpServer,
  tool: AnyToolDefinition,
  client: ApiClient,
): void {
  server.registerTool(
    tool.name,
    {
      title: tool.title,
      description: tool.description,
      inputSchema: tool.inputShape,
      annotations: tool.annotations,
    },
    async (args: unknown) => {
      try {
        // The SDK has already validated `args` against `inputShape`, but we
        // cast through `unknown` because each tool's handler is parameterized
        // on its own argument type and the union here is too wide for TS.
        const result = await tool.handler(args as never, client);
        const text =
          typeof result === "string"
            ? result
            : JSON.stringify(result, null, 2);
        return {
          content: [{ type: "text" as const, text }],
        };
      } catch (error) {
        return toToolError(error);
      }
    },
  );
}

/**
 * Convert a thrown error into an MCP tool error result. We return the error
 * to the client via `isError: true` (the standard MCP shape) rather than
 * raising a protocol-level error — this is the recommended way to surface
 * "bad token" and similar recoverable failures to the calling agent.
 */
function toToolError(error: unknown): {
  content: Array<{ type: "text"; text: string }>;
  isError: true;
} {
  let message: string;
  if (error instanceof ApiError) {
    if (error.status === 401) {
      message =
        "Slothing rejected the extension token (401). Set SLOTHING_TOKEN to a valid token minted via POST /api/extension/auth on your Slothing instance.";
    } else if (error.status === 403) {
      message = `Slothing refused the request (403): ${error.message}`;
    } else if (error.status === 404) {
      message = `Slothing returned 404: ${error.message}`;
    } else {
      message = error.message;
    }
  } else if (error instanceof Error) {
    message = `Tool failed: ${error.message}`;
  } else {
    message = `Tool failed with non-Error throw: ${String(error)}`;
  }

  return {
    content: [{ type: "text" as const, text: message }],
    isError: true,
  };
}
