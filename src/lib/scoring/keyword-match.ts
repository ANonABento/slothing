import type { JobDescription } from "@/types";
import { getSynonyms, SYNONYM_MATCH_WEIGHT } from "@/lib/ats/synonyms";
import { SUB_SCORE_MAX_POINTS } from "./constants";
import {
  containsWord,
  countWordOccurrences,
  getResumeText,
  normalizeText,
} from "./text";
import type { ResumeScoreInput, SubScore } from "./types";

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "in",
  "of",
  "on",
  "or",
  "our",
  "the",
  "to",
  "we",
  "with",
  "you",
  "your",
]);

function tokenizeKeywords(text: string): string[] {
  return normalizeText(text)
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 3 && !STOP_WORDS.has(token));
}

function topTokens(text: string, limit: number): string[] {
  const counts = new Map<string, number>();
  for (const token of tokenizeKeywords(text)) {
    counts.set(token, (counts.get(token) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([token]) => token);
}

function buildKeywordSet(job: JobDescription): string[] {
  const keywords = [
    ...job.keywords,
    ...job.requirements.flatMap(tokenizeKeywords),
    ...topTokens(job.description, 10),
  ];
  const normalized = keywords
    .map((keyword) => normalizeText(keyword))
    .filter((keyword) => keyword.length >= 2 && !STOP_WORDS.has(keyword));

  return Array.from(new Set(normalized)).slice(0, 24);
}

export function scoreKeywordMatch(input: ResumeScoreInput): SubScore {
  if (!input.job) {
    return {
      key: "keywordMatch",
      label: "Keyword match",
      earned: 18,
      maxPoints: SUB_SCORE_MAX_POINTS.keywordMatch,
      notes: ["No job description supplied; neutral baseline."],
      evidence: ["No job description supplied."],
    };
  }

  const keywords = buildKeywordSet(input.job);
  if (keywords.length === 0) {
    return {
      key: "keywordMatch",
      label: "Keyword match",
      earned: 18,
      maxPoints: SUB_SCORE_MAX_POINTS.keywordMatch,
      notes: ["Job description has no usable keywords; neutral baseline."],
      evidence: ["0 keywords available."],
    };
  }

  const resumeText = normalizeText(getResumeText(input.profile, input.rawText));
  let weightedHits = 0;
  let exactHits = 0;
  let stuffing = false;

  for (const keyword of keywords) {
    const frequency = countWordOccurrences(resumeText, keyword);
    if (frequency > 10) stuffing = true;
    if (frequency > 0) {
      weightedHits += 1;
      exactHits += 1;
      continue;
    }

    const synonymHit = getSynonyms(keyword).some(
      (synonym) => synonym !== keyword && containsWord(resumeText, synonym),
    );
    if (synonymHit) weightedHits += SYNONYM_MATCH_WEIGHT;
  }

  const rawEarned = Math.round(
    (weightedHits / keywords.length) * SUB_SCORE_MAX_POINTS.keywordMatch,
  );
  const earned = Math.max(0, rawEarned - (stuffing ? 2 : 0));
  const notes =
    exactHits === keywords.length
      ? []
      : ["Add natural mentions of missing target job keywords."];
  if (stuffing) notes.push("Keyword stuffing detected; repeated terms too often.");

  return {
    key: "keywordMatch",
    label: "Keyword match",
    earned,
    maxPoints: SUB_SCORE_MAX_POINTS.keywordMatch,
    notes,
    evidence: [
      `${exactHits}/${keywords.length} keywords matched`,
      `${weightedHits.toFixed(1)}/${keywords.length} weighted keyword hits`,
    ],
  };
}
