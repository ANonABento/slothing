import { describe, expect, it } from "vitest";
import { PROMPT_QA_FIXTURES } from "../../../evals/prompt-qa/fixtures";
import {
  buildTailorAutofixPrompt,
  buildTailoredResumePrompt,
} from "./prompt-builders";

describe("tailor prompt builders", () => {
  it("includes bank evidence, target job context, and JSON guardrails", () => {
    const fixture = PROMPT_QA_FIXTURES[0];
    const prompt = buildTailoredResumePrompt(
      {
        bankEntries: fixture.bankEntries,
        contact: fixture.contact,
        summary: fixture.profile.summary,
        jobTitle: fixture.job.title,
        company: fixture.job.company,
        jobDescription: fixture.job.description,
      },
      "Keep claims evidence-based.",
    );

    expect(prompt).toContain("ONLY the knowledge bank entries provided");
    expect(prompt).toContain("Campus Pantry Finder");
    expect(prompt).toContain("Frontend Engineer Intern");
    expect(prompt).toContain("Return ONLY a JSON object");
  });

  it("caps autofix keyword and job description context", () => {
    const fixture = PROMPT_QA_FIXTURES[5];
    const prompt = buildTailorAutofixPrompt({
      resume: fixture.resume,
      keywordsMissing: Array.from({ length: 20 }, (_, index) => `kw${index}`),
      jobDescription: "x".repeat(2100),
    });

    expect(prompt).toContain("kw14");
    expect(prompt).not.toContain("kw15");
    expect(prompt).toContain("Keep contact info and education unchanged");
  });
});
