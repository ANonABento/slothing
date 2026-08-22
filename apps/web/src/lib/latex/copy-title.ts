/**
 * Naming a duplicate.
 *
 * Its own module because a Next route file may export ONLY route handlers — anything else
 * fails the generated route-type check, and therefore `next build`.
 */

/** The column's limit, which `" (copy)"` has to fit inside. */
const MAX_TITLE = 200;
const SUFFIX = " (copy)";

/** "Resume" → "Resume (copy)", but "Resume (copy)" → "Resume (copy 2)". */
export function copyTitle(title: string): string {
  const numbered = /^(.*)\s\(copy(?:\s(\d+))?\)$/.exec(title);
  if (numbered) {
    const next = numbered[2] ? Number(numbered[2]) + 1 : 2;
    return `${numbered[1]} (copy ${next})`;
  }
  return `${title.slice(0, MAX_TITLE - SUFFIX.length)}${SUFFIX}`;
}
