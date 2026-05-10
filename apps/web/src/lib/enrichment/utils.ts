export function slugifyCompany(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function compactCompanySlug(name: string): string {
  return slugifyCompany(name).replace(/-/g, "");
}

export function githubSlugCandidates(name: string): string[] {
  const base = compactCompanySlug(name);
  if (!base) return [];

  return Array.from(
    new Set([
      base,
      ...(base.endsWith("s") ? [] : [`${base}s`]),
      `${base}-inc`,
      `${base}hq`,
    ]),
  ).filter(Boolean);
}

export function domainFromUrl(rawUrl?: string | null): string | null {
  if (!rawUrl) return null;
  try {
    const url = new URL(rawUrl);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export function githubOrgFromUrl(rawUrl?: string | null): string | null {
  if (!rawUrl) return null;
  try {
    const url = new URL(rawUrl);
    if (
      url.hostname !== "github.com" &&
      !url.hostname.endsWith(".github.com")
    ) {
      return null;
    }
    const [org] = url.pathname.split("/").filter(Boolean);
    return org ?? null;
  } catch {
    return null;
  }
}

export function decodeXml(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}
