"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import {
  BarChart3,
  Building2,
  ExternalLink,
  Github,
  Loader2,
  Newspaper,
  RefreshCw,
  Rss,
  TrendingUp,
} from "lucide-react";
import { TimeAgo } from "@/components/format/time-ago";
import { EditGithubSlugButton } from "@/components/research/edit-github-slug-button";
import { QuickResearchLinks } from "@/components/research/quick-research-links";
import {
  SourceCard,
  type SourceCardState,
} from "@/components/research/source-card";
import { Button } from "@/components/ui/button";
import { Skeleton, SkeletonChart } from "@/components/ui/skeleton";
import type {
  BlogData,
  EnrichmentSnapshot,
  GithubData,
  HnData,
  LevelsData,
  NewsData,
  SourceResult,
} from "@/lib/enrichment";
import { pluralize } from "@/lib/text/pluralize";
import { cn } from "@/lib/utils";
import { useA11yTranslations } from "@/lib/i18n/use-a11y-translations";

interface CompanyEnrichmentDossierProps {
  jobId: string;
  companyName: string;
}

export function CompanyEnrichmentDossier({
  jobId,
  companyName,
}: CompanyEnrichmentDossierProps) {
  const a11yT = useA11yTranslations();

  const [snapshot, setSnapshot] = useState<EnrichmentSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSnapshot = useCallback(
    async (forceRefresh = false) => {
      setError(null);
      if (forceRefresh) setRefreshing(true);
      try {
        const res = await fetch(
          `/api/companies/${jobId}/enrich${forceRefresh ? "?refresh=true" : ""}`,
          {
            method: forceRefresh ? "POST" : "GET",
            headers: { "content-type": "application/json" },
            body: forceRefresh ? "{}" : undefined,
          },
        );
        const data = await readJson(res);
        if (!res.ok) {
          throw new Error(readError(data, "Failed to load research"));
        }
        if (data.snapshot) {
          setSnapshot(data.snapshot as EnrichmentSnapshot);
        } else if (!forceRefresh) {
          const createRes = await fetch(`/api/companies/${jobId}/enrich`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: "{}",
          });
          const createData = await readJson(createRes);
          if (!createRes.ok) {
            throw new Error(readError(createData, "Failed to enrich company"));
          }
          setSnapshot(createData.snapshot as EnrichmentSnapshot);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load research",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [jobId],
  );

  useEffect(() => {
    void fetchSnapshot();
  }, [fetchSnapshot]);

  const isInitialLoading = loading && !snapshot;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold">Public research dossier</h2>
              <p className="text-sm text-muted-foreground">
                {snapshot ? (
                  <>
                    Last enriched <TimeAgo date={snapshot.enrichedAt} />
                  </>
                ) : (
                  `No public research saved for ${companyName}`
                )}
              </p>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fetchSnapshot(true)}
            disabled={refreshing || isInitialLoading}
            className="shrink-0"
          >
            {refreshing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {isInitialLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="rounded-lg border bg-card p-4">
              <div className="mb-4 flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-5 w-24" />
              </div>
              <SkeletonChart className="border-0 p-0 shadow-none" />
            </div>
          ))
        ) : (
          <>
            <SourceCard
              title={a11yT("github")}
              icon={Github}
              state={sourceState(snapshot?.github ?? null, isInitialLoading)}
              errorMessage={sourceError("GitHub", snapshot?.github ?? null)}
              onRetry={() => fetchSnapshot(true)}
              headerAction={
                <EditGithubSlugButton
                  jobId={jobId}
                  currentSlug={
                    snapshot?.github?.ok
                      ? snapshot.github.data.resolvedSlug
                      : null
                  }
                  onSlugSaved={() => fetchSnapshot(true)}
                />
              }
            >
              <GithubSection result={snapshot?.github ?? null} />
            </SourceCard>

            <SourceCard
              title={a11yT("news")}
              icon={Newspaper}
              state={sourceState(
                snapshot?.news ?? null,
                isInitialLoading,
                (data) => data.headlines.length > 0,
              )}
              errorMessage={sourceError("News", snapshot?.news ?? null)}
              onRetry={() => fetchSnapshot(true)}
            >
              <NewsSection result={snapshot?.news ?? null} />
            </SourceCard>

            <SourceCard
              title={a11yT("levels")}
              icon={BarChart3}
              state={sourceState(
                snapshot?.levels ?? null,
                isInitialLoading,
                (data) =>
                  Boolean(data.medianTotalComp) || data.roles.length > 0,
              )}
              errorMessage={sourceError("Levels", snapshot?.levels ?? null)}
              onRetry={() => fetchSnapshot(true)}
            >
              <LevelsSection result={snapshot?.levels ?? null} />
            </SourceCard>

            <SourceCard
              title={a11yT("engBlog")}
              icon={Rss}
              state={sourceState(
                snapshot?.blog ?? null,
                isInitialLoading,
                (data) => data.posts.length > 0,
              )}
              errorMessage={sourceError("Eng Blog", snapshot?.blog ?? null)}
              onRetry={() => fetchSnapshot(true)}
            >
              <BlogSection result={snapshot?.blog ?? null} />
            </SourceCard>

            <SourceCard
              title="HN"
              icon={TrendingUp}
              state={sourceState(
                snapshot?.hn ?? null,
                isInitialLoading,
                (data) => data.stories.length > 0,
              )}
              errorMessage={sourceError("HN", snapshot?.hn ?? null)}
              onRetry={() => fetchSnapshot(true)}
            >
              <HnSection result={snapshot?.hn ?? null} />
            </SourceCard>
          </>
        )}
      </div>

      <QuickResearchLinks companyName={companyName} />
    </div>
  );
}

async function readJson(response: Response): Promise<Record<string, unknown>> {
  try {
    return (await response.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function readError(data: Record<string, unknown>, fallback: string): string {
  return typeof data.error === "string" ? data.error : fallback;
}

function sourceState<T>(
  result: SourceResult<T> | null,
  loading: boolean,
  hasUsefulData: (data: T) => boolean = () => true,
): SourceCardState {
  if (loading && !result) return "loading";
  if (!result) return "no-data";
  if (!result.ok) return result.error === "not_found" ? "no-data" : "error";
  return hasUsefulData(result.data) ? "has-data" : "no-data";
}

function sourceError<T>(
  source: string,
  result: SourceResult<T> | null,
): string | undefined {
  if (!result || result.ok || result.error === "not_found") return undefined;
  return `Couldn't reach ${source}: ${result.error.replace("_", " ")}`;
}

function EmptySource<T>({ result }: { result: SourceResult<T> | null }) {
  const detail =
    result && !result.ok ? ` (${result.error.replace("_", " ")})` : "";
  return (
    <p className="text-sm text-muted-foreground">No data found{detail}.</p>
  );
}

function GithubSection({
  result,
}: {
  result: SourceResult<GithubData> | null;
}) {
  if (!result?.ok) return <EmptySource result={result} />;
  const data = result.data;
  return (
    <div className="space-y-4 text-sm">
      <div className="grid gap-2">
        <Metric label="Stars" value={formatNumber(data.totalStars)} />
        <Metric label="Repos" value={formatNumber(data.publicRepos)} />
        <Metric label="Followers" value={formatNumber(data.followers)} />
      </div>
      <ChipRow values={data.topLanguages} />
      <div className="space-y-2">
        {data.recentRepos.slice(0, 5).map((repo) => (
          <ExternalItem
            key={repo.url}
            href={repo.url}
            title={`${repo.name} · ${formatNumber(repo.stars)} stars`}
            description={repo.description}
          />
        ))}
      </div>
    </div>
  );
}

function NewsSection({ result }: { result: SourceResult<NewsData> | null }) {
  if (!result?.ok || result.data.headlines.length === 0) {
    return <EmptySource result={result} />;
  }
  return (
    <div className="space-y-2">
      {result.data.headlines.slice(0, 5).map((item) => (
        <ExternalItem
          key={`${item.title}-${item.link}`}
          href={item.link}
          title={item.title}
          description={item.source ?? item.pubDate}
        />
      ))}
    </div>
  );
}

function LevelsSection({
  result,
}: {
  result: SourceResult<LevelsData> | null;
}) {
  if (
    !result?.ok ||
    (!result.data.medianTotalComp && result.data.roles.length === 0)
  ) {
    return <EmptySource result={result} />;
  }
  return (
    <div className="space-y-3 text-sm">
      {result.data.medianTotalComp && (
        <Metric label="Median total comp" value={result.data.medianTotalComp} />
      )}
      {result.data.roles.slice(0, 5).map((role) => (
        <div
          key={`${role.role}-${role.totalComp}`}
          className="flex justify-between gap-3"
        >
          <span>{role.role}</span>
          <span className="font-medium">{role.totalComp}</span>
        </div>
      ))}
      <ExternalLinkText href={result.data.url}>
        Open Levels.fyi
      </ExternalLinkText>
    </div>
  );
}

function BlogSection({ result }: { result: SourceResult<BlogData> | null }) {
  if (!result?.ok || result.data.posts.length === 0) {
    return <EmptySource result={result} />;
  }
  return (
    <div className="space-y-2">
      {result.data.posts.slice(0, 5).map((post) => (
        <ExternalItem
          key={post.url}
          href={post.url}
          title={post.title}
          description={post.excerpt}
        />
      ))}
    </div>
  );
}

function HnSection({ result }: { result: SourceResult<HnData> | null }) {
  if (!result?.ok || result.data.stories.length === 0) {
    return <EmptySource result={result} />;
  }
  return (
    <div className="space-y-2">
      {result.data.stories.slice(0, 5).map((story) => (
        <ExternalItem
          key={story.hnUrl}
          href={story.hnUrl}
          title={story.title}
          description={`${pluralize(story.points, "point")} · ${pluralize(
            story.comments,
            "comment",
          )}`}
        />
      ))}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/50 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}

function ChipRow({ values }: { values: string[] }) {
  if (values.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {values.map((value) => (
        <span
          key={value}
          className="rounded-md border px-2 py-1 text-xs text-muted-foreground"
        >
          {value}
        </span>
      ))}
    </div>
  );
}

function ExternalItem({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "block rounded-lg border p-3 transition-colors hover:bg-muted/50",
      )}
    >
      <span className="flex items-start justify-between gap-3">
        <span className="text-sm font-medium">{title}</span>
        <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
      </span>
      {description && (
        <span className="mt-1 block text-xs text-muted-foreground">
          {description}
        </span>
      )}
    </a>
  );
}

function ExternalLinkText({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
    >
      {children}
      <ExternalLink className="h-3.5 w-3.5" />
    </a>
  );
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}
