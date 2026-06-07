import {
  analyzeResumeFit,
  extractKeywords,
  resumeToKeywordSearchText,
} from "@/lib/tailor/analyze";
import { groundClaims } from "@/lib/grounding";
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

/** The output claims (bullets + summary) to ground against the candidate's material. */
function outputClaims(output: GeneratorOutput): string[] {
  if (output.kind === "resume" && output.resume) {
    const r = output.resume;
    return [
      ...(r.summary ? [r.summary] : []),
      ...r.experiences.flatMap((e) => e.highlights),
    ];
  }
  return [];
}

/**
 * Grounding / anti-fabrication metric (AI Bank Authoring spec §3): the fraction of output
 * bullets traceable to the candidate's own material, with any ungrounded metric (a
 * fabricated number) called out. The deterministic base generator copies bullets verbatim
 * so it should score ~1.0; an LLM that invents content scores lower. Evidence = the
 * candidate profile (the user's real résumé text).
 */
export const groundingMetric: EvalMetric = (testCase, output) => {
  const claims = outputClaims(output);
  if (claims.length === 0) {
    return {
      name: "grounding",
      score: 1,
      details: { note: "no claims to ground" },
    };
  }
  const { supported, unsupported, ungroundedNumbers } = groundClaims(
    claims,
    testCase.candidateProfile,
  );
  const total = supported.length + unsupported.length;
  // A fabricated number is the worst failure — hard-cap the score when any appear.
  const base = total > 0 ? supported.length / total : 1;
  const score = ungroundedNumbers.length > 0 ? Math.min(base, 0.5) : base;
  return {
    name: "grounding",
    score: Number(score.toFixed(4)),
    details: {
      supported: supported.length,
      unsupported: unsupported.length,
      ungroundedNumbers,
    },
  };
};

export const DEFAULT_METRICS: EvalMetric[] = [
  keywordOverlapMetric,
  missingKeywordsMetric,
  lengthMetric,
  actionVerbMetric,
  groundingMetric,
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
