import { JSDOM } from "jsdom";

import { fetchWithTimeout } from "@/lib/enrichment/fetch-with-timeout";
import type { SourceError } from "@/lib/enrichment/types";

/**
 * URL → source text for grounded bank authoring. Fetches a GitHub repo (README + languages +
 * description) or any web page, returning readable text that becomes the GROUNDING EVIDENCE for
 * AI-drafted bullets — the AI may only assert what this text supports. All network access goes
 * through {@link fetchWithTimeout}, which runs the SSRF guard before every request.
 */

export type UrlSourceErrorCode =
  | "invalid_url"
  | "blocked_url"
  | "not_found"
  | "private_or_forbidden"
  | "rate_limited"
  | "unsupported_content"
  | "empty_content"
  | "fetch_failed";

export class UrlSourceError extends Error {
  constructor(
    readonly code: UrlSourceErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "UrlSourceError";
  }
}

export interface UrlSourceResult {
  kind: "github" | "web";
  url: string;
  title: string;
  /** Readable source text — the evidence the grounding check runs against. */
  text: string;
  /** A suggested project/entry name (repo name or page title). */
  suggestedName: string;
  /** Detected technologies (GitHub languages); empty for generic pages. */
  technologies: string[];
}

const MAX_README_CHARS = 12_000;
const MAX_WEB_CHARS = 14_000;
const GITHUB_API = "https://api.github.com";
const GITHUB_HOSTS = ["api.github.com"];

/** Parse `owner` + `repo` from a github.com repo URL, or null if it isn't one. */
export function parseGithubRepo(
  rawUrl: string,
): { owner: string; repo: string } | null {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return null;
  }
  const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
  if (host !== "github.com") return null;
  const segments = parsed.pathname.split("/").filter(Boolean);
  if (segments.length < 2) return null;
  const [owner, repoRaw] = segments;
  const repo = repoRaw.replace(/\.git$/i, "");
  // Reserved top-level GitHub paths that look like owners but aren't.
  const reserved = new Set([
    "features",
    "marketplace",
    "topics",
    "collections",
    "sponsors",
    "settings",
    "explore",
    "notifications",
  ]);
  if (!owner || !repo || reserved.has(owner.toLowerCase())) return null;
  return { owner, repo };
}

/** Map an enrichment {@link SourceError} to our typed code. */
function mapSourceError(error: SourceError): UrlSourceErrorCode {
  switch (error) {
    case "blocked":
      return "blocked_url";
    case "rate_limited":
      return "rate_limited";
    case "not_found":
      return "not_found";
    default:
      return "fetch_failed";
  }
}

function clamp(text: string, max: number): string {
  return text.length > max ? text.slice(0, max) : text;
}

interface GithubRepoMeta {
  name: string;
  description: string | null;
}

async function githubJson(
  url: string,
): Promise<{ status: number; body: unknown; rateLimited: boolean }> {
  const result = await fetchWithTimeout(url, {
    allowedHosts: GITHUB_HOSTS,
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!result.ok) {
    throw new UrlSourceError(
      mapSourceError(result.error),
      "Couldn't reach GitHub. Try again in a moment.",
    );
  }
  const { response } = result;
  const rateLimited =
    response.status === 403 &&
    response.headers.get("x-ratelimit-remaining") === "0";
  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }
  return { status: response.status, body, rateLimited };
}

async function fetchGithubSource(
  url: string,
  owner: string,
  repo: string,
): Promise<UrlSourceResult> {
  const base = `${GITHUB_API}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;

  const repoRes = await githubJson(base);
  if (repoRes.rateLimited) {
    throw new UrlSourceError(
      "rate_limited",
      "GitHub rate limit hit. Try again in a few minutes.",
    );
  }
  if (repoRes.status === 404) {
    throw new UrlSourceError(
      "not_found",
      "Repo not found. It may be private or the URL may be wrong.",
    );
  }
  if (repoRes.status === 401 || repoRes.status === 403) {
    throw new UrlSourceError(
      "private_or_forbidden",
      "That repo is private or access is forbidden.",
    );
  }
  if (repoRes.status >= 400 || repoRes.body == null) {
    throw new UrlSourceError("fetch_failed", "Couldn't read the repo.");
  }
  const meta = repoRes.body as GithubRepoMeta;

  // Languages (best-effort — never blocks the draft).
  let technologies: string[] = [];
  try {
    const langRes = await githubJson(`${base}/languages`);
    if (
      langRes.status < 400 &&
      langRes.body &&
      typeof langRes.body === "object"
    ) {
      technologies = Object.keys(langRes.body as Record<string, number>);
    }
  } catch {
    technologies = [];
  }

  // README (best-effort — a repo with only a description is still usable).
  let readme = "";
  try {
    const readmeRes = await githubJson(`${base}/readme`);
    if (readmeRes.status < 400 && readmeRes.body) {
      const payload = readmeRes.body as { content?: string; encoding?: string };
      if (payload.content && payload.encoding === "base64") {
        readme = Buffer.from(payload.content, "base64").toString("utf8");
      }
    }
  } catch {
    readme = "";
  }

  const text = clamp(
    [meta.description ?? "", readme].filter(Boolean).join("\n\n").trim(),
    MAX_README_CHARS,
  );
  if (!text) {
    throw new UrlSourceError(
      "empty_content",
      "This repo has no description or README to draft from.",
    );
  }

  return {
    kind: "github",
    url,
    title: `${owner}/${meta.name || repo}`,
    text,
    suggestedName: meta.name || repo,
    technologies,
  };
}

function stripHtmlToText(html: string): { title: string; body: string } {
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  doc
    .querySelectorAll("script, style, noscript, template, svg")
    .forEach((el) => el.remove());
  const title =
    doc.querySelector("title")?.textContent?.trim() ||
    doc.querySelector("h1")?.textContent?.trim() ||
    "";
  const body = (doc.body?.textContent ?? "").replace(/\s+/g, " ").trim();
  return { title, body };
}

async function fetchWebSource(url: string): Promise<UrlSourceResult> {
  const result = await fetchWithTimeout(url, { timeoutMs: 8000 });
  if (!result.ok) {
    throw new UrlSourceError(
      mapSourceError(result.error),
      result.error === "blocked"
        ? "That URL isn't allowed."
        : "Couldn't reach that page.",
    );
  }
  const { response } = result;
  if (response.status === 404) {
    throw new UrlSourceError("not_found", "Page not found.");
  }
  if (response.status === 401 || response.status === 403) {
    throw new UrlSourceError(
      "private_or_forbidden",
      "That page is behind a login or forbidden.",
    );
  }
  if (response.status >= 400) {
    throw new UrlSourceError("fetch_failed", "Couldn't load that page.");
  }
  const contentType = response.headers.get("content-type") ?? "";
  if (!/text\/html|text\/plain|application\/xhtml/i.test(contentType)) {
    throw new UrlSourceError(
      "unsupported_content",
      "That link isn't a readable web page (only HTML/text is supported).",
    );
  }

  const html = await response.text();
  const { title, body } = stripHtmlToText(html);
  const text = clamp(body, MAX_WEB_CHARS);
  if (text.length < 40) {
    throw new UrlSourceError(
      "empty_content",
      "Couldn't extract enough text from that page. Paste the details manually instead.",
    );
  }
  let host = "";
  try {
    host = new URL(url).hostname.replace(/^www\./, "");
  } catch {
    host = "";
  }
  return {
    kind: "web",
    url,
    title: title || host || url,
    text,
    suggestedName: title || host || "Project",
    technologies: [],
  };
}

/**
 * Fetch readable source text for `url`. GitHub repos get first-class extraction (README +
 * languages + description); any other URL is best-effort HTML→text. Throws {@link UrlSourceError}
 * with a typed `code` on any failure so callers can map to a clear, actionable message.
 */
export async function fetchUrlSource(rawUrl: string): Promise<UrlSourceResult> {
  let url: string;
  try {
    url = new URL(rawUrl).toString();
  } catch {
    throw new UrlSourceError(
      "invalid_url",
      "That doesn't look like a valid URL.",
    );
  }
  const repo = parseGithubRepo(url);
  return repo
    ? fetchGithubSource(url, repo.owner, repo.repo)
    : fetchWebSource(url);
}
