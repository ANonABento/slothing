import { z } from "zod";

import { generateJSON } from "./llm";

/* ─── Import a job from its URL ───
 * Fetched server-side. Greenhouse has a public API (its pages carry no structured data); every other
 * page is read for a schema.org JobPosting (Lever, Ashby, LinkedIn's public pages and most career
 * sites have one). LinkedIn uses its guest endpoint, since its pages only sometimes have one. Without
 * structured data, AI reads the page text. Ported from v1's extension scrapers (generic JSON-LD parsing,
 * description clean-up, Greenhouse / Lever / LinkedIn URL patterns and LinkedIn's class names).
 */

export interface ImportedJob {
  company: string;
  title: string;
  location: string;
  description: string;
}

/* ─── HTML to text ─── */

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", ndash: "–", mdash: "—", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", hellip: "…", bull: "•", middot: "·" };

export const decodeEntities = (s: string) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === "#") {
      const code = e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) && code > 0 && code < 0x110000 ? String.fromCodePoint(code) : m;
    }
    return ENTITIES[e.toLowerCase()] ?? m;
  });

/** Readable text from a posting's HTML: paragraphs and list items on their own lines, "- " for list items. */
export function htmlToText(html: string): string {
  // Some sources escape the HTML itself ("&lt;p&gt;"), so decode once first when that's the case.
  const src = /&lt;\/?[a-z]/i.test(html) && !/<\/?[a-z][^>]*>/i.test(html) ? decodeEntities(html) : html;
  return decodeEntities(
    src
      .replace(/<(script|style|noscript|svg|head)[^>]*>[\s\S]*?<\/\1>/gi, "")
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<li[^>]*>/gi, "\n- ")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|li|ul|ol|h[1-6]|section|article|tr|header|footer)>/gi, "\n")
      .replace(/<(p|div|h[1-6]|ul|ol|section|article|tr)[^>]*>/gi, "\n")
      .replace(/<[^>]+>/g, ""),
  )
    .replace(/[ \t ]+/g, " ")
    .split("\n")
    .map((l) => l.trim())
    .join("\n")
    .replace(/^- *$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    // List items one per line, not a blank line between each.
    .replace(/^(- .*)\n\n(?=- )/gm, "$1\n")
    .replace(/^(- .*)\n\n(?=- )/gm, "$1\n")
    .trim();
}

/* ─── schema.org JobPosting ─── */

type Json = Record<string, unknown>;
const isObj = (v: unknown): v is Json => typeof v === "object" && v !== null && !Array.isArray(v);
const str = (v: unknown) => (typeof v === "string" ? v.trim() : typeof v === "number" ? String(v) : "");
const isPosting = (v: unknown): v is Json => isObj(v) && [v["@type"]].flat().some((t) => t === "JobPosting");

/** Every JobPosting in the page's JSON-LD: a single object, an array, or an @graph. */
export function findJobPosting(html: string): Json | null {
  for (const m of html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    let data: unknown;
    try {
      data = JSON.parse(m[1].trim());
    } catch {
      continue;
    }
    const items = [data].flat().flatMap((d) => (isObj(d) && Array.isArray(d["@graph"]) ? d["@graph"] : [d]));
    const posting = items.find(isPosting);
    if (posting) return posting;
  }
  return null;
}

function placeName(p: unknown): string {
  if (typeof p === "string") return p.trim();
  if (!isObj(p)) return "";
  const a = p.address;
  if (isObj(a)) {
    const country = isObj(a.addressCountry) ? str(a.addressCountry.name) : str(a.addressCountry);
    const parts = [str(a.addressLocality), str(a.addressRegion), country].filter(Boolean);
    if (parts.length) return [...new Set(parts)].join(", ");
  }
  return typeof a === "string" ? a.trim() : str(p.name);
}

export function fromJobPosting(p: Json): ImportedJob {
  const org = p.hiringOrganization;
  const places = [...new Set([p.jobLocation].flat().map(placeName).filter(Boolean))];
  const remote = str(p.jobLocationType).toUpperCase() === "TELECOMMUTE";
  const location = [places.slice(0, 3).join(" · "), remote && !/remote/i.test(places.join(" ")) ? "Remote" : ""].filter(Boolean).join(" · ");
  return {
    title: decodeEntities(str(p.title)),
    company: decodeEntities(isObj(org) ? str(org.name) : str(org)),
    location,
    description: htmlToText(str(p.description)),
  };
}

/* ─── Greenhouse ─── */

/** Board and job id from a Greenhouse URL (boards., job-boards., the embed form). */
export function greenhouseIds(url: URL): { board: string; id: string } | null {
  if (!/(^|\.)greenhouse\.io$/.test(url.hostname)) return null;
  const path = url.pathname.match(/^\/([\w-]+)\/jobs\/(\d+)/);
  if (path && path[1] !== "embed") return { board: path[1], id: path[2] };
  const board = url.searchParams.get("for");
  const id = url.searchParams.get("token") ?? url.searchParams.get("gh_jid");
  return board && id ? { board, id } : null;
}

/**
 * A company's own career site showing a Greenhouse job: boards to try. A link to the same job id on
 * Greenhouse names the board; with `?gh_jid=…`, the board the page embeds, then the site's name
 * ("careers.airbnb.com" → "airbnb"), which is usually the board.
 */
export function embeddedGreenhouse(url: URL, html: string): { boards: string[]; id: string } | null {
  // A page that links to its own Greenhouse posting (the job id is in both): "mozilla.org/careers/position/gh/7137777".
  const linked = [...html.matchAll(/greenhouse\.io\/([\w-]+)\/jobs\/(\d{4,})/g)].find((m) => m[1] !== "embed" && url.href.includes(m[2]));
  if (linked) return { boards: [linked[1]], id: linked[2] };
  const id = url.searchParams.get("gh_jid");
  if (!id || !/^\d+$/.test(id)) return null;
  const embedded = html.match(/greenhouse\.io\/embed\/job_board(?:\/js)?\?for=([\w-]+)/)?.[1];
  const site = url.hostname.split(".").slice(-2)[0];
  return { boards: [...new Set([embedded, site].filter((b): b is string => Boolean(b)))], id };
}

const GreenhouseJob = z.object({
  title: z.string().default(""),
  company_name: z.string().nullish(),
  location: z.object({ name: z.string().nullish() }).nullish(),
  content: z.string().default(""),
});

/** The posting from Greenhouse's public API, or null when this board doesn't have it. */
async function fromGreenhouse({ board, id }: { board: string; id: string }): Promise<ImportedJob | null> {
  const res = await get(`https://boards-api.greenhouse.io/v1/boards/${board}/jobs/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Greenhouse answered ${res.status}. Try again, or paste the description.`);
  const j = GreenhouseJob.parse(await res.json());
  return { title: j.title.trim(), company: j.company_name?.trim() || board, location: j.location?.name?.trim() ?? "", description: htmlToText(j.content) };
}

/* ─── LinkedIn ───
 * Public postings carry JSON-LD only on some URL shapes, but the guest endpoint returns any public
 * posting by id as a page fragment. Parsed by its class names, like v1's LinkedIn scraper.
 */

export const linkedInJobId = (url: URL) =>
  /(^|\.)linkedin\.com$/.test(url.hostname) ? (url.searchParams.get("currentJobId") ?? url.pathname.match(/\/jobs\/view\/(?:[^/]*?-)?(\d+)/)?.[1] ?? null) : null;

/** Fields from LinkedIn's guest job fragment. */
export function parseLinkedInFragment(html: string): ImportedJob {
  const after = (cls: string, end: string) => {
    const m = new RegExp(`class="[^"]*\\b${cls}\\b[^"]*"[^>]*>`).exec(html);
    if (!m) return "";
    const rest = html.slice(m.index + m[0].length);
    return rest.slice(0, Math.max(0, rest.indexOf(end)));
  };
  const text = (cls: string, end: string) => htmlToText(after(cls, end)).replace(/\s+/g, " ").trim();
  return {
    title: text("top-card-layout__title", "</h"),
    company: text("topcard__org-name-link", "</a>"),
    location: text("topcard__flavor--bullet", "</span>"),
    description: htmlToText(after("show-more-less-html__markup", "<button")),
  };
}

async function fromLinkedIn(id: string): Promise<ImportedJob> {
  const res = await get(`https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/${id}`);
  if (res.status === 404 || res.status === 410) throw new Error("LinkedIn says this posting doesn't exist. It may have closed.");
  if (!res.ok) throw new Error(`LinkedIn answered ${res.status} (it limits automated reads). Try again in a minute, or paste the description.`);
  const job = parseLinkedInFragment(await res.text());
  if (!job.title || job.description.length < 100) throw new Error("LinkedIn didn't return the posting. Open it, copy the description and use \"Add job\".");
  return job;
}

/* ─── Fetching ─── */

const TIMEOUT_MS = 20_000;
const MAX_BYTES = 5_000_000;
// Some boards (LinkedIn) only serve the public posting to a browser-like agent.
const HEADERS = {
  "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0 Safari/537.36",
  // HTML first: some boards (Workday) answer a request that accepts JSON with an app-internal JSON blob.
  accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
  "accept-language": "en-US,en;q=0.9",
};

async function get(url: string): Promise<Response> {
  try {
    return await fetch(url, { headers: HEADERS, redirect: "follow", signal: AbortSignal.timeout(TIMEOUT_MS) });
  } catch (err) {
    if ((err as Error).name === "TimeoutError") throw new Error(`The site didn't answer within ${TIMEOUT_MS / 1000}s.`);
    throw new Error(`Couldn't reach ${new URL(url).hostname}. Check the link and your connection.`);
  }
}

/** A posting link as typed or pasted ("jobs.lever.co/…" without a scheme is fine). */
export function parsePostingUrl(raw: string): URL {
  const t = raw.trim();
  let url: URL;
  try {
    url = new URL(/^[a-z][a-z\d+.-]*:\/\//i.test(t) ? t : `https://${t}`);
  } catch {
    throw new Error("That doesn't look like a link. Paste the posting's full URL.");
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("Only http and https links can be imported.");
  if (!url.hostname.includes(".")) throw new Error("That doesn't look like a link. Paste the posting's full URL.");
  return url;
}

const AiJob = z.object({
  company: z.preprocess((v) => v ?? "", z.string()),
  title: z.preprocess((v) => v ?? "", z.string()),
  location: z.preprocess((v) => v ?? "", z.string()),
  description: z.preprocess((v) => v ?? "", z.string()),
  isJobPosting: z.preprocess((v) => v ?? true, z.boolean()),
});

// Below this much text the page is a shell that loads the posting with JavaScript.
const MIN_TEXT = 400;

/** The page's text, read by AI: the fallback when there's no structured data. */
async function fromPageText(html: string, host: string): Promise<ImportedJob> {
  const text = htmlToText(html.match(/<body[\s\S]*<\/body>/i)?.[0] ?? html);
  if (text.length < MIN_TEXT) {
    throw new Error(`There's almost no text on that page, so no posting to read (${host} may load it with JavaScript). Paste the description with "Add job" instead.`);
  }
  const job = await generateJSON(
    AiJob,
    `You extract one job posting from the text of a web page. Copy the job description verbatim: every section
(about the role, responsibilities, requirements, benefits), without navigation, cookie banners or other jobs.
Don't summarize or rewrite it. If the page isn't a single job posting, set "isJobPosting": false.
JSON: { "company": string, "title": string, "location": string, "description": string, "isJobPosting": boolean }`,
    text.slice(0, 30_000),
  );
  if (!job.isJobPosting || !job.description.trim()) throw new Error("That page doesn't look like a single job posting. Open the posting itself and copy its link.");
  return { company: job.company.trim(), title: job.title.trim(), location: job.location.trim(), description: job.description.trim() };
}

export async function importJobFromUrl(raw: string): Promise<ImportedJob & { url: string }> {
  const url = parsePostingUrl(raw);
  const li = linkedInJobId(url);
  // A LinkedIn search link ("…/jobs/search/?currentJobId=…&keywords=…") is saved as the posting's own link.
  const saved = li ? `https://www.linkedin.com/jobs/view/${li}` : url.href;
  const done = (job: ImportedJob) => ({ ...job, url: saved });

  const gh = greenhouseIds(url);
  if (gh) {
    const job = await fromGreenhouse(gh);
    if (!job) throw new Error("Greenhouse says this posting no longer exists. It may have closed.");
    return done(job);
  }
  let linkedInError: Error | null = null;
  if (li) {
    try {
      return done(await fromLinkedIn(li));
    } catch (e) {
      // Rate limited or empty: the link's own page may still carry JSON-LD (the /jobs/view/<slug> pages do).
      linkedInError = e as Error;
    }
  }

  const res = await get(url.href);
  if (linkedInError && !res.ok) throw linkedInError;
  if (res.status === 404 || res.status === 410) throw new Error("The site says this posting doesn't exist. It may have closed.");
  if (!res.ok) throw new Error(`${url.hostname} answered ${res.status}, so the posting couldn't be read. Paste the description with "Add job" instead.`);
  const type = res.headers.get("content-type") ?? "";
  if (type && !/html|xml|text\/plain/i.test(type)) throw new Error('That link isn\'t a web page (it may be a PDF). Paste the description with "Add job" instead.');
  if (Number(res.headers.get("content-length") ?? 0) > MAX_BYTES) throw new Error("That page is too large to read.");
  const html = (await res.text()).slice(0, MAX_BYTES);

  const embedded = embeddedGreenhouse(url, html);
  for (const board of embedded?.boards ?? []) {
    const job = await fromGreenhouse({ board, id: embedded!.id });
    if (job) return done(job);
  }

  const posting = findJobPosting(html);
  if (posting) {
    const job = fromJobPosting(posting);
    if (job.title && job.description.length >= 100) return done(job);
  }
  // LinkedIn's page text is mostly sign-in prompts; better to say why than have AI guess.
  if (linkedInError) throw linkedInError;
  return done(await fromPageText(html, url.hostname));
}
