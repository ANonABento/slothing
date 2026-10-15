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
  meta: DocMeta;
  updatedAt: string;
}

/* ─── Settings: one row, every field defaulted so an empty row means "today's behavior" ─── */

export const PROVIDERS = ["anthropic", "nebius", "openai"] as const;
export type Provider = (typeof PROVIDERS)[number];

export const LATITUDES = ["select", "rephrase", "rewrite"] as const;
export type Latitude = (typeof LATITUDES)[number];

export const SECTIONS = ["summary", "experience", "projects", "education", "skills"] as const;
export type Section = (typeof SECTIONS)[number];
/** Sections that can be left off the page. The rest always render when they have content. */
export const OPTIONAL_SECTIONS = ["summary", "projects"] as const;
export const PAPERS = ["us-letter", "a4"] as const;
export const LETTER_LENGTHS = { short: 200, standard: 350 } as const;
export type LetterLength = keyof typeof LETTER_LENGTHS;

/** Every section exactly once: unknown and repeated ones dropped, missing ones appended in default order. */
const fullOrder = (order: Section[]): Section[] => {
  const seen = [...new Set(order)];
  return [...seen, ...SECTIONS.filter((s) => !seen.includes(s))];
};

const DEFAULT_LAYOUT = { order: [...SECTIONS], hide: [], paper: "us-letter" as const };

export const Settings = z.object({
  ai: z
    .object({
      /** null: use the first provider that has a key. */
      provider: z.enum(PROVIDERS).nullable().default(null),
      /** Per provider, so switching back and forth keeps each choice. "" means the env/default model. */
      models: z.object({ anthropic: z.string().default(""), nebius: z.string().default(""), openai: z.string().default("") }).default({ anthropic: "", nebius: "", openai: "" }),
      /** OpenAI-compatible endpoint (OpenRouter, Ollama, LM Studio…). "" means OPENAI_BASE_URL or api.openai.com. */
      openaiBaseUrl: z.string().default(""),
    })
    .default({ provider: null, models: { anthropic: "", nebius: "", openai: "" }, openaiBaseUrl: "" }),
  tailoring: z
    .object({
      /** How far AI may move from the profile's wording. Grounding is the same at every level. */
      latitude: z.enum(LATITUDES).default("rephrase"),
      /** Free-text style preferences added to the resume and cover letter prompts. */
      instructions: z.string().default(""),
    })
    .default({ latitude: "rephrase", instructions: "" }),
  resume: z
    .object({
      order: z.array(z.enum(SECTIONS)).default([...SECTIONS]).transform(fullOrder),
      hide: z.array(z.enum(OPTIONAL_SECTIONS)).default([]),
      paper: z.enum(PAPERS).default("us-letter"),
    })
    .default(DEFAULT_LAYOUT),
  letter: z.object({ length: z.enum(["short", "standard"]).default("standard") }).default({ length: "standard" }),
});
export type Settings = z.infer<typeof Settings>;
export type AiSettings = Settings["ai"];
export type TailoringSettings = Settings["tailoring"];
export type ResumeLayout = Settings["resume"];
export type LetterSettings = Settings["letter"];
export type Paper = (typeof PAPERS)[number];

/** Where a document came from, shown above the editor. Older documents have an empty object. */
export const DocMeta = z.object({
  source: z.enum(["ai", "profile"]).optional(),
  provider: z.string().optional(),
  model: z.string().optional(),
  latitude: z.enum(LATITUDES).optional(),
  /** Hand-edited since it was generated. */
  edited: z.boolean().optional(),
});
export type DocMeta = z.infer<typeof DocMeta>;

/* ─── Fully-resolved shapes the renderers consume ─── */

export interface ResolvedResume {
  /** Sections to render, in order. */
  sections: Section[];
  paper: Paper;
  contact: Profile["contact"];
  summary: string;
  experience: { company: string; title: string; location: string; start: string; end: string; bullets: string[] }[];
  projects: { name: string; url: string; bullets: string[] }[];
  education: Omit<Education, "id">[];
  skills: { category: string; items: string[] }[];
}

export interface ResolvedLetter {
  paper: Paper;
  contact: Profile["contact"];
  date: string;
  recipient: { company: string; title: string };
  greeting: string;
  paragraphs: string[];
  closing: string;
}
