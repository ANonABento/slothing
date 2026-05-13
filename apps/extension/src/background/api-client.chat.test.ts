import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getStorage: vi.fn(),
  setStorage: vi.fn(),
  clearSessionAuthCache: vi.fn(),
  markAuthSeen: vi.fn(),
}));

vi.mock("./storage", () => ({
  getStorage: mocks.getStorage,
  setStorage: mocks.setStorage,
  clearSessionAuthCache: mocks.clearSessionAuthCache,
  markAuthSeen: mocks.markAuthSeen,
}));

import { SlothingAPIClient } from "./api-client";

/**
 * Build a Response whose body is an SSE stream of the supplied frames.
 * Each `frame` is the raw string body of one `data:` line (typically JSON).
 */
function sseResponse(frames: string[], init: ResponseInit = { status: 200 }) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      for (const frame of frames) {
        controller.enqueue(encoder.encode(`data: ${frame}\n\n`));
      }
      controller.close();
    },
  });
  return new Response(stream, init);
}

describe("SlothingAPIClient.chat (P4/#40)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getStorage.mockResolvedValue({
      authToken: "token-1",
      apiBaseUrl: "http://localhost:3000",
      settings: {},
    });
    vi.stubGlobal("fetch", vi.fn());
  });

  it("yields the token chunks from an SSE stream", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      sseResponse([
        JSON.stringify({ token: "Hello" }),
        JSON.stringify({ token: " world" }),
        JSON.stringify({ done: true }),
      ]),
    );

    const client = new SlothingAPIClient("http://localhost:3000");
    const tokens: string[] = [];
    for await (const t of client.chat("Why am I qualified?")) {
      tokens.push(t);
    }
    expect(tokens).toEqual(["Hello", " world"]);
  });

  it("forwards the X-Extension-Token header and prompt body", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      sseResponse([JSON.stringify({ done: true })]),
    );
    const client = new SlothingAPIClient("http://localhost:3000");
    const iterator = client.chat("hi", { title: "FE", company: "Acme" });
    // Drain
    for await (const _ of iterator) {
      // no-op
    }
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/extension/chat",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "X-Extension-Token": "token-1",
        }),
        body: JSON.stringify({
          prompt: "hi",
          jobContext: { title: "FE", company: "Acme" },
        }),
      }),
    );
  });

  it("throws when the stream emits an error frame", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      sseResponse([
        JSON.stringify({ error: "boom" }),
        JSON.stringify({ done: true }),
      ]),
    );
    const client = new SlothingAPIClient("http://localhost:3000");
    const iterator = client.chat("hi");
    await expect(async () => {
      for await (const _ of iterator) {
        // no-op
      }
    }).rejects.toThrow("boom");
  });

  it("surfaces the server's JSON error string on a non-OK response", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({ error: "Daily AI assistant limit reached." }),
        { status: 429 },
      ),
    );
    const client = new SlothingAPIClient("http://localhost:3000");
    await expect(async () => {
      for await (const _ of client.chat("hi")) {
        // no-op
      }
    }).rejects.toThrow("Daily AI assistant limit reached.");
  });

  it("clears the auth token on 401 so the popup re-verifies", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
      }),
    );
    const client = new SlothingAPIClient("http://localhost:3000");
    await expect(async () => {
      for await (const _ of client.chat("hi")) {
        // no-op
      }
    }).rejects.toThrow("Authentication expired");
    expect(mocks.setStorage).toHaveBeenCalledWith(
      expect.objectContaining({
        authToken: undefined,
        tokenExpiry: undefined,
      }),
    );
    expect(mocks.clearSessionAuthCache).toHaveBeenCalled();
  });

  it("throws when no auth token is stored", async () => {
    mocks.getStorage.mockResolvedValueOnce({
      apiBaseUrl: "http://localhost:3000",
      settings: {},
    });
    const client = new SlothingAPIClient("http://localhost:3000");
    await expect(async () => {
      for await (const _ of client.chat("hi")) {
        // no-op
      }
    }).rejects.toThrow("Not authenticated");
  });

  it("handles SSE chunks split across reader boundaries", async () => {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        // First chunk: a half-frame (no terminating \n\n yet).
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ token: "Hel" })}\n`),
        );
        // Second chunk: completes the first frame and emits another.
        controller.enqueue(
          encoder.encode(
            `\ndata: ${JSON.stringify({ token: "lo" })}\n\ndata: ${JSON.stringify({ done: true })}\n\n`,
          ),
        );
        controller.close();
      },
    });
    vi.mocked(fetch).mockResolvedValueOnce(new Response(stream));
    const client = new SlothingAPIClient("http://localhost:3000");
    const tokens: string[] = [];
    for await (const t of client.chat("hi")) {
      tokens.push(t);
    }
    expect(tokens.join("")).toBe("Hello");
  });
});
