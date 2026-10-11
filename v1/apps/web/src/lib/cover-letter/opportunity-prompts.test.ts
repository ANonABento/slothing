import { describe, expect, it } from "vitest";
import {
  buildOpportunityCoverLetterJsonPrompt,
  buildOpportunityCoverLetterStreamPrompt,
} from "./opportunity-prompts";

const input = {
  profileSummary: "Name: Ada\nExperience:\n- Intern at Acme: Built API tests",
  job: {
    title: "Frontend Engineer",
    company: "Globex",
    description: "Needs React testing experience.",
    keywords: ["React", "testing"],
  },
};

describe("opportunity cover letter prompts", () => {
  it("builds JSON prompts with evidence rules and self-check shape", () => {
    const prompt = buildOpportunityCoverLetterJsonPrompt(input);

    expect(prompt).toContain("one concrete candidate evidence point");
    expect(prompt).toContain("one job/company requirement");
    expect(prompt).toContain("do not invent achievements, metrics, roles");
    expect(prompt).toContain("Do not invent company facts");
    expect(prompt).toContain('"selfCheck"');
    expect(prompt).toContain('"unsupportedCompanyFacts"');
    expect(prompt).toContain('"genericPhrases"');
    expect(prompt).toContain('"hasClearCTA"');
  });

  it("builds stream prompts without changing the plain-text contract", () => {
    const prompt = buildOpportunityCoverLetterStreamPrompt(input);

    expect(prompt).toContain("Output only the cover letter text");
    expect(prompt).toContain("Start directly with \"Dear Hiring Manager,\"");
    expect(prompt).toContain("Preserve supplied candidate evidence");
    expect(prompt).not.toContain("Return a JSON object");
  });
});
