"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  BarChart3,
  Download,
  Eye,
  FileText,
  Loader2,
  MousePointerClick,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AppPage,
  PageContent,
  PageHeader,
  StandardEmptyState,
} from "@/components/ui/page-layout";

interface ResumeAnalytics {
  overview: {
    totalViews: number;
    totalDownloads: number;
    totalShareClicks: number;
    totalEvents: number;
  };
  trend: Array<{
    date: string;
    views: number;
    downloads: number;
    shareClicks: number;
  }>;
  topPerformers: Array<{
    resumeId: string;
    jobId: string;
    jobTitle: string;
    company: string;
    createdAt: string;
    views: number;
    downloads: number;
    shareClicks: number;
    totalEvents: number;
  }>;
}

const RANGE_OPTIONS = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
] as const;

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export default function ResumeAnalyticsPage() {
  const [analytics, setAnalytics] = useState<ResumeAnalytics | null>(null);
  const [days, setDays] = useState(30);
  const [requestId, setRequestId] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const maxTrendValue = useMemo(() => {
    return Math.max(
      1,
      ...(analytics?.trend.map(
        (point) => point.views + point.downloads + point.shareClicks,
      ) ?? [0]),
    );
  }, [analytics]);

  useEffect(() => {
    let canceled = false;

    async function fetchResumeAnalytics() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/analytics/resumes?days=${days}`);
        if (!response.ok) throw new Error("Failed to fetch resume analytics");
        const data = (await response.json()) as ResumeAnalytics;
        if (!canceled) setAnalytics(data);
      } catch (err) {
        if (!canceled) {
          setError(
            err instanceof Error ? err.message : "Failed to load analytics",
          );
        }
      } finally {
        if (!canceled) setLoading(false);
      }
    }

    void fetchResumeAnalytics();

    return () => {
      canceled = true;
    };
  }, [days, requestId]);

  if (loading && !analytics) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">
            Loading resume analytics...
          </p>
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
          <p className="text-muted-foreground">
            {error || "Failed to load analytics"}
          </p>
          <Button onClick={() => setRequestId((current) => current + 1)}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <AppPage>
      <PageHeader
        icon={FileText}
        eyebrow="Resume analytics"
        title="Resume Performance"
        description="Track views, downloads, and share clicks for generated resumes."
        actions={
          <div className="flex items-center gap-2">
            {RANGE_OPTIONS.map((option) => (
              <Button
                key={option.days}
                type="button"
                size="sm"
                variant={days === option.days ? "default" : "outline"}
                onClick={() => setDays(option.days)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        }
      />

      <PageContent>
        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border bg-card p-5">
              <div className="mb-4 flex items-center justify-between">
                <Eye className="h-5 w-5 text-info" />
                <span className="text-2xl font-bold">
                  {analytics.overview.totalViews}
                </span>
              </div>
              <h3 className="font-medium">Views</h3>
              <p className="text-sm text-muted-foreground">
                Opened resume previews
              </p>
            </div>

            <div className="rounded-lg border bg-card p-5">
              <div className="mb-4 flex items-center justify-between">
                <Download className="h-5 w-5 text-success" />
                <span className="text-2xl font-bold">
                  {analytics.overview.totalDownloads}
                </span>
              </div>
              <h3 className="font-medium">Downloads</h3>
              <p className="text-sm text-muted-foreground">
                Exported resume files
              </p>
            </div>

            <div className="rounded-lg border bg-card p-5">
              <div className="mb-4 flex items-center justify-between">
                <Share2 className="h-5 w-5 text-warning" />
                <span className="text-2xl font-bold">
                  {analytics.overview.totalShareClicks}
                </span>
              </div>
              <h3 className="font-medium">Share Clicks</h3>
              <p className="text-sm text-muted-foreground">
                Tracked share actions
              </p>
            </div>

            <div className="rounded-lg border bg-card p-5">
              <div className="mb-4 flex items-center justify-between">
                <MousePointerClick className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">
                  {analytics.overview.totalEvents}
                </span>
              </div>
              <h3 className="font-medium">Total Events</h3>
              <p className="text-sm text-muted-foreground">
                All resume engagement
              </p>
            </div>
          </div>

          <section className="rounded-lg border bg-card p-6">
            <div className="mb-6 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Trend Over Time</h2>
            </div>

            {analytics.trend.length > 0 ? (
              <div className="flex h-64 items-end gap-3 overflow-x-auto border-b border-l px-4 pb-4">
                {analytics.trend.map((point) => {
                  const total =
                    point.views + point.downloads + point.shareClicks;
                  const height = Math.max(8, (total / maxTrendValue) * 220);

                  return (
                    <div
                      key={point.date}
                      className="flex min-w-16 flex-1 flex-col items-center gap-2"
                    >
                      <div
                        className="flex w-full max-w-12 flex-col justify-end overflow-hidden rounded-t-md bg-muted"
                        style={{ height: `${height}px` }}
                        title={`${total} events`}
                      >
                        <div
                          className="bg-warning"
                          style={{
                            height: `${total ? (point.shareClicks / total) * 100 : 0}%`,
                          }}
                        />
                        <div
                          className="bg-success"
                          style={{
                            height: `${total ? (point.downloads / total) * 100 : 0}%`,
                          }}
                        />
                        <div
                          className="bg-info"
                          style={{
                            height: `${total ? (point.views / total) * 100 : 0}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(point.date)}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <StandardEmptyState
                icon={BarChart3}
                title="No resume events yet"
                className="min-h-56"
              />
            )}
          </section>

          <section className="rounded-lg border bg-card p-6">
            <h2 className="mb-6 font-semibold">Top Performers</h2>

            {analytics.topPerformers.length > 0 ? (
              <div className="space-y-3">
                {analytics.topPerformers.map((resume) => (
                  <div
                    key={resume.resumeId}
                    className="grid gap-4 rounded-md border px-4 py-3 text-sm md:grid-cols-[1fr_auto]"
                  >
                    <div>
                      <Link
                        href={`/api/resume/view?resumeId=${encodeURIComponent(resume.resumeId)}`}
                        target="_blank"
                        className="font-medium hover:underline"
                      >
                        {resume.jobTitle}
                      </Link>
                      <p className="text-muted-foreground">
                        {resume.company || "No company"} · Created{" "}
                        {formatDate(resume.createdAt)}
                      </p>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-right">
                      <div>
                        <p className="font-semibold">{resume.views}</p>
                        <p className="text-xs text-muted-foreground">Views</p>
                      </div>
                      <div>
                        <p className="font-semibold">{resume.downloads}</p>
                        <p className="text-xs text-muted-foreground">
                          Downloads
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold">{resume.shareClicks}</p>
                        <p className="text-xs text-muted-foreground">Shares</p>
                      </div>
                      <div>
                        <p className="font-semibold">{resume.totalEvents}</p>
                        <p className="text-xs text-muted-foreground">Total</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <StandardEmptyState
                icon={FileText}
                title="No generated resumes yet"
                action={
                  <Button asChild variant="outline">
                    <Link href="/studio">Create a resume</Link>
                  </Button>
                }
                className="min-h-56"
              />
            )}
          </section>
        </div>
      </PageContent>
    </AppPage>
  );
}
