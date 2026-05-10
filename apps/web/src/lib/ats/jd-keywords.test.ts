import { describe, expect, it } from "vitest";
import { extractJdKeywords } from "./jd-keywords";

describe("extractJdKeywords", () => {
  it("returns an empty list for blank input", () => {
    expect(extractJdKeywords(" \n\t ")).toEqual([]);
  });

  it("excludes broad job description filler terms", () => {
    const terms = extractJdKeywords(
      "We are looking for a candidate with years of experience for this role.",
    ).map((keyword) => keyword.term);

    expect(terms).not.toContain("candidate");
    expect(terms).not.toContain("experience");
    expect(terms).not.toContain("role");
  });

  it("dedupes common tech terms case-insensitively", () => {
    const keywords = extractJdKeywords(
      "React, REACT, TypeScript, Node.js and C++ for AWS services.",
    );

    expect(keywords.find((keyword) => keyword.term === "react")).toMatchObject({
      frequency: 2,
      kind: "keyword",
    });
    expect(keywords.map((keyword) => keyword.term)).toEqual(
      expect.arrayContaining(["typescript", "node.js", "c++", "aws"]),
    );
  });

  it("detects and ranks multi-word phrases", () => {
    const keywords = extractJdKeywords(
      "Requirements: machine learning, data analysis, and data visualization. Machine learning partners with data analysis teams.",
    );

    expect(keywords.slice(0, 4).map((keyword) => keyword.term)).toEqual(
      expect.arrayContaining(["machine learning", "data analysis"]),
    );
    expect(
      keywords.find((keyword) => keyword.term === "data visualization"),
    ).toMatchObject({ kind: "phrase" });
  });

  it("respects the limit option", () => {
    expect(
      extractJdKeywords("React TypeScript AWS SQL Docker Kubernetes", {
        limit: 3,
      }),
    ).toHaveLength(3);
  });

  it("extracts useful frontend internship skills without filler", () => {
    const terms = extractJdKeywords(
      `Frontend Intern
      Responsibilities: use React to build interfaces. Write unit tests.
      Requirements: GraphQL, REST APIs, data visualization, Figma, responsive design.
      Bonus: passion for collaboration.`,
    ).map((keyword) => keyword.term);

    expect(terms).toEqual(
      expect.arrayContaining([
        "graphql",
        "rest apis",
        "data visualization",
        "figma",
      ]),
    );
    expect(terms).not.toEqual(
      expect.arrayContaining([
        "bonus",
        "use",
        "intern",
        "intern.",
        "graphql.",
        "interfaces write unit",
        "write unit",
      ]),
    );
  });

  it("dedupes rest api aliases and singular/plural variants", () => {
    const terms = extractJdKeywords(
      "Build REST API, REST APIs, and RESTful APIs. API integrations are helpful.",
    ).map((keyword) => keyword.term);

    expect(terms.filter((term) => term === "rest apis")).toHaveLength(1);
    expect(terms.filter((term) => term === "api")).toHaveLength(1);
    expect(
      extractJdKeywords("REST API, REST APIs, and RESTful APIs.").map(
        (keyword) => keyword.term,
      ),
    ).toEqual(["rest apis"]);
  });

  it("strips punctuation while preserving meaningful tech punctuation", () => {
    const terms = extractJdKeywords(
      "GraphQL. Node.js, C++, C#, .NET, and CI/CD pipelines.",
    ).map((keyword) => keyword.term);

    expect(terms).toEqual(
      expect.arrayContaining([
        "graphql",
        "node.js",
        "c++",
        "c#",
        ".net",
        "ci/cd",
      ]),
    );
    expect(terms).not.toContain("graphql.");
  });
});
