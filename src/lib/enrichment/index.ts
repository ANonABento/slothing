import { saveCompanyEnrichment } from "@/lib/db/company-research";
import { nowIso } from "@/lib/format/time";
import { fetchEngBlog } from "./blog";
import { fetchGithubOrg } from "./github";
import { fetchHnMentions } from "./hn";
import { fetchLevels } from "./levels";
import { fetchNews } from "./news";
import type { EnrichmentSnapshot, SourceError, SourceResult } from "./types";
import { compactCompanySlug, domainFromUrl, githubOrgFromUrl } from "./utils";

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
  const derivedGithubOrg =
    githubOrg ??
    githubOrgFromUrl(companyUrl) ??
    compactCompanySlug(companyName);
  const domain = domainFromUrl(companyUrl);
  const settled = await Promise.allSettled([
    fetchGithubOrg(derivedGithubOrg),
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
