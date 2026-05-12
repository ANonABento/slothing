#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { buildServer, SERVER_NAME, SERVER_VERSION } from "./server.js";
import { loadConfig, ConfigError } from "./config.js";

export { buildServer, SERVER_NAME, SERVER_VERSION } from "./server.js";
export { loadConfig, ConfigError } from "./config.js";
export { createApiClient, ApiError } from "./api-client.js";
export type { ApiClient, ApiClientConfig } from "./api-client.js";
export type { ServerConfig } from "./config.js";
export type { ToolDefinition } from "./tools/index.js";
export { allTools } from "./tools/index.js";

/**
 * Stdio bootstrap. Reads SLOTHING_TOKEN + SLOTHING_API_URL from env, builds
 * the MCP server with all five tools registered, and connects it to a
 * stdio transport.
 *
 * Log to stderr only — stdout is the MCP framing channel.
 */
export async function main(): Promise<void> {
  let config;
  try {
    config = loadConfig();
  } catch (error) {
    if (error instanceof ConfigError) {
      process.stderr.write(`[slothing-mcp] ${error.message}\n`);
      process.exit(1);
    }
    throw error;
  }

  const server = buildServer({ config });
  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write(
    `[slothing-mcp] ${SERVER_NAME} v${SERVER_VERSION} listening on stdio (api=${config.baseUrl})\n`,
  );
}

// Only auto-run when invoked as the CLI entry point. The `bin/slothing-mcp.mjs`
// shim imports the compiled `dist/index.js` and calls `main()` explicitly so
// tests can import this module without spawning a transport.
const isDirectInvocation =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  process.argv[1] !== undefined &&
  /slothing-mcp(\.mjs|\.js)?$/.test(process.argv[1]);

if (isDirectInvocation) {
  main().catch((error) => {
    process.stderr.write(`[slothing-mcp] fatal: ${String(error)}\n`);
    process.exit(1);
  });
}
