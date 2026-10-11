import { describe, expect, it } from "vitest";

import {
  clampRatio,
  readStoredRatio,
  SPLIT_STORAGE_KEY,
} from "./use-split-pane";

describe("clampRatio", () => {
  it("keeps a sensible ratio untouched", () => {
    expect(clampRatio(0.62)).toBe(0.62);
  });

  it("stops either pane from collapsing", () => {
    expect(clampRatio(0.01)).toBe(0.35);
    expect(clampRatio(0.99)).toBe(0.8);
  });

  it("falls back for a non-finite value", () => {
    expect(clampRatio(Number.NaN)).toBe(0.62);
  });
});

describe("readStoredRatio", () => {
  it("reads and clamps a stored ratio", () => {
    const storage = { getItem: () => "0.95" };
    expect(readStoredRatio(storage, 0.62)).toBe(0.8);
  });

  it("uses the canonical taida: key", () => {
    expect(SPLIT_STORAGE_KEY).toBe("taida:tex:split");
  });

  it("falls back when nothing is stored", () => {
    expect(readStoredRatio({ getItem: () => null }, 0.62)).toBe(0.62);
  });

  it("falls back when storage throws — private mode must not break the editor", () => {
    const storage = {
      getItem: () => {
        throw new Error("blocked");
      },
    };
    expect(readStoredRatio(storage, 0.62)).toBe(0.62);
  });

  it("falls back with no storage at all (SSR)", () => {
    expect(readStoredRatio(null, 0.62)).toBe(0.62);
  });
});
