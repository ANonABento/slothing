import { describe, expect, it } from "vitest";
import type { EvalCase, GeneratorOutput } from "../types.js";
import {
  actionVerbMetric,
  errorMetric,
  keywordOverlapMetric,
  lengthMetric,
  missingKeywordsMetric,
  runMetrics,
} from "../metrics/index.js";

const TEST_CASE: EvalCase = {
  id: "tc-metrics",
  label: "Metrics",
  candidateProfile: "Engineer",
  jobDescription: "React TypeScript performance optimization",
  expectedKeywords: ["react", "typescript", "performance"],
};

const OUTPUT: GeneratorOutput = {
  kind: "coverLetter",
  generator: "test",
  text: "I built React systems, improved TypeScript quality, and optimized performance.",
  latencyMs: 10,
};

describe("deterministic metrics", () => {
  it("scores keyword overlap", () => {
    const result = keywordOverlapMetric(TEST_CASE, OUTPUT);
    expect(result.score).toBe(1);
    expect(result.details?.matched).toEqual(["react", "typescript", "performance"]);
  });

  it("counts missing keywords", () => {
    const result = missingKeywordsMetric(TEST_CASE, {
      ...OUTPUT,
      text: "React only",
    });
    expect(result.details?.count).toBe(2);
    expect(result.score).toBeCloseTo(1 / 3);
  });

  it("returns bounded length and action verb scores", () => {
    expect(lengthMetric(TEST_CASE, OUTPUT).score).toBeGreaterThanOrEqual(0);
    expect(lengthMetric(TEST_CASE, OUTPUT).score).toBeLessThanOrEqual(1);
    expect(actionVerbMetric(TEST_CASE, OUTPUT).score).toBeGreaterThan(0);
  });

  it("flags generator errors without throwing other metrics", () => {
    const errored: GeneratorOutput = {
      kind: "resume",
      generator: "test",
      rawText: "",
      latencyMs: 1,
      error: "failed",
    };
    expect(errorMetric(TEST_CASE, errored).score).toBe(1);
    const results = runMetrics(TEST_CASE, errored);
    expect(results.every((metric) => Number.isFinite(metric.score))).toBe(true);
  });
});
