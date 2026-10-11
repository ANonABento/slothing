import { describe, it, expect } from "vitest";

import type { EvalCase, ResumeGeneratorOutput } from "../types.js";
import { groundingMetric } from "./index.js";

const testCase: EvalCase = {
  id: "g-1",
  label: "grounding",
  candidateProfile:
    "Built React dashboards for internal support workflows and improved load time by 30%. Mentored peers on JavaScript and React.",
  jobDescription: "Frontend Engineer at Acme",
};

function resumeOutput(highlights: string[]): ResumeGeneratorOutput {
  return {
    kind: "resume",
    generator: "test",
    rawText: "",
    latencyMs: 0,
    resume: {
      contact: { name: "Alex" },
      summary: "",
      experiences: [
        { company: "BlueOwl", title: "FE Engineer", dates: "2024", highlights },
      ],
      skills: [],
      education: [],
    },
  };
}

describe("groundingMetric (anti-fabrication, spec §3)", () => {
  it("scores a verbatim/paraphrased bullet as fully grounded", () => {
    const score = groundingMetric(
      testCase,
      resumeOutput(["Built React dashboards for support workflows"]),
    );
    expect(score.score).toBe(1);
  });

  it("penalizes a fabricated metric and reports the ungrounded number", () => {
    const score = groundingMetric(
      testCase,
      resumeOutput(["Increased revenue 40% across the company"]),
    );
    expect(score.score).toBeLessThanOrEqual(0.5);
    const details = score.details as { ungroundedNumbers: string[] };
    expect(details.ungroundedNumbers).toContain("40%");
  });

  it("keeps a metric that IS in the candidate's material", () => {
    const score = groundingMetric(
      testCase,
      resumeOutput(["Improved load time by 30% on the dashboards"]),
    );
    const details = score.details as { ungroundedNumbers: string[] };
    expect(details.ungroundedNumbers).toHaveLength(0);
    expect(score.score).toBe(1);
  });

  it("drops an unrelated (unsupported) bullet from the grounded fraction", () => {
    const score = groundingMetric(
      testCase,
      resumeOutput([
        "Built React dashboards for support workflows",
        "Negotiated international shipping contracts in maritime law",
      ]),
    );
    expect(score.score).toBeLessThan(1);
    expect(score.score).toBeGreaterThan(0);
  });
});
