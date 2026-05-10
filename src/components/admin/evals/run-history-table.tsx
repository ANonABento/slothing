"use client";

import { Fragment, useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Eye } from "lucide-react";
import { TimeAgo } from "@/components/format/time-ago";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PagePanel, PagePanelHeader } from "@/components/ui/page-layout";
import { SampleOutputDialog } from "./sample-output-dialog";
import type {
  EvalCaseRow,
  EvalRunSummary,
  ModelKey,
} from "@/lib/admin/evals/types";
import { pluralize } from "@/lib/text/pluralize";
import { cn } from "@/lib/utils";

function formatScore(score: number | null): string {
  return score === null ? "Error" : score.toFixed(1);
}

function formatCost(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(value);
}

function WinnerBadge({ winner }: { winner: EvalCaseRow["winner"] }) {
  if (winner === "tie") return <Badge variant="secondary">Tie</Badge>;
  return (
    <Badge variant={winner === "gpt55" ? "default" : "info"}>
      {winner === "gpt55" ? "GPT-5.5" : "Claude"}
    </Badge>
  );
}

export function RunHistoryTable({
  runs,
  cases,
  model,
}: {
  runs: EvalRunSummary[];
  cases: EvalCaseRow[];
  model: "all" | ModelKey;
}) {
  const [expandedRunId, setExpandedRunId] = useState<string | null>(
    runs[0]?.id ?? null,
  );
  const [sampleRow, setSampleRow] = useState<EvalCaseRow | null>(null);

  const casesByRun = useMemo(() => {
    const grouped = new Map<string, EvalCaseRow[]>();
    for (const row of cases) {
      grouped.set(row.runId, [...(grouped.get(row.runId) ?? []), row]);
    }
    return grouped;
  }, [cases]);

  return (
    <PagePanel className="p-0 sm:p-0">
      <div className="p-5 sm:p-6">
        <PagePanelHeader
          title="Run History"
          description={`${pluralize(runs.length, "run")} matching the current filters.`}
          className="mb-0"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="border-y bg-muted/40 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="w-10 px-3 py-3 font-medium" aria-label="Expand" />
              <th className="px-4 py-3 font-medium">Run</th>
              <th className="px-4 py-3 font-medium">Models</th>
              <th className="px-4 py-3 font-medium">Scores</th>
              <th className="px-4 py-3 font-medium">Wins</th>
              <th className="px-4 py-3 font-medium">Est. cost</th>
              <th className="px-4 py-3 font-medium">Cases</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {runs.map((run) => {
              const expanded = expandedRunId === run.id;
              const runCases = casesByRun.get(run.id) ?? [];
              return (
                <Fragment key={run.id}>
                  <tr className="bg-card">
                    <td className="px-3 py-4">
                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-[var(--radius)] hover:bg-muted"
                        aria-label={expanded ? "Collapse run" : "Expand run"}
                        aria-expanded={expanded}
                        onClick={() =>
                          setExpandedRunId(expanded ? null : run.id)
                        }
                      >
                        {expanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-foreground">
                        <TimeAgo date={run.runAt} />
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {run.evalSetLabel} · judge {run.judgeModel}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs text-muted-foreground">
                      <div>{run.generatorModels.gpt55}</div>
                      <div>{run.generatorModels.claude}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div
                        className={cn(
                          "grid gap-1",
                          model === "all" ? "grid-cols-2" : "grid-cols-1",
                        )}
                      >
                        {model === "all" || model === "gpt55" ? (
                          <span>GPT {formatScore(run.avgScoreGpt55)}</span>
                        ) : null}
                        {model === "all" || model === "claude" ? (
                          <span>Claude {formatScore(run.avgScoreClaude)}</span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs text-muted-foreground">
                      {run.gpt55Wins} GPT · {run.claudeWins} Claude ·{" "}
                      {run.ties} ties
                    </td>
                    <td className="px-4 py-4 font-medium">
                      {formatCost(run.estimatedCostUsd)}
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">
                      {run.successfulCases}/{pluralize(run.totalCases, "case")}
                      {run.errorCount > 0 ? (
                        <span className="ml-2 text-destructive">
                          {pluralize(run.errorCount, "error")}
                        </span>
                      ) : null}
                    </td>
                  </tr>
                  {expanded
                    ? runCases.map((row) => (
                        <tr key={row.id} className="bg-muted/20">
                          <td />
                          <td className="px-4 py-3" colSpan={2}>
                            <div className="font-medium">
                              {row.testCaseLabel}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {row.testCaseId}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-2">
                              {model === "all" || model === "gpt55" ? (
                                <Badge variant="outline">
                                  GPT {formatScore(row.gpt55.score)}
                                </Badge>
                              ) : null}
                              {model === "all" || model === "claude" ? (
                                <Badge variant="outline">
                                  Claude {formatScore(row.claude.score)}
                                </Badge>
                              ) : null}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <WinnerBadge winner={row.winner} />
                          </td>
                          <td className="px-4 py-3" colSpan={2}>
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              onClick={() => setSampleRow(row)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View samples
                            </Button>
                          </td>
                        </tr>
                      ))
                    : null}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      <SampleOutputDialog
        row={sampleRow}
        open={Boolean(sampleRow)}
        onOpenChange={(open) => {
          if (!open) setSampleRow(null);
        }}
      />
    </PagePanel>
  );
}
