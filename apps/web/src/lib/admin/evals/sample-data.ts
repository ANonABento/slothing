import type { ComparisonReport, TestCaseResult } from "../../../../evals/types";

const MODELS = {
  gpt55: "gpt-5.5",
  claude: "claude-sonnet-4-6",
  judge: "claude-opus-4-7",
} as const;

function caseResult({
  run,
  id,
  label,
  gptScore,
  claudeScore,
  winner,
  gptOutput,
  claudeOutput,
  gptError,
}: {
  run: number;
  id: string;
  label: string;
  gptScore: number;
  claudeScore: number;
  winner: "gpt55" | "claude" | "tie";
  gptOutput: string;
  claudeOutput: string;
  gptError?: string;
}): TestCaseResult {
  return {
    testCaseId: id,
    testCaseLabel: label,
    gpt55: {
      model: MODELS.gpt55,
      provider: "openai" as const,
      output: gptError ? "" : gptOutput,
      latencyMs: 7_400 + run * 500,
      ...(gptError ? { error: gptError } : {}),
    },
    claude: {
      model: MODELS.claude,
      provider: "anthropic" as const,
      output: claudeOutput,
      latencyMs: 8_900 + run * 420,
    },
    judgeScores: {
      gpt55: {
        model: MODELS.gpt55,
        score: gptScore,
        reasoning:
          gptScore >= claudeScore
            ? "Strong alignment with role requirements and concise achievement framing."
            : "Useful structure, but it missed a few role-specific keywords and examples.",
        strengths: ["Clear summary", "Metric-led bullets"],
        weaknesses: gptError ? ["Generation failed"] : ["Could be more specific"],
      },
      claude: {
        model: MODELS.claude,
        score: claudeScore,
        reasoning:
          claudeScore >= gptScore
            ? "The output mapped experience to the role with grounded, scannable bullets."
            : "Solid coverage, though the framing was a little generic in places.",
        strengths: ["Role-aware language", "Good ATS vocabulary"],
        weaknesses: ["Some bullets need sharper outcomes"],
      },
    },
    winner,
  };
}

function report(
  runAt: string,
  run: number,
  scores: Array<[number, number, "gpt55" | "claude" | "tie"]>,
): ComparisonReport {
  const labels = [
    ["tc-001", "Junior SWE -> Frontend role at startup"],
    ["tc-003", "Data Analyst -> Data Scientist at tech company"],
    ["tc-004", "Product Manager -> Senior PM at FAANG"],
    ["tc-007", "Recent CS grad -> Backend Engineer"],
  ] as const;

  const results = labels.map(([id, label], index) =>
    caseResult({
      run,
      id,
      label,
      gptScore: scores[index][0],
      claudeScore: scores[index][1],
      winner: scores[index][2],
      gptOutput: `${label}: GPT-5.5 tailored the resume around measurable delivery, ownership, and exact job keywords for sample run ${run}.`,
      claudeOutput: `${label}: Claude emphasized transferable scope, stakeholder context, and concise bullets for sample run ${run}.`,
      gptError: run === 2 && index === 2 ? "Rate limit during sample run" : undefined,
    }),
  );

  const successfulResults = results.filter(
    (result) => !result.gpt55.error && !result.claude.error,
  );

  return {
    runAt,
    generatorModels: { gpt55: MODELS.gpt55, claude: MODELS.claude },
    judgeModel: MODELS.judge,
    totalCases: results.length,
    successfulCases: successfulResults.length,
    results,
    summary: {
      gpt55Wins: results.filter((result) => result.winner === "gpt55").length,
      claudeWins: results.filter((result) => result.winner === "claude").length,
      ties: results.filter((result) => result.winner === "tie").length,
      avgScoreGpt55:
        successfulResults.reduce(
          (sum, result) => sum + result.judgeScores.gpt55.score,
          0,
        ) / Math.max(successfulResults.length, 1),
      avgScoreClaude:
        successfulResults.reduce(
          (sum, result) => sum + result.judgeScores.claude.score,
          0,
        ) / Math.max(successfulResults.length, 1),
      errorCount: results.length - successfulResults.length,
    },
  };
}

export const SAMPLE_COMPARISON_REPORTS: ComparisonReport[] = [
  report("2026-05-07T14:12:00.000Z", 4, [
    [4.7, 4.5, "gpt55"],
    [4.2, 4.4, "claude"],
    [4.6, 4.6, "tie"],
    [4.5, 4.1, "gpt55"],
  ]),
  report("2026-04-26T19:30:00.000Z", 3, [
    [4.4, 4.2, "gpt55"],
    [4.0, 4.3, "claude"],
    [4.1, 4.0, "gpt55"],
    [4.2, 4.2, "tie"],
  ]),
  report("2026-04-15T11:05:00.000Z", 2, [
    [4.1, 4.3, "claude"],
    [3.9, 4.0, "claude"],
    [0, 4.1, "claude"],
    [4.0, 3.8, "gpt55"],
  ]),
  report("2026-04-02T16:45:00.000Z", 1, [
    [3.8, 3.7, "gpt55"],
    [3.9, 4.1, "claude"],
    [4.0, 3.9, "gpt55"],
    [3.7, 3.7, "tie"],
  ]),
];
