import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import type { ComparisonReport } from "../../../../evals/types";
import { parseToDate } from "@/lib/format/time";

export const EVALS_REPORTS_DIR = path.join(process.cwd(), "evals", "reports");

const generatorResultSchema = z.object({
  model: z.string(),
  provider: z.enum(["openai", "anthropic"]),
  output: z.string(),
  latencyMs: z.number(),
  error: z.string().optional(),
});

const judgeScoreSchema = z.object({
  model: z.string(),
  score: z.number(),
  reasoning: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
});

export const comparisonReportSchema = z.object({
  runAt: z.string(),
  generatorModels: z.object({ gpt55: z.string(), claude: z.string() }),
  judgeModel: z.string(),
  totalCases: z.number(),
  successfulCases: z.number(),
  results: z.array(
    z.object({
      testCaseId: z.string(),
      testCaseLabel: z.string(),
      gpt55: generatorResultSchema,
      claude: generatorResultSchema,
      judgeScores: z.object({
        gpt55: judgeScoreSchema,
        claude: judgeScoreSchema,
      }),
      winner: z.enum(["gpt55", "claude", "tie"]),
    }),
  ),
  summary: z.object({
    gpt55Wins: z.number(),
    claudeWins: z.number(),
    ties: z.number(),
    avgScoreGpt55: z.number(),
    avgScoreClaude: z.number(),
    errorCount: z.number(),
  }),
}) satisfies z.ZodType<ComparisonReport>;

export type ParsedComparisonReport = z.infer<typeof comparisonReportSchema>;

export function loadComparisonReports(
  dir = EVALS_REPORTS_DIR,
): ComparisonReport[] {
  let filenames: string[];
  try {
    filenames = fs
      .readdirSync(dir)
      .filter((file) => /^comparison-.*\.json$/.test(file));
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return [];
    }
    throw error;
  }

  const reports: ComparisonReport[] = [];

  for (const filename of filenames) {
    const fullPath = path.join(dir, filename);
    try {
      const parsed = JSON.parse(fs.readFileSync(fullPath, "utf8"));
      reports.push(comparisonReportSchema.parse(parsed));
    } catch (error) {
      console.warn(`Skipping invalid eval report ${filename}`, error);
    }
  }

  return reports.sort(
    (a, b) =>
      (parseToDate(b.runAt)?.getTime() ?? 0) -
      (parseToDate(a.runAt)?.getTime() ?? 0),
  );
}
