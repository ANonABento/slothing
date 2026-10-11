/**
 * Deep-link URL builders for the popup's post-import success buttons (#31).
 *
 * Kept in its own module so the URL shape is unit-testable without booting
 * React/jsdom. The popup component imports both helpers and threads the
 * configured `apiBaseUrl` (from GET_AUTH_STATUS) through.
 */

/**
 * Builds the deep-link to a single opportunity's detail page.
 *
 * Trailing slashes on the base URL are stripped so we don't produce
 * `http://localhost:3000//opportunities/...`. The opportunity id is
 * URI-encoded defensively even though server-side ids are safe today.
 */
export function opportunityDetailUrl(
  apiBaseUrl: string,
  opportunityId: string,
): string {
  const base = apiBaseUrl.replace(/\/+$/, "");
  return `${base}/opportunities/${encodeURIComponent(opportunityId)}`;
}

/**
 * Builds the deep-link to the review queue used after a bulk scrape import.
 */
export function opportunityReviewUrl(apiBaseUrl: string): string {
  const base = apiBaseUrl.replace(/\/+$/, "");
  return `${base}/opportunities/review`;
}
