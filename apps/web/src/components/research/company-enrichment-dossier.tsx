"use client";

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
import { ExpandableSection } from "@/components/research/expandable-section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  BlogData,
  EnrichmentSnapshot,
  GithubData,
  HnData,
  LevelsData,
  NewsData,
  SourceResult,
} from "@/lib/enrichment";

interface CompanyEnrichmentDossierProps {
  jobId: string;
  companyName: string;
}

export function CompanyEnrichmentDossier({
  jobId,
  companyName,
}: CompanyEnrichmentDossierProps) {
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
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load research");
        if (data.snapshot) {
          setSnapshot(data.snapshot);
        } else if (!forceRefresh) {
          const createRes = await fetch(`/api/companies/${jobId}/enrich`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: "{}",
          });
          const createData = await createRes.json();
          if (!createRes.ok) {
            throw new Error(createData.error || "Failed to enrich company");
          }
          setSnapshot(createData.snapshot);
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

  if (loading && !snapshot) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <div>
            <h3 className="font-semibold">Public research</h3>
            <p className="text-sm text-muted-foreground">
              Building a company dossier...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="p-4 bg-primary/5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Public research dossier</h3>
              <p className="text-sm text-muted-foreground">
                {snapshot ? (
                  <>
                    Updated <TimeAgo date={snapshot.enrichedAt} />
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
            disabled={refreshing}
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

      <ExpandableSection title="GitHub" icon={Github} defaultExpanded>
        <GithubSection result={snapshot?.github ?? null} />
      </ExpandableSection>
      <ExpandableSection title="News" icon={Newspaper} defaultExpanded>
        <NewsSection result={snapshot?.news ?? null} />
      </ExpandableSection>
      <ExpandableSection title="Levels.fyi" icon={BarChart3}>
        <LevelsSection result={snapshot?.levels ?? null} />
      </ExpandableSection>
      <ExpandableSection title="Engineering Blog" icon={Rss}>
        <BlogSection result={snapshot?.blog ?? null} />
      </ExpandableSection>
      <ExpandableSection title="Hacker News" icon={TrendingUp}>
        <HnSection result={snapshot?.hn ?? null} />
      </ExpandableSection>
    </div>
  );
}

function EmptySource<T>({ result }: { result: SourceResult<T> | null }) {
  const detail =
    result && !result.ok ? ` (${result.error.replace("_", " ")})` : "";
  return (
    <p className="text-sm text-muted-foreground">No data available{detail}.</p>
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
      <div className="grid gap-2 sm:grid-cols-3">
        <Metric label="Stars" value={formatNumber(data.totalStars)} />
        <Metric label="Repos" value={formatNumber(data.publicRepos)} />
        <Metric label="Followers" value={formatNumber(data.followers)} />
      </div>
      <ChipRow values={data.topLanguages} />
      <div className="space-y-2">
        {data.recentRepos.map((repo) => (
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
      {result.data.headlines.map((item) => (
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
  if (!result?.ok) return <EmptySource result={result} />;
  return (
    <div className="space-y-3 text-sm">
      {result.data.medianTotalComp && (
        <Metric label="Median total comp" value={result.data.medianTotalComp} />
      )}
      {result.data.roles.map((role) => (
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
      {result.data.posts.map((post) => (
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
      {result.data.stories.map((story) => (
        <ExternalItem
          key={story.hnUrl}
          href={story.hnUrl}
          title={story.title}
          description={`${story.points} points · ${story.comments} comments`}
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
        <span className="font-medium text-sm">{title}</span>
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
  children: React.ReactNode;
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
