import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resolveCompanyLogoDataUrl } from "./company-logo";

const CACHE_KEY = "slothing:logoCache";

function imageResponse(type = "image/png") {
  return {
    ok: true,
    headers: { get: (k: string) => (k === "content-type" ? type : null) },
    arrayBuffer: async () => new Uint8Array([1, 2, 3, 4]).buffer,
  };
}

describe("resolveCompanyLogoDataUrl", () => {
  let store: Record<string, unknown>;
  const now = new Date("2026-06-13T00:00:00.000Z").getTime();

  beforeEach(() => {
    store = {};
    vi.stubGlobal("chrome", {
      storage: {
        local: {
          get: (key: string, cb: (r: Record<string, unknown>) => void) =>
            cb({ [key]: store[key] }),
          set: (entries: Record<string, unknown>, cb: () => void) => {
            Object.assign(store, entries);
            cb();
          },
        },
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("rejects domains without a dot and never fetches", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    expect(await resolveCompanyLogoDataUrl("localhost", now)).toBeNull();
    expect(await resolveCompanyLogoDataUrl("", now)).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns a fresh cached hit without fetching", async () => {
    store[CACHE_KEY] = {
      "acme.com": {
        dataUrl: "data:image/png;base64,CACHED",
        at: new Date(now).toISOString(),
      },
    };
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    expect(await resolveCompanyLogoDataUrl("acme.com", now)).toBe(
      "data:image/png;base64,CACHED",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns a fresh cached negative (null) without fetching", async () => {
    store[CACHE_KEY] = {
      "acme.com": { dataUrl: null, at: new Date(now).toISOString() },
    };
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    expect(await resolveCompanyLogoDataUrl("acme.com", now)).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("fetches Clearbit on a miss and caches the data URL", async () => {
    const fetchMock = vi.fn().mockResolvedValue(imageResponse());
    vi.stubGlobal("fetch", fetchMock);
    const result = await resolveCompanyLogoDataUrl("acme.com", now);
    expect(result).toMatch(/^data:image\/png;base64,/);
    expect(fetchMock.mock.calls[0][0]).toContain("logo.clearbit.com/acme.com");
    // cached
    expect(
      (store[CACHE_KEY] as Record<string, unknown>)["acme.com"],
    ).toMatchObject({
      dataUrl: result,
    });
  });

  it("falls back to DuckDuckGo when Clearbit misses", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        headers: { get: () => null },
        arrayBuffer: async () => new ArrayBuffer(0),
      })
      .mockResolvedValueOnce(imageResponse("image/x-icon"));
    vi.stubGlobal("fetch", fetchMock);
    const result = await resolveCompanyLogoDataUrl("acme.com", now);
    expect(result).toMatch(/^data:image\/x-icon;base64,/);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1][0]).toContain(
      "icons.duckduckgo.com/ip3/acme.com",
    );
  });

  it("caches a null when both services fail", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      headers: { get: () => null },
      arrayBuffer: async () => new ArrayBuffer(0),
    });
    vi.stubGlobal("fetch", fetchMock);
    expect(await resolveCompanyLogoDataUrl("acme.com", now)).toBeNull();
    expect(
      (store[CACHE_KEY] as Record<string, unknown>)["acme.com"],
    ).toMatchObject({
      dataUrl: null,
    });
  });

  it("refetches once a cached entry is stale", async () => {
    const stale = now - 40 * 24 * 60 * 60 * 1000; // 40d > 30d positive TTL
    store[CACHE_KEY] = {
      "acme.com": {
        dataUrl: "data:image/png;base64,OLD",
        at: new Date(stale).toISOString(),
      },
    };
    const fetchMock = vi.fn().mockResolvedValue(imageResponse());
    vi.stubGlobal("fetch", fetchMock);
    const result = await resolveCompanyLogoDataUrl("acme.com", now);
    expect(result).toMatch(/^data:image\/png;base64,/);
    expect(fetchMock).toHaveBeenCalled();
  });
});
