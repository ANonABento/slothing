import { terms } from "./score";
import type { Answer } from "./types";

/* ─── Matching application questions to the answer bank, no AI ───
 * Forms word the same question differently ("Are you legally authorized to work in the U.S.?" /
 * "Authorized to work in the United States?"), so questions are compared by their terms, not their text.
 * The score mixes overlap of the two term sets (Jaccard) with how much of the shorter one the longer
 * covers, so a short saved question still matches a long form label that contains it.
 */

// Words that frame a question without saying what it asks.
const FILLER = new Set("please describe briefly explain tell share list provide answer question optional required select choose enter below following".split(" "));

// Spellings forms use for the same thing, folded to one term.
const SYNONYMS: [RegExp, string][] = [
  [/\b(visa\s+)?sponsor(ship|ed)?\b/gi, "sponsorship"],
  [/\bauthori[sz](ed|ation)\b/gi, "authorized"],
  [/\bcv\b/gi, "resume"],
  [/\bpronouns?\b/gi, "pronoun"],
  [/\b(salary|compensation|pay)\s+(expectations?|requirements?|range)\b/gi, "salary expectation"],
  [/\bnotice\s+period\b/gi, "notice period"],
  [/\bhow\s+did\s+you\s+(hear|learn|find out)\b/gi, "hear about"],
];

/** A question's comparable terms. "US" is folded before `terms()` would drop it as the stop word "us". */
export function questionTerms(question: string): Set<string> {
  let q = question.replace(/\*|\(optional\)|\(required\)/gi, " ");
  // Case-sensitive, so "tell us" stays a stop word.
  q = q.replace(/\b(?:U\.S\.(?:A\.)?|USA|US)(?![A-Za-z])/g, " united states ").replace(/\b(?:U\.K\.|UK)(?![A-Za-z])/g, " united kingdom ");
  for (const [re, to] of SYNONYMS) q = q.replace(re, ` ${to} `);
  return new Set(terms(q).filter((t) => !FILLER.has(t)));
}

/** 0–1. Exact (after folding) is 1; nothing in common is 0. */
export function questionSimilarity(a: string, b: string): number {
  const ta = questionTerms(a);
  const tb = questionTerms(b);
  if (!ta.size || !tb.size) return 0;
  let shared = 0;
  for (const t of ta) if (tb.has(t)) shared++;
  if (!shared) return 0;
  const jaccard = shared / (ta.size + tb.size - shared);
  const cover = shared / Math.min(ta.size, tb.size);
  return 0.5 * jaccard + 0.5 * cover;
}

/** Below this a saved answer isn't offered. Tuned so "Why this company?" doesn't match "Why this role?". */
export const MATCH_THRESHOLD = 0.6;

/** The saved answer that best fits a form's question: highest score, then the one used most recently. */
export function bestAnswer(question: string, bank: Answer[]): { answer: Answer; score: number } | null {
  let best: { answer: Answer; score: number } | null = null;
  for (const a of bank) {
    if (!a.answer.trim()) continue;
    const score = questionSimilarity(question, a.question);
    if (score < MATCH_THRESHOLD) continue;
    if (!best || score > best.score || (score === best.score && (a.usedAt ?? a.updatedAt) > (best.answer.usedAt ?? best.answer.updatedAt))) best = { answer: a, score };
  }
  return best;
}

const fold = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/**
 * Which option of a select or radio group an answer picks: the same text, then an option that starts
 * with the answer ("Yes" → "Yes, I am authorized…"), then one the answer starts with. -1 when none fits.
 */
export function matchOption(answer: string, options: string[]): number {
  const a = fold(answer);
  if (!a) return -1;
  const opts = options.map(fold);
  const exact = opts.indexOf(a);
  if (exact >= 0) return exact;
  const starts = opts.findIndex((o) => o.startsWith(`${a} `));
  if (starts >= 0) return starts;
  // Longest first, so "No" isn't picked for "Not a veteran" when both are options.
  const byLength = opts.map((o, i) => [o, i] as const).filter(([o]) => o).sort((x, y) => y[0].length - x[0].length);
  return byLength.find(([o]) => a.startsWith(`${o} `) || a === o)?.[1] ?? -1;
}

/** Questions most applications ask, offered on an empty bank so you can answer them once. */
export const COMMON_QUESTIONS = [
  "Are you legally authorized to work in the United States?",
  "Will you now or in the future require visa sponsorship?",
  "What are your salary expectations?",
  "When can you start?",
  "Are you open to relocation?",
  "How did you hear about this role?",
  "What are your pronouns?",
  "Why do you want to work here?",
];
