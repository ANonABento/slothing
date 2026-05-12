"use client";

import { Flame, Trophy } from "lucide-react";
import { useTranslations } from "next-intl";
import { PagePanel } from "@/components/ui/page-layout";
import { pluralize } from "@/lib/text/pluralize";
import { cn } from "@/lib/utils";
import type { StreakState } from "@/lib/streak/types";
import { useA11yTranslations } from "@/lib/i18n/use-a11y-translations";

interface StreakHeroCardProps {
  streak: StreakState | null;
}

export function StreakHeroCard({ streak }: StreakHeroCardProps) {
  const t = useTranslations("streak");
  const a11yT = useA11yTranslations();

  const currentStreak = streak?.currentStreak ?? 0;
  const longestStreak = streak?.longestStreak ?? 0;
  const weekDays = streak?.weekDays ?? [];

  return (
    <PagePanel className="overflow-hidden border-primary/20 bg-primary/5">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1 text-xs font-semibold uppercase text-primary">
            <Flame className="h-3.5 w-3.5" />
            {t("badgeLabel")}
          </div>
          <div className="mt-4 flex items-end gap-3">
            <span className="text-5xl font-bold leading-none text-foreground">
              {currentStreak}
            </span>
            <span className="pb-1 text-sm font-medium text-muted-foreground">
              {pluralize(currentStreak, "day")}
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {currentStreak > 0 ? t("activeMessage") : t("startMessage")}
          </p>
        </div>

        <div className="min-w-[220px] rounded-lg border bg-card/70 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                {t("bestStreak")}
              </p>
              <p className="mt-1 flex items-center gap-2 text-sm font-semibold">
                <Trophy className="h-4 w-4 text-warning" />
                {pluralize(longestStreak, "day")}
              </p>
            </div>
          </div>
          <div
            className="grid grid-cols-7 gap-2"
            aria-label={a11yT("weeklyActivity")}
          >
            {weekDays.map((day) => (
              <div
                key={day.date}
                title={day.date}
                className={cn(
                  "h-8 rounded-md border transition-colors",
                  day.active
                    ? "border-success/40 bg-success/30"
                    : "border-border bg-muted/40",
                  day.today ? "ring-2 ring-primary/40" : "",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </PagePanel>
  );
}
