import { describe, expect, it } from "vitest";
import { fixtureProfile, skeletalProfile } from "./__fixtures__/fixtures";
import { scoreSectionCompleteness } from "./section-completeness";

describe("scoreSectionCompleteness", () => {
  it("scores a complete profile at the cap", () => {
    const result = scoreSectionCompleteness({ profile: fixtureProfile() });

    expect(result.earned).toBe(10);
    expect(result.evidence).toContain("7/7 sections complete");
  });

  it("scores a skeletal profile low", () => {
    const result = scoreSectionCompleteness({ profile: skeletalProfile() });

    expect(result.earned).toBe(0);
    expect(result.notes.length).toBeGreaterThan(0);
  });
});
