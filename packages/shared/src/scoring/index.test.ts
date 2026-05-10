import { describe, expect, it } from "vitest";
import {
  fixtureJob,
  fixtureProfile,
  longRawText,
  skeletalProfile,
} from "./__fixtures__/fixtures";
import { SUB_SCORE_MAX_POINTS } from "./constants";
import { scoreResume } from "./index";

describe("scoreResume", () => {
  it("aggregates all seven sub-scores into an overall score", () => {
    const profile = fixtureProfile();
    const result = scoreResume({
      profile,
      rawText: longRawText(profile),
      job: fixtureJob(),
    });
    const sum = Object.values(result.subScores).reduce(
      (total, subScore) => total + subScore.earned,
      0,
    );

    expect(Object.keys(result.subScores).sort()).toEqual([
      "actionVerbs",
      "atsFriendliness",
      "keywordMatch",
      "length",
      "quantifiedAchievements",
      "sectionCompleteness",
      "spellingGrammar",
    ]);
    expect(result.overall).toBe(sum);
    expect(result.overall).toBeGreaterThanOrEqual(80);
    expect(result.overall).toBeLessThanOrEqual(100);
  });

  it("keeps max points aligned to the 100 point rubric", () => {
    const result = scoreResume({ profile: fixtureProfile() });

    expect(
      Object.values(SUB_SCORE_MAX_POINTS).reduce(
        (total, points) => total + points,
        0,
      ),
    ).toBe(100);
    expect(
      Object.values(result.subScores).every(
        (subScore) => subScore.earned <= subScore.maxPoints,
      ),
    ).toBe(true);
  });

  it("scores an empty skeletal profile at or below 20", () => {
    const result = scoreResume({
      profile: skeletalProfile(),
      job: fixtureJob(),
    });

    expect(result.overall).toBeLessThanOrEqual(20);
  });

  it("uses neutral keyword scoring without a job while keeping strong resumes solid", () => {
    const profile = fixtureProfile();
    const result = scoreResume({ profile, rawText: longRawText(profile) });

    expect(result.subScores.keywordMatch.earned).toBe(18);
    expect(result.overall).toBeGreaterThanOrEqual(60);
  });

  it("scores an intuitively better profile higher than a weaker one", () => {
    const strong = fixtureProfile();
    const weak = fixtureProfile();
    weak.summary = "Engineer.";
    weak.contact.email = "";
    weak.experiences[0].highlights = ["helped team", "worked on app"];
    weak.skills = weak.skills.slice(0, 1);
    weak.education = [];

    const strongScore = scoreResume({
      profile: strong,
      rawText: longRawText(strong),
      job: fixtureJob(),
    });
    const weakScore = scoreResume({ profile: weak, job: fixtureJob() });

    expect(strongScore.overall).toBeGreaterThan(weakScore.overall);
  });
});
