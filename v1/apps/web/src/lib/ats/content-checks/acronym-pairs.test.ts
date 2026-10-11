import { describe, expect, it } from "vitest";
import { analyzeAcronymPairs } from "./acronym-pairs";

describe("analyzeAcronymPairs", () => {
  it("flags acronyms with no spelled-out form", () => {
    const report = analyzeAcronymPairs("Built ML pipelines with TensorFlow.");

    expect(report.gaps.find((gap) => gap.acronym === "ML")).toMatchObject({
      kind: "expansion-missing",
    });
  });

  it("flags expansions with no acronym", () => {
    const report = analyzeAcronymPairs(
      "Built Machine Learning pipelines with TensorFlow.",
    );

    expect(report.gaps.find((gap) => gap.acronym === "ML")).toMatchObject({
      kind: "acronym-missing",
    });
  });

  it("considers acronym + expansion together as paired", () => {
    const report = analyzeAcronymPairs(
      "Built Machine Learning (ML) pipelines with TensorFlow.",
    );

    expect(report.paired.find((pair) => pair.acronym === "ML")).toBeDefined();
    expect(report.gaps.find((gap) => gap.acronym === "ML")).toBeUndefined();
  });

  it("treats acronyms case-sensitively to avoid false positives", () => {
    // 'ai' inside 'available' should NOT trigger an AI gap.
    const report = analyzeAcronymPairs("This product is highly available.");

    expect(report.gaps.find((gap) => gap.acronym === "AI")).toBeUndefined();
  });

  it("matches expansions case-insensitively", () => {
    const report = analyzeAcronymPairs("artificial intelligence research");

    expect(report.gaps.find((gap) => gap.acronym === "AI")).toMatchObject({
      kind: "acronym-missing",
    });
  });

  it("ignores acronyms with no presence in the text at all", () => {
    const report = analyzeAcronymPairs("Built a billing service in Go.");
    // No false flags for ML/AI/etc.
    expect(report.gaps).toHaveLength(0);
    expect(report.paired).toHaveLength(0);
  });

  it("handles CI/CD correctly because of slash boundary", () => {
    const report = analyzeAcronymPairs(
      "Owned CI/CD pipelines and improved Continuous Integration and Continuous Delivery cycle time.",
    );

    expect(
      report.paired.find((pair) => pair.acronym === "CI/CD"),
    ).toBeDefined();
  });
});
