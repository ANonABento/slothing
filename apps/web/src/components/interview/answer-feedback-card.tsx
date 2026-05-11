"use client";

import { CheckCircle2, Lightbulb, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type {
  InterviewAnswerScorecard,
  InterviewFeedbackRating,
} from "@/lib/interview/feedback";
import { useA11yTranslations } from "@/lib/i18n/use-a11y-translations";

interface AnswerFeedbackCardProps {
  scorecard: InterviewAnswerScorecard;
  compact?: boolean;
}

const ratingLabels: Record<InterviewFeedbackRating, string> = {
  green: "Green",
  yellow: "Yellow",
  red: "Red",
};

const ratingBadgeVariants: Record<
  InterviewFeedbackRating,
  "success" | "warning" | "destructive"
> = {
  green: "success",
  yellow: "warning",
  red: "destructive",
};

const ratingTextClasses: Record<InterviewFeedbackRating, string> = {
  green: "text-success",
  yellow: "text-warning",
  red: "text-destructive",
};

export function AnswerFeedbackCard({
  scorecard,
  compact = false,
}: AnswerFeedbackCardProps) {
  const a11yT = useA11yTranslations();

  return (
    <section
      aria-label={a11yT("answerScorecard")}
      className={cn("rounded-lg border bg-card p-5", compact && "p-4")}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="flex items-center gap-2 font-semibold">
            <TrendingUp className="h-4 w-4 text-primary" />
            Answer scorecard
          </h3>
        </div>
        <Badge variant={ratingBadgeVariants[scorecard.overallRating]}>
          {ratingLabels[scorecard.overallRating]}
        </Badge>
      </div>

      <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-3">
        <p className="flex items-center gap-2 text-sm font-medium text-primary">
          <Lightbulb className="h-4 w-4" />
          Top suggestion
        </p>
        <p className="mt-1 text-sm">{scorecard.topSuggestion}</p>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {scorecard.metrics.map((metric) => (
          <div key={metric.id} className="rounded-lg bg-muted/30 p-3">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium">{metric.label}</p>
              <Badge
                variant={ratingBadgeVariants[metric.rating]}
                className="shrink-0"
              >
                {ratingLabels[metric.rating]}
              </Badge>
            </div>
            <p
              className={cn(
                "mt-2 text-2xl font-bold",
                ratingTextClasses[metric.rating],
              )}
            >
              {metric.value}
            </p>
            <p className="mt-1 min-h-10 text-xs text-muted-foreground">
              {metric.detail}
            </p>
            <Progress
              value={metricProgressValue(metric.rating)}
              variant={progressVariant(metric.rating)}
              size="sm"
              className="mt-3"
              aria-label={`${metric.label} rating`}
            />
          </div>
        ))}
      </div>

      {scorecard.overallRating === "green" ? (
        <p className="mt-4 flex items-center gap-2 text-sm text-success">
          <CheckCircle2 className="h-4 w-4" />
          This answer is landing in the target range across most coaching
          signals.
        </p>
      ) : null}
    </section>
  );
}

function metricProgressValue(rating: InterviewFeedbackRating): number {
  if (rating === "green") return 100;
  if (rating === "yellow") return 66;
  return 33;
}

function progressVariant(
  rating: InterviewFeedbackRating,
): "success" | "warning" | "destructive" {
  return ratingBadgeVariants[rating];
}
