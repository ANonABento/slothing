import { afterEach, describe, expect, it } from "vitest";
import type { Server, AddressInfo } from "node:http";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { startHttpServer } from "../src/http.js";
import { resolveTransport, resolvePort } from "../src/index.js";

const CONFIG = { baseUrl: "https://slothing.test", token: "valid-token" };

describe("resolveTransport", () => {
  it("defaults to stdio", () => {
    expect(resolveTransport([], {})).toBe("stdio");
  });

  it("selects http via --http, --transport http, or env", () => {
    expect(resolveTransport(["--http"], {})).toBe("http");
    expect(resolveTransport(["--transport", "http"], {})).toBe("http");
    expect(resolveTransport(["--transport=http"], {})).toBe("http");
    expect(resolveTransport([], { SLOTHING_MCP_TRANSPORT: "http" })).toBe("http");
  });

  it("explicit --stdio overrides the env", () => {
    expect(resolveTransport(["--stdio"], { SLOTHING_MCP_TRANSPORT: "http" })).toBe(
      "stdio",
    );
  });
});

describe("resolvePort", () => {
  it("reads --port then env then the default", () => {
    expect(resolvePort(["--port", "8080"], {})).toBe(8080);
    expect(resolvePort([], { SLOTHING_MCP_PORT: "9090" })).toBe(9090);
    expect(resolvePort([], {})).toBe(3399);
  });
});

describe("HTTP transport round-trip", () => {
  const servers: Server[] = [];
  const closers: Array<() => Promise<void>> = [];

  afterEach(async () => {
    await Promise.all(closers.splice(0).map((c) => c().catch(() => {})));
    await Promise.all(
      servers.splice(0).map(
        (s) =>
          new Promise<void>((resolve) => s.close(() => resolve())),
      ),
    );
  });

  it("serves listTools over Streamable HTTP", async () => {
    const server = await startHttpServer(CONFIG, { port: 0, host: "127.0.0.1" });
    servers.push(server);
    const { port } = server.address() as AddressInfo;

    const client = new Client({ name: "test", version: "0.0.0" });
    const transport = new StreamableHTTPClientTransport(
      new URL(`http://127.0.0.1:${port}/mcp`),
    );
    closers.push(() => client.close());
    await client.connect(transport);

    const result = await client.listTools();
    const names = result.tools.map((t) => t.name);
    expect(names).toContain("get_profile");
    expect(names).toContain("draft_application");
    expect(names).toContain("get_agent_policy");
    expect(names.length).toBe(11);
  });

  it("answers a health probe and 404s unknown paths", async () => {
    const server = await startHttpServer(CONFIG, { port: 0, host: "127.0.0.1" });
    servers.push(server);
    const { port } = server.address() as AddressInfo;

    const health = await fetch(`http://127.0.0.1:${port}/health`);
    expect(health.status).toBe(200);
    expect(await health.json()).toEqual({ ok: true });

    const missing = await fetch(`http://127.0.0.1:${port}/nope`);
    expect(missing.status).toBe(404);
  });
});
