import { describe, expect, it } from "vitest";
import { PROMPT_QA_FIXTURES } from "../../../evals/prompt-qa/fixtures";
import {
  buildGenericInterviewQuestionsPrompt,
  buildInterviewAnswerFeedbackPrompt,
  buildJobInterviewQuestionsPrompt,
} from "./prompt-builders";

describe("interview prompt builders", () => {
  it("builds job-specific question prompts with profile and category guardrails", () => {
    const fixture = PROMPT_QA_FIXTURES[0];
    const prompt = buildJobInterviewQuestionsPrompt({
      job: fixture.job,
      profile: fixture.profile,
      difficulty: "entry",
      questionCount: 5,
    });

    expect(prompt).toContain("Frontend Engineer Intern at BrightApps");
    expect(prompt).toContain("Ava Chen");
    expect(prompt).toContain("Return ONLY a JSON array");
    expect(prompt).toContain("cultural-fit");
  });

  it("builds generic prompts without referencing a company", () => {
    const prompt = buildGenericInterviewQuestionsPrompt({
      category: "technical",
      difficulty: "entry",
      questionCount: 5,
    });

    expect(prompt).toContain("Do not reference any specific role or company");
    expect(prompt).toContain('"category": "technical"');
  });

  it("builds answer feedback prompts with concise coaching instructions", () => {
    const fixture = PROMPT_QA_FIXTURES[2];
    const prompt = buildInterviewAnswerFeedbackPrompt({
      job: fixture.job,
      answer: "I built the Task Board project.",
      category: "behavioral",
    });

    expect(prompt).toContain("Software Engineering Intern at Northstar");
    expect(prompt).toContain("2-3 sentences");
    expect(prompt).toContain("One specific improvement suggestion");
  });
});
