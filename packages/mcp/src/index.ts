#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { buildServer, SERVER_NAME, SERVER_VERSION } from "./server.js";
import { loadConfig, ConfigError } from "./config.js";
import { checkToken, formatRefreshReport } from "./refresh.js";
import { startHttpServer, DEFAULT_HTTP_PORT, MCP_HTTP_PATH } from "./http.js";

export { buildServer, SERVER_NAME, SERVER_VERSION } from "./server.js";
export { loadConfig, ConfigError } from "./config.js";
export { createApiClient, ApiError } from "./api-client.js";
export type { ApiClient, ApiClientConfig } from "./api-client.js";
export type { ServerConfig } from "./config.js";
export type { ToolDefinition } from "./tools/index.js";
export { allTools } from "./tools/index.js";
export { checkToken, formatRefreshReport } from "./refresh.js";
export type { TokenStatus } from "./refresh.js";
export {
  startHttpServer,
  createMcpRequestListener,
  DEFAULT_HTTP_PORT,
  MCP_HTTP_PATH,
} from "./http.js";

export type Command = "serve" | "refresh" | "help";
export type Transport = "stdio" | "http";

const USAGE = `slothing-mcp — Model Context Protocol server for Slothing

Usage:
  slothing-mcp                 Start the stdio MCP server (default)
  slothing-mcp --http [--port N]   Start the Streamable HTTP server (default port ${DEFAULT_HTTP_PORT}, path ${MCP_HTTP_PATH})
  slothing-mcp refresh         Check whether SLOTHING_TOKEN is still valid + how to re-mint
  slothing-mcp --help          Show this help

Environment:
  SLOTHING_TOKEN          Extension token minted via POST /api/extension/auth (required)
  SLOTHING_API_URL        Base URL of your Slothing instance (required)
  SLOTHING_MCP_TRANSPORT  stdio (default) | http
  SLOTHING_MCP_PORT       Port for the HTTP transport (default ${DEFAULT_HTTP_PORT})`;

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

/** Resolve the transport from argv (`--http`/`--transport http`) then env. */
export function resolveTransport(
  argv: readonly string[],
  env: NodeJS.ProcessEnv = process.env,
): Transport {
  if (argv.includes("--http")) return "http";
  const flagIdx = argv.indexOf("--transport");
  if (flagIdx >= 0 && argv[flagIdx + 1] === "http") return "http";
  if (argv.some((a) => a === "--transport=http")) return "http";
  if (argv.includes("--stdio")) return "stdio";
  return env.SLOTHING_MCP_TRANSPORT === "http" ? "http" : "stdio";
}

/** Resolve the HTTP port from `--port N` then env, falling back to the default. */
export function resolvePort(
  argv: readonly string[],
  env: NodeJS.ProcessEnv = process.env,
): number {
  const flagIdx = argv.indexOf("--port");
  const fromFlag = flagIdx >= 0 ? Number(argv[flagIdx + 1]) : NaN;
  if (Number.isInteger(fromFlag) && fromFlag > 0) return fromFlag;
  const fromEnv = Number(env.SLOTHING_MCP_PORT);
  if (Number.isInteger(fromEnv) && fromEnv > 0) return fromEnv;
  return DEFAULT_HTTP_PORT;
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

  if (resolveTransport(argv) === "http") {
    const port = resolvePort(argv);
    await startHttpServer(config, { port });
    process.stderr.write(
      `[slothing-mcp] ${SERVER_NAME} v${SERVER_VERSION} listening on http://localhost:${port}${MCP_HTTP_PATH} (api=${config.baseUrl})\n`,
    );
    return;
  }

  const server = buildServer({ config });
  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write(
    `[slothing-mcp] ${SERVER_NAME} v${SERVER_VERSION} listening on stdio (api=${config.baseUrl})\n`,
  );
}

// Only auto-run when this compiled module IS the process entry point
// (`node dist/index.js`). The `bin/slothing-mcp.mjs` shim imports this module
// and calls `main()` explicitly — matching the shim's own path here would run
// `main()` TWICE (two stdio transports, or EADDRINUSE on the HTTP transport).
// Tests import the module (argv[1] = the test runner) and never auto-run.
const isDirectInvocation =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  process.argv[1] !== undefined &&
  /[\\/]dist[\\/]index\.(c?js|mjs)$/.test(process.argv[1]);

if (isDirectInvocation) {
  main().catch((error) => {
    process.stderr.write(`[slothing-mcp] fatal: ${String(error)}\n`);
    process.exit(1);
  });
}
