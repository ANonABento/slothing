#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { buildServer, SERVER_NAME, SERVER_VERSION } from "./server.js";
import { loadConfig, ConfigError } from "./config.js";
import { checkToken, formatRefreshReport } from "./refresh.js";

export { buildServer, SERVER_NAME, SERVER_VERSION } from "./server.js";
export { loadConfig, ConfigError } from "./config.js";
export { createApiClient, ApiError } from "./api-client.js";
export type { ApiClient, ApiClientConfig } from "./api-client.js";
export type { ServerConfig } from "./config.js";
export type { ToolDefinition } from "./tools/index.js";
export { allTools } from "./tools/index.js";
export { checkToken, formatRefreshReport } from "./refresh.js";
export type { TokenStatus } from "./refresh.js";

export type Command = "serve" | "refresh" | "help";

const USAGE = `slothing-mcp — Model Context Protocol server for Slothing

Usage:
  slothing-mcp            Start the stdio MCP server (default)
  slothing-mcp refresh    Check whether SLOTHING_TOKEN is still valid + how to re-mint
  slothing-mcp --help     Show this help

Environment:
  SLOTHING_TOKEN          Extension token minted via POST /api/extension/auth (required)
  SLOTHING_API_URL        Base URL of your Slothing instance (required)`;

/**
 * Map argv into a command. `refresh` and `doctor` are aliases for the token
 * health check; `--help`/`-h`/`help` print usage; everything else serves.
 */
export function parseCommand(argv: readonly string[]): Command {
  const first = argv.find((arg) => !arg.startsWith("-"));
  if (first === "refresh" || first === "doctor") return "refresh";
  if (
    first === "help" ||
    argv.includes("--help") ||
    argv.includes("-h")
  ) {
    return "help";
  }
  return "serve";
}

/**
 * Stdio bootstrap. Reads SLOTHING_TOKEN + SLOTHING_API_URL from env, builds
 * the MCP server with every tool registered, and connects it to a stdio
 * transport. Also dispatches the `refresh` and `--help` subcommands.
 *
 * Log to stderr only — stdout is the MCP framing channel.
 */
export async function main(argv: readonly string[] = process.argv.slice(2)): Promise<void> {
  const command = parseCommand(argv);

  if (command === "help") {
    process.stdout.write(`${USAGE}\n`);
    return;
  }

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

  if (command === "refresh") {
    const status = await checkToken(config);
    process.stdout.write(`${formatRefreshReport(status, config)}\n`);
    if (!status.ok) process.exit(1);
    return;
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
