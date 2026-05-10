"use client";

import { ArrowRight, Target } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ProfileCompletenessGap } from "@/lib/profile/completeness";

interface GapListProps {
  gaps: ProfileCompletenessGap[];
  onSelectGap: (gap: ProfileCompletenessGap) => void;
}

export function GapList({ gaps, onSelectGap }: GapListProps) {
  const visibleGaps = [...gaps]
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 3);

  if (visibleGaps.length === 0) {
    return (
      <p className="rounded-[var(--radius)] border border-success/30 bg-success/10 px-4 py-3 text-sm font-medium text-success">
        Everything essential is filled in.
      </p>
    );
  }

  return (
    <div className="grid gap-2">
      {visibleGaps.map((gap) => (
        <Button
          key={gap.id}
          type="button"
          variant="ghost"
          className="h-auto justify-between gap-3 rounded-[var(--radius)] border bg-background px-4 py-3 text-left hover:bg-accent/10"
          onClick={() => onSelectGap(gap)}
        >
          <span className="flex min-w-0 items-start gap-3">
            <Target className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span className="min-w-0">
              <span className="block whitespace-normal text-sm font-medium text-foreground">
                {gap.label}
              </span>
              <span className="mt-1 block text-xs text-muted-foreground">
                +{gap.points} points
              </span>
            </span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        </Button>
      ))}
    </div>
  );
}
