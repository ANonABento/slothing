import { describe, expect, it } from "vitest";
import { EMAIL_TEMPLATE_INFO } from "@/lib/email/templates";
import { PROMPT_QA_FIXTURES } from "../../../evals/prompt-qa/fixtures";
import {
  buildEmailGenerationPrompt,
  getTemplateGuidelines,
} from "./prompt-builders";

describe("email prompt builders", () => {
  it("includes candidate, job, context, JSON shape, and template guidance", () => {
    const fixture = PROMPT_QA_FIXTURES[1];
    const prompt = buildEmailGenerationPrompt({
      templateInfo: EMAIL_TEMPLATE_INFO.cold_outreach,
      profile: fixture.profile,
      job: fixture.job,
      contextParams: fixture.emailContext,
      type: "cold_outreach",
    });

    expect(prompt).toContain("Maya Brooks");
    expect(prompt).toContain("Campus Tech");
    expect(prompt).toContain("Cold Outreach Hook");
    expect(prompt).toContain('"subject"');
    expect(prompt).toContain("do not sound salesy");
  });

  it("selects recruiter not-a-fit guidance", () => {
    expect(getTemplateGuidelines("recruiter_reply", "not_a_fit")).toContain(
      "politely decline",
    );
  });
});
