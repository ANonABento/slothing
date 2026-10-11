import { describe, expect, it } from "vitest";
import { fixtureProfile, skeletalProfile } from "./__fixtures__/fixtures";
import { scoreActionVerbs } from "./action-verbs";

describe("scoreActionVerbs", () => {
  it("rewards distinct action verbs at the start of highlights", () => {
    const result = scoreActionVerbs({ profile: fixtureProfile() });

    expect(result.earned).toBe(15);
    expect(result.evidence[0]).toContain("distinct action verbs");
  });

  it("scores profiles without highlights at zero", () => {
    const result = scoreActionVerbs({ profile: skeletalProfile() });

    expect(result.earned).toBe(0);
    expect(result.notes).toContain(
      "Start achievement bullets with strong action verbs.",
    );
  });
});
