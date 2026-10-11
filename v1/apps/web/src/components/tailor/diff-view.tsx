import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TailorDiff } from "@/lib/tailor/diff";
import type { WordDiffCounts, WordDiffSegment } from "@/lib/diff/word-diff";

interface TailorDiffViewProps {
  diff: TailorDiff;
  className?: string;
}

const countLabels: Array<{
  key: keyof Omit<WordDiffCounts, "total">;
  label: string;
  className: string;
}> = [
  { key: "added", label: "Added", className: "bg-success/15 text-success" },
  {
    key: "removed",
    label: "Removed",
    className: "bg-destructive/10 text-destructive",
  },
  {
    key: "reworded",
    label: "Reworded",
    className: "bg-warning/20 text-warning",
  },
];

export function TailorDiffView({ diff, className }: TailorDiffViewProps) {
  const changedSections = diff.sections.filter(
    (section) => section.counts.total > 0,
  );
  const sectionsToRender =
    changedSections.length > 0 ? changedSections : diff.sections;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="rounded-md border bg-background p-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold">Changes</span>
          {countLabels.map(({ key, label, className: labelClassName }) => (
            <span
              key={key}
              className={cn(
                "rounded-md px-2 py-1 text-xs font-medium",
                labelClassName,
              )}
            >
              {label}: {diff.counts[key]}
            </span>
          ))}
          <span className="ml-auto text-xs text-muted-foreground">
            {diff.counts.total === 0
              ? "No changes"
              : `${diff.counts.total} total`}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
          <LegendItem className="bg-success/15 text-success" label="Added" />
          <LegendItem
            className="bg-destructive/10 text-destructive line-through"
            label="Removed"
          />
          <LegendItem className="bg-warning/20 text-warning" label="Reworded" />
        </div>
        {diff.sections.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {diff.sections.map((section) => (
              <span
                key={section.id}
                className="rounded-md border bg-muted/30 px-2 py-1 text-muted-foreground"
              >
                {section.title}: {section.counts.total}
              </span>
            ))}
          </div>
        )}
      </div>

      {sectionsToRender.map((section) => (
        <section key={section.id} className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold">{section.title}</h3>
            <span className="text-xs text-muted-foreground">
              {section.counts.total === 0
                ? "No changes"
                : `${section.counts.total} changes`}
            </span>
          </div>
          <div className="whitespace-pre-wrap rounded-md border bg-muted/20 p-3 text-sm leading-7">
            <span className="sr-only">
              {diffSegmentsToAfterText(section.segments)}
            </span>
            {section.segments.length > 0 ? (
              section.segments.map((segment, index) => (
                <DiffSegment key={`${section.id}-${index}`} segment={segment} />
              ))
            ) : (
              <span className="text-muted-foreground">
                No changes in this section.
              </span>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}

function LegendItem({
  className,
  label,
}: {
  className: string;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={cn("h-2.5 w-2.5 rounded-md", className)}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}

function diffSegmentsToAfterText(segments: WordDiffSegment[]): string {
  return segments
    .map((segment) => {
      if (segment.type === "removed") return "";
      if (segment.type === "reworded") {
        return segment.afterText ?? segment.text;
      }
      return segment.text;
    })
    .join("");
}

function DiffSegment({ segment }: { segment: WordDiffSegment }) {
  if (segment.type === "unchanged") return <span>{segment.text}</span>;

  if (segment.type === "reworded") {
    return (
      <span className="rounded-md bg-warning/20 px-0.5 text-warning">
        <span className="text-warning">{segment.beforeText}</span>
        <RefreshCw
          className="mx-1 inline h-3 w-3 align-[-0.125em]"
          aria-hidden="true"
        />
        <span className="text-warning">
          {segment.afterText ?? segment.text}
        </span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "rounded-md px-0.5",
        segment.type === "added" && "bg-success/15 text-success",
        segment.type === "removed" &&
          "bg-destructive/10 text-destructive line-through",
      )}
    >
      {segment.text}
    </span>
  );
}
