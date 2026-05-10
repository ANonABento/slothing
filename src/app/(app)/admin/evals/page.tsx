"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, BarChart3, Database, RefreshCcw } from "lucide-react";
import { EvalFilters } from "@/components/admin/evals/eval-filters";
import { EvalTrendCharts } from "@/components/admin/evals/eval-trend-charts";
import { RunHistoryTable } from "@/components/admin/evals/run-history-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AppPage,
  CenteredPagePanel,
  PageContent,
  PageHeader,
  PageLoadingState,
  StandardEmptyState,
  pageGridClasses,
} from "@/components/ui/page-layout";
import type {
  EvalDashboardPayload,
  EvalRunSummary,
  ModelKey,
} from "@/lib/admin/evals/types";
import type { DataPoint, TimeRange } from "@/lib/analytics/time-series";
import { addDays, nowDate, parseToDate } from "@/lib/format/time";
import { pluralize } from "@/lib/text/pluralize";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(value);
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return Number(
    (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2),
  );
}

function rangeStart(range: TimeRange): number {
  if (range === "all") return Number.NEGATIVE_INFINITY;
  const date = nowDate();
  if (range === "7d") return addDays(date, -7).getTime();
  if (range === "30d") return addDays(date, -30).getTime();
  if (range === "90d") return addDays(date, -90).getTime();
  if (range === "1y") date.setFullYear(date.getFullYear() - 1);
  return date.getTime();
}

function trendLabel(dateKey: string): string {
  const [, month, day] = dateKey.split("-");
  return `${month}/${day}`;
}

function point(date: string, value: number): DataPoint {
  return { date, label: trendLabel(date), value };
}

function buildClientTrends(runs: EvalRunSummary[]) {
  const buckets = new Map<
    string,
    {
      gpt: number[];
      claude: number[];
      cost: number;
      runs: number;
    }
  >();

  for (const run of runs) {
    const key = run.runAt.slice(0, 10);
    const bucket = buckets.get(key) ?? { gpt: [], claude: [], cost: 0, runs: 0 };
    if (run.avgScoreGpt55 !== null) bucket.gpt.push(run.avgScoreGpt55);
    if (run.avgScoreClaude !== null) bucket.claude.push(run.avgScoreClaude);
    bucket.cost += run.estimatedCostUsd;
    bucket.runs += 1;
    buckets.set(key, bucket);
  }

  const keys = Array.from(buckets.keys()).sort();
  return {
    avgScoreGpt55: keys.map((key) => point(key, average(buckets.get(key)!.gpt))),
    avgScoreClaude: keys.map((key) =>
      point(key, average(buckets.get(key)!.claude)),
    ),
    cost: keys.map((key) =>
      point(key, Number(buckets.get(key)!.cost.toFixed(4))),
    ),
    runs: keys.map((key) => point(key, buckets.get(key)!.runs)),
  };
}

export default function AdminEvalsPage() {
  const [payload, setPayload] = useState<EvalDashboardPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [model, setModel] = useState<"all" | ModelKey>("all");
  const [evalSet, setEvalSet] = useState("all");
  const [range, setRange] = useState<TimeRange>("30d");

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/evals");
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "Failed to load evals");
        if (alive) {
          setPayload(data);
          setError(null);
        }
      } catch (err) {
        if (alive) {
          setError(err instanceof Error ? err.message : "Failed to load evals");
        }
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  const filteredRuns = useMemo(() => {
    if (!payload) return [];
    const start = rangeStart(range);
    return payload.runs.filter((run) => {
      const inSet = evalSet === "all" || run.evalSetKey === evalSet;
      const inRange = (parseToDate(run.runAt)?.getTime() ?? 0) >= start;
      return inSet && inRange;
    });
  }, [payload, evalSet, range]);

  const filteredRunIds = useMemo(
    () => new Set(filteredRuns.map((run) => run.id)),
    [filteredRuns],
  );

  const filteredCases = useMemo(() => {
    if (!payload) return [];
    return payload.cases.filter((row) => filteredRunIds.has(row.runId));
  }, [payload, filteredRunIds]);

  const trends = useMemo(() => buildClientTrends(filteredRuns), [filteredRuns]);

  const totals = useMemo(() => {
    const gptScores = filteredRuns
      .map((run) => run.avgScoreGpt55)
      .filter((score): score is number => score !== null);
    const claudeScores = filteredRuns
      .map((run) => run.avgScoreClaude)
      .filter((score): score is number => score !== null);
    return {
      cases: filteredRuns.reduce((sum, run) => sum + run.totalCases, 0),
      cost: filteredRuns.reduce((sum, run) => sum + run.estimatedCostUsd, 0),
      gptScore: average(gptScores),
      claudeScore: average(claudeScores),
    };
  }, [filteredRuns]);

  if (loading && !payload) {
    return <PageLoadingState icon={RefreshCcw} label="Loading eval metrics..." />;
  }

  if (error) {
    return (
      <CenteredPagePanel>
        <div className="text-center">
          <AlertTriangle className="mx-auto h-10 w-10 text-destructive" />
          <h1 className="mt-4 text-lg font-semibold">Could not load evals</h1>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        </div>
      </CenteredPagePanel>
    );
  }

  if (!payload) return null;

  return (
    <AppPage>
      <PageHeader
        title="Eval Metrics"
        description="Track LLM eval runs, model quality, estimated cost, and sample outputs."
        icon={BarChart3}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={payload.source === "sample" ? "warning" : "success"}>
              {payload.source === "sample" ? "Sample data" : "Report data"}
            </Badge>
            <Badge variant="outline">{pluralize(filteredRuns.length, "run")}</Badge>
          </div>
        }
      />
      <PageContent className="space-y-6">
        <EvalFilters
          model={model}
          evalSet={evalSet}
          range={range}
          evalSets={payload.evalSets}
          onModelChange={setModel}
          onEvalSetChange={setEvalSet}
          onRangeChange={setRange}
        />

        <div className={pageGridClasses.fourStats}>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Runs</p>
            <p className="mt-2 text-2xl font-semibold">{filteredRuns.length}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Cases</p>
            <p className="mt-2 text-2xl font-semibold">{totals.cases}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Avg score</p>
            <p className="mt-2 text-2xl font-semibold">
              {model === "claude" ? totals.claudeScore : totals.gptScore}
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Est. cost</p>
            <p className="mt-2 text-2xl font-semibold">
              {formatCurrency(totals.cost)}
            </p>
          </div>
        </div>

        {filteredRuns.length === 0 ? (
          <StandardEmptyState
            icon={Database}
            title="No eval runs match these filters"
            description="Adjust the model, eval set, or date range to inspect more runs."
          />
        ) : (
          <>
            <EvalTrendCharts
              avgScoreGpt55={trends.avgScoreGpt55}
              avgScoreClaude={trends.avgScoreClaude}
              cost={trends.cost}
              runs={trends.runs}
              model={model}
            />
            <RunHistoryTable
              runs={filteredRuns}
              cases={filteredCases}
              model={model}
            />
          </>
        )}
      </PageContent>
    </AppPage>
  );
}
