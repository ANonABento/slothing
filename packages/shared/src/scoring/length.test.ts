import { describe, expect, it } from "vitest";
import { fixtureProfile, skeletalProfile, longRawText } from "./__fixtures__/fixtures";
import { scoreLength } from "./length";

describe("scoreLength", () => {
  it("awards full points for the 400-700 word target band", () => {
    const profile = fixtureProfile();
    const result = scoreLength({ profile, rawText: longRawText(profile) });

    expect(result.earned).toBe(10);
  });

  it("scores very short resumes at zero", () => {
    const result = scoreLength({ profile: skeletalProfile() });

    expect(result.earned).toBe(0);
  });
});
