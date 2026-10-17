import { ChartColumn, Mic, type LucideIcon } from "lucide-react";

/**
 * Pages that are planned but not built, shown in the sidebar as placeholders (see ROADMAP.md).
 * Delete an entry when its page ships or the idea is dropped.
 */
export interface PlannedPage {
  slug: string;
  label: string;
  icon: LucideIcon;
  when: "Later";
  summary: string;
  /** What v1 had, to port from. */
  v1: string;
  /** The matching page in v1 (run it with `npm run v1`). */
  v1Path: string;
  /** What has to be true before it gets built. */
  gate: string;
}

export const PLANNED: PlannedPage[] = [
  {
    slug: "interview",
    v1Path: "/en/interview",
    label: "Interview prep",
    icon: Mic,
    when: "Later",
    summary: "Likely questions for a job, drawn from its description and your profile, with your notes.",
    v1: "Interview prep with text, voice and audio recording.",
    gate: "A job reaches the interviewing stage and you want help preparing.",
  },
  {
    slug: "insights",
    v1Path: "/en/analytics",
    label: "Insights",
    icon: ChartColumn,
    when: "Later",
    summary: "Your funnel: saved → applied → interviewing → offer, and which resumes got responses.",
    v1: "A dashboard and analytics pages.",
    gate: "There are enough applications for the numbers to mean something.",
  },
];

/** Where `npm run v1` serves the archived app. */
export const V1_URL = "http://localhost:3100";

export const plannedPage = (slug: string) => PLANNED.find((p) => p.slug === slug) ?? null;
