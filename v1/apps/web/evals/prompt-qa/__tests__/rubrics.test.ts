import { describe, expect, it } from "vitest";
import { PROMPT_QA_FIXTURES } from "../fixtures";
import { scorePromptQaCase } from "../rubrics";
import type { PromptQaCase } from "../types";

function makeCase(output: string): PromptQaCase {
  return {
    fixture: PROMPT_QA_FIXTURES[0],
    workflow: "resume_generation",
    prompt: "prompt",
    output,
  };
}

describe("prompt QA rubrics", () => {
  it("lowers factuality when output invents unsupported facts", () => {
    const scores = scorePromptQaCase(
      makeCase("Ava is a senior engineer with Kubernetes and AWS expertise."),
    );

    expect(scores.factuality.score).toBeLessThan(0.7);
  });

  it("raises evidence use when supported tokens appear", () => {
    const scores = scorePromptQaCase(
      makeCase("Campus Pantry Finder used React and TypeScript."),
    );

    expect(scores.evidenceUse.score).toBe(1);
  });

  it("penalizes keyword stuffing without evidence", () => {
    const scores = scorePromptQaCase(
      makeCase("Kubernetes AWS Terraform microservices machine learning."),
    );

    expect(scores.evidenceUse.score).toBe(0);
    expect(scores.factuality.score).toBeLessThan(0.7);
  });

  it("lowers actionability and student usefulness for vague output", () => {
    const scores = scorePromptQaCase(makeCase("This candidate is good."));

    expect(scores.actionability.score).toBe(0);
    expect(scores.studentUsefulness.score).toBe(0);
  });

  it("lowers concision for overly long output", () => {
    const scores = scorePromptQaCase(
      makeCase(Array(220).fill("word").join(" ")),
    );

    expect(scores.concision.score).toBeLessThan(1);
  });
});
