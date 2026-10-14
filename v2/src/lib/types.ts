import { z } from "zod";

/* ─── Profile: the single source of truth for every fact on a resume ─── */

export const Bullet = z.object({ id: z.string(), text: z.string() });

export const Experience = z.object({
  id: z.string(),
  company: z.string(),
  title: z.string(),
  location: z.string().default(""),
  start: z.string().default(""),
  end: z.string().default(""),
  bullets: z.array(Bullet).default([]),
});

export const Education = z.object({
  id: z.string(),
  school: z.string(),
  degree: z.string().default(""),
  location: z.string().default(""),
  start: z.string().default(""),
  end: z.string().default(""),
  details: z.string().default(""),
});

export const Project = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string().default(""),
  bullets: z.array(Bullet).default([]),
});

export const SkillGroup = z.object({
  id: z.string(),
  category: z.string(),
  items: z.array(z.string()).default([]),
});

export const Profile = z.object({
  contact: z
    .object({
      name: z.string().default(""),
      email: z.string().default(""),
      phone: z.string().default(""),
      location: z.string().default(""),
      links: z.array(z.string()).default([]),
    })
    .default({ name: "", email: "", phone: "", location: "", links: [] }),
  summary: z.string().default(""),
  experience: z.array(Experience).default([]),
  education: z.array(Education).default([]),
  projects: z.array(Project).default([]),
  skills: z.array(SkillGroup).default([]),
});

export type Profile = z.infer<typeof Profile>;
export type Experience = z.infer<typeof Experience>;
export type Education = z.infer<typeof Education>;
export type Project = z.infer<typeof Project>;
export type SkillGroup = z.infer<typeof SkillGroup>;
export type Bullet = z.infer<typeof Bullet>;

/* ─── Jobs ─── */

export const JOB_STATUSES = ["saved", "applied", "interviewing", "offer", "rejected", "archived"] as const;
export type JobStatus = (typeof JOB_STATUSES)[number];

export interface Job {
  id: string;
  company: string;
  title: string;
  url: string;
  location: string;
  description: string;
  status: JobStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

/* ─── Tailored documents ───
 * A tailored resume never restates identity facts (company, title, dates, school).
 * It references profile entries by id and only carries the rewritten bullet text,
 * each bullet citing the profile bullet(s) it came from.
 */

// AI drafts go through these schemas too, and models send null for "nothing".
const str = z.preprocess((v) => v ?? "", z.string());
const arr = <T extends z.ZodTypeAny>(item: T) => z.preprocess((v) => v ?? [], z.array(item));

export const TailoredBullet = z.object({ text: str, sourceIds: arr(z.string()) });

export const TailoredResume = z.object({
  summary: str,
  experience: arr(z.object({ sourceId: z.string(), bullets: arr(TailoredBullet) })),
  projects: arr(z.object({ sourceId: z.string(), bullets: arr(TailoredBullet) })),
  educationIds: arr(z.string()),
  skills: arr(z.object({ category: str, items: arr(z.string()) })),
});
export type TailoredResume = z.infer<typeof TailoredResume>;

export const CoverLetter = z.object({
  greeting: z.preprocess((v) => v ?? "Dear Hiring Manager,", z.string()),
  paragraphs: arr(z.string()),
  closing: z.preprocess((v) => v ?? "Sincerely,", z.string()),
});
export type CoverLetter = z.infer<typeof CoverLetter>;

export type DocKind = "resume" | "cover_letter";

export interface Warning {
  where: string;
  message: string;
}

export interface StoredDoc<T> {
  id: string;
  jobId: string;
  kind: DocKind;
  data: T;
  warnings: Warning[];
  updatedAt: string;
}

/* ─── Fully-resolved shapes the renderers consume ─── */

export interface ResolvedResume {
  contact: Profile["contact"];
  summary: string;
  experience: { company: string; title: string; location: string; start: string; end: string; bullets: string[] }[];
  projects: { name: string; url: string; bullets: string[] }[];
  education: Omit<Education, "id">[];
  skills: { category: string; items: string[] }[];
}

export interface ResolvedLetter {
  contact: Profile["contact"];
  date: string;
  recipient: { company: string; title: string };
  greeting: string;
  paragraphs: string[];
  closing: string;
}
