import { describe, expect, it, vi } from "vitest";
import type { TailoredResume } from "@/lib/resume/generator";
import { createCoverLetterGenerator } from "../generators/cover-letter-generator.js";
import { createTailorGenerator } from "../generators/tailor-generator.js";
import type { EvalCase } from "../types.js";

const { mockGenerateFromBank, mockGenerateCoverLetter } = vi.hoisted(() => ({
  mockGenerateFromBank: vi.fn(),
  mockGenerateCoverLetter: vi.fn(),
}));

vi.mock("@/lib/tailor/generate", () => ({
  generateFromBank: mockGenerateFromBank,
}));

vi.mock("@/lib/cover-letter/generate", () => ({
  generateCoverLetter: mockGenerateCoverLetter,
}));

const TEST_CASE: EvalCase = {
  id: "tc-gen",
  label: "Generator",
  candidateProfile: "React engineer",
  jobDescription: "Frontend Engineer at Acme\nReact TypeScript role.",
};

const RESUME: TailoredResume = {
  contact: { name: "Eval Candidate" },
  summary: "React engineer.",
  experiences: [
    {
      company: "Acme",
      title: "Engineer",
      dates: "2024",
      highlights: ["Built React systems"],
    },
  ],
  skills: ["React", "TypeScript"],
  education: [],
};

describe("generator wrappers", () => {
  it("wraps generateFromBank for resume evals", async () => {
    mockGenerateFromBank.mockResolvedValueOnce({
      resume: RESUME,
      promptVariantId: null,
    });

    const result = await createTailorGenerator(null)(TEST_CASE);

    expect(mockGenerateFromBank).toHaveBeenCalled();
    expect(result.kind).toBe("resume");
    expect(result.generator).toBe("tailor");
    if (result.kind === "resume") {
      expect(result.rawText).toContain("react");
    }
  });

  it("wraps generateCoverLetter for cover-letter evals", async () => {
    mockGenerateCoverLetter.mockResolvedValueOnce("Dear Acme, I built React apps.");

    const result = await createCoverLetterGenerator({
      provider: "openai",
      apiKey: "test",
      model: "gpt-test",
    })(TEST_CASE);

    expect(mockGenerateCoverLetter).toHaveBeenCalled();
    expect(result.kind).toBe("coverLetter");
    expect(result.generator).toBe("cover-letter");
    if (result.kind === "coverLetter") {
      expect(result.text).toContain("React");
    }
  });
});
