/**
 * Match an approved draft to the page the user is on (L3, increment 2).
 *
 * A draft carries the job `url` it was sourced from (resolved server-side). The
 * apply page the user lands on is usually the SAME url with cosmetic drift —
 * a tracking query (`?gh_src=…`), a hash (`#app`), a trailing slash, or a
 * trailing `/apply` segment Lever appends. We normalise both sides to
 * `host + path` (no query, no hash, no `/apply`, no trailing slash) and accept
 * an exact match or a prefix match, so `…/jobs/123` matches `…/jobs/123/apply`.
 *
 * Pure module — no DOM, no chrome APIs — so it is unit-testable headless.
 */
import type { ApprovedDraftPayload } from "@/shared/types";

/** Reduce a url to a stable `host/path` key for comparison. */
export function normalizeJobUrl(raw: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return null;
  }
  const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
  let path = parsed.pathname.toLowerCase();
  // Lever/Greenhouse apply pages append `/apply` to the listing path.
  path = path.replace(/\/apply\/?$/, "");
  // Drop a trailing slash (but keep the root "/").
  path = path.replace(/\/+$/, "");
  return `${host}${path}`;
}

/** True when two job urls point at the same posting modulo cosmetic drift. */
export function jobUrlsMatch(a: string, b: string): boolean {
  const na = normalizeJobUrl(a);
  const nb = normalizeJobUrl(b);
  if (!na || !nb) return false;
  if (na === nb) return true;
  // One side may carry extra path segments (e.g. `…/jobs/123` vs the deeper
  // apply route). Treat a segment-boundary prefix as a match.
  const [shorter, longer] = na.length <= nb.length ? [na, nb] : [nb, na];
  return longer === shorter || longer.startsWith(`${shorter}/`);
}

/**
 * Find the single approved draft whose job url matches `currentUrl`. Returns
 * null when none match or more than one does (ambiguous → defer to the user).
 */
export function findMatchingDraft(
  currentUrl: string,
  drafts: ApprovedDraftPayload[],
): ApprovedDraftPayload | null {
  const matches = drafts.filter(
    (d) => d.job?.url && jobUrlsMatch(currentUrl, d.job.url),
  );
  return matches.length === 1 ? matches[0] : null;
}
