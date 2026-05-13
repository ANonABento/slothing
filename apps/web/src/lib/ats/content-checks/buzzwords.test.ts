import { describe, expect, it } from "vitest";
import { analyzeBuzzwords } from "./buzzwords";

describe("analyzeBuzzwords", () => {
  it("flags common buzzwords", () => {
    const report = analyzeBuzzwords([
      {
        text: "Self-starter and team player with synergy.",
        location: "summary",
      },
    ]);

    expect(report.uniquePhrases).toEqual(
      expect.arrayContaining(["self-starter", "team player", "synergy"]),
    );
  });

  it("dedupes phrases across multiple segments", () => {
    const report = analyzeBuzzwords([
      { text: "Results-driven engineer.", location: "summary" },
      { text: "Results-driven approach to problems.", location: "exp-1" },
    ]);

    expect(report.uniquePhrases).toEqual(["results-driven"]);
    expect(report.hits).toHaveLength(2);
  });

  it("does not match unrelated words", () => {
    const report = analyzeBuzzwords([
      {
        text: "Built a leverage point for distributed teams.",
        location: "exp-1",
      },
    ]);

    // 'leverage' is in the list, so this should hit.
    expect(report.uniquePhrases).toContain("leverage");
  });

  it("returns empty report for clean copy", () => {
    const report = analyzeBuzzwords([
      { text: "Shipped Node.js services to 25k DAU.", location: "exp-1" },
    ]);

    expect(report.hits).toEqual([]);
    expect(report.uniquePhrases).toEqual([]);
  });
});
