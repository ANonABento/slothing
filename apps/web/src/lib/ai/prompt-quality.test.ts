import { describe, expect, it } from "vitest";
import {
  detectGenericPhrases,
  genericPhrasePenalty,
  scoreGenericPhraseDensity,
} from "./prompt-quality";

describe("prompt quality helpers", () => {
  it("detects generic phrases case-insensitively", () => {
    expect(
      detectGenericPhrases(
        "I am Passionate About joining your dynamic team and can contribute effectively.",
      ),
    ).toEqual(["passionate about", "contribute effectively", "dynamic team"]);
  });

  it("does not flag specific evidence-heavy drafts", () => {
    expect(
      detectGenericPhrases(
        "I reduced dashboard load time by using cached queries in a class project.",
      ),
    ).toEqual([]);
    expect(genericPhrasePenalty("")).toBe(0);
  });

  it("returns a bounded penalty for phrase-heavy drafts", () => {
    const draft =
      "I am passionate about this role and excited about this opportunity. My strong background makes me a perfect fit for your dynamic team in a fast-paced environment.";

    expect(scoreGenericPhraseDensity(draft)).toBeGreaterThan(0);
    expect(genericPhrasePenalty(draft)).toBe(3);
  });
});
