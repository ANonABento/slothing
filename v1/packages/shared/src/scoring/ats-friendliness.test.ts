import { describe, expect, it } from "vitest";
import { fixtureProfile, longRawText } from "./__fixtures__/fixtures";
import { scoreAtsFriendliness } from "./ats-friendliness";

describe("scoreAtsFriendliness", () => {
  it("awards full points for parseable plain text with email", () => {
    const profile = fixtureProfile();
    const result = scoreAtsFriendliness({
      profile,
      rawText: longRawText(profile),
    });

    expect(result.earned).toBe(10);
  });

  it("deducts for ATS-hostile formatting signals", () => {
    const profile = fixtureProfile();
    const longLine = "x".repeat(210);
    const result = scoreAtsFriendliness({
      profile,
      rawText: [
        "Jordan Lee\tSenior Engineer • <b>React</b>",
        longLine,
        longLine,
        longLine,
        longLine,
      ].join("\n"),
    });

    expect(result.earned).toBeLessThanOrEqual(3);
    expect(result.notes.length).toBeGreaterThan(0);
  });
});
