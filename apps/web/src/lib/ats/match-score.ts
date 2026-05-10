import { extractJdKeywords } from "./jd-keywords";

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

function singularize(term: string) {
  if (term.endsWith("ies") && term.length > 4) {
    return `${term.slice(0, -3)}y`;
  }
  if (term.endsWith("ses") || term.endsWith("xes")) {
    return term.slice(0, -2);
  }
  if (term.endsWith("s") && !term.endsWith("ss") && term.length > 3) {
    return term.slice(0, -1);
  }
  return term;
}

function pluralize(term: string) {
  if (term.endsWith("y") && term.length > 3) {
    return `${term.slice(0, -1)}ies`;
  }
  if (term.endsWith("s")) {
    return term;
  }
  return `${term}s`;
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

function containsTerm(normalizedText: string, term: string) {
  const normalizedTerm = normalizeForMatch(term);
  if (!normalizedTerm) return false;

  const variants = new Set([
    normalizedTerm,
    singularize(normalizedTerm),
    pluralize(normalizedTerm),
  ]);
  for (const variant of variants) {
    const pattern = escapeRegExp(variant).replace(/\s+/g, "\\s+");
    const regex = new RegExp(`(^|[^a-z0-9+#])${pattern}($|[^a-z0-9+#])`);
    if (regex.test(normalizedText)) return true;
  }

  return false;
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
    if (containsTerm(normalizedResume, keyword.term)) {
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
