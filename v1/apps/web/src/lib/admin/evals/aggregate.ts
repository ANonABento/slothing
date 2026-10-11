import { createHash } from "node:crypto";
import type { ComparisonReport, TestCaseResult } from "../../../../evals/types";
import type {
  EvalCaseRow,
  EvalDashboardPayload,
  EvalRunSummary,
  EvalSetOption,
  EvalTrends,
} from "./types";
import { estimateRunCostUsd } from "./cost";
import { nowDate, parseToDate, toIso } from "@/lib/format/time";

function round(value: number, digits = 3): number {
  return Number(value.toFixed(digits));
}

function dateKey(value: string): string {
  return value.slice(0, 10);
}

function evalSetKey(results: TestCaseResult[]): string {
  const ids = results.map((result) => result.testCaseId).sort();
  return createHash("sha256").update(ids.join(",")).digest("hex").slice(0, 8);
}

function averageScore(
  results: TestCaseResult[],
  model: "gpt55" | "claude",
): number | null {
  const scored = results.filter((result) => !result[model].error);
  if (scored.length === 0) return null;
  return round(
    scored.reduce((sum, result) => sum + result.judgeScores[model].score, 0) /
      scored.length,
    2,
  );
}

function labelForSet(index: number, size: number): string {
  return index === 0 ? `default-${size}` : `set-${index + 1}-${size}`;
}

function trendLabel(key: string): string {
  const [, month, day] = key.split("-");
  return `${month}/${day}`;
}

function buildTrends(runs: EvalRunSummary[]): EvalTrends {
  const buckets = new Map<
    string,
    {
      gptTotal: number;
      gptCount: number;
      claudeTotal: number;
      claudeCount: number;
      cost: number;
      runs: number;
    }
  >();

  for (const run of runs) {
    const key = dateKey(run.runAt);
    const bucket = buckets.get(key) ?? {
      gptTotal: 0,
      gptCount: 0,
      claudeTotal: 0,
      claudeCount: 0,
      cost: 0,
      runs: 0,
    };

    if (run.avgScoreGpt55 !== null) {
      bucket.gptTotal += run.avgScoreGpt55;
      bucket.gptCount += 1;
    }
    if (run.avgScoreClaude !== null) {
      bucket.claudeTotal += run.avgScoreClaude;
      bucket.claudeCount += 1;
    }
    bucket.cost += run.estimatedCostUsd;
    bucket.runs += 1;
    buckets.set(key, bucket);
  }

  const keys = Array.from(buckets.keys()).sort();
  return {
    avgScoreGpt55: keys.map((key) => {
      const bucket = buckets.get(key)!;
      return {
        date: key,
        label: trendLabel(key),
        value: bucket.gptCount
          ? round(bucket.gptTotal / bucket.gptCount, 2)
          : 0,
      };
    }),
    avgScoreClaude: keys.map((key) => {
      const bucket = buckets.get(key)!;
      return {
        date: key,
        label: trendLabel(key),
        value: bucket.claudeCount
          ? round(bucket.claudeTotal / bucket.claudeCount, 2)
          : 0,
      };
    }),
    cost: keys.map((key) => {
      const bucket = buckets.get(key)!;
      return {
        date: key,
        label: trendLabel(key),
        value: round(bucket.cost, 4),
      };
    }),
    runs: keys.map((key) => {
      const bucket = buckets.get(key)!;
      return { date: key, label: trendLabel(key), value: bucket.runs };
    }),
  };
}

export function buildDashboardPayload(
  reports: ComparisonReport[],
  {
    now = nowDate(),
    source = "reports",
  }: { now?: Date; source?: "sample" | "reports" } = {},
): EvalDashboardPayload {
  const sortedReports = [...reports].sort(
    (a, b) =>
      (parseToDate(b.runAt)?.getTime() ?? 0) -
      (parseToDate(a.runAt)?.getTime() ?? 0),
  );
  const setLabels = new Map<string, string>();
  const setSizes = new Map<string, number>();

  for (const report of sortedReports) {
    const key = evalSetKey(report.results);
    if (!setLabels.has(key)) {
      const size = new Set(report.results.map((result) => result.testCaseId))
        .size;
      setSizes.set(key, size);
      setLabels.set(key, labelForSet(setLabels.size, size));
    }
  }

  const runs: EvalRunSummary[] = sortedReports.map((report, index) => {
    const key = evalSetKey(report.results);
    const cost = estimateRunCostUsd(report);
    return {
      id: `${report.runAt}-${index}`,
      runAt: report.runAt,
      evalSetKey: key,
      evalSetLabel: setLabels.get(key) ?? "default",
      totalCases: report.totalCases,
      successfulCases: report.successfulCases,
      generatorModels: report.generatorModels,
      judgeModel: report.judgeModel,
      avgScoreGpt55: averageScore(report.results, "gpt55"),
      avgScoreClaude: averageScore(report.results, "claude"),
      gpt55Wins: report.summary.gpt55Wins,
      claudeWins: report.summary.claudeWins,
      ties: report.summary.ties,
      errorCount: report.summary.errorCount,
      estimatedCostUsd: round(cost.totalUsd, 4),
      caseIds: report.results.map((result) => result.testCaseId),
    };
  });

  const cases: EvalCaseRow[] = sortedReports.flatMap((report, reportIndex) => {
    const run = runs[reportIndex];
    return report.results.map((result) => ({
      id: `${run.id}-${result.testCaseId}`,
      runId: run.id,
      evalSetKey: run.evalSetKey,
      testCaseId: result.testCaseId,
      testCaseLabel: result.testCaseLabel,
      winner: result.winner,
      gpt55: {
        model: result.gpt55.model,
        score: result.gpt55.error ? null : result.judgeScores.gpt55.score,
        output: result.gpt55.output,
        latencyMs: result.gpt55.latencyMs,
        error: result.gpt55.error,
        reasoning: result.judgeScores.gpt55.reasoning,
        strengths: result.judgeScores.gpt55.strengths,
        weaknesses: result.judgeScores.gpt55.weaknesses,
      },
      claude: {
        model: result.claude.model,
        score: result.claude.error ? null : result.judgeScores.claude.score,
        output: result.claude.output,
        latencyMs: result.claude.latencyMs,
        error: result.claude.error,
        reasoning: result.judgeScores.claude.reasoning,
        strengths: result.judgeScores.claude.strengths,
        weaknesses: result.judgeScores.claude.weaknesses,
      },
    }));
  });

  const evalSets: EvalSetOption[] = Array.from(setLabels.entries()).map(
    ([key, label]) => ({ key, label, size: setSizes.get(key) ?? 0 }),
  );

  return {
    source,
    generatedAt: toIso(now),
    range: "30d",
    runs,
    cases,
    trends: buildTrends(runs),
    evalSets,
  };
}
