import {
  analyzeResumeFit,
  extractKeywords,
  resumeToKeywordSearchText,
} from "@/lib/tailor/analyze";
import type {
  EvalCase,
  EvalMetric,
  GeneratorOutput,
  MetricScore,
} from "../types.js";
import { ACTION_VERBS } from "./action-verbs.js";

function outputText(output: GeneratorOutput): string {
  if (output.kind === "resume") {
    return output.resume
      ? resumeToKeywordSearchText(output.resume)
      : output.rawText;
  }
  return output.text;
}

function keywordsFor(testCase: EvalCase): string[] {
  return testCase.expectedKeywords?.length
    ? testCase.expectedKeywords
    : extractKeywords(testCase.jobDescription);
}

export const keywordOverlapMetric: EvalMetric = (testCase, output) => {
  const keywords = keywordsFor(testCase);
  if (output.kind === "resume" && output.resume) {
    const analysis = analyzeResumeFit(
      testCase.jobDescription,
      output.resume,
      keywords,
    );
    return {
      name: "keyword_overlap",
      score: analysis.matchScore / 100,
      details: {
        matched: analysis.keywordsFound,
        missing: analysis.keywordsMissing,
      },
    };
  }

  const text = outputText(output).toLowerCase();
  const matched = keywords.filter((keyword) =>
    text.includes(keyword.toLowerCase()),
  );
  const missing = keywords.filter(
    (keyword) => !text.includes(keyword.toLowerCase()),
  );

  return {
    name: "keyword_overlap",
    score: keywords.length > 0 ? matched.length / keywords.length : 0,
    details:
      keywords.length > 0 ? { matched, missing } : { note: "no keywords" },
  };
};

export const missingKeywordsMetric: EvalMetric = (testCase, output) => {
  const keywordScore = keywordOverlapMetric(testCase, output);
  const missing = Array.isArray(keywordScore.details?.missing)
    ? keywordScore.details.missing
    : [];
  const total = keywordsFor(testCase).length;
  return {
    name: "missing_keywords",
    score: total > 0 ? 1 - missing.length / total : 0,
    details: { count: missing.length, missing },
  };
};

export const lengthMetric: EvalMetric = (_testCase, output) => {
  const words = outputText(output).trim().split(/\s+/).filter(Boolean).length;
  const min = output.kind === "resume" ? 150 : 150;
  const max = output.kind === "resume" ? 600 : 400;
  const score = words < min ? words / min : words > max ? max / words : 1;
  return {
    name: "length",
    score: Number(Math.max(0, Math.min(1, score)).toFixed(4)),
    details: { words, min, max, pass: words >= min && words <= max },
  };
};

export const actionVerbMetric: EvalMetric = (_testCase, output) => {
  const text = outputText(output).toLowerCase();
  const matched = ACTION_VERBS.filter((verb) =>
    new RegExp(`\\b${verb}\\b`, "i").test(text),
  );
  const words = Math.max(1, text.split(/\s+/).filter(Boolean).length);
  const score = Math.min(
    1,
    matched.length / Math.max(3, Math.ceil(words / 120)),
  );
  return {
    name: "action_verbs",
    score: Number(score.toFixed(4)),
    details: { count: matched.length, matched },
  };
};

export const errorMetric: EvalMetric = (_testCase, output) => ({
  name: "error",
  score: output.error ? 1 : 0,
  details: output.error ? { message: output.error } : { message: null },
});

export const DEFAULT_METRICS: EvalMetric[] = [
  keywordOverlapMetric,
  missingKeywordsMetric,
  lengthMetric,
  actionVerbMetric,
  errorMetric,
];

export function runMetrics(
  testCase: EvalCase,
  output: GeneratorOutput,
  metrics: EvalMetric[] = DEFAULT_METRICS,
): MetricScore[] {
  return metrics.map((metric) => {
    try {
      const result = metric(testCase, output);
      return {
        ...result,
        score: Number.isFinite(result.score)
          ? Number(Math.max(0, Math.min(1, result.score)).toFixed(4))
          : 0,
      };
    } catch (err) {
      return {
        name: metric.name || "metric",
        score: 0,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  });
}
