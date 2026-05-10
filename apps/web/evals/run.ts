import type {
  EvalCase,
  EvalGenerator,
  EvalMetric,
  EvalMode,
  EvalRunReport,
  JudgeScore,
} from "./types.js";
import { runMetrics, DEFAULT_METRICS } from "./metrics/index.js";
import { aggregateMetrics } from "./metrics/aggregate.js";

interface RunEvalOptions {
  cases: EvalCase[];
  mode: EvalMode;
  generatorName: string;
  generator: EvalGenerator;
  metrics?: EvalMetric[];
  judge?: (testCase: EvalCase, output: Awaited<ReturnType<EvalGenerator>>) => Promise<JudgeScore | undefined>;
}

function summarize(cases: EvalRunReport["cases"]): EvalRunReport["summary"] {
  const metricNames = Array.from(
    new Set(cases.flatMap((result) => result.metrics.map((metric) => metric.name))),
  );

  const avgScoreByMetric: Record<string, number> = {};
  for (const metricName of metricNames) {
    const scores = cases
      .flatMap((result) => result.metrics)
      .filter((metric) => metric.name === metricName)
      .map((metric) => metric.score);
    avgScoreByMetric[metricName] =
      scores.length > 0
        ? Number((scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(4))
        : 0;
  }

  const avgOverallScore =
    cases.length > 0
      ? Number(
          (
            cases.reduce((sum, result) => sum + result.overallScore, 0) /
            cases.length
          ).toFixed(4),
        )
      : 0;

  return {
    totalCases: cases.length,
    errorCount: cases.filter((result) => result.error).length,
    avgOverallScore,
    avgScoreByMetric,
  };
}

export async function runEval(options: RunEvalOptions): Promise<EvalRunReport> {
  const caseResults: EvalRunReport["cases"] = [];

  for (const testCase of options.cases) {
    const output = await options.generator(testCase);
    const metrics = runMetrics(testCase, output, options.metrics ?? DEFAULT_METRICS);
    const overallScore = aggregateMetrics(metrics);
    const judgeScore = options.judge
      ? await options.judge(testCase, output)
      : undefined;

    caseResults.push({
      caseId: testCase.id,
      caseLabel: testCase.label,
      mode: options.mode,
      generator: output.generator || options.generatorName,
      output,
      metrics,
      overallScore,
      judgeScore,
      error: output.error,
    });
  }

  return {
    runAt: new Date().toISOString(),
    mode: options.mode,
    generator: options.generatorName,
    judgeEnabled: Boolean(options.judge),
    judge: options.judge ? "enabled" : "disabled",
    cases: caseResults,
    summary: summarize(caseResults),
  };
}
