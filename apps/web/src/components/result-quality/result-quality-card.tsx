"use client";

import {
  AlertTriangle,
  CheckCircle2,
  FileSearch,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  ResultQualityRubric,
  ResultQualityStatus,
} from "@/lib/result-quality/rubric";

interface ResultQualityCardProps {
  rubric: ResultQualityRubric;
  className?: string;
}

const STATUS_STYLES: Record<
  ResultQualityStatus,
  { icon: typeof CheckCircle2; tone: string; badge: string }
> = {
  ready_to_apply: {
    icon: CheckCircle2,
    tone: "text-success",
    badge: "border-success/30 bg-success/10 text-success",
  },
  light_tailoring: {
    icon: Pencil,
    tone: "text-warning",
    badge: "border-warning/30 bg-warning/10 text-warning",
  },
  needs_evidence: {
    icon: FileSearch,
    tone: "text-info",
    badge: "border-info/30 bg-info/10 text-info",
  },
  not_a_fit: {
    icon: AlertTriangle,
    tone: "text-destructive",
    badge: "border-destructive/30 bg-destructive/10 text-destructive",
  },
};

export function ResultQualityCard({
  rubric,
  className,
}: ResultQualityCardProps) {
  const styles = STATUS_STYLES[rubric.status];
  const Icon = styles.icon;

  return (
    <section
      aria-label={`Result quality: ${rubric.label}`}
      className={cn("rounded-lg border border-border bg-card p-4", className)}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "mt-0.5 rounded-md border p-2",
              styles.badge,
            )}
            aria-hidden="true"
          >
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <p className={cn("text-sm font-semibold", styles.tone)}>
              {rubric.label}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {rubric.rationale}
            </p>
          </div>
        </div>
      </div>

      <ol className="mt-4 space-y-2">
        {rubric.nextActions.map((action, index) => (
          <li key={action} className="flex gap-2 text-sm">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
              {index + 1}
            </span>
            <span>{action}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
