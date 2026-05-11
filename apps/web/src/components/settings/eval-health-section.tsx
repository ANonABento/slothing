"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Activity, ExternalLink } from "lucide-react";
import { TimeAgo } from "@/components/format/time-ago";
import { PageSection, pageGridClasses } from "@/components/ui/page-layout";
import type {
  EvalDashboardPayload,
  EvalRunSummary,
} from "@/lib/admin/evals/types";
import { cn } from "@/lib/utils";
import { useA11yTranslations } from "@/lib/i18n/use-a11y-translations";

const EVAL_RAW_EXPORT_URL = "/api/admin/evals";

type FetchState =
  | { status: "loading" }
  | { status: "hidden" }
  | { status: "empty" }
  | { status: "ready"; payload: EvalDashboardPayload };

export function EvalHealthSection() {
  const a11yT = useA11yTranslations();

  const [state, setState] = useState<FetchState>({ status: "loading" });

  useEffect(() => {
    let alive = true;

    async function loadEvalHealth() {
      try {
        const response = await fetch(EVAL_RAW_EXPORT_URL);
        if (!alive) return;

        if (!response.ok) {
          setState({ status: "hidden" });
          return;
        }

        const payload = (await response.json()) as EvalDashboardPayload;
        setState(
          payload.source === "sample" || payload.runs.length === 0
            ? { status: "empty" }
            : { status: "ready", payload },
        );
      } catch {
        if (alive) setState({ status: "hidden" });
      }
    }

    void loadEvalHealth();

    return () => {
      alive = false;
    };
  }, []);

  if (state.status === "loading" || state.status === "hidden") return null;

  return (
    <PageSection
      title={a11yT("evalHealth")}
      description="LLM eval runs across configured judges and generators."
      icon={Activity}
    >
      {state.status === "empty" ? (
        <p className="text-sm italic text-muted-foreground">
          No eval runs recorded. Run{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs text-foreground">
            npm run eval
          </code>{" "}
          to seed data.
        </p>
      ) : (
        <EvalHealthBody payload={state.payload} />
      )}
    </PageSection>
  );
}

function EvalHealthBody({ payload }: { payload: EvalDashboardPayload }) {
  const a11yT = useA11yTranslations();

  const runs = payload.runs;
  const stats = useMemo(() => buildEvalStats(runs), [runs]);
  const sparklinePoints = useMemo(() => buildSparklinePoints(runs), [runs]);

  return (
    <div className="space-y-4">
      <dl className={pageGridClasses.fourStats}>
        <MiniKpi label="Last run">
          {runs[0] ? <TimeAgo date={runs[0].runAt} /> : "Unknown"}
        </MiniKpi>
        <MiniKpi label="Runs">{formatInteger(runs.length)}</MiniKpi>
        <MiniKpi label="Avg score">
          {stats.avgScore === null ? "N/A" : stats.avgScore.toFixed(2)}
        </MiniKpi>
        <MiniKpi label="Est. cost">{formatCurrency(stats.totalCost)}</MiniKpi>
      </dl>

      <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
        {sparklinePoints ? (
          <svg
            aria-label={a11yT("averageScoreTrend")}
            className="h-6 w-20 text-primary"
            role="img"
            viewBox="0 0 80 24"
          >
            <polyline
              points={sparklinePoints}
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        ) : (
          <span className="text-xs text-muted-foreground">
            Add another run to show trend.
          </span>
        )}

        <a
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          href={EVAL_RAW_EXPORT_URL}
          rel="noopener noreferrer"
          target="_blank"
        >
          View raw exports
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

function MiniKpi({
  children,
  className,
  label,
}: {
  children: ReactNode;
  className?: string;
  label: string;
}) {
  return (
    <div className={cn("rounded-md border bg-muted/30 px-3 py-2", className)}>
      <dt className="text-xs font-medium uppercase tracking-normal text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-lg font-semibold text-foreground">{children}</dd>
    </div>
  );
}

function buildEvalStats(runs: EvalRunSummary[]) {
  const scores = runs.flatMap((run) =>
    [run.avgScoreGpt55, run.avgScoreClaude].filter(
      (score): score is number => score !== null,
    ),
  );
  const totalCost = runs.reduce((sum, run) => sum + run.estimatedCostUsd, 0);

  return {
    avgScore:
      scores.length === 0
        ? null
        : scores.reduce((sum, score) => sum + score, 0) / scores.length,
    totalCost,
  };
}

function buildSparklinePoints(runs: EvalRunSummary[]) {
  const points = runs
    .slice()
    .reverse()
    .map((run) => run.avgScoreGpt55 ?? run.avgScoreClaude)
    .filter((score): score is number => score !== null);

  if (points.length < 2) return null;

  const min = Math.min(...points);
  const max = Math.max(...points);
  const spread = max - min || 1;

  return points
    .map((score, index) => {
      const x = points.length === 1 ? 40 : (index / (points.length - 1)) * 80;
      const y = 22 - ((score - min) / spread) * 20;
      return `${roundCoordinate(x)},${roundCoordinate(y)}`;
    })
    .join(" ");
}

function formatCurrency(usd: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(usd);
}

function formatInteger(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function roundCoordinate(value: number) {
  return Number(value.toFixed(2));
}
