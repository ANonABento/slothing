import { describe, expect, it } from "vitest";
import { DEFAULT_DIGEST_ENABLED, parseDigestEnabled } from "./digest";

describe("parseDigestEnabled", () => {
  it("defaults missing settings to enabled", () => {
    expect(parseDigestEnabled(null)).toBe(DEFAULT_DIGEST_ENABLED);
  });

  it("returns true only for the persisted true value", () => {
    expect(parseDigestEnabled("true")).toBe(true);
    expect(parseDigestEnabled("false")).toBe(false);
    expect(parseDigestEnabled("unexpected")).toBe(false);
  });
});
