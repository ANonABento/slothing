import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  DEFAULT_DOCUMENT_DEFAULTS,
  STUDIO_DEFAULTS_KEY,
  STUDIO_SORT_KEY,
  STUDIO_VIEW_KEY,
  hasCustomDefaults,
  readStudioDefaults,
  readStudioSort,
  readStudioView,
  writeStudioDefaults,
  writeStudioSort,
  writeStudioView,
} from "./preferences";

/**
 * The shared test setup replaces `localStorage` with no-op `vi.fn()`s, so a round-trip
 * assertion needs a real backing store. This installs one per test.
 */
let store: Map<string, string>;

beforeEach(() => {
  store = new Map();
  vi.mocked(window.localStorage.getItem).mockImplementation(
    (key: string) => store.get(key) ?? null,
  );
  vi.mocked(window.localStorage.setItem).mockImplementation(
    (key: string, value: string) => {
      store.set(key, value);
    },
  );
});

describe("view and sort", () => {
  it("defaults to the list view and the most-recent sort", () => {
    expect(readStudioView()).toBe("list");
    expect(readStudioSort()).toBe("recent");
  });

  it("round-trips through the documented keys", () => {
    writeStudioView("grid");
    writeStudioSort("title");
    expect(store.get(STUDIO_VIEW_KEY)).toBe("grid");
    expect(store.get(STUDIO_SORT_KEY)).toBe("title");
    expect(readStudioView()).toBe("grid");
    expect(readStudioSort()).toBe("title");
  });

  it("falls back rather than trusting an unknown stored value", () => {
    store.set(STUDIO_VIEW_KEY, "carousel");
    store.set(STUDIO_SORT_KEY, "colour");
    expect(readStudioView()).toBe("list");
    expect(readStudioSort()).toBe("recent");
  });

  it("keeps the taida: prefix so existing storage resets still match", () => {
    expect(STUDIO_VIEW_KEY.startsWith("taida:")).toBe(true);
    expect(STUDIO_SORT_KEY.startsWith("taida:")).toBe(true);
    expect(STUDIO_DEFAULTS_KEY.startsWith("taida:")).toBe(true);
  });
});

describe("new-document defaults", () => {
  it("round-trips a full set", () => {
    writeStudioDefaults({ font: "Times", fontsize: "12pt", margin: "0.75in" });
    expect(readStudioDefaults()).toEqual({
      font: "Times",
      fontsize: "12pt",
      margin: "0.75in",
    });
  });

  it("keeps valid fields when a sibling field is unusable", () => {
    // A blob written by an older build: the font still validates, the margin does not.
    store.set(
      STUDIO_DEFAULTS_KEY,
      JSON.stringify({ font: "Palatino", fontsize: "11pt", margin: "wide" }),
    );
    expect(readStudioDefaults()).toEqual({
      font: "Palatino",
      fontsize: "11pt",
      margin: DEFAULT_DOCUMENT_DEFAULTS.margin,
    });
  });

  it("survives a corrupt blob", () => {
    store.set(STUDIO_DEFAULTS_KEY, "{not json");
    expect(readStudioDefaults()).toEqual(DEFAULT_DOCUMENT_DEFAULTS);
  });

  it("survives localStorage throwing outright", () => {
    // Private-browsing modes throw on access rather than returning null. The list must
    // still render.
    vi.mocked(window.localStorage.getItem).mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.mocked(window.localStorage.setItem).mockImplementation(() => {
      throw new Error("quota");
    });
    expect(readStudioView()).toBe("list");
    expect(readStudioSort()).toBe("recent");
    expect(readStudioDefaults()).toEqual(DEFAULT_DOCUMENT_DEFAULTS);
    expect(() => writeStudioView("grid")).not.toThrow();
  });

  it("reports whether anything was customised", () => {
    expect(hasCustomDefaults(DEFAULT_DOCUMENT_DEFAULTS)).toBe(false);
    expect(
      hasCustomDefaults({ ...DEFAULT_DOCUMENT_DEFAULTS, fontsize: "12pt" }),
    ).toBe(true);
  });
});
