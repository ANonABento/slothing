import { afterEach, describe, expect, it } from "vitest";

import {
  __resetPdfCacheForTests,
  cachePdfBytes,
  evictCachedPdf,
  getCachedPdfBytes,
} from "./pdf-cache";

afterEach(() => {
  __resetPdfCacheForTests();
});

describe("pdf-cache (PF.3)", () => {
  it("round-trips bytes for the owning user", () => {
    const bytes = Buffer.from("%PDF-1.7\n%pretend pdf bytes\n");
    cachePdfBytes("doc-1", "user-a", bytes);
    const hit = getCachedPdfBytes("doc-1", "user-a");
    expect(hit).not.toBeNull();
    expect(hit!.bytes.toString("utf8")).toContain("pretend pdf bytes");
    expect(hit!.contentType).toBe("application/pdf");
  });

  it("scopes lookups by user — another user cannot brute-force the documentId", () => {
    cachePdfBytes("doc-1", "user-a", Buffer.from("secret"));
    expect(getCachedPdfBytes("doc-1", "user-b")).toBeNull();
  });

  it("evictCachedPdf removes the entry", () => {
    cachePdfBytes("doc-2", "user-a", Buffer.from("x"));
    evictCachedPdf("doc-2");
    expect(getCachedPdfBytes("doc-2", "user-a")).toBeNull();
  });

  it("returns null after TTL elapses", async () => {
    cachePdfBytes("doc-3", "user-a", Buffer.from("y"));
    const original = Date.now;
    const fakeNow = original() + 25 * 60 * 60 * 1000;
    Date.now = () => fakeNow;
    try {
      expect(getCachedPdfBytes("doc-3", "user-a")).toBeNull();
    } finally {
      Date.now = original;
    }
  });
});
