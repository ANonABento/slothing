import type { LLMConfig } from "@/types";
import { generateFromBank } from "@/lib/tailor/generate";
import { analyzeJobFit, resumeToKeywordSearchText } from "@/lib/tailor/analyze";
import {
  inferJobMetadata,
  profileToBankEntries,
  profileToContactInfo,
} from "../adapters.js";
import type { EvalCase, EvalGenerator, GeneratorOutput } from "../types.js";

export function createTailorGenerator(
  llmConfig: LLMConfig | null,
): EvalGenerator {
  return async (testCase: EvalCase): Promise<GeneratorOutput> => {
    const start = Date.now();
    try {
      const bankEntries = profileToBankEntries(testCase);
      const { jobTitle, company } = inferJobMetadata(testCase);
      const analysis = analyzeJobFit(testCase.jobDescription, bankEntries);
      const { resume } = await generateFromBank(
        {
          bankEntries,
          matchedEntries: analysis.matchedEntries,
          contact: profileToContactInfo(testCase),
          summary: testCase.candidateProfile.split("\n")[0]?.trim(),
          jobTitle,
          company,
          jobDescription: testCase.jobDescription,
          userId: "eval-user",
        },
        llmConfig,
      );

      return {
        kind: "resume",
        generator: "tailor",
        resume,
        rawText: resumeToKeywordSearchText(resume),
        latencyMs: Date.now() - start,
      };
    } catch (err) {
      return {
        kind: "resume",
        generator: "tailor",
        rawText: "",
        latencyMs: Date.now() - start,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  };
}
