import { describe, expect, it } from "vitest";
import { fixtureProfile, skeletalProfile } from "./__fixtures__/fixtures";
import { scoreQuantifiedAchievements } from "./quantified-achievements";

describe("scoreQuantifiedAchievements", () => {
  it("rewards multiple measurable outcomes", () => {
    const result = scoreQuantifiedAchievements({ profile: fixtureProfile() });

    expect(result.earned).toBe(20);
    expect(result.evidence[0]).toContain("quantified result");
  });

  it("scores profiles without metrics at zero", () => {
    const result = scoreQuantifiedAchievements({ profile: skeletalProfile() });

    expect(result.earned).toBe(0);
    expect(result.notes.length).toBeGreaterThan(0);
  });
});
