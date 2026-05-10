import { fetchWithTimeout } from "./fetch-with-timeout";
import type { GithubData, SourceResult } from "./types";

interface GithubOrgResponse {
  login: string;
  html_url: string;
  public_repos: number;
  followers: number;
  blog?: string;
}

interface GithubRepoResponse {
  name: string;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  description: string | null;
  pushed_at: string | null;
}

async function fetchGithubOrgAttempt(
  slug: string,
): Promise<SourceResult<GithubData>> {
  if (!slug) return { ok: false, error: "not_found" };
  const orgUrl = `https://api.github.com/orgs/${encodeURIComponent(slug)}`;
  const reposUrl = `${orgUrl}/repos?per_page=100&sort=updated`;

  const orgResponse = await fetchWithTimeout(orgUrl, {
    allowedHosts: ["api.github.com"],
  });
  if (!orgResponse.ok) return orgResponse;
  if (orgResponse.response.status === 404) {
    return { ok: false, error: "not_found" };
  }
  if (isRateLimited(orgResponse.response)) {
    return { ok: false, error: "rate_limited" };
  }
  if (!orgResponse.response.ok) return { ok: false, error: "unknown" };

  const reposResponse = await fetchWithTimeout(reposUrl, {
    allowedHosts: ["api.github.com"],
  });
  if (!reposResponse.ok) return reposResponse;
  if (isRateLimited(reposResponse.response)) {
    return { ok: false, error: "rate_limited" };
  }
  if (!reposResponse.response.ok) return { ok: false, error: "unknown" };

  try {
    const org = (await orgResponse.response.json()) as GithubOrgResponse;
    const repos = (await reposResponse.response.json()) as GithubRepoResponse[];
    const languageCounts = new Map<string, number>();
    for (const repo of repos) {
      if (repo.language) {
        languageCounts.set(
          repo.language,
          (languageCounts.get(repo.language) ?? 0) + 1,
        );
      }
    }

    return {
      ok: true,
      data: {
        org: org.login,
        url: org.html_url,
        resolvedSlug: slug,
        totalStars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
        publicRepos: org.public_repos,
        followers: org.followers,
        blogUrl: org.blog || undefined,
        topLanguages: Array.from(languageCounts.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([language]) => language),
        recentRepos: repos.slice(0, 5).map((repo) => ({
          name: repo.name,
          url: repo.html_url,
          stars: repo.stargazers_count,
          description: repo.description ?? undefined,
          pushedAt: repo.pushed_at ?? undefined,
        })),
      },
    };
  } catch {
    return { ok: false, error: "parse_error" };
  }
}

export async function fetchGithubOrg(
  slugOrCandidates: string | string[],
): Promise<SourceResult<GithubData>> {
  const candidates = Array.isArray(slugOrCandidates)
    ? slugOrCandidates
    : [slugOrCandidates];
  const deduped = Array.from(
    new Set(candidates.map((candidate) => candidate.trim()).filter(Boolean)),
  );

  if (deduped.length === 0) return { ok: false, error: "not_found" };

  let lastNotFound: SourceResult<GithubData> = {
    ok: false,
    error: "not_found",
  };
  for (const candidate of deduped) {
    const result = await fetchGithubOrgAttempt(candidate);
    if (result.ok) return result;
    if (result.error !== "not_found") return result;
    lastNotFound = result;
  }

  return lastNotFound;
}

function isRateLimited(response: Response): boolean {
  return (
    response.status === 429 ||
    (response.status === 403 &&
      response.headers.get("X-RateLimit-Remaining") === "0")
  );
}
