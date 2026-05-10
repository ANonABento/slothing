import { JSDOM } from "jsdom";
import { fetchWithTimeout } from "./fetch-with-timeout";
import type { BlogData, BlogPost, SourceResult } from "./types";

export async function fetchEngBlog(
  domain: string | null,
): Promise<SourceResult<BlogData>> {
  if (!domain) return { ok: false, error: "not_found" };
  const host = domain.replace(/^www\./, "");
  const candidates = [
    `https://${host}/blog`,
    `https://eng.${host}`,
    `https://engineering.${host}`,
  ];

  for (const url of candidates) {
    const result = await fetchWithTimeout(url, {
      allowedHosts: [host],
      timeoutMs: 5000,
    });
    if (!result.ok) return result;
    if (result.response.status === 404) continue;
    if (result.response.status === 403) return { ok: false, error: "blocked" };
    if (!result.response.ok) continue;
    try {
      const posts = parseBlogHtml(await result.response.text(), url);
      if (posts.length > 0) return { ok: true, data: { url, posts } };
    } catch {
      return { ok: false, error: "parse_error" };
    }
  }

  return { ok: false, error: "not_found" };
}

export function parseBlogHtml(html: string, baseUrl: string): BlogPost[] {
  const document = new JSDOM(html).window.document;
  const candidates = Array.from(
    document.querySelectorAll("article, .post, [class*='blog' i]"),
  );
  const blocks =
    candidates.length > 0
      ? candidates
      : Array.from(document.querySelectorAll("a"));

  return blocks
    .map((block): BlogPost | null => {
      const anchor =
        block instanceof document.defaultView!.HTMLAnchorElement
          ? block
          : block.querySelector("a");
      const title =
        block.querySelector("h1,h2,h3")?.textContent?.trim() ??
        anchor?.textContent?.trim();
      const href = anchor?.getAttribute("href");
      if (!title || !href || title.length < 4) return null;
      const paragraph = block.querySelector("p")?.textContent?.trim();
      return {
        title,
        url: new URL(href, baseUrl).toString(),
        excerpt: paragraph || undefined,
      };
    })
    .filter((post): post is BlogPost => post !== null)
    .slice(0, 3);
}
