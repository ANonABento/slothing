import { describe, expect, it } from "vitest";
import { runEval } from "../run.js";
import type { EvalCase, EvalGenerator } from "../types.js";

const CASES: EvalCase[] = [
  {
    id: "tc-1",
    label: "Case 1",
    candidateProfile: "React engineer",
    jobDescription: "React TypeScript",
    expectedKeywords: ["react"],
  },
  {
    id: "tc-2",
    label: "Case 2",
    candidateProfile: "Backend engineer",
    jobDescription: "Go systems",
    expectedKeywords: ["go"],
  },
];

describe("runEval", () => {
  it("runs a stubbed generator and summarizes deterministic metrics", async () => {
    const generator: EvalGenerator = async (testCase) => ({
      kind: "coverLetter",
      generator: "stub",
      text: testCase.id === "tc-1" ? "React" : "",
      latencyMs: 1,
      error: testCase.id === "tc-2" ? "boom" : undefined,
    });

    const report = await runEval({
      cases: CASES,
      mode: "cover-letter",
      generatorName: "stub",
      generator,
      metrics: [
        (_testCase, output) => ({
          name: "error",
          score: output.error ? 1 : 0,
        }),
        (testCase, output) => ({
          name: "contains_keyword",
          score:
            output.kind === "coverLetter" &&
            output.text.toLowerCase().includes(testCase.expectedKeywords![0])
              ? 1
              : 0,
        }),
      ],
    });

    expect(report.cases).toHaveLength(2);
    expect(report.summary.errorCount).toBe(1);
    expect(report.judge).toBe("disabled");
    expect(report.summary.avgScoreByMetric.contains_keyword).toBe(0.5);
  });
});
