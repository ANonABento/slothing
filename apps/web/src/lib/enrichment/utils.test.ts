import { describe, expect, it } from "vitest";
import { githubSlugCandidates } from "./utils";

describe("githubSlugCandidates", () => {
  it("builds ordered fallback candidates", () => {
    expect(githubSlugCandidates("Anthropic")).toEqual([
      "anthropic",
      "anthropics",
      "anthropic-inc",
      "anthropichq",
    ]);
  });

  it("compacts punctuation and spaces", () => {
    expect(githubSlugCandidates("J.P. Morgan")).toEqual([
      "jpmorgan",
      "jpmorgans",
      "jpmorgan-inc",
      "jpmorganhq",
    ]);
    expect(githubSlugCandidates("P&G")).toEqual([
      "pandg",
      "pandgs",
      "pandg-inc",
      "pandghq",
    ]);
  });

  it("dedupes candidates", () => {
    expect(githubSlugCandidates("Acmes")).toEqual([
      "acmes",
      "acmes-inc",
      "acmeshq",
    ]);
    expect(githubSlugCandidates("")).toEqual([]);
  });
});
