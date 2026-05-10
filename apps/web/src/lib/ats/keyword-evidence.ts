import { getSynonyms, SYNONYM_MATCH_WEIGHT } from "./synonyms";

export type KeywordEvidenceStatus =
  | "matched_with_evidence"
  | "mentioned_only"
  | "missing";

export interface KeywordEvidenceSegment {
  text: string;
  location: string;
  kind:
    | "summary"
    | "skills"
    | "experience"
    | "project"
    | "education"
    | "certification"
    | "raw";
  evidencePreferred?: boolean;
}

export interface KeywordEvidenceMatch {
  keyword: string;
  status: KeywordEvidenceStatus;
  frequency: number;
  locations: string[];
  evidenceSnippets: string[];
  matchType?: "exact" | "synonym";
  matchedTerm?: string;
  scoreWeight: number;
}

export interface KeywordEvidenceSummary {
  matchedWithEvidence: string[];
  mentionedOnly: string[];
  missing: string[];
  stuffed: string[];
  warnings: string[];
  matches: KeywordEvidenceMatch[];
}

const ACTION_OR_OUTCOME_RE =
  /\b(achieved|added|analyzed|architected|automated|built|created|cut|delivered|designed|developed|drove|grew|improved|increased|launched|led|managed|mentored|migrated|optimized|reduced|resolved|scaled|shipped|streamlined|supported|transformed|used|wrote)\b/i;

const RESULT_RE =
  /\b(\d+%|\$\d+|\b\d+x\b|\b\d+\s+(users|customers|clients|projects|people|engineers|reports|hours|minutes|dashboards|tests)\b|latency|revenue|coverage|conversion|retention|performance|production|impact|saved|faster|slower)\b/i;

function escapeRegExp(term: string) {
  return term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function singularize(term: string) {
  if (term.endsWith("ies") && term.length > 4) return `${term.slice(0, -3)}y`;
  if (term.endsWith("ses") || term.endsWith("xes")) return term.slice(0, -2);
  if (term.endsWith("s") && !term.endsWith("ss") && term.length > 3) {
    return term.slice(0, -1);
  }
  return term;
}

function pluralize(term: string) {
  if (term.endsWith("y") && term.length > 3) return `${term.slice(0, -1)}ies`;
  if (term.endsWith("s")) return term;
  return `${term}s`;
}

export function normalizeKeywordText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[•*]/g, " ")
    .replace(/[-_/]/g, " ")
    .replace(/[^a-z0-9+#.\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function termVariants(term: string) {
  const normalized = normalizeKeywordText(term);
  return Array.from(
    new Set([normalized, singularize(normalized), pluralize(normalized)]),
  ).filter(Boolean);
}

function termRegex(term: string) {
  const pattern = escapeRegExp(term).replace(/\s+/g, "\\s+");
  return new RegExp(`(^|[^a-z0-9+#])${pattern}($|[^a-z0-9+#])`, "g");
}

function countTerm(normalizedText: string, term: string) {
  return termVariants(term).reduce(
    (count, variant) =>
      count + Array.from(normalizedText.matchAll(termRegex(variant))).length,
    0,
  );
}

function isEvidenceSegment(segment: KeywordEvidenceSegment) {
  if (
    (segment.kind === "skills" || segment.kind === "certification") &&
    !segment.evidencePreferred
  ) {
    return false;
  }

  const text = segment.text.trim();
  if (!text) return false;
  if (
    segment.evidencePreferred &&
    (segment.kind === "skills" || segment.kind === "certification")
  ) {
    return true;
  }

  const hasAction = ACTION_OR_OUTCOME_RE.test(text);
  const hasResult = RESULT_RE.test(text);
  const looksLikeBullet = /^[-*•]\s+/.test(text) || segment.evidencePreferred;
  const enoughContext = text.split(/\s+/).length >= 9;

  if (segment.kind === "summary") return hasAction && hasResult;
  if (segment.kind === "raw")
    return (looksLikeBullet || enoughContext) && hasAction;
  return hasAction || hasResult || (looksLikeBullet && enoughContext);
}

function snippet(text: string) {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= 180) return cleaned;
  return `${cleaned.slice(0, 177).trim()}...`;
}

function keywordTerms(keyword: string, includeSynonyms: boolean) {
  const normalized = normalizeKeywordText(keyword);
  const synonyms = includeSynonyms ? getSynonyms(normalized) : [];
  return [
    { term: normalized, matchType: "exact" as const, weight: 1 },
    ...synonyms
      .filter((term) => normalizeKeywordText(term) !== normalized)
      .map((term) => ({
        term,
        matchType: "synonym" as const,
        weight: SYNONYM_MATCH_WEIGHT,
      })),
  ];
}

export function analyzeKeywordEvidence(
  keywords: string[],
  segments: KeywordEvidenceSegment[],
  options: { includeSynonyms?: boolean } = {},
): KeywordEvidenceSummary {
  const matches: KeywordEvidenceMatch[] = [];
  const stuffed = new Set<string>();

  for (const keyword of keywords) {
    let frequency = 0;
    let matchedTerm: string | undefined;
    let matchType: "exact" | "synonym" | undefined;
    let matchWeight = 0;
    const locations = new Set<string>();
    const evidenceSnippets: string[] = [];

    for (const candidate of keywordTerms(
      keyword,
      options.includeSynonyms ?? true,
    )) {
      let candidateFrequency = 0;
      const candidateLocations = new Set<string>();
      const candidateSnippets: string[] = [];

      for (const segment of segments) {
        const count = countTerm(
          normalizeKeywordText(segment.text),
          candidate.term,
        );
        if (count === 0) continue;

        candidateFrequency += count;
        candidateLocations.add(segment.location);
        if (isEvidenceSegment(segment) && candidateSnippets.length < 3) {
          candidateSnippets.push(snippet(segment.text));
        }
      }

      if (candidateFrequency > 0) {
        frequency = candidateFrequency;
        matchedTerm =
          candidate.matchType === "synonym" ? candidate.term : undefined;
        matchType = candidate.matchType;
        matchWeight = candidate.weight;
        candidateLocations.forEach((location) => locations.add(location));
        evidenceSnippets.push(...candidateSnippets);
        break;
      }
    }

    const uniqueEvidenceSnippets = Array.from(new Set(evidenceSnippets));
    const status: KeywordEvidenceStatus =
      frequency === 0
        ? "missing"
        : uniqueEvidenceSnippets.length > 0
          ? "matched_with_evidence"
          : "mentioned_only";

    if (
      frequency >= 8 ||
      (frequency >= 4 &&
        uniqueEvidenceSnippets.length === 0 &&
        locations.size <= 2)
    ) {
      stuffed.add(keyword);
    }

    matches.push({
      keyword,
      status,
      frequency,
      locations: Array.from(locations),
      evidenceSnippets: uniqueEvidenceSnippets,
      matchType,
      matchedTerm,
      scoreWeight:
        status === "matched_with_evidence"
          ? matchWeight
          : status === "mentioned_only"
            ? Math.min(0.45, matchWeight * 0.45)
            : 0,
    });
  }

  const matchedWithEvidence = matches
    .filter((match) => match.status === "matched_with_evidence")
    .map((match) => match.keyword);
  const mentionedOnly = matches
    .filter((match) => match.status === "mentioned_only")
    .map((match) => match.keyword);
  const missing = matches
    .filter((match) => match.status === "missing")
    .map((match) => match.keyword);
  const stuffedKeywords = Array.from(stuffed);
  const warnings: string[] = [];

  if (stuffedKeywords.length > 0) {
    warnings.push(
      `Keyword stuffing detected for ${stuffedKeywords.slice(0, 5).join(", ")}. Repetition without supporting bullets does not count as strong evidence.`,
    );
  }

  if (
    mentionedOnly.length > matchedWithEvidence.length &&
    mentionedOnly.length >= 3
  ) {
    warnings.push(
      "Several JD keywords are mentioned only in thin contexts; add concrete bullets or projects showing how you used them.",
    );
  }

  return {
    matchedWithEvidence,
    mentionedOnly,
    missing,
    stuffed: stuffedKeywords,
    warnings,
    matches,
  };
}
