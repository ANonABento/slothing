// Company-logo resolution helpers (Layer 1: from the page; domain derivation
// feeds Layer 2's background favicon fetch). Pure-ish — takes a Document so the
// same code runs in the content script and under jsdom in tests.

// Hosts that are job boards / aggregators / ATS — their domain is NOT the
// employer, so we never derive a company favicon from them (their pages usually
// carry an on-page logo we pick up in Layer 1 instead).
const NON_COMPANY_HOSTS = [
  "linkedin.com",
  "indeed.com",
  "greenhouse.io",
  "lever.co",
  "workdayjobs.com",
  "myworkdayjobs.com",
  "waterlooworks.uwaterloo.ca",
  "glassdoor.com",
  "ziprecruiter.com",
  "monster.com",
  "dice.com",
  "simplyhired.com",
  "wellfound.com",
  "angel.co",
  "google.com",
  "bing.com",
];

function isNonCompanyHost(host: string): boolean {
  const h = host.toLowerCase().replace(/^www\./, "");
  return NON_COMPANY_HOSTS.some((d) => h === d || h.endsWith("." + d));
}

/** Naive registrable domain: last two labels (acme.com from careers.acme.com). */
export function registrableDomain(host: string): string {
  const h = host
    .toLowerCase()
    .replace(/^www\./, "")
    .replace(/:\d+$/, "");
  const parts = h.split(".").filter(Boolean);
  if (parts.length <= 2) return h;
  return parts.slice(-2).join(".");
}

function toAbsoluteUrl(src: string, base: string): string | undefined {
  try {
    const url = new URL(src, base);
    if (url.protocol === "http:" || url.protocol === "https:") return url.href;
  } catch {
    // ignore malformed
  }
  return undefined;
}

/** Parses every JSON-LD block and returns flattened objects (handles @graph/arrays). */
function jsonLdObjects(doc: Document): Record<string, unknown>[] {
  const out: Record<string, unknown>[] = [];
  const blocks = doc.querySelectorAll('script[type="application/ld+json"]');
  blocks.forEach((block) => {
    try {
      const parsed = JSON.parse(block.textContent || "");
      const queue = Array.isArray(parsed) ? [...parsed] : [parsed];
      while (queue.length) {
        const node = queue.shift();
        if (!node || typeof node !== "object") continue;
        out.push(node as Record<string, unknown>);
        const graph = (node as Record<string, unknown>)["@graph"];
        if (Array.isArray(graph)) queue.push(...graph);
      }
    } catch {
      // skip invalid JSON-LD
    }
  });
  return out;
}

/** Every hiringOrganization object across all JSON-LD blocks. */
function hiringOrgs(doc: Document): Record<string, unknown>[] {
  const orgs: Record<string, unknown>[] = [];
  for (const node of jsonLdObjects(doc)) {
    const org = node.hiringOrganization;
    if (org && typeof org === "object") {
      orgs.push(org as Record<string, unknown>);
    }
  }
  return orgs;
}

/**
 * Layer 1 — best on-page company logo URL (absolute), or undefined.
 * Priority: JSON-LD hiringOrganization.logo → known site logo <img> → og:image.
 */
export function extractCompanyLogoUrl(doc: Document): string | undefined {
  const base = doc.baseURI || doc.location?.href || "";

  // 1. JSON-LD hiringOrganization.logo (string or ImageObject). Scan every org
  // so one without a logo doesn't shadow a later one that has it.
  for (const org of hiringOrgs(doc)) {
    const logo = org.logo;
    const candidate =
      typeof logo === "string"
        ? logo
        : logo && typeof logo === "object"
          ? (logo as Record<string, unknown>).url
          : undefined;
    if (typeof candidate === "string") {
      const abs = toAbsoluteUrl(candidate, base);
      if (abs) return abs;
    }
  }

  // 2. Known site logo images.
  const selectors = [
    ".logo-wrapper img[src]", // Greenhouse
    ".main-header-logo img[src], .posting-header .logo img[src]", // Lever
    "img.artdeco-entity-image[src], .jobs-company__logo img[src], .org-top-card-primary-content__logo img[src]", // LinkedIn
    '[data-automation-id="companyLogo"] img[src]', // Workday
    'header img[alt*="logo" i][src], img[class*="logo" i][src]', // generic
  ];
  for (const sel of selectors) {
    const img = doc.querySelector<HTMLImageElement>(sel);
    const src = img?.getAttribute("src");
    if (src) {
      const abs = toAbsoluteUrl(src, base);
      if (abs) return abs;
    }
  }

  // 3. og:image (last resort — can be a banner, but better than nothing).
  const og = doc
    .querySelector('meta[property="og:image"], meta[name="og:image"]')
    ?.getAttribute("content");
  if (og) {
    const abs = toAbsoluteUrl(og, base);
    if (abs) return abs;
  }

  return undefined;
}

/**
 * The employer's registrable domain for the Layer 2 favicon fetch, or undefined.
 * Prefers JSON-LD hiringOrganization.url/sameAs; falls back to the page host
 * unless it's a job board / aggregator (which isn't the employer).
 */
export function deriveCompanyDomain(
  doc: Document,
  pageUrl: string,
): string | undefined {
  const candidates: unknown[] = hiringOrgs(doc).flatMap((org) => [
    org.url,
    org.sameAs,
  ]);
  for (const candidate of candidates.flat()) {
    if (typeof candidate !== "string") continue;
    try {
      const host = new URL(candidate).hostname;
      if (host && !isNonCompanyHost(host)) return registrableDomain(host);
    } catch {
      // ignore
    }
  }

  try {
    const host = new URL(pageUrl).hostname;
    if (host && !isNonCompanyHost(host) && host !== "localhost") {
      return registrableDomain(host);
    }
  } catch {
    // ignore
  }
  return undefined;
}
