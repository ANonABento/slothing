import { describe, expect, it } from "vitest";
import { computeJdMatch, normalizeForMatch } from "./match-score";

describe("computeJdMatch", () => {
  it("scores highly when the resume contains most JD keywords", () => {
    const result = computeJdMatch(
      "Built React and TypeScript dashboards, shipped Node.js APIs, and used SQL and AWS.",
      "We need React, TypeScript, Node.js, SQL, AWS, and Docker.",
      { keywordLimit: 6 },
    );

    expect(result.score).toBeGreaterThanOrEqual(80);
    expect(result.matchedKeywords).toEqual(
      expect.arrayContaining(["react", "typescript", "node.js", "sql", "aws"]),
    );
    expect(result.matchedWithEvidence).toEqual(
      expect.arrayContaining(["react", "typescript"]),
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
      matchedWithEvidence: [],
      mentionedOnly: [],
      stuffedKeywords: [],
      evidenceByKeyword: {},
      warnings: [],
    });
    expect(computeJdMatch("React", "")).toEqual({
      score: 0,
      matchedKeywords: [],
      missingKeywords: [],
      totalKeywords: 0,
      matchedWithEvidence: [],
      mentionedOnly: [],
      stuffedKeywords: [],
      evidenceByKeyword: {},
      warnings: [],
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

  it("does not list frontend internship skills as missing when present", () => {
    const jd =
      "Frontend internship requiring React, TypeScript, GraphQL, REST APIs, data visualization, Figma, accessible UI, and unit testing.";
    const resume =
      "Frontend student using React and TypeScript. Designed in Figma, built GraphQL clients, consumed REST APIs, created data visualization dashboards, improved accessible UI, and wrote unit tests.";

    const result = computeJdMatch(resume, jd, { keywordLimit: 12 });

    expect(result.score).toBeGreaterThan(40);
    expect(result.matchedKeywords).toEqual(
      expect.arrayContaining([
        "graphql",
        "rest apis",
        "data visualization",
        "figma",
      ]),
    );
    expect(result.missingKeywords).not.toEqual(
      expect.arrayContaining([
        "graphql",
        "rest apis",
        "data visualization",
        "figma",
      ]),
    );
  });

  it("lists frontend skills as missing for a weak resume without filler chips", () => {
    const result = computeJdMatch(
      "Coursework in HTML and CSS with classroom projects.",
      "Frontend intern: use React, TypeScript, GraphQL, REST APIs, data visualization, and Figma. Bonus if you write unit tests.",
      { keywordLimit: 12 },
    );

    expect(result.missingKeywords).toEqual(
      expect.arrayContaining([
        "graphql",
        "rest apis",
        "data visualization",
        "figma",
      ]),
    );
    expect([...result.matchedKeywords, ...result.missingKeywords]).not.toEqual(
      expect.arrayContaining(["bonus", "use", "intern", "write unit"]),
    );
  });

  it("dedupes keyword-stuffed resumes and ignores filler from the JD", () => {
    const result = computeJdMatch(
      "React React React GraphQL GraphQL REST APIs Figma.",
      "React GraphQL REST APIs Figma. Bonus: use these skills as an intern.",
      { keywordLimit: 12 },
    );

    expect(new Set(result.matchedKeywords).size).toBe(
      result.matchedKeywords.length,
    );
    expect([...result.matchedKeywords, ...result.missingKeywords]).not.toEqual(
      expect.arrayContaining(["bonus", "use", "intern"]),
    );
  });

  it("keeps unrelated data JDs focused on data skills", () => {
    const result = computeJdMatch(
      "Frontend engineer with React, TypeScript, and Figma.",
      "Data analyst role requiring Python, SQL, Tableau, Power BI, ETL, data pipelines, and statistics.",
      { keywordLimit: 10 },
    );

    expect(result.missingKeywords).toEqual(
      expect.arrayContaining([
        "python",
        "sql",
        "tableau",
        "power bi",
        "etl",
        "data pipelines",
        "statistics",
      ]),
    );
    expect(result.missingKeywords).not.toEqual(
      expect.arrayContaining(["front end", "intern", "role requiring"]),
    );
  });

  it("scores supported keyword matches above repeated keyword-only text", () => {
    const jd = "React, TypeScript, and Playwright are required.";
    const supported = computeJdMatch(
      "- Built React and TypeScript dashboards for 25,000 users.\n- Added Playwright tests that improved release confidence.",
      jd,
      { keywordLimit: 3 },
    );
    const stuffed = computeJdMatch(
      "React TypeScript Playwright React TypeScript Playwright React TypeScript Playwright React TypeScript Playwright",
      jd,
      { keywordLimit: 3 },
    );

    expect(supported.matchedWithEvidence).toEqual(
      expect.arrayContaining(["react", "typescript", "playwright"]),
    );
    expect(stuffed.stuffedKeywords).toEqual(
      expect.arrayContaining(["react", "typescript", "playwright"]),
    );
    expect(stuffed.score).toBeLessThan(supported.score);
  });

  it("keeps skills-list matches in mentioned only", () => {
    const result = computeJdMatch(
      "Skills: React, TypeScript, Playwright",
      "React, TypeScript, and Playwright are required.",
      { keywordLimit: 3 },
    );

    expect(result.mentionedOnly).toEqual(
      expect.arrayContaining(["react", "typescript", "playwright"]),
    );
    expect(result.matchedWithEvidence).toHaveLength(0);
  });
});

describe("normalizeForMatch", () => {
  it("normalizes separators without dropping useful tech punctuation", () => {
    expect(normalizeForMatch("Node.js / C# - data-analysis")).toBe(
      "node.js c# data analysis",
    );
  });
});
