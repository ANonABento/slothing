import {
  extractJdKeywords,
  getJdKeywordAliases,
  pluralizeTerm,
  singularizeTerm,
} from "./jd-keywords";
import {
  analyzeKeywordEvidence,
  normalizeKeywordText,
  type KeywordEvidenceSegment,
} from "./keyword-evidence";

export interface JdMatchResult {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  totalKeywords: number;
  matchedWithEvidence: string[];
  mentionedOnly: string[];
  stuffedKeywords: string[];
  evidenceByKeyword: Record<string, string[]>;
  warnings: string[];
}

const DEFAULT_KEYWORD_LIMIT = 30;

function escapeRegExp(term: string) {
  return term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function normalizeForMatch(text: string): string {
  return normalizeKeywordText(text);
}

function containsNormalizedTerm(normalizedText: string, term: string) {
  const normalizedTerm = normalizeForMatch(term);
  if (!normalizedTerm) return false;

  const variants = new Set([
    normalizedTerm,
    singularizeTerm(normalizedTerm),
    pluralizeTerm(normalizedTerm),
    ...getJdKeywordAliases(normalizedTerm).map(normalizeForMatch),
  ]);
  for (const variant of variants) {
    const pattern = escapeRegExp(variant).replace(/\s+/g, "\\s+");
    const regex = new RegExp(`(^|[^a-z0-9+#])${pattern}($|[^a-z0-9+#])`);
    if (regex.test(normalizedText)) return true;
  }

  return false;
}

function containsExactNormalizedTerm(normalizedText: string, term: string) {
  const normalizedTerm = normalizeForMatch(term);
  if (!normalizedTerm) return false;

  const variants = new Set([
    normalizedTerm,
    singularizeTerm(normalizedTerm),
    pluralizeTerm(normalizedTerm),
  ]);
  for (const variant of variants) {
    const pattern = escapeRegExp(variant).replace(/\s+/g, "\\s+");
    const regex = new RegExp(`(^|[^a-z0-9+#])${pattern}($|[^a-z0-9+#])`);
    if (regex.test(normalizedText)) return true;
  }

  return false;
}

export function containsKeywordTerm(text: string, term: string) {
  return containsNormalizedTerm(normalizeForMatch(text), term);
}

export function containsExactKeywordTerm(text: string, term: string) {
  return containsExactNormalizedTerm(normalizeForMatch(text), term);
}

function emptyResult(): JdMatchResult {
  return {
    score: 0,
    matchedKeywords: [],
    missingKeywords: [],
    totalKeywords: 0,
    matchedWithEvidence: [],
    mentionedOnly: [],
    stuffedKeywords: [],
    evidenceByKeyword: {},
    warnings: [],
  };
}

function resumeSegments(resumeText: string): KeywordEvidenceSegment[] {
  const lines = resumeText
    .split(/\n|(?<=\.)\s+/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return [{ text: resumeText, location: "resume text", kind: "raw" }];
  }

  return lines.map((line) => {
    const looksLikeSkills =
      /\b(skills|technologies|tools)\b\s*[:|-]/i.test(line) ||
      (line.split(/,|\s{2,}/).length >= 4 && !/[.!?]/.test(line));

    return {
      text: line,
      location: looksLikeSkills ? "skills" : "resume text",
      kind: looksLikeSkills ? ("skills" as const) : ("raw" as const),
      evidencePreferred: /^[-*•]\s+/.test(line),
    };
  });
}

export function computeJdMatch(
  resumeText: string,
  jdText: string,
  options: { keywordLimit?: number; missingLimit?: number } = {},
): JdMatchResult {
  if (!resumeText.trim() || !jdText.trim()) return emptyResult();

  const keywords = extractJdKeywords(jdText, {
    limit: options.keywordLimit ?? DEFAULT_KEYWORD_LIMIT,
  });
  if (keywords.length === 0) return emptyResult();

  const evidence = analyzeKeywordEvidence(
    keywords.map((keyword) => keyword.term),
    resumeSegments(resumeText),
    { includeSynonyms: false },
  );
  const matchedKeywords = evidence.matches
    .filter((match) => match.status !== "missing")
    .map((match) => match.keyword);
  const missingKeywords: string[] = [];

  for (const keyword of evidence.missing) {
    if (
      options.missingLimit === undefined ||
      missingKeywords.length < options.missingLimit
    ) {
      missingKeywords.push(keyword);
    }
  }

  const rawScore =
    (evidence.matches.reduce((sum, match) => sum + match.scoreWeight, 0) /
      keywords.length) *
    100;
  const stuffingPenalty = Math.min(20, evidence.stuffed.length * 6);

  return {
    score: Math.max(0, Math.min(100, Math.round(rawScore - stuffingPenalty))),
    matchedKeywords,
    missingKeywords,
    totalKeywords: keywords.length,
    matchedWithEvidence: evidence.matchedWithEvidence,
    mentionedOnly: evidence.mentionedOnly,
    stuffedKeywords: evidence.stuffed,
    evidenceByKeyword: Object.fromEntries(
      evidence.matches.map((match) => [match.keyword, match.evidenceSnippets]),
    ),
    warnings: evidence.warnings,
  };
}
