// Pure (no chrome.* I/O) helpers for the per-host allow/block control. Safe to
// import from the content bundle as well as the background script. Storage-backed
// CRUD lives in background/storage.ts; this module owns the data shapes, host
// normalization, seeds, and the matcher.

import type { SiteRule, SiteRuleMode } from "./types";

export type { SiteRule, SiteRuleMode } from "./types";

export type SiteVerdict = "allow" | "block" | "default";

/**
 * Hosts the extension is known to support. Seeded as ALLOW rules so the Manage
 * Sites list is populated and self-documenting on first run. (Allow and the
 * unlisted "default" behave identically at runtime — the extension runs — so
 * these rows are informational / "known good".)
 */
export const SEEDED_ALLOW_HOSTS = [
  "waterlooworks.uwaterloo.ca",
  "linkedin.com",
  "indeed.com",
  "greenhouse.io",
  "lever.co",
  "myworkdayjobs.com",
  "workdayjobs.com",
] as const;

export const DEFAULT_SITE_RULES: SiteRule[] = SEEDED_ALLOW_HOSTS.map(
  (host) => ({ host, mode: "allow" as SiteRuleMode }),
);

/**
 * Normalizes a host or pasted URL to a bare host key: lowercased, no scheme,
 * no `www.`/`*.` prefix, no path. Ports are stripped EXCEPT for localhost /
 * 127.0.0.1, where the port is the only thing distinguishing the Slothing dev
 * app (localhost:3000) from other localhost services — keeping it avoids a
 * blanket block of every localhost site.
 */
export function normalizeRuleHost(input: string): string {
  let h = (input || "").trim().toLowerCase();
  h = h.replace(/^[a-z][a-z0-9+.-]*:\/\//, ""); // strip scheme
  h = h.replace(/\/.*$/, ""); // strip path
  h = h.replace(/^\*\./, "").replace(/^www\./, ""); // strip wildcard/www

  const portMatch = h.match(/^(.*?):(\d+)$/);
  if (portMatch) {
    const [, hostPart, port] = portMatch;
    if (hostPart === "localhost" || hostPart === "127.0.0.1") {
      return `${hostPart}:${port}`;
    }
    return hostPart;
  }
  return h;
}

/**
 * Returns the verdict for a hostname against a rule set. Matching is by host
 * suffix (so a rule on `greenhouse.io` also covers `boards.greenhouse.io`), and
 * the longest matching rule host wins (so a specific `jobs.lever.co` allow can
 * override a broad `lever.co` block, and the exact app-host block always wins
 * for its own host). Unlisted hosts return "default" — today's behavior, which
 * keeps broad coverage for the generic scraper.
 */
export function matchSiteRules(
  hostname: string,
  rules: SiteRule[],
): SiteVerdict {
  const host = normalizeRuleHost(hostname);
  let best: { mode: SiteRuleMode; len: number } | null = null;
  for (const rule of rules) {
    const ruleHost = normalizeRuleHost(rule.host);
    if (!ruleHost) continue;
    const matches = host === ruleHost || host.endsWith("." + ruleHost);
    if (matches && (!best || ruleHost.length > best.len)) {
      best = { mode: rule.mode, len: ruleHost.length };
    }
  }
  return best ? best.mode : "default";
}

/** Convenience: is the extension blocked from running on this host? */
export function isHostBlockedByRules(
  hostname: string,
  rules: SiteRule[],
): boolean {
  return matchSiteRules(hostname, rules) === "block";
}
