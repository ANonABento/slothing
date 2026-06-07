/**
 * Grounding engine (AI Bank Authoring spec §3) — the single validator that keeps AI output
 * honest. Given output claims and the evidence the user actually provided (a bank entry, or
 * the user's own raw input), it reports which claims are supported, which are unsupported,
 * and — the highest-risk axis — which *metrics/numbers* in the output are absent from the
 * evidence (a hard check, since a fabricated "grew revenue 40%" is the worst failure).
 *
 * Pure + deterministic + dependency-free, so it runs identically in tailoring
 * (anti-fabrication), the AI bank-authoring flows, and the eval harness.
 */

const STOPWORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "but",
  "of",
  "to",
  "in",
  "on",
  "for",
  "with",
  "at",
  "by",
  "from",
  "as",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "it",
  "its",
  "this",
  "that",
  "these",
  "those",
  "i",
  "we",
  "my",
  "our",
  "their",
  "they",
  "he",
  "she",
  "his",
  "her",
  "you",
  "your",
  "me",
  "us",
  "them",
  "into",
  "over",
  "across",
  "per",
  "via",
  "than",
  "then",
  "so",
  "up",
  "out",
  "about",
  "after",
  "before",
  "during",
  "while",
  "which",
  "who",
  "whom",
  "led", // common résumé verb that adds little grounding signal on its own
]);

/** Split a block of text into atomic claims (bullets / lines / sentences). */
export function splitClaims(text: string): string[] {
  return text
    .split(/\r?\n|(?<=[.!?])\s+(?=[A-Z0-9])/)
    .map((s) => s.replace(/^\s*[-•●·◦∙*▸►➤»‣>→–—]\s*/, "").trim())
    .filter((s) => s.length > 0);
}

/** Content words (lowercased, de-punctuated, stopwords + very short tokens dropped). */
export function contentWords(text: string): Set<string> {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9+#./%$-]+/g, " ")
    .split(/\s+/)
    .map((w) => w.replace(/^[-.]+|[-.]+$/g, ""))
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w) && !/^\d+$/.test(w));
  return new Set(words);
}

// A number with an optional unit. Letter units require a word boundary (\b) so we don't
// swallow the first letter of the next word — e.g. "6 minutes" must read as "6", not "6m".
const NUMBER_RE =
  /\$?\d[\d,]*(?:\.\d+)?\s?(?:%|percent\b|bn\b|pb\b|tb\b|gb\b|mb\b|[kmbx]\b)?\+?/gi;

/** Canonical form of a numeric/metric token: lowercase, no $/commas/space, percent→%. */
export function normalizeNumber(token: string): string {
  return token
    .toLowerCase()
    .replace(/\$/g, "")
    .replace(/,/g, "")
    .replace(/\s+/g, "")
    .replace(/percent/g, "%")
    .replace(/\+$/, "")
    .trim();
}

/**
 * A "metric" number worth a hard grounding check: it carries a unit/suffix (%, $, k/m/b/x,
 * data sizes), a decimal, or is large (>= 1000). Plain small integers ("5 engineers") are
 * excluded — they're prone to digit/spelled-out mismatch ("5" vs "five") and are low-risk.
 */
export function isMetricNumber(normalized: string): boolean {
  if (/[%xkmbgt]|pb|tb|gb|mb/.test(normalized)) return true;
  if (normalized.includes(".")) return true;
  const intVal = parseInt(normalized.replace(/[^\d]/g, ""), 10);
  return Number.isFinite(intVal) && intVal >= 1000;
}

/** Normalized metric numbers found in a string. */
export function metricNumbers(text: string): string[] {
  const out: string[] = [];
  for (const m of text.matchAll(NUMBER_RE)) {
    const norm = normalizeNumber(m[0]);
    if (norm && isMetricNumber(norm)) out.push(norm);
  }
  return out;
}

export interface GroundingResult {
  /** Claims sufficiently supported by the evidence. */
  supported: string[];
  /** Claims with no evidence support (or carrying an ungrounded metric). */
  unsupported: string[];
  /** Metric/number tokens present in the output but absent from the evidence. */
  ungroundedNumbers: string[];
}

export interface GroundingOptions {
  /**
   * Minimum fraction of a claim's content words that must appear in the best-matching
   * evidence sentence for it to count as supported. Tunable on the eval golden set.
   */
  threshold?: number;
}

/**
 * Ground `output` (a string, which is split into claims, or an explicit claim array)
 * against `evidence`. A claim is supported when enough of its content words overlap a
 * single evidence sentence AND it introduces no ungrounded metric. Any metric number not
 * present in the evidence is reported in `ungroundedNumbers` and forces its claim
 * unsupported.
 */
export function groundClaims(
  output: string | string[],
  evidence: string,
  options: GroundingOptions = {},
): GroundingResult {
  const threshold = options.threshold ?? 0.6;
  const claims = Array.isArray(output) ? output : splitClaims(output);
  const evidenceSentences = splitClaims(evidence).map((s) => contentWords(s));
  const evidenceNumbers = new Set(metricNumbers(evidence));

  const supported: string[] = [];
  const unsupported: string[] = [];
  const ungroundedNumbers = new Set<string>();

  for (const claim of claims) {
    const claimNumbers = metricNumbers(claim);
    const badNumbers = claimNumbers.filter((n) => !evidenceNumbers.has(n));
    badNumbers.forEach((n) => ungroundedNumbers.add(n));

    const words = [...contentWords(claim)];
    let bestOverlap = 0;
    if (words.length > 0) {
      for (const sentence of evidenceSentences) {
        const hits = words.filter((w) => sentence.has(w)).length;
        bestOverlap = Math.max(bestOverlap, hits / words.length);
      }
    } else {
      // No content words to ground (e.g. a bare metric) — lean on the numeric check.
      bestOverlap = 1;
    }

    const wordSupported = bestOverlap >= threshold;
    if (wordSupported && badNumbers.length === 0) {
      supported.push(claim);
    } else {
      unsupported.push(claim);
    }
  }

  return {
    supported,
    unsupported,
    ungroundedNumbers: [...ungroundedNumbers],
  };
}

/** Convenience: is a single claim grounded in the evidence? */
export function isClaimGrounded(
  claim: string,
  evidence: string,
  options?: GroundingOptions,
): boolean {
  const result = groundClaims([claim], evidence, options);
  return result.supported.length === 1;
}
