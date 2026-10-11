/**
 * Naive, deterministic opportunity ↔ profile match scoring used for
 * "rank-on-push" (see docs/agent-overnight-apply-spec.md, P1). A real agent can
 * layer LLM judgement on top; this gives every pushed opportunity an immediate,
 * explainable score with zero LLM cost so the review queue can be ranked.
 *
 * Pure module — no DB, no IO.
 */
import type { Profile } from "@slothing/shared/types";

/** Split arbitrary text into a set of lower-cased tokens for overlap scoring. */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9+#.]+/)
    .map((t) => t.replace(/^\.+|\.+$/g, ""))
    .filter((t) => t.length > 1);
}

/**
 * Build the set of terms that represent a user's profile: skill names, the
 * skills listed on each experience, and the words in experience titles. These
 * are what an opportunity's keywords/requirements are scored against.
 */
export function profileTerms(profile: Profile | null | undefined): Set<string> {
  if (!profile) return new Set();
  const terms = new Set<string>();
  for (const skill of profile.skills ?? []) {
    for (const t of tokenize(skill.name)) terms.add(t);
  }
  for (const exp of profile.experiences ?? []) {
    for (const s of exp.skills ?? []) {
      for (const t of tokenize(s)) terms.add(t);
    }
    for (const t of tokenize(exp.title)) terms.add(t);
  }
  return terms;
}

export interface ScorableOpportunity {
  title?: string;
  keywords?: string[];
  requirements?: string[];
  description?: string;
}

/**
 * Fraction of the opportunity's salient terms (keywords + requirements + title)
 * that appear in the profile term set, in [0, 1].
 *
 * - When the profile has no signal, returns 1 (don't filter anything out — the
 *   user hasn't given us anything to rank against).
 * - When the opportunity has no salient terms, returns 0.
 *
 * Rounded to 2 decimals so scores are stable across runs and easy to assert.
 */
export function scoreOpportunityMatch(
  opportunity: ScorableOpportunity,
  terms: Set<string>,
): number {
  if (terms.size === 0) return 1;

  const oppTokens = new Set<string>();
  for (const kw of opportunity.keywords ?? []) {
    for (const t of tokenize(kw)) oppTokens.add(t);
  }
  for (const req of opportunity.requirements ?? []) {
    for (const t of tokenize(req)) oppTokens.add(t);
  }
  for (const t of tokenize(opportunity.title ?? "")) oppTokens.add(t);

  if (oppTokens.size === 0) return 0;

  let hits = 0;
  for (const token of oppTokens) {
    if (terms.has(token)) hits += 1;
  }
  return Math.round((hits / oppTokens.size) * 100) / 100;
}
