import { describe, expect, it } from "vitest";
import { PROMPT_QA_FIXTURES } from "../fixtures";
import {
  buildPromptQaCases,
  runPromptQaFixtures,
  summarizePromptQaResults,
} from "../harness";
import { PROMPT_QA_WORKFLOWS } from "../types";

describe("prompt QA harness", () => {
  it("runs all six internship fixtures across every required workflow", () => {
    const cases = buildPromptQaCases();

    expect(PROMPT_QA_FIXTURES.map((fixture) => fixture.id)).toEqual([
      "strong-frontend-student",
      "weak-retail-to-tech-student",
      "keyword-stuffed-resume",
      "unrelated-data-role",
      "thin-profile-one-project",
      "unsupported-keyword-request",
    ]);
    expect(cases).toHaveLength(
      PROMPT_QA_FIXTURES.length * PROMPT_QA_WORKFLOWS.length,
    );

    for (const fixture of PROMPT_QA_FIXTURES) {
      expect(
        cases.filter((testCase) => testCase.fixture.id === fixture.id),
      ).toHaveLength(PROMPT_QA_WORKFLOWS.length);
    }
  });

  it("builds prompts with candidate, job, and evidence context", () => {
    const cases = buildPromptQaCases();
    const frontendCases = cases.filter(
      (testCase) => testCase.fixture.id === "strong-frontend-student",
    );

    for (const testCase of frontendCases) {
      expect(testCase.prompt).toContain("Ava Chen");
      expect(testCase.prompt).toContain("BrightApps");
    }

    expect(
      frontendCases.find(
        (testCase) => testCase.workflow === "resume_generation",
      )?.prompt,
    ).toContain("Campus Pantry Finder");
    expect(
      frontendCases.find((testCase) => testCase.workflow === "cover_letter")
        ?.prompt,
    ).toContain("ONLY the cover letter text");
    expect(
      frontendCases.find((testCase) => testCase.workflow === "interview")
        ?.prompt,
    ).toContain("FEEDBACK PROMPT");
  });

  it("keeps unsupported keyword invention below passing threshold", () => {
    const results = runPromptQaFixtures();
    const unsupportedAutofix = results.find(
      (result) =>
        result.fixture.id === "unsupported-keyword-request" &&
        result.workflow === "tailor_autofix",
    );

    expect(unsupportedAutofix).toBeDefined();
    expect(unsupportedAutofix?.scores.factuality.score).toBeLessThan(0.5);
    expect(unsupportedAutofix?.passed).toBe(false);
  });

  it("summarizes deterministic pass and fail counts", () => {
    const results = runPromptQaFixtures();
    const summary = summarizePromptQaResults(results);

    expect(summary.total).toBe(30);
    expect(summary.failed).toBeGreaterThan(0);
    expect(summary.byWorkflow.tailor_autofix.failed).toBeGreaterThan(0);
    expect(summary.passed + summary.failed).toBe(summary.total);
  });
});
