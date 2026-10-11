import type { LLMConfig } from "@/types";
import { generateCoverLetter } from "@/lib/cover-letter/generate";
import {
  inferJobMetadata,
  profileToBankEntries,
  profileToContactInfo,
} from "../adapters.js";
import type { EvalCase, EvalGenerator, GeneratorOutput } from "../types.js";

function fallbackCoverLetter(testCase: EvalCase): string {
  const { jobTitle, company } = inferJobMetadata(testCase);
  return `Dear ${company} team,

I am excited to apply for the ${jobTitle} role. My background includes ${testCase.candidateProfile}

The job description emphasizes ${testCase.jobDescription}. I would bring a practical, results-oriented approach to those needs and focus on shipping useful work with clear communication.

Thank you for your consideration.`;
}

export function createCoverLetterGenerator(
  llmConfig: LLMConfig | null,
): EvalGenerator {
  return async (testCase: EvalCase): Promise<GeneratorOutput> => {
    const start = Date.now();
    try {
      const { jobTitle, company } = inferJobMetadata(testCase);
      const contact = profileToContactInfo(testCase);
      const text = llmConfig
        ? await generateCoverLetter(
            {
              jobDescription: testCase.jobDescription,
              jobTitle,
              company,
              bankEntries: profileToBankEntries(testCase),
              userName: contact.name,
            },
            llmConfig,
          )
        : fallbackCoverLetter(testCase);

      return {
        kind: "coverLetter",
        generator: "cover-letter",
        text,
        latencyMs: Date.now() - start,
      };
    } catch (err) {
      return {
        kind: "coverLetter",
        generator: "cover-letter",
        text: "",
        latencyMs: Date.now() - start,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  };
}
