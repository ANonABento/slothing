import type { Profile } from "../types";

export interface ContactItem {
  text: string;
  href: string | null;
}

const URLISH = /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i;

/** `https://…` target for something that looks like a URL or bare domain, else null. */
function linkTarget(raw: string): string | null {
  const l = raw.trim();
  if (!URLISH.test(l)) return null;
  return /^https?:\/\//i.test(l) ? l : `https://${l}`;
}

/** A URL without its scheme / www / trailing slash, for display. */
const displayUrl = (u: string) => u.trim().replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/\/$/, "");

/** Contact fields in display order (plain-text items first), with link targets for email, phone and URLs. */
export function contactItems(c: Profile["contact"]): ContactItem[] {
  const items: ContactItem[] = [];
  for (const l of c.links) if (!l.url.trim() && l.label.trim()) items.push({ text: l.label.trim(), href: null });
  if (c.email.trim()) items.push({ text: c.email.trim(), href: `mailto:${c.email.trim()}` });
  if (c.phone.trim()) items.push({ text: c.phone.trim(), href: `tel:${c.phone.replace(/[^\d+]/g, "")}` });
  if (c.location.trim()) items.push({ text: c.location.trim(), href: null });
  for (const { label, url } of c.links) {
    if (!url.trim()) continue;
    const href = linkTarget(url);
    items.push({ text: label.trim() || (href ? displayUrl(url) : url.trim()), href });
  }
  return items;
}
