/**
 * HTTP (Streamable HTTP) transport for the Slothing MCP server.
 *
 * stdio remains the default; this lets a non-colocated agent stack (Choomfie,
 * Hermes, OpenClaw running off-box) connect to a hosted Slothing MCP server
 * over HTTP. Runs STATELESS — a fresh `McpServer` + transport per request — so
 * there is no session affinity to manage and the server scales trivially.
 *
 * Auth/token handling is unchanged: the configured `SLOTHING_TOKEN` is used for
 * every tool call regardless of transport.
 */
import {
  createServer,
  type IncomingMessage,
  type Server,
  type ServerResponse,
} from "node:http";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { buildServer } from "./server.js";
import type { ServerConfig } from "./config.js";

export const DEFAULT_HTTP_PORT = 3399;
export const MCP_HTTP_PATH = "/mcp";

export interface HttpServerOptions {
  port?: number;
  host?: string;
  /** Path the MCP endpoint is mounted at (default `/mcp`). */
  path?: string;
}

function readBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8");
      if (!raw) return resolve(undefined);
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

/**
 * Build a Node HTTP request listener that handles MCP requests at `path`. A
 * `GET /health` probe returns `{ ok: true }`; everything else off-path is 404.
 */
export function createMcpRequestListener(
  config: ServerConfig,
  path: string = MCP_HTTP_PATH,
): (req: IncomingMessage, res: ServerResponse) => Promise<void> {
  return async (req, res) => {
    const pathname = (req.url ?? "/").split("?")[0];

    if (pathname === "/health") {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ ok: true }));
      return;
    }

    if (pathname !== path) {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "Not found" }));
      return;
    }

    // Stateless: a fresh server + transport per request.
    const server = buildServer({ config });
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });

    res.on("close", () => {
      void transport.close();
      void server.close();
    });

    try {
      await server.connect(transport);
      let body: unknown;
      if (req.method === "POST") {
        try {
          body = await readBody(req);
        } catch {
          res.writeHead(400, { "content-type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid JSON body" }));
          return;
        }
      }
      await transport.handleRequest(req, res, body);
    } catch (error) {
      if (!res.headersSent) {
        res.writeHead(500, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: "Internal server error" }));
      }
      process.stderr.write(`[slothing-mcp] http error: ${String(error)}\n`);
    }
  };
}

/** Start the MCP HTTP server, resolving once it is listening. */
export function startHttpServer(
  config: ServerConfig,
  options: HttpServerOptions = {},
): Promise<Server> {
  const listener = createMcpRequestListener(
    config,
    options.path ?? MCP_HTTP_PATH,
  );
  const server = createServer((req, res) => {
    void listener(req, res);
  });
  return new Promise((resolve) => {
    server.listen(options.port ?? DEFAULT_HTTP_PORT, options.host, () =>
      resolve(server),
    );
  });
}
