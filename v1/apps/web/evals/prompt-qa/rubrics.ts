import {
  PROMPT_QA_RUBRICS,
  type PromptQaCase,
  type PromptQaRubricKey,
  type PromptQaRubricScore,
  type PromptQaWorkflow,
} from "./types";

const ACTION_TERMS = [
  "next step",
  "suggest",
  "rewrite",
  "improve",
  "add",
  "STAR",
  "call-to-action",
  "ask",
  "quantify",
];

const STUDENT_TERMS = [
  "student",
  "intern",
  "early-career",
  "learn",
  "project",
  "honest",
  "entry",
  "gap",
];

const INFLATION_TERMS = [
  "senior",
  "principal",
  "staff engineer",
  "expert",
  "led a team of 20",
];

const WORKFLOW_WORD_LIMITS: Record<PromptQaWorkflow, number> = {
  resume_generation: 180,
  tailor_autofix: 160,
  cover_letter: 220,
  email: 140,
  interview: 120,
};

export function scorePromptQaCase(
  testCase: PromptQaCase,
): Record<PromptQaRubricKey, PromptQaRubricScore> {
  return Object.fromEntries(
    PROMPT_QA_RUBRICS.map((key) => [key, scoreDimension(testCase, key)]),
  ) as Record<PromptQaRubricKey, PromptQaRubricScore>;
}

function scoreDimension(
  testCase: PromptQaCase,
  key: PromptQaRubricKey,
): PromptQaRubricScore {
  const output = testCase.output;
  const normalized = output.toLowerCase();
  const fixture = testCase.fixture;

  if (key === "factuality") {
    const forbidden = fixture.forbiddenClaims.filter((claim) =>
      normalized.includes(claim.toLowerCase()),
    );
    const inflated = INFLATION_TERMS.filter((claim) =>
      normalized.includes(claim.toLowerCase()),
    );
    const penalty = forbidden.length * 0.35 + inflated.length * 0.2;
    const score = clamp(1 - penalty);
    return {
      key,
      score,
      details:
        forbidden.length || inflated.length
          ? `Unsupported claims: ${[...forbidden, ...inflated].join(", ")}`
          : "No forbidden or inflated claims found.",
    };
  }

  if (key === "evidenceUse") {
    const matches = fixture.expectedEvidence.filter((token) =>
      normalized.includes(token.toLowerCase()),
    );
    const score = matches.length / Math.max(1, fixture.expectedEvidence.length);
    return {
      key,
      score,
      details: matches.length
        ? `Used evidence: ${matches.join(", ")}`
        : "No expected evidence tokens found.",
    };
  }

  if (key === "jobFit") {
    const supported = fixture.supportedJobTerms.filter((term) =>
      normalized.includes(term.toLowerCase()),
    );
    const unsupported = fixture.forbiddenClaims.filter((term) =>
      normalized.includes(term.toLowerCase()),
    );
    const score = clamp(
      supported.length / Math.max(1, fixture.supportedJobTerms.length) -
        unsupported.length * 0.2,
    );
    return {
      key,
      score,
      details: supported.length
        ? `Relevant supported terms: ${supported.join(", ")}`
        : "Few supported job terms found.",
    };
  }

  if (key === "actionability") {
    const hits = ACTION_TERMS.filter((term) =>
      normalized.includes(term.toLowerCase()),
    );
    const score = clamp(hits.length / 2);
    return {
      key,
      score,
      details: hits.length
        ? `Action terms found: ${hits.join(", ")}`
        : "No concrete rewrite, next step, or improvement guidance found.",
    };
  }

  if (key === "concision") {
    const words = countWords(output);
    const limit = WORKFLOW_WORD_LIMITS[testCase.workflow];
    return {
      key,
      score: words <= limit ? 1 : clamp(1 - (words - limit) / limit),
      details: `${words} words; limit ${limit}.`,
    };
  }

  const studentHits = STUDENT_TERMS.filter((term) =>
    normalized.includes(term.toLowerCase()),
  );
  const inflationHits = INFLATION_TERMS.filter((term) =>
    normalized.includes(term.toLowerCase()),
  );
  return {
    key,
    score: clamp(studentHits.length / 2 - inflationHits.length * 0.25),
    details: studentHits.length
      ? `Student-useful framing: ${studentHits.join(", ")}`
      : "Little early-career or student-specific guidance found.",
  };
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function clamp(value: number): number {
  return Math.max(0, Math.min(1, Number(value.toFixed(2))));
}
