"use client";

import { CheckCircle2, Sparkles } from "lucide-react";

import { GapList } from "@/components/profile/gap-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type {
  ProfileCompletenessGap,
  ProfileCompletenessResult,
} from "@/lib/profile/completeness";
import { useA11yTranslations } from "@/lib/i18n/use-a11y-translations";

interface CompletenessCardProps {
  result: ProfileCompletenessResult;
  onSelectGap: (gap: ProfileCompletenessGap) => void;
  celebrating?: boolean;
}

function progressVariant(
  score: number,
): "default" | "success" | "warning" | "destructive" {
  if (score >= 80) return "success";
  if (score >= 60) return "warning";
  if (score >= 40) return "default";
  return "destructive";
}

export function CompletenessCard({
  result,
  onSelectGap,
  celebrating = false,
}: CompletenessCardProps) {
  const a11yT = useA11yTranslations();

  const quickWinText =
    result.gaps.length === 1
      ? "1 quick win available"
      : `${result.gaps.length} quick wins available`;
  const isComplete = result.score === 100;

  return (
    <Card className="relative overflow-hidden">
      {celebrating ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          {["left-1/4", "left-1/2", "left-3/4"].map((position, index) => (
            <span
              key={position}
              className={`absolute top-0 h-2 w-2 animate-ping rounded-full bg-primary ${position}`}
              style={{ animationDelay: `${index * 120}ms` }}
            />
          ))}
        </div>
      ) : null}
      <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            {isComplete ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            Profile readiness
          </div>
          <CardTitle className="text-xl sm:text-2xl">
            Profile is {result.score}% complete · {quickWinText}
          </CardTitle>
        </div>
        <div className="shrink-0 rounded-[var(--radius)] border bg-background px-4 py-3 text-center">
          <div className="text-3xl font-semibold">{result.score}%</div>
          <div className="text-xs text-muted-foreground">complete</div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress
          value={result.score}
          aria-label={a11yT("profileCompleteness")}
          variant={progressVariant(result.score)}
        />
        <GapList gaps={result.gaps} onSelectGap={onSelectGap} />
      </CardContent>
    </Card>
  );
}
