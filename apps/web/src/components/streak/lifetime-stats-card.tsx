"use client";

import { Award, Briefcase, FileText, Mail, Trophy, UserCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { pluralize } from "@/lib/text/pluralize";
import type { StreakState } from "@/lib/streak/types";

interface LifetimeStatsCardProps {
  streak: StreakState | null;
}

export function LifetimeStatsCard({ streak }: LifetimeStatsCardProps) {
  const lifetime = streak?.lifetime;
  const unlocked = streak?.unlocked ?? [];

  const stats = [
    {
      label: "Applications",
      value: lifetime?.opportunitiesApplied ?? 0,
      icon: Briefcase,
    },
    {
      label: "Tailored resumes",
      value: lifetime?.resumesTailored ?? 0,
      icon: FileText,
    },
    {
      label: "Cover letters",
      value: lifetime?.coverLetters ?? 0,
      icon: Award,
    },
    {
      label: "Emails sent",
      value: lifetime?.emailsSent ?? 0,
      icon: Mail,
    },
    {
      label: "Interviews",
      value: lifetime?.interviewsStarted ?? 0,
      icon: UserCheck,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Trophy className="h-4 w-4 text-warning" />
          Lifetime progress
        </CardTitle>
        <CardDescription>
          Best streak: {pluralize(streak?.longestStreak ?? 0, "day")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </span>
                <span className="font-semibold">{item.value}</span>
              </div>
            );
          })}
        </div>

        <div className="border-t pt-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-medium">Achievements</p>
            <p className="text-xs text-muted-foreground">
              {unlocked.length} / 12
            </p>
          </div>
          <div className="grid grid-cols-6 gap-2">
            {unlocked.length > 0 ? (
              unlocked.map((achievement) => (
                <span
                  key={achievement.achievementId}
                  title={achievement.title}
                  className="flex h-9 w-9 items-center justify-center rounded-md border bg-muted/40 text-lg"
                >
                  {achievement.emoji}
                </span>
              ))
            ) : (
              <p className="col-span-6 text-sm text-muted-foreground">
                Unlocks appear as you build momentum.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
