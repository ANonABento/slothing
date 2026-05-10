import { BarChart3, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type {
  InterviewFeedbackRating,
  InterviewSessionFeedbackSummary,
} from "@/lib/interview/feedback";

interface SessionFeedbackSummaryProps {
  summary: InterviewSessionFeedbackSummary;
}

const ratingBadgeVariants: Record<
  InterviewFeedbackRating,
  "success" | "warning" | "destructive"
> = {
  green: "success",
  yellow: "warning",
  red: "destructive",
};

const ratingLabels: Record<InterviewFeedbackRating, string> = {
  green: "Green",
  yellow: "Yellow",
  red: "Red",
};

export function SessionFeedbackSummary({
  summary,
}: SessionFeedbackSummaryProps) {
  if (summary.answeredCount === 0) {
    return (
      <section className="rounded-xl border bg-card p-5">
        <h3 className="flex items-center gap-2 font-semibold">
          <BarChart3 className="h-5 w-5 text-primary" />
          Coaching summary
        </h3>
        <p className="mt-3 text-sm text-muted-foreground">
          No answered questions to summarize yet.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border bg-card p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="flex items-center gap-2 font-semibold">
            <BarChart3 className="h-5 w-5 text-primary" />
            Coaching summary
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {summary.answeredCount} answered{" "}
            {summary.answeredCount === 1 ? "question" : "questions"}
          </p>
        </div>
        <Badge variant={ratingBadgeVariants[summary.overallRating]}>
          {ratingLabels[summary.overallRating]}
        </Badge>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <SummaryStat
          label="Avg fillers"
          value={formatDecimal(summary.averageFillerCount)}
        />
        <SummaryStat
          label="Avg STAR"
          value={`${formatDecimal(summary.averageStarCoverage)}/4`}
        />
        <SummaryStat
          label="Metrics used"
          value={String(summary.totalQuantificationCount)}
        />
        <SummaryStat
          label="Length health"
          value={`${summary.lengthHealthPercent}%`}
        />
        <SummaryStat
          label="Avg pace"
          value={`${Math.round(summary.averagePaceWordsPerMinute)} WPM`}
        />
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <ProgressBlock
          label="Length in target"
          value={summary.lengthHealthPercent}
        />
        <ProgressBlock
          label="Pace in target"
          value={summary.paceHealthPercent}
        />
      </div>

      {summary.focusAreas.length > 0 ? (
        <div className="mt-5 rounded-lg bg-muted/30 p-4">
          <p className="flex items-center gap-2 text-sm font-medium">
            <Target className="h-4 w-4 text-primary" />
            Focus areas
          </p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {summary.focusAreas.map((focusArea) => (
              <li key={focusArea}>{focusArea}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/30 p-3 text-center">
      <p className="text-xl font-bold text-primary">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function ProgressBlock({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">{value}%</span>
      </div>
      <Progress value={value} variant={progressVariant(value)} size="sm" />
    </div>
  );
}

function progressVariant(value: number): "success" | "warning" | "destructive" {
  if (value >= 70) return "success";
  if (value >= 40) return "warning";
  return "destructive";
}

function formatDecimal(value: number): string {
  return value.toFixed(1).replace(/\.0$/, "");
}
