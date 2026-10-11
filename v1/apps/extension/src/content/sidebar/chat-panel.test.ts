import { describe, expect, it } from "vitest";
import { COVER_LETTER_SEED_MAX } from "./chat-panel";

describe("ChatPanel constants (P4/#40)", () => {
  it("caps the cover-letter seed at a URL-safe length", () => {
    // 500 chars URL-encoded fits well inside the practical browser/CDN
    // limits (~8KB) used by chrome.tabs.create + Studio's deep-link parser.
    expect(COVER_LETTER_SEED_MAX).toBe(500);
  });

  it("seeds longer than the cap are truncated, not rejected", () => {
    const longText = "x".repeat(1200);
    const seed = longText.slice(0, COVER_LETTER_SEED_MAX);
    expect(seed).toHaveLength(500);
    expect(seed).toBe("x".repeat(500));
  });
});
