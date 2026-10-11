import type { BankCategory, BankEntry } from "@/types";
import { isVerifiedBankEntry } from "@/types";
import { getBankEntries } from "@/lib/db/profile-bank";

/**
 * Dynamic "golden set" (spec §4): instead of hardcoded exemplars, steer AI authoring with the
 * user's OWN strongest verified bullets as STYLE references. These are passed to prompts purely
 * to match tone/format — never as facts (grounding still restricts facts to the live source), so
 * they cannot leak content into an unrelated entry.
 */

const METRIC_RE = /(\d[\d,.]*\s*(%|x|k|m|b|\+|ms|s|gb|mb)|\$\s?\d|\b\d{3,}\b)/i;
const IDEAL_MIN = 80;
const IDEAL_MAX = 220;

function bulletText(entry: BankEntry): string {
  const c = entry.content;
  return String(c.description ?? c.text ?? "").trim();
}

/** Heuristic style score: reward a leading action verb, a concrete metric, and a tweet-ish length. */
function styleScore(text: string): number {
  let score = 0;
  if (METRIC_RE.test(text)) score += 2;
  // Verb-first-ish: starts with a capitalized word that isn't an article/pronoun.
  const first = text.split(/\s+/)[0] ?? "";
  if (
    /^[A-Z][a-z]+(ed|t|d)?$/.test(first) &&
    !/^(The|A|An|This|It|We|I)$/.test(first)
  ) {
    score += 1;
  }
  if (text.length >= IDEAL_MIN && text.length <= IDEAL_MAX) score += 1;
  return score;
}

export interface SelectStyleExemplarsOptions {
  category?: BankCategory;
  limit?: number;
}

/**
 * Return up to `limit` of the user's strongest VERIFIED bullets as style exemplars. Prefers
 * project/experience bullets (resume-shaped), ranked by {@link styleScore}. Returns `[]` when the
 * user has fewer than two usable bullets — the prompts then fall back to their built-in guidance.
 */
export function selectStyleExemplars(
  userId: string,
  options: SelectStyleExemplarsOptions = {},
): string[] {
  const { limit = 4 } = options;
  const entries = getBankEntries(userId);

  const candidates = entries
    .filter((e) => e.category === "bullet" && isVerifiedBankEntry(e))
    .map((e) => bulletText(e))
    .filter((text) => text.length >= 40 && text.length <= 320);

  if (candidates.length < 2) return [];

  const seen = new Set<string>();
  return candidates
    .map((text) => ({ text, score: styleScore(text) }))
    .sort((a, b) => b.score - a.score)
    .map((c) => c.text)
    .filter((text) => {
      const key = text.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, limit);
}
