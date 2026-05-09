"use client";

import { TimeAgo } from "@/components/format/time-ago";
import { categoryColors } from "@/lib/interview/category-display";
import { pluralize } from "@/lib/text/pluralize";
import type { SessionQuestionCategory } from "@/lib/constants";
import type { PastSession } from "@/types/interview";

const TILE_COPY: Record<
  SessionQuestionCategory,
  { title: string; description: string }
> = {
  behavioral: {
    title: "Behavioral",
    description: "Practice STAR method responses for common scenarios.",
  },
  technical: {
    title: "Technical",
    description: "Warm up on trade-offs, debugging, and technical judgment.",
  },
  situational: {
    title: "Situational",
    description: "Handle hypothetical scenarios with calm structure.",
  },
  "cultural-fit": {
    title: "Cultural Fit",
    description: "Sharpen answers about values, collaboration, and trust.",
  },
  general: {
    title: "General",
    description: "Build confidence with broad interview openers.",
  },
};

const FEATURED_CATEGORIES: SessionQuestionCategory[] = [
  "behavioral",
  "technical",
  "situational",
];

interface CategoryPracticeTilesProps {
  pastSessions: PastSession[];
  onStartQuickPractice: (category: SessionQuestionCategory) => void;
}

export function CategoryPracticeTiles({
  pastSessions,
  onStartQuickPractice,
}: CategoryPracticeTilesProps) {
  return (
    <div className="grid gap-4 text-left sm:grid-cols-3">
      {FEATURED_CATEGORIES.map((category) => {
        const style = categoryColors[category];
        const sessions = pastSessions.filter(
          (session) => session.category === category,
        );
        const latest = sessions[0];

        return (
          <button
            type="button"
            key={category}
            onClick={() => onStartQuickPractice(category)}
            className="group rounded-lg border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <div
              className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${style.bg} ${style.text} transition-transform group-hover:scale-105`}
            >
              {style.icon}
            </div>
            <h3 className="font-medium">{TILE_COPY[category].title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {TILE_COPY[category].description}
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              {sessions.length > 0 ? (
                <>
                  {pluralize(sessions.length, "session")} • last{" "}
                  <TimeAgo date={latest.startedAt} />
                </>
              ) : (
                "Fresh track • start anytime"
              )}
            </p>
          </button>
        );
      })}
    </div>
  );
}
