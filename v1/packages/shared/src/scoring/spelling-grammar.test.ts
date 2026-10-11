import { describe, expect, it } from "vitest";
import { fixtureProfile } from "./__fixtures__/fixtures";
import { scoreSpellingGrammar } from "./spelling-grammar";

describe("scoreSpellingGrammar", () => {
  it("keeps a clean profile near the cap", () => {
    const result = scoreSpellingGrammar({ profile: fixtureProfile() });

    expect(result.earned).toBeGreaterThanOrEqual(9);
  });

  it("deducts for repeated words, lowercase starts, spacing, and fragments", () => {
    const profile = fixtureProfile();
    profile.experiences[0].highlights = [
      "built  systems with repeated repeated language",
      "customer platform architecture quality reliability collaboration roadmap delivery",
      "SHOUTING WORDS ABOUT HUGE URGENT BROKEN THINGS EVERYWHERE",
    ];

    const result = scoreSpellingGrammar({ profile });

    expect(result.earned).toBeLessThanOrEqual(4);
    expect(result.notes.length).toBeGreaterThan(0);
  });
});
