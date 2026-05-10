import { countFillerWords, type FillerWordMatch } from "./filler-words";
import {
  detectStarCoverage,
  type StarCoverage,
  type StarDimension,
} from "./star-detector";
import type {
  InterviewQuestion,
  InterviewQuestionCategory,
} from "@/types/interview";

export type InterviewFeedbackRating = "green" | "yellow" | "red";

export interface InterviewFeedbackMetric {
  id: "fillers" | "star" | "quantification" | "length" | "pace";
  label: string;
  value: string;
  detail: string;
  rating: InterviewFeedbackRating;
  score: number;
}

export interface InterviewAnswerScorecard {
  answer: string;
  category: InterviewQuestionCategory;
  wordCount: number;
  durationSeconds: number;
  durationEstimated: boolean;
  filler: {
    count: number;
    matches: FillerWordMatch[];
    rating: InterviewFeedbackRating;
  };
  star: StarCoverage & {
    rating: InterviewFeedbackRating;
  };
  quantification: {
    count: number;
    rating: InterviewFeedbackRating;
  };
  length: {
    targetMinSeconds: number;
    targetMaxSeconds: number;
    seconds: number;
    estimated: boolean;
    rating: InterviewFeedbackRating;
  };
  pace: {
    wordsPerMinute: number;
    estimated: boolean;
    rating: InterviewFeedbackRating;
  };
  metrics: InterviewFeedbackMetric[];
  overallRating: InterviewFeedbackRating;
  topSuggestion: string;
}

export interface InterviewSessionFeedbackSummary {
  scorecards: InterviewAnswerScorecard[];
  answeredCount: number;
  overallRating: InterviewFeedbackRating;
  averageFillerCount: number;
  averageStarCoverage: number;
  totalQuantificationCount: number;
  averagePaceWordsPerMinute: number;
  lengthHealthPercent: number;
  paceHealthPercent: number;
  focusAreas: string[];
}

export interface AnalyzeInterviewAnswerInput {
  answer: string;
  category: InterviewQuestionCategory;
  durationSeconds?: number;
}

export interface SummarizeInterviewFeedbackInput {
  questions: InterviewQuestion[];
  answers: string[];
  skipped?: boolean[];
}

interface AnswerSubstance {
  hasStorySignal: boolean;
  isVagueShortAnswer: boolean;
  looksLikeToolList: boolean;
  shouldGateOverall: boolean;
}

const TARGET_WPM = 140;
const PACE_TARGET = {
  min: 130,
  max: 150,
  yellowMin: 110,
  yellowMax: 170,
};

const LENGTH_TARGETS: Record<
  InterviewQuestionCategory,
  { min: number; max: number }
> = {
  behavioral: { min: 60, max: 90 },
  technical: { min: 90, max: 180 },
  situational: { min: 60, max: 90 },
  general: { min: 60, max: 90 },
  "cultural-fit": { min: 60, max: 90 },
};

const NUMBER_WORDS = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "dozen",
] as const;

const STORY_CATEGORIES = new Set<InterviewQuestionCategory>([
  "behavioral",
  "situational",
  "general",
  "cultural-fit",
]);

const TOOL_TERMS = [
  "react",
  "typescript",
  "javascript",
  "tailwind",
  "prisma",
  "postgres",
  "postgresql",
  "docker",
  "aws",
  "github",
  "actions",
  "next",
  "next.js",
  "node",
  "python",
  "kubernetes",
  "terraform",
  "graphql",
  "redux",
  "vercel",
  "supabase",
  "sql",
] as const;

export function analyzeInterviewAnswer({
  answer,
  category,
  durationSeconds,
}: AnalyzeInterviewAnswerInput): InterviewAnswerScorecard {
  const cleanedAnswer = answer.trim();
  const wordCount = countWords(cleanedAnswer);
  const target = LENGTH_TARGETS[category];
  const estimatedDurationSeconds =
    wordCount > 0 ? Math.round((wordCount / TARGET_WPM) * 60) : 0;
  const effectiveDurationSeconds =
    durationSeconds && durationSeconds > 0
      ? durationSeconds
      : estimatedDurationSeconds;
  const durationEstimated = !durationSeconds || durationSeconds <= 0;
  const filler = countFillerWords(cleanedAnswer);
  const star = detectStarCoverage(cleanedAnswer);
  const quantificationCount = countQuantifications(cleanedAnswer);
  const substance = classifyAnswerSubstance(
    cleanedAnswer,
    category,
    star,
    quantificationCount,
    wordCount,
  );
  const fillerRating = rateFillerCount(filler.total);
  const starRating = rateStarCoverage(star.score);
  const quantificationRating = rateQuantificationCount(quantificationCount);
  const lengthRating = rateLength(effectiveDurationSeconds, target);
  const paceWordsPerMinute =
    effectiveDurationSeconds > 0
      ? Math.round((wordCount / effectiveDurationSeconds) * 60)
      : 0;
  const paceRating = ratePace(paceWordsPerMinute);
  const metricRatings = [
    fillerRating,
    starRating,
    quantificationRating,
    lengthRating,
    paceRating,
  ];
  const overallRating = substance.shouldGateOverall
    ? "red"
    : summarizeRatings(metricRatings);

  const scorecardBase = {
    answer: cleanedAnswer,
    category,
    wordCount,
    durationSeconds: effectiveDurationSeconds,
    durationEstimated,
    filler: {
      count: filler.total,
      matches: filler.matches,
      rating: fillerRating,
    },
    star: {
      ...star,
      rating: starRating,
    },
    quantification: {
      count: quantificationCount,
      rating: quantificationRating,
    },
    length: {
      targetMinSeconds: target.min,
      targetMaxSeconds: target.max,
      seconds: effectiveDurationSeconds,
      estimated: durationEstimated,
      rating: lengthRating,
    },
    pace: {
      wordsPerMinute: paceWordsPerMinute,
      estimated: durationEstimated,
      rating: paceRating,
    },
    overallRating,
  };

  const topSuggestion = chooseTopSuggestion(scorecardBase, substance);

  return {
    ...scorecardBase,
    topSuggestion,
    metrics: buildMetrics({ ...scorecardBase, topSuggestion }),
  };
}

export function summarizeInterviewFeedback({
  questions,
  answers,
  skipped = [],
}: SummarizeInterviewFeedbackInput): InterviewSessionFeedbackSummary {
  const scorecards = questions.flatMap((question, index) => {
    const answer = answers[index]?.trim() ?? "";

    if (!answer || answer === "[skipped]" || skipped[index]) {
      return [];
    }

    return [
      analyzeInterviewAnswer({
        answer,
        category: question.category,
      }),
    ];
  });
  const answeredCount = scorecards.length;

  if (answeredCount === 0) {
    return {
      scorecards: [],
      answeredCount: 0,
      overallRating: "red",
      averageFillerCount: 0,
      averageStarCoverage: 0,
      totalQuantificationCount: 0,
      averagePaceWordsPerMinute: 0,
      lengthHealthPercent: 0,
      paceHealthPercent: 0,
      focusAreas: [],
    };
  }

  const averageFillerCount = average(
    scorecards.map((scorecard) => scorecard.filler.count),
  );
  const averageStarCoverage = average(
    scorecards.map((scorecard) => scorecard.star.score),
  );
  const totalQuantificationCount = scorecards.reduce(
    (sum, scorecard) => sum + scorecard.quantification.count,
    0,
  );
  const averagePaceWordsPerMinute = average(
    scorecards.map((scorecard) => scorecard.pace.wordsPerMinute),
  );
  const lengthHealthPercent = percentRatedGreen(
    scorecards.map((scorecard) => scorecard.length.rating),
  );
  const paceHealthPercent = percentRatedGreen(
    scorecards.map((scorecard) => scorecard.pace.rating),
  );

  return {
    scorecards,
    answeredCount,
    overallRating: summarizeRatings(
      scorecards.map((scorecard) => scorecard.overallRating),
    ),
    averageFillerCount,
    averageStarCoverage,
    totalQuantificationCount,
    averagePaceWordsPerMinute,
    lengthHealthPercent,
    paceHealthPercent,
    focusAreas: summarizeFocusAreas(scorecards),
  };
}

function buildMetrics(
  scorecard: Omit<InterviewAnswerScorecard, "metrics">,
): InterviewFeedbackMetric[] {
  return [
    {
      id: "fillers",
      label: "Filler words",
      value: String(scorecard.filler.count),
      detail:
        scorecard.filler.count === 0
          ? "No filler phrases detected"
          : topFillerMatches(scorecard.filler.matches),
      rating: scorecard.filler.rating,
      score: scorecard.filler.count,
    },
    {
      id: "star",
      label: "STAR coverage",
      value: `${scorecard.star.score}/4`,
      detail:
        scorecard.star.missing.length === 0
          ? "Situation, Task, Action, and Result are covered"
          : `Missing ${formatDimensions(scorecard.star.missing)}`,
      rating: scorecard.star.rating,
      score: scorecard.star.score,
    },
    {
      id: "quantification",
      label: "Quantification",
      value: String(scorecard.quantification.count),
      detail:
        scorecard.quantification.count === 0
          ? "Add numbers, metrics, money, time, or percentages"
          : "Specific metrics make the answer more concrete",
      rating: scorecard.quantification.rating,
      score: scorecard.quantification.count,
    },
    {
      id: "length",
      label: "Length vs target",
      value: formatDuration(scorecard.length.seconds),
      detail: `${scorecard.length.estimated ? "Estimated " : ""}target ${formatDuration(
        scorecard.length.targetMinSeconds,
      )}-${formatDuration(scorecard.length.targetMaxSeconds)}`,
      rating: scorecard.length.rating,
      score: scorecard.length.seconds,
    },
    {
      id: "pace",
      label: "Pace",
      value: `${scorecard.pace.wordsPerMinute} WPM`,
      detail: `${scorecard.pace.estimated ? "Estimated " : ""}target ${PACE_TARGET.min}-${PACE_TARGET.max} WPM`,
      rating: scorecard.pace.rating,
      score: scorecard.pace.wordsPerMinute,
    },
  ];
}

function chooseTopSuggestion(
  scorecard: Omit<InterviewAnswerScorecard, "metrics" | "topSuggestion">,
  substance: AnswerSubstance,
): string {
  if (!scorecard.answer) {
    return "Write a complete answer before reviewing coaching feedback.";
  }

  if (substance.looksLikeToolList) {
    return "Answer the behavioral question with one specific story, not a stack of tools.";
  }

  if (substance.isVagueShortAnswer || !substance.hasStorySignal) {
    return "Choose one specific example and add the context, actions, and result.";
  }

  if (scorecard.star.missing.includes("result")) {
    return "Close with the result so the interviewer hears the outcome.";
  }

  if (scorecard.star.missing.includes("action")) {
    return "Add the actions you personally took to solve the problem.";
  }

  if (
    scorecard.star.missing.includes("situation") ||
    scorecard.star.missing.includes("task")
  ) {
    return "Add the setup and your role so the interviewer understands the stakes.";
  }

  if (scorecard.quantification.count === 0) {
    return "Add at least one metric, number, or timeframe to make the impact concrete.";
  }

  if (scorecard.length.rating !== "green") {
    return scorecard.length.seconds < scorecard.length.targetMinSeconds
      ? "Expand the answer with more context, actions, and impact."
      : "Tighten the answer so it lands inside the target time.";
  }

  if (scorecard.filler.rating !== "green") {
    return "Reduce filler words by pausing briefly before your next thought.";
  }

  if (scorecard.pace.rating !== "green") {
    return scorecard.pace.wordsPerMinute < PACE_TARGET.min
      ? "Increase pace slightly while keeping the structure clear."
      : "Slow down a little so each result and metric is easy to follow.";
  }

  return "Strong structure. Keep practicing this level of specificity.";
}

function summarizeFocusAreas(scorecards: InterviewAnswerScorecard[]): string[] {
  const counts = new Map<string, number>();

  for (const scorecard of scorecards) {
    counts.set(
      scorecard.topSuggestion,
      (counts.get(scorecard.topSuggestion) ?? 0) + 1,
    );
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([suggestion]) => suggestion)
    .slice(0, 3);
}

function countWords(answer: string): number {
  return answer.match(/\b[\w'-]+\b/g)?.length ?? 0;
}

function classifyAnswerSubstance(
  answer: string,
  category: InterviewQuestionCategory,
  star: StarCoverage,
  quantificationCount: number,
  wordCount: number,
): AnswerSubstance {
  const storyCategory = STORY_CATEGORIES.has(category);
  const hasSpecificity =
    star.score >= 2 ||
    quantificationCount > 0 ||
    /\b(?:because|after|before|during|customer|user|team|deadline|launch|project|incident|rollout|migration|blocked|problem|challenge)\b/i.test(
      answer,
    );
  const hasPersonalAction =
    /\b(?:i|we)\s+(?:built|led|created|implemented|decided|launched|designed|coordinated|profiled|split|added|mapped|prioritized|tested|shipped|facilitated|debugged|redesigned|owned|helped|moved|trained|documented|reviewed)\b/i.test(
      answer,
    );
  const hasStorySignal =
    !storyCategory ||
    star.score >= 2 ||
    (hasPersonalAction && (star.situation || star.result));
  const isVagueShortAnswer =
    storyCategory &&
    wordCount < 30 &&
    star.score <= 1 &&
    quantificationCount === 0 &&
    !hasSpecificity;
  const toolList = looksLikeToolList(answer);
  const looksLikeToolListAnswer =
    storyCategory && toolList && !hasPersonalAction && star.score <= 1;

  return {
    hasStorySignal,
    isVagueShortAnswer,
    looksLikeToolList: looksLikeToolListAnswer,
    shouldGateOverall:
      isVagueShortAnswer || looksLikeToolListAnswer || !hasStorySignal,
  };
}

function looksLikeToolList(answer: string): boolean {
  const normalized = answer.toLowerCase();
  const commaCount = (answer.match(/,/g) ?? []).length;
  const toolMatches = TOOL_TERMS.filter((term) =>
    new RegExp(`\\b${escapeRegExp(term)}\\b`, "i").test(normalized),
  ).length;
  const wordCount = countWords(answer);

  return toolMatches >= 4 && (commaCount >= 3 || toolMatches / wordCount > 0.3);
}

function countQuantifications(answer: string): number {
  const digitMatches =
    answer.match(
      /(?:[$€£]\s?\d+(?:[.,]\d+)?[kKmMbB]?|\d+(?:[.,]\d+)?\s?(?:%|percent|x|k|m|b|hours?|days?|weeks?|months?|years?|users?|customers?|people|revenue|dollars?)?)/g,
    ) ?? [];
  const numberWordPattern = new RegExp(
    `\\b(?:${NUMBER_WORDS.join("|")})\\b`,
    "gi",
  );
  const wordMatches = answer.match(numberWordPattern) ?? [];

  return digitMatches.length + wordMatches.length;
}

function rateFillerCount(count: number): InterviewFeedbackRating {
  if (count <= 2) return "green";
  if (count <= 5) return "yellow";
  return "red";
}

function rateStarCoverage(score: number): InterviewFeedbackRating {
  if (score === 4) return "green";
  if (score >= 2) return "yellow";
  return "red";
}

function rateQuantificationCount(count: number): InterviewFeedbackRating {
  if (count >= 2) return "green";
  if (count === 1) return "yellow";
  return "red";
}

function rateLength(
  seconds: number,
  target: { min: number; max: number },
): InterviewFeedbackRating {
  if (seconds >= target.min && seconds <= target.max) return "green";

  const lowerYellow = target.min * 0.75;
  const upperYellow = target.max * 1.25;

  if (seconds >= lowerYellow && seconds <= upperYellow) return "yellow";

  return "red";
}

function ratePace(wordsPerMinute: number): InterviewFeedbackRating {
  if (wordsPerMinute >= PACE_TARGET.min && wordsPerMinute <= PACE_TARGET.max) {
    return "green";
  }

  if (
    wordsPerMinute >= PACE_TARGET.yellowMin &&
    wordsPerMinute <= PACE_TARGET.yellowMax
  ) {
    return "yellow";
  }

  return "red";
}

function summarizeRatings(
  ratings: InterviewFeedbackRating[],
): InterviewFeedbackRating {
  const score = average(ratings.map(ratingToScore));

  if (score >= 2.6) return "green";
  if (score >= 1.6) return "yellow";
  return "red";
}

function ratingToScore(rating: InterviewFeedbackRating): number {
  if (rating === "green") return 3;
  if (rating === "yellow") return 2;
  return 1;
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function percentRatedGreen(ratings: InterviewFeedbackRating[]): number {
  if (ratings.length === 0) return 0;

  const greenCount = ratings.filter((rating) => rating === "green").length;
  return Math.round((greenCount / ratings.length) * 100);
}

function topFillerMatches(matches: FillerWordMatch[]): string {
  return matches
    .slice(0, 3)
    .map((match) => `${match.phrase} (${match.count})`)
    .join(", ");
}

function formatDimensions(dimensions: StarDimension[]): string {
  return dimensions.map((dimension) => dimension.replace("-", " ")).join(", ");
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;

  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;

  return remainder === 0 ? `${minutes}m` : `${minutes}m ${remainder}s`;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
