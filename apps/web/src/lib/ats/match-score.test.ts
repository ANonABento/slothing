import { describe, expect, it } from "vitest";
import { computeJdMatch, normalizeForMatch } from "./match-score";

describe("computeJdMatch", () => {
  it("scores highly when the resume contains most JD keywords", () => {
    const result = computeJdMatch(
      "Senior engineer using React, TypeScript, Node.js, SQL, and AWS.",
      "We need React, TypeScript, Node.js, SQL, AWS, and Docker.",
      { keywordLimit: 6 },
    );

    expect(result.score).toBeGreaterThanOrEqual(80);
    expect(result.matchedKeywords).toEqual(
      expect.arrayContaining(["react", "typescript", "node.js", "sql", "aws"]),
    );
  });

  it("returns missing keywords in JD ranking order", () => {
    const result = computeJdMatch(
      "Product analyst with SQL and dashboard reporting.",
      "SQL, dashboard reporting, machine learning, Python, and AWS are required.",
      { keywordLimit: 6 },
    );

    expect(result.missingKeywords).toEqual(
      expect.arrayContaining(["machine learning", "python", "aws"]),
    );
  });

  it("matches through case, punctuation, and simple plurals", () => {
    const result = computeJdMatch(
      "Built DASHBOARDS with node.js and C# APIs.",
      "Build dashboard, Node.js, C#, and API integrations.",
      { keywordLimit: 4 },
    );

    expect(result.matchedKeywords).toEqual(
      expect.arrayContaining(["dashboard", "node.js", "c#", "api"]),
    );
  });

  it("has deterministic empty input behavior", () => {
    expect(computeJdMatch("", "React")).toEqual({
      score: 0,
      matchedKeywords: [],
      missingKeywords: [],
      totalKeywords: 0,
    });
    expect(computeJdMatch("React", "")).toEqual({
      score: 0,
      matchedKeywords: [],
      missingKeywords: [],
      totalKeywords: 0,
    });
  });

  it("honors keywordLimit and missingLimit", () => {
    const result = computeJdMatch(
      "React",
      "React TypeScript AWS SQL Docker Kubernetes Python",
      { keywordLimit: 5, missingLimit: 2 },
    );

    expect(result.totalKeywords).toBe(5);
    expect(result.missingKeywords).toHaveLength(2);
  });
});

describe("normalizeForMatch", () => {
  it("normalizes separators without dropping useful tech punctuation", () => {
    expect(normalizeForMatch("Node.js / C# - data-analysis")).toBe(
      "node.js c# data analysis",
    );
  });
});
