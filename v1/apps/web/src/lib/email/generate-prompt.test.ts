import { describe, expect, it } from "vitest";
import { buildEmailGenerationPrompt } from "./generate-prompt";

describe("email generation prompt", () => {
  it("requires evidence-first email structure and self-check JSON", () => {
    const prompt = buildEmailGenerationPrompt({
      templateTitle: "Cold Outreach",
      profileSummary: "Name: Ada\nCurrent Role: Student",
      jobSummary: "Position: Intern\nCompany: Acme",
      additionalContext: "Cold Outreach Hook: Met at demo day",
      templateGuidelines: "- Stay humble",
    });

    expect(prompt).toContain("Lead with one concrete candidate/context evidence point");
    expect(prompt).toContain("one recipient, company, job, or relationship reason");
    expect(prompt).toContain("Do not invent company facts");
    expect(prompt).toContain("under 200 words");
    expect(prompt).toContain("clear call to action");
    expect(prompt).toContain('"selfCheck"');
    expect(prompt).toContain('"matchedReason"');
    expect(prompt).toContain('"unsupportedFacts"');
  });
});
