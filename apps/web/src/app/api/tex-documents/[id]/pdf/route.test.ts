import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth", () =>
  globalThis.__contractRouteMocks!.createAuthModuleMock(),
);

const store = vi.hoisted(() => ({
  document: {
    id: "doc-1",
    userId: "user-1",
    kind: "resume" as const,
    title: "My Resume",
    source: "\\documentclass{article}",
    contractVersion: 1,
    templateId: null,
    opportunityId: null,
    createdAt: "2026-08-21T00:00:00.000Z",
    updatedAt: "2026-08-21T00:00:00.000Z",
  },
  cached: new Map<string, Uint8Array>(),
}));

vi.mock("@/lib/db/tex-documents", () => ({
  getTexDocument: vi.fn(async (id: string, userId: string) =>
    id === store.document.id && userId === store.document.userId
      ? store.document
      : null,
  ),
}));

vi.mock("@/lib/latex/cache", () => ({
  cacheKey: () => "f".repeat(64),
  readCachedPdf: vi.fn(async (key: string) => store.cached.get(key) ?? null),
  writeCachedPdf: vi.fn(async (key: string, pdf: Uint8Array) => {
    store.cached.set(key, pdf);
  }),
}));

vi.mock("@/lib/latex/compile", () => ({
  compile: vi.fn(async () => ({
    pdf: new Uint8Array([37, 80, 68, 70]),
    synctex: null,
    log: { ok: true, entries: [], raw: "" },
    hitMap: null,
  })),
  CompileError: class CompileError extends Error {},
  EngineUnavailableError: class EngineUnavailableError extends Error {},
}));

import { GET } from "./route";
import { getRequest, invokeRouteHandler, routeContext } from "@/test/contract";

const VALID_KEY = "a".repeat(64);

function get(query: string) {
  return invokeRouteHandler(
    GET,
    getRequest(`http://localhost/api/tex-documents/doc-1/pdf${query}`),
    routeContext({ id: "doc-1" }),
  );
}

describe("GET /api/tex-documents/[id]/pdf?key=", () => {
  it("serves the bytes a preview compile cached under that key", async () => {
    store.cached.set(VALID_KEY, new Uint8Array([37, 80, 68, 70, 45]));

    const response = await get(`?key=${VALID_KEY}`);
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("application/pdf");
    expect(response.headers.get("etag")).toBe(`"${VALID_KEY}"`);
  });

  it("rejects a malformed key rather than treating it as a cache miss", async () => {
    const response = await get("?key=not-a-hash");
    expect(response.status).toBe(400);
    expect((await response.json()).code).toBe("bad_key");
  });

  it("409s on an evicted key instead of compiling different bytes", async () => {
    store.cached.delete(VALID_KEY);
    const response = await get(`?key=${VALID_KEY}`);

    // Compiling here would silently return bytes for the SAVED source, which is not what
    // this key means. The client recompiles and self-heals.
    expect(response.status).toBe(409);
    expect((await response.json()).code).toBe("stale_key");
  });

  it("still serves the saved source when no key is given", async () => {
    const response = await get("?mode=export");
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("application/pdf");
  });

  it("marks a download as an attachment", async () => {
    const response = await get("?mode=export&download=true");
    expect(response.headers.get("content-disposition")).toContain("attachment");
  });

  it("404s for a document that is not the user's", async () => {
    const response = await invokeRouteHandler(
      GET,
      getRequest("http://localhost/api/tex-documents/other/pdf"),
      routeContext({ id: "other" }),
    );
    expect(response.status).toBe(404);
  });
});
