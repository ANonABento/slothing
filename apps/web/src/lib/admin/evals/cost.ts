import type { ComparisonReport, TestCase } from "../../../../evals/types";
import { TEST_CASES } from "../../../../evals/test-cases";
import { buildJudgePrompt } from "../../../../evals/judge";
import { buildTailoringPrompt } from "../../../../evals/generators";

interface ModelPricing {
  inputUsdPerMillion: number;
  outputUsdPerMillion: number;
}

export const MODEL_PRICING: Record<string, ModelPricing> = {
  "gpt-5.5": { inputUsdPerMillion: 5, outputUsdPerMillion: 15 },
  "claude-sonnet-4-6": { inputUsdPerMillion: 3, outputUsdPerMillion: 15 },
  "claude-opus-4-7": { inputUsdPerMillion: 15, outputUsdPerMillion: 75 },
};

const TEST_CASE_BY_ID = new Map(TEST_CASES.map((testCase) => [testCase.id, testCase]));

export function estimateTokens(chars: number): number {
  return Math.ceil(Math.max(chars, 0) / 4);
}

function estimateModelCostUsd({
  model,
  inputChars,
  outputChars,
}: {
  model: string;
  inputChars: number;
  outputChars: number;
}): number {
  const pricing = MODEL_PRICING[model];
  if (!pricing) return 0;

  return (
    (estimateTokens(inputChars) / 1_000_000) * pricing.inputUsdPerMillion +
    (estimateTokens(outputChars) / 1_000_000) * pricing.outputUsdPerMillion
  );
}

function fallbackTestCase(report: ComparisonReport, testCaseId: string): TestCase {
  const result = report.results.find((item) => item.testCaseId === testCaseId);
  return {
    id: testCaseId,
    label: result?.testCaseLabel ?? testCaseId,
    candidateProfile: "",
    jobDescription: "",
  };
}

export function estimateRunCostUsd(report: ComparisonReport): {
  totalUsd: number;
  byModel: { gpt55Usd: number; claudeUsd: number; judgeUsd: number };
} {
  let gpt55Usd = 0;
  let claudeUsd = 0;
  let judgeUsd = 0;

  for (const result of report.results) {
    const testCase =
      TEST_CASE_BY_ID.get(result.testCaseId) ?? fallbackTestCase(report, result.testCaseId);
    const generatorPromptChars = buildTailoringPrompt(testCase).length;

    gpt55Usd += estimateModelCostUsd({
      model: result.gpt55.model,
      inputChars: generatorPromptChars,
      outputChars: result.gpt55.output.length,
    });
    claudeUsd += estimateModelCostUsd({
      model: result.claude.model,
      inputChars: generatorPromptChars,
      outputChars: result.claude.output.length,
    });
    judgeUsd += estimateModelCostUsd({
      model: report.judgeModel,
      inputChars: buildJudgePrompt(testCase, result.gpt55, result.claude).length,
      outputChars:
        result.judgeScores.gpt55.reasoning.length +
        result.judgeScores.claude.reasoning.length +
        result.judgeScores.gpt55.strengths.join(" ").length +
        result.judgeScores.claude.strengths.join(" ").length +
        result.judgeScores.gpt55.weaknesses.join(" ").length +
        result.judgeScores.claude.weaknesses.join(" ").length,
    });
  }

  return {
    totalUsd: gpt55Usd + claudeUsd + judgeUsd,
    byModel: { gpt55Usd, claudeUsd, judgeUsd },
  };
}
