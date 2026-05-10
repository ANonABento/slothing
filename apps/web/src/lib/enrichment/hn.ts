import { nowEpoch } from "@/lib/format/time";
import { fetchWithTimeout } from "./fetch-with-timeout";
import type { HnData, SourceResult } from "./types";

interface AlgoliaHit {
  objectID: string;
  title?: string;
  url?: string;
  points?: number;
  num_comments?: number;
  created_at?: string;
}

export async function fetchHnMentions(
  company: string,
): Promise<SourceResult<HnData>> {
  const thirtyDaysAgo = Math.floor(
    (nowEpoch() - 30 * 24 * 60 * 60 * 1000) / 1000,
  );
  const url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(
    company,
  )}&tags=story&numericFilters=created_at_i>${thirtyDaysAgo}`;
  const result = await fetchWithTimeout(url, {
    allowedHosts: ["hn.algolia.com"],
  });
  if (!result.ok) return result;
  if (result.response.status === 404) return { ok: false, error: "not_found" };
  if (!result.response.ok) return { ok: false, error: "unknown" };

  try {
    const json = (await result.response.json()) as { hits?: AlgoliaHit[] };
    return {
      ok: true,
      data: {
        stories: (json.hits ?? []).slice(0, 5).map((hit) => ({
          title: hit.title ?? "Untitled",
          url: hit.url,
          points: hit.points ?? 0,
          comments: hit.num_comments ?? 0,
          createdAt: hit.created_at,
          hnUrl: `https://news.ycombinator.com/item?id=${hit.objectID}`,
        })),
      },
    };
  } catch {
    return { ok: false, error: "parse_error" };
  }
}
