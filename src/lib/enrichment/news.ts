import { fetchWithTimeout } from "./fetch-with-timeout";
import type { NewsData, NewsItem, SourceResult } from "./types";
import { decodeXml } from "./utils";

export async function fetchNews(
  company: string,
): Promise<SourceResult<NewsData>> {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(
    company,
  )}+when:7d&hl=en`;
  const result = await fetchWithTimeout(url, {
    allowedHosts: ["news.google.com"],
  });
  if (!result.ok) return result;
  if (result.response.status === 404) return { ok: false, error: "not_found" };
  if (!result.response.ok) return { ok: false, error: "unknown" };
  try {
    return {
      ok: true,
      data: { headlines: parseNewsRss(await result.response.text()) },
    };
  } catch {
    return { ok: false, error: "parse_error" };
  }
}

export function parseNewsRss(xml: string): NewsItem[] {
  const itemBlocks = [...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)];
  if (itemBlocks.length === 0 && /<channel\b/i.test(xml)) return [];
  if (itemBlocks.length === 0) throw new Error("Missing RSS items");

  return itemBlocks.slice(0, 5).map(([, block]) => ({
    title: tag(block, "title") ?? "Untitled",
    link: tag(block, "link") ?? "",
    pubDate: tag(block, "pubDate"),
    source: tag(block, "source"),
  }));
}

function tag(block: string, name: string): string | undefined {
  const match = block.match(
    new RegExp(`<${name}\\b[^>]*>([\\s\\S]*?)<\\/${name}>`, "i"),
  );
  return match ? decodeXml(match[1]) : undefined;
}
