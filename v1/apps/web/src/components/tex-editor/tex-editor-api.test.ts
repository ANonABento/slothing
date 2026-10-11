import { describe, expect, it, vi } from "vitest";

import {
  compileDocument,
  exportDownloadUrl,
  fetchPdfByKey,
  rateLimitDelayMs,
  saveDocument,
} from "./tex-editor-api";

function jsonResponse(
  status: number,
  body: unknown,
  headers: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

function transportOf(response: Response | (() => Promise<never>)) {
  const fetchMock = vi.fn(
    typeof response === "function" ? response : async () => response.clone(),
  ) as unknown as typeof fetch;
  return {
    transport: { fetch: fetchMock },
    fetchMock: fetchMock as unknown as ReturnType<typeof vi.fn>,
  };
}

describe("compileDocument", () => {
  it("returns the key and hit map on success", async () => {
    const { transport } = transportOf(
      jsonResponse(200, {
        ok: true,
        key: "a".repeat(64),
        hitMap: { rects: [], ids: ["itm-1"] },
        log: { ok: true, entries: [], raw: "" },
      }),
    );
    const result = await compileDocument("doc-1", "src", "preview", {
      transport,
    });
    expect(result).toMatchObject({ ok: true, key: "a".repeat(64) });
    if (result.ok) expect(result.hitMap?.ids).toEqual(["itm-1"]);
  });

  it("sends the local source so unsaved edits are what compile", async () => {
    const { transport, fetchMock } = transportOf(
      jsonResponse(200, { key: "k", hitMap: null, log: {} }),
    );
    await compileDocument("doc-1", "LOCAL SOURCE", "preview", { transport });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/tex-documents/doc-1/compile");
    expect(JSON.parse(String(init.body))).toEqual({
      mode: "preview",
      source: "LOCAL SOURCE",
    });
  });

  it("maps 422 to a compile failure carrying the log", async () => {
    const log = {
      ok: false,
      entries: [{ severity: "error", message: "boom", line: 12 }],
      raw: "",
    };
    const { transport } = transportOf(
      jsonResponse(422, { code: "compile_failed", log }),
    );
    const result = await compileDocument("doc-1", "src", "preview", {
      transport,
    });
    expect(result).toMatchObject({ ok: false, kind: "compile_failed" });
    if (!result.ok && result.kind === "compile_failed") {
      expect(result.log.entries[0].line).toBe(12);
    }
  });

  it("maps 503 to engine_unavailable", async () => {
    const { transport } = transportOf(
      jsonResponse(503, { code: "engine_unavailable", error: "no tectonic" }),
    );
    expect(
      await compileDocument("doc-1", "src", "preview", { transport }),
    ).toMatchObject({
      ok: false,
      kind: "engine_unavailable",
      message: "no tectonic",
    });
  });

  it("maps 429 to rate_limited, honouring Retry-After", async () => {
    const { transport } = transportOf(
      jsonResponse(429, { code: "rate_limited" }, { "retry-after": "5" }),
    );
    expect(
      await compileDocument("doc-1", "src", "preview", { transport }),
    ).toEqual({
      ok: false,
      kind: "rate_limited",
      retryAfterMs: 5000,
    });
  });

  it("falls back to a default delay when Retry-After is absent", async () => {
    const { transport } = transportOf(jsonResponse(429, {}));
    expect(
      await compileDocument("doc-1", "src", "preview", { transport }),
    ).toMatchObject({
      retryAfterMs: 2000,
    });
  });

  it("maps a thrown fetch to a network failure instead of rejecting", async () => {
    const { transport } = transportOf(async () => {
      throw new Error("offline");
    });
    expect(
      await compileDocument("doc-1", "src", "preview", { transport }),
    ).toEqual({
      ok: false,
      kind: "network",
      message: "offline",
    });
  });

  it("survives an error response with no JSON body", async () => {
    const fetchMock = vi.fn(async () => new Response("nope", { status: 500 }));
    const result = await compileDocument("doc-1", "src", "preview", {
      transport: { fetch: fetchMock as unknown as typeof fetch },
    });
    expect(result.ok).toBe(false);
  });
});

describe("fetchPdfByKey", () => {
  it("requests the bytes by cache key", async () => {
    const fetchMock = vi.fn(
      async (_url: string, _init?: RequestInit) =>
        new Response(new Uint8Array([1, 2, 3]), { status: 200 }),
    );
    const result = await fetchPdfByKey("doc-1", "b".repeat(64), {
      transport: { fetch: fetchMock as unknown as typeof fetch },
    });

    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      `/api/tex-documents/doc-1/pdf?key=${"b".repeat(64)}`,
    );
    expect(result).toMatchObject({ ok: true });
    if (result.ok) expect(result.bytes.byteLength).toBe(3);
  });

  it("maps 409 to stale_key so the caller can recompile", async () => {
    const { transport } = transportOf(jsonResponse(409, { code: "stale_key" }));
    expect(await fetchPdfByKey("doc-1", "c".repeat(64), { transport })).toEqual(
      {
        ok: false,
        kind: "stale_key",
      },
    );
  });

  it("maps other failures to network", async () => {
    const { transport } = transportOf(jsonResponse(500, {}));
    expect(
      await fetchPdfByKey("doc-1", "d".repeat(64), { transport }),
    ).toMatchObject({
      ok: false,
      kind: "network",
    });
  });
});

describe("saveDocument", () => {
  it("PATCHes the source and returns the new updatedAt", async () => {
    const { transport, fetchMock } = transportOf(
      jsonResponse(200, {
        document: { updatedAt: "2026-08-21T00:00:00.000Z" },
      }),
    );
    const result = await saveDocument("doc-1", "src", {
      label: "field edit",
      transport,
    });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/tex-documents/doc-1");
    expect(init.method).toBe("PATCH");
    expect(JSON.parse(String(init.body))).toEqual({
      source: "src",
      label: "field edit",
    });
    expect(result).toEqual({ ok: true, updatedAt: "2026-08-21T00:00:00.000Z" });
  });

  it("reports a failure without throwing", async () => {
    const { transport } = transportOf(jsonResponse(500, {}));
    expect(await saveDocument("doc-1", "src", { transport })).toMatchObject({
      ok: false,
    });
  });
});

describe("rateLimitDelayMs", () => {
  it("backs off 2s, 4s, 8s and then caps", () => {
    expect([1, 2, 3, 4, 9].map(rateLimitDelayMs)).toEqual([
      2000, 4000, 8000, 8000, 8000,
    ]);
  });
});

describe("exportDownloadUrl", () => {
  it("asks for the export mode as an attachment", () => {
    expect(exportDownloadUrl("doc-1")).toBe(
      "/api/tex-documents/doc-1/pdf?mode=export&download=true",
    );
  });
});
