import { BellRing, ChartColumn, LayoutTemplate, MessageSquareText, Mic, Puzzle, type LucideIcon } from "lucide-react";

/**
 * Pages that are planned but not built, shown in the sidebar as placeholders (see ROADMAP.md).
 * Delete an entry when its page ships or the idea is dropped.
 */
export interface PlannedPage {
  slug: string;
  label: string;
  icon: LucideIcon;
  when: "Iteration 2" | "Later";
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
    slug: "extension",
    v1Path: "/en/extension/connect",
    label: "Extension",
    icon: Puzzle,
    when: "Iteration 2",
    summary: "One click on a job posting sends it to Slothing: title, company and the full description, ready to tailor.",
    v1: "A Chrome/Firefox extension with scrapers for LinkedIn, Indeed, Greenhouse, Lever and Workday, plus autofill. Only capture is planned.",
    gate: "Pasting job descriptions shows up as friction during the first ~10 applications, and importing a job from its URL isn't enough.",
  },
  {
    slug: "templates",
    v1Path: "/en/studio",
    label: "Templates",
    icon: LayoutTemplate,
    when: "Later",
    summary: "Pick a resume + cover letter design. Each template is a matched Typst pair kept in the repo.",
    v1: "Custom template uploads (HTML, Markdown, DOCX, PDF) with pixel-matching. Uploads aren't planned.",
    gate: "A second template exists that you'd actually send.",
  },
  {
    slug: "follow-ups",
    v1Path: "/en/calendar",
    label: "Follow-ups",
    icon: BellRing,
    when: "Later",
    summary: "When you applied, and a nudge when a job has been quiet for a while.",
    v1: "A calendar, reminders and cron jobs. The follow-up reminder was built but never wired up.",
    gate: "You lose track of applications while using the Jobs list.",
  },
  {
    slug: "answer-bank",
    v1Path: "/en/answers",
    label: "Answer bank",
    icon: MessageSquareText,
    when: "Later",
    summary: "Your saved answers to application questions (“Why this company?”), reusable and tailorable.",
    v1: "An answer bank that the extension captured into and autofilled from.",
    gate: "You rewrite the same application answers more than a few times.",
  },
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
