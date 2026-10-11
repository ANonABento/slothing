"use client";

import { ArrowRight, Target } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import type { ProfileCompletenessGap } from "@/lib/profile/completeness";

interface GapListProps {
  gaps: ProfileCompletenessGap[];
  onSelectGap: (gap: ProfileCompletenessGap) => void;
}

const gapsRequiringValues = new Set([
  "experience-bullets",
  "quantified-bullets",
  "skills",
]);

export function GapList({ gaps, onSelectGap }: GapListProps) {
  const t = useTranslations("profile.completeness");
  const visibleGaps = [...gaps]
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 3);

  if (visibleGaps.length === 0) {
    return (
      <p className="rounded-md border border-success/30 bg-success/10 px-4 py-3 text-sm font-medium text-success">
        {t("noGaps")}
      </p>
    );
  }

  return (
    <div className="grid gap-2">
      {visibleGaps.map((gap) => {
        const label =
          !gap.labelKey && !gap.labelValues && gapsRequiringValues.has(gap.id)
            ? gap.label
            : t(`gaps.${gap.labelKey ?? gap.id}`, gap.labelValues);

        return (
          <Button
            key={gap.id}
            type="button"
            variant="ghost"
            className="h-auto justify-between gap-3 rounded-md border bg-background px-4 py-3 text-left hover:bg-accent/10"
            onClick={() => onSelectGap(gap)}
          >
            <span className="flex min-w-0 items-start gap-3">
              <Target className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span className="min-w-0">
                <span className="block whitespace-normal text-sm font-medium text-foreground">
                  {label}
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {t("points", { points: gap.points })}
                </span>
              </span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          </Button>
        );
      })}
    </div>
  );
}
