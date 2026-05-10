import { describe, expect, it } from "vitest";
import {
  fixtureJob,
  fixtureProfile,
  longRawText,
  skeletalProfile,
} from "./__fixtures__/fixtures";
import { scoreKeywordMatch } from "./keyword-match";

describe("scoreKeywordMatch", () => {
  it("scores a strong profile against a matching job highly", () => {
    const profile = fixtureProfile();
    const result = scoreKeywordMatch({
      profile,
      rawText: longRawText(profile),
      job: fixtureJob(),
    });

    expect(result.earned).toBeGreaterThanOrEqual(18);
  });

  it("uses a neutral baseline without a job description", () => {
    const result = scoreKeywordMatch({ profile: fixtureProfile() });

    expect(result.earned).toBe(18);
    expect(result.notes[0]).toContain("neutral baseline");
  });

  it("scores a poor keyword match low", () => {
    const result = scoreKeywordMatch({
      profile: skeletalProfile(),
      job: fixtureJob(),
    });

    expect(result.earned).toBe(0);
  });
});
