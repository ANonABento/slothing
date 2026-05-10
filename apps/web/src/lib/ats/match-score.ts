import {
  extractJdKeywords,
  getJdKeywordAliases,
  pluralizeTerm,
  singularizeTerm,
} from "./jd-keywords";

export interface JdMatchResult {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  totalKeywords: number;
}

const DEFAULT_KEYWORD_LIMIT = 30;

function escapeRegExp(term: string) {
  return term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function normalizeForMatch(text: string): string {
  return text
    .toLowerCase()
    .replace(/[•*]/g, " ")
    .replace(/[-_/]/g, " ")
    .replace(/[^a-z0-9+#.\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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
  };
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

  const normalizedResume = normalizeForMatch(resumeText);
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  for (const keyword of keywords) {
    if (containsNormalizedTerm(normalizedResume, keyword.term)) {
      matchedKeywords.push(keyword.term);
    } else if (
      options.missingLimit === undefined ||
      missingKeywords.length < options.missingLimit
    ) {
      missingKeywords.push(keyword.term);
    }
  }

  return {
    score: Math.max(
      0,
      Math.min(
        100,
        Math.round((matchedKeywords.length / keywords.length) * 100),
      ),
    ),
    matchedKeywords,
    missingKeywords,
    totalKeywords: keywords.length,
  };
}
