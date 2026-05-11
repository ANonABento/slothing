"use client";

import { useMemo, useState } from "react";
import type {
  BuilderDraftState,
  BuilderVersion,
} from "@/lib/builder/version-history";
import { createStudioVersionDiff } from "@/lib/studio/diff";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatVersionTimestamp } from "./studio-documents";
import { useA11yTranslations } from "@/lib/i18n/use-a11y-translations";

interface VersionDiffViewProps {
  currentDraftState: BuilderDraftState;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  version: BuilderVersion | null;
}

type DiffMode = "diff" | "compared";

function countLabel(value: number, label: string): string {
  if (label === "reworded") return `${value} reworded`;
  return `${value} ${label}${value === 1 ? "" : "s"}`;
}

function SegmentText({
  side,
  segments,
}: {
  side: "before" | "after";
  segments: ReturnType<
    typeof createStudioVersionDiff
  >["sections"][number]["segments"];
}) {
  const visibleSegments = segments.filter(
    (segment) => segment.side === "both" || segment.side === side,
  );

  if (visibleSegments.length === 0) {
    return <p className="text-sm text-muted-foreground">No content</p>;
  }

  return (
    <p className="whitespace-pre-wrap text-sm leading-7">
      {visibleSegments.map((segment, index) => (
        <span
          key={`${segment.type}-${segment.side}-${index}`}
          data-diff-type={segment.type}
          className={cn(
            "rounded-[var(--radius)] px-1 py-0.5",
            segment.type === "added" && "bg-success/10 text-success",
            segment.type === "removed" && "bg-destructive/10 text-destructive",
            segment.type === "reworded" && "bg-warning/10 text-warning",
          )}
        >
          {segment.type === "reworded"
            ? side === "before"
              ? (segment.beforeText ?? segment.text)
              : (segment.afterText ?? segment.text)
            : segment.text}
          {index < visibleSegments.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}

function SectionCounts({
  counts,
}: {
  counts: ReturnType<
    typeof createStudioVersionDiff
  >["sections"][number]["counts"];
}) {
  const a11yT = useA11yTranslations();

  return (
    <div
      className="flex flex-wrap gap-1.5"
      aria-label={a11yT("sectionChangeCounts")}
    >
      <Badge variant="success">{countLabel(counts.added, "added")}</Badge>
      <Badge variant="destructive">
        {countLabel(counts.removed, "removed")}
      </Badge>
      <Badge variant="warning">{countLabel(counts.reworded, "reworded")}</Badge>
    </div>
  );
}

export function VersionDiffView({
  currentDraftState,
  onOpenChange,
  open,
  version,
}: VersionDiffViewProps) {
  const a11yT = useA11yTranslations();

  const [mode, setMode] = useState<DiffMode>("diff");
  const diff = useMemo(
    () =>
      version
        ? createStudioVersionDiff(version.state, currentDraftState)
        : {
            sections: [],
            totals: {
              added: 0,
              removed: 0,
              reworded: 0,
              unchanged: 0,
              total: 0,
            },
          },
    [currentDraftState, version],
  );
  const versionName = version?.name || "Saved version";
  const savedAt = version ? formatVersionTimestamp(version.savedAt) : "";
  const hasChanges = diff.totals.total > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl">
        <DialogHeader className="pr-10">
          <DialogTitle>Compare to current</DialogTitle>
          <DialogDescription>
            {version
              ? `${versionName} saved ${savedAt}`
              : "Select a version to compare."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div
            className="flex flex-wrap gap-2"
            aria-label={a11yT("totalChangeCounts")}
          >
            <Badge variant="success">
              {countLabel(diff.totals.added, "added")}
            </Badge>
            <Badge variant="destructive">
              {countLabel(diff.totals.removed, "removed")}
            </Badge>
            <Badge variant="warning">
              {countLabel(diff.totals.reworded, "reworded")}
            </Badge>
          </div>
          <div className="inline-flex rounded-[var(--radius)] border-[length:var(--border-width)] p-1">
            <Button
              type="button"
              size="sm"
              variant={mode === "diff" ? "default" : "ghost"}
              onClick={() => setMode("diff")}
            >
              Diff
            </Button>
            <Button
              type="button"
              size="sm"
              variant={mode === "compared" ? "default" : "ghost"}
              onClick={() => setMode("compared")}
            >
              Compared version only
            </Button>
          </div>
        </div>

        {!version || diff.sections.length === 0 ? (
          <div className="rounded-[var(--radius)] border-[length:var(--border-width)] p-6 text-sm text-muted-foreground">
            There is no document content to compare yet.
          </div>
        ) : !hasChanges && mode === "diff" ? (
          <div className="rounded-[var(--radius)] border-[length:var(--border-width)] p-6 text-sm text-muted-foreground">
            No changes between this saved version and the current draft.
          </div>
        ) : (
          <div className="space-y-4">
            {diff.sections.map((section) => (
              <section
                key={section.id}
                className="rounded-[var(--radius)] border-[length:var(--border-width)] p-4"
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold">{section.label}</h3>
                  <SectionCounts counts={section.counts} />
                </div>

                {mode === "compared" ? (
                  <div>
                    <p className="mb-2 text-xs font-medium text-muted-foreground">
                      Compared version
                    </p>
                    <p className="whitespace-pre-wrap text-sm leading-7">
                      {section.comparedText || "No content"}
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="mb-2 text-xs font-medium text-muted-foreground">
                        Compared version
                      </p>
                      <SegmentText side="before" segments={section.segments} />
                    </div>
                    <div>
                      <p className="mb-2 text-xs font-medium text-muted-foreground">
                        Current draft
                      </p>
                      <SegmentText side="after" segments={section.segments} />
                    </div>
                  </div>
                )}
              </section>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
