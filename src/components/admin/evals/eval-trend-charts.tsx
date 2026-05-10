"use client";

import { Activity, BarChart3, DollarSign } from "lucide-react";
import { PagePanel, PagePanelHeader } from "@/components/ui/page-layout";
import type { DataPoint } from "@/lib/analytics/time-series";
import type { ModelKey } from "@/lib/admin/evals/types";
import { cn } from "@/lib/utils";

function formatCost(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(value);
}

function SimpleBarChart({
  data,
  color,
  formatter = (value) => String(value),
}: {
  data: DataPoint[];
  color: "primary" | "info" | "success";
  formatter?: (value: number) => string;
}) {
  const maxValue = Math.max(...data.map((point) => point.value), 1);
  const colorClasses = {
    primary: "bg-primary",
    info: "bg-info",
    success: "bg-success",
  };

  if (data.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
        No runs in this range
      </div>
    );
  }

  return (
    <div className="flex h-36 items-end gap-1">
      {data.map((point, index) => (
        <div key={`${point.date}-${index}`} className="group flex flex-1 flex-col items-center">
          <div
            className={cn(
              "w-full rounded-t transition-opacity group-hover:opacity-80",
              colorClasses[color],
            )}
            style={{ height: `${Math.max((point.value / maxValue) * 100, 3)}%` }}
            title={`${point.label ?? point.date}: ${formatter(point.value)}`}
          />
          {index % Math.max(Math.ceil(data.length / 5), 1) === 0 ? (
            <span className="mt-1 max-w-full truncate text-[10px] text-muted-foreground">
              {point.label ?? point.date}
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function MultiSeriesScoreChart({
  gpt55,
  claude,
  model,
}: {
  gpt55: DataPoint[];
  claude: DataPoint[];
  model: "all" | ModelKey;
}) {
  const showGpt = model === "all" || model === "gpt55";
  const showClaude = model === "all" || model === "claude";

  return (
    <div className="space-y-4">
      {showGpt ? (
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-primary" />
            GPT-5.5
          </div>
          <SimpleBarChart data={gpt55} color="primary" />
        </div>
      ) : null}
      {showClaude ? (
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-info" />
            Claude
          </div>
          <SimpleBarChart data={claude} color="info" />
        </div>
      ) : null}
    </div>
  );
}

export function EvalTrendCharts({
  avgScoreGpt55,
  avgScoreClaude,
  cost,
  runs,
  model,
}: {
  avgScoreGpt55: DataPoint[];
  avgScoreClaude: DataPoint[];
  cost: DataPoint[];
  runs: DataPoint[];
  model: "all" | ModelKey;
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr_0.8fr]">
      <PagePanel>
        <PagePanelHeader
          title="Avg Score Over Time"
          description="Judge score on a five-point scale."
          icon={BarChart3}
        />
        <MultiSeriesScoreChart
          gpt55={avgScoreGpt55}
          claude={avgScoreClaude}
          model={model}
        />
      </PagePanel>
      <PagePanel>
        <PagePanelHeader
          title="Estimated Cost"
          description="Heuristic token estimate per run day."
          icon={DollarSign}
        />
        <SimpleBarChart data={cost} color="success" formatter={formatCost} />
      </PagePanel>
      <PagePanel>
        <PagePanelHeader
          title="Runs per Day"
          description="Completed comparison reports."
          icon={Activity}
        />
        <SimpleBarChart data={runs} color="info" />
      </PagePanel>
    </div>
  );
}
