import { describe, expect, it } from "vitest";
import { profileTerms, scoreOpportunityMatch } from "./match-score";
import type { Profile } from "@slothing/shared/types";

function makeProfile(skills: string[], titles: string[] = []): Profile {
  return {
    id: "p1",
    contact: {} as Profile["contact"],
    experiences: titles.map((title, i) => ({
      id: `e${i}`,
      company: "X",
      title,
      startDate: "2020",
      current: false,
      description: "",
      highlights: [],
      skills: [],
    })),
    education: [],
    skills: skills.map((name, i) => ({
      id: `s${i}`,
      name,
      category: "technical" as const,
    })),
    projects: [],
    certifications: [],
  };
}

describe("profileTerms", () => {
  it("collects skill names and experience titles as tokens", () => {
    const terms = profileTerms(
      makeProfile(["TypeScript", "Go"], ["Backend Engineer"]),
    );
    expect(terms.has("typescript")).toBe(true);
    expect(terms.has("go")).toBe(true);
    expect(terms.has("backend")).toBe(true);
    expect(terms.has("engineer")).toBe(true);
  });

  it("returns an empty set for a null profile", () => {
    expect(profileTerms(null).size).toBe(0);
  });
});

describe("scoreOpportunityMatch", () => {
  const terms = profileTerms(makeProfile(["TypeScript", "React", "Node"]));

  it("returns 1 when there is no profile signal (do not filter)", () => {
    expect(scoreOpportunityMatch({ keywords: ["anything"] }, new Set())).toBe(
      1,
    );
  });

  it("returns 0 when the opportunity has no salient terms", () => {
    expect(scoreOpportunityMatch({}, terms)).toBe(0);
  });

  it("scores the fraction of overlapping terms, rounded to 2 dp", () => {
    // tokens: typescript (hit), react (hit) → 2/2 = 1
    expect(
      scoreOpportunityMatch({ keywords: ["TypeScript", "React"] }, terms),
    ).toBe(1);
    // tokens: typescript (hit), python (miss) → 1/2 = 0.5
    expect(
      scoreOpportunityMatch({ keywords: ["TypeScript", "Python"] }, terms),
    ).toBe(0.5);
  });

  it("considers title and requirements too", () => {
    const score = scoreOpportunityMatch(
      { title: "Node Developer", requirements: ["Cobol"] },
      terms,
    );
    // tokens: node (hit), developer (miss), cobol (miss) → 1/3 = 0.33
    expect(score).toBe(0.33);
  });
});
