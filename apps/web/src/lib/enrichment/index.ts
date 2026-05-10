import {
  saveCompanyEnrichment,
  setCompanyGithubSlug,
} from "@/lib/db/company-research";
import { nowIso } from "@/lib/format/time";
import { fetchEngBlog } from "./blog";
import { fetchGithubOrg } from "./github";
import { fetchHnMentions } from "./hn";
import { fetchLevels } from "./levels";
import { fetchNews } from "./news";
import type { EnrichmentSnapshot, SourceError, SourceResult } from "./types";
import { domainFromUrl, githubOrgFromUrl, githubSlugCandidates } from "./utils";

interface EnrichCompanyOptions {
  companyName: string;
  companyUrl?: string | null;
  githubOrg?: string | null;
  userId: string;
}

export async function enrichCompany({
  companyName,
  companyUrl,
  githubOrg,
  userId,
}: EnrichCompanyOptions): Promise<EnrichmentSnapshot> {
  const urlGithubOrg = githubOrgFromUrl(companyUrl);
  const derivedGithubOrgs = githubOrg
    ? [githubOrg]
    : Array.from(
        new Set(
          [urlGithubOrg, ...githubSlugCandidates(companyName)].filter(
            (candidate): candidate is string => Boolean(candidate),
          ),
        ),
      );
  const domain = domainFromUrl(companyUrl);
  const settled = await Promise.allSettled([
    fetchGithubOrg(derivedGithubOrgs),
    fetchNews(companyName),
    fetchLevels(companyName),
    fetchEngBlog(domain),
    fetchHnMentions(companyName),
  ]);
  const enrichedAt = nowIso();
  const snapshot: EnrichmentSnapshot = {
    version: 1,
    github: normalizeSettled(settled[0]),
    news: normalizeSettled(settled[1]),
    levels: normalizeSettled(settled[2]),
    blog: normalizeSettled(settled[3]),
    hn: normalizeSettled(settled[4]),
    enrichedAt,
  };

  saveCompanyEnrichment(userId, companyName, snapshot);
  if (snapshot.github?.ok && snapshot.github.data.resolvedSlug) {
    setCompanyGithubSlug(
      userId,
      companyName,
      snapshot.github.data.resolvedSlug,
    );
  }
  return snapshot;
}

function normalizeSettled<T>(
  settled: PromiseSettledResult<SourceResult<T>>,
): SourceResult<T> {
  if (settled.status === "fulfilled") return settled.value;
  return { ok: false, error: mapRejection(settled.reason) };
}

function mapRejection(reason: unknown): SourceError {
  if (reason instanceof Error && /timeout|abort/i.test(reason.name)) {
    return "timeout";
  }
  return "unknown";
}

export * from "./types";
