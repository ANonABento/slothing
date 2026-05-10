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
      "Requirements: project management, data analysis, and customer success. Project management partners with data analysis teams.",
    );

    expect(keywords.slice(0, 4).map((keyword) => keyword.term)).toEqual(
      expect.arrayContaining(["project management", "data analysis"]),
    );
    expect(
      keywords.find((keyword) => keyword.term === "customer success"),
    ).toMatchObject({ kind: "phrase" });
  });

  it("respects the limit option", () => {
    expect(
      extractJdKeywords("React TypeScript AWS SQL Docker Kubernetes", {
        limit: 3,
      }),
    ).toHaveLength(3);
  });
});
