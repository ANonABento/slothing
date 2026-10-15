import { z } from "zod";

/* ─── Profile: the single source of truth for every fact on a resume ─── */

/**
 * How automatic tailoring treats an entry or bullet: pinned is always included, hidden is never picked
 * (you can still add it by hand in a tailored resume), normal is up to the job.
 */
export const RANKS = ["pinned", "normal", "hidden"] as const;
export type Rank = (typeof RANKS)[number];
const rank = z.enum(RANKS).default("normal");

export const Bullet = z.object({ id: z.string(), text: z.string(), rank });

export const Experience = z.object({
  id: z.string(),
  company: z.string(),
  title: z.string(),
  /** Company or team site, linked from the role's line. */
  url: z.string().default(""),
  location: z.string().default(""),
  start: z.string().default(""),
  end: z.string().default(""),
  bullets: z.array(Bullet).default([]),
  rank,
});

export const Education = z.object({
  id: z.string(),
  school: z.string(),
  degree: z.string().default(""),
  location: z.string().default(""),
  start: z.string().default(""),
  end: z.string().default(""),
  details: z.string().default(""),
  rank,
});

export const Project = z.object({
  id: z.string(),
  name: z.string(),
  /** Tools and languages used, shown after the name ("Trailmap | Python | React"). */
  tech: z.array(z.string()).default([]),
  url: z.string().default(""),
  bullets: z.array(Bullet).default([]),
  rank,
});

/**
 * An entry in an extra section (certification, award, leadership role, publication…). Shaped like a
 * role so any of them fits: certifications usually have no bullets, leadership roles usually do.
 */
export const ExtraEntry = z.object({
  id: z.string(),
  title: z.string().default(""),
  /** Issuer, organisation or publisher. */
  org: z.string().default(""),
  location: z.string().default(""),
  start: z.string().default(""),
  end: z.string().default(""),
  url: z.string().default(""),
  bullets: z.array(Bullet).default([]),
  rank,
});

/** A section with a name you choose ("Certifications", "Leadership"), rendered after the standard ones by default. */
export const ExtraSection = z.object({
  id: z.string(),
  title: z.string().default(""),
  entries: z.array(ExtraEntry).default([]),
});

export const SkillGroup = z.object({
  id: z.string(),
  category: z.string(),
  items: z.array(z.string()).default([]),
});

/**
 * A header item: a labelled link ("Portfolio" → its URL), a bare URL (no label), or plain text (no URL,
 * e.g. "Open to relocation"). Older profiles stored plain strings; those become url or label.
 */
export const ContactLink = z.preprocess(
  (v) => (typeof v === "string" ? (/^\S+\.\S+$/.test(v.trim()) ? { label: "", url: v } : { label: v, url: "" }) : v),
  z.object({ label: z.string().default(""), url: z.string().default("") }),
);
export type ContactLink = z.infer<typeof ContactLink>;

export const Profile = z.object({
  contact: z
    .object({
      name: z.string().default(""),
      email: z.string().default(""),
      phone: z.string().default(""),
      location: z.string().default(""),
      links: z.array(ContactLink).default([]),
    })
    .default({ name: "", email: "", phone: "", location: "", links: [] }),
  summary: z.string().default(""),
  experience: z.array(Experience).default([]),
  education: z.array(Education).default([]),
  projects: z.array(Project).default([]),
  skills: z.array(SkillGroup).default([]),
  extras: z.array(ExtraSection).default([]),
});

export type Profile = z.infer<typeof Profile>;
export type Experience = z.infer<typeof Experience>;
export type Education = z.infer<typeof Education>;
export type Project = z.infer<typeof Project>;
export type SkillGroup = z.infer<typeof SkillGroup>;
export type ExtraEntry = z.infer<typeof ExtraEntry>;
export type ExtraSection = z.infer<typeof ExtraSection>;

/** The three kinds of entry that carry bullets, and so get tailored and fitted the same way. */
export const ENTRY_KINDS = ["experience", "projects", "extras"] as const;
export type EntryKind = (typeof ENTRY_KINDS)[number];
/** Every entry of one kind, flat (extra sections' entries in section order). */
export const entriesOf = (p: Profile, kind: EntryKind): (Experience | Project | ExtraEntry)[] =>
  kind === "extras" ? p.extras.flatMap((s) => s.entries) : p[kind];
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
  /** Entries from extra sections, by entry id. */
  extras: arr(z.object({ sourceId: z.string(), bullets: arr(TailoredBullet) })),
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
  /** "number": a figure not found in the source. Recomputed whenever the resume changes. */
  kind?: "number";
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

export const SECTIONS = ["summary", "experience", "projects", "education", "skills", "extras"] as const;
export type Section = (typeof SECTIONS)[number];
/** Sections that can be left off the page. The rest always render when they have content. */
export const OPTIONAL_SECTIONS = ["summary", "projects", "extras"] as const;
export const PAPERS = ["us-letter", "a4"] as const;
export const LETTER_LENGTHS = { short: 200, standard: 350 } as const;
export type LetterLength = keyof typeof LETTER_LENGTHS;

/** Every section exactly once: unknown and repeated ones dropped, missing ones appended in default order. */
const fullOrder = (order: Section[]): Section[] => {
  const seen = [...new Set(order)];
  return [...seen, ...SECTIONS.filter((s) => !seen.includes(s))];
};

export const LIGHT_THEMES = ["cream", "paper"] as const;
export const DARK_THEMES = ["graphite", "slate", "dim", "black"] as const;
export type Theme = (typeof LIGHT_THEMES)[number] | (typeof DARK_THEMES)[number];
export const THEME_MODES = ["light", "dark", "system"] as const;
export type ThemeMode = (typeof THEME_MODES)[number];

export const PAGE_LIMITS = ["one", "two", "any"] as const;

/* ─── Resume design ───
 * Fonts are bundled (npm run engines → .engines/fonts) and system fonts are ignored, so a resume
 * renders the same on every machine. Libertinus and New Computer Modern ship inside Typst.
 */
export const FONTS = {
  libertinus: { label: "Libertinus Serif", family: "Libertinus Serif", kind: "serif" },
  "computer-modern": { label: "Computer Modern (LaTeX)", family: "New Computer Modern", kind: "serif" },
  "source-serif": { label: "Source Serif", family: "Source Serif 4", kind: "serif" },
  garamond: { label: "EB Garamond", family: "EB Garamond", kind: "serif" },
  asap: { label: "Asap", family: "Asap", kind: "sans" },
  ubuntu: { label: "Ubuntu", family: "Ubuntu", kind: "sans" },
  inter: { label: "Inter", family: "Inter", kind: "sans" },
  "source-sans": { label: "Source Sans", family: "Source Sans 3", kind: "sans" },
  lato: { label: "Lato", family: "Lato", kind: "sans" },
  "plex-sans": { label: "IBM Plex Sans", family: "IBM Plex Sans", kind: "sans" },
  carlito: { label: "Carlito (Calibri-like)", family: "Carlito", kind: "sans" },
} as const;
export type FontId = keyof typeof FONTS;
const FONT_IDS = Object.keys(FONTS) as [FontId, ...FontId[]];

/** center: everything centered. split: name left, contact right. left: both on the left. */
export const HEADER_STYLES = ["center", "split", "left"] as const;
export const HEADING_CASES = ["caps", "smallcaps", "title"] as const;
export const HEADING_RULES = ["below", "beside", "none"] as const;
export const DATE_POSITIONS = ["right", "left"] as const;
/** stacked: title and dates, then company and location. inline: "Title — Company — Location   dates". */
export const ENTRY_STYLES = ["stacked", "inline"] as const;
export const BULLETS = { dot: "•", disc: "●", dash: "–", arrow: "▸" } as const;
export const ACCENTS = ["#111111", "#1f3a5f", "#3873b3", "#0f5e63", "#2f5d3a", "#7a2335", "#dc3522", "#9b85c4", "#b45309"] as const;

/** Sizes are numbers, like a word processor's; each template sets all of them. */
export const SIZE_LIMITS = {
  size: { min: 8, max: 13, step: 0.5 },
  nameSize: { min: 12, max: 36, step: 1 },
  headingSize: { min: 8, max: 18, step: 0.5 },
  spacing: { min: 0.6, max: 1.6, step: 0.05 },
  margin: { min: 0.25, max: 1.5, step: 0.05 },
} as const;
const sized = (k: keyof typeof SIZE_LIMITS) => z.number().min(SIZE_LIMITS[k].min).max(SIZE_LIMITS[k].max);
const quarter = (n: number) => Math.round(n * 4) / 4;

/** Older settings stored spacing and margins as named steps, and derived name and heading sizes. */
function upgradeStyle(v: unknown) {
  if (!v || typeof v !== "object") return v;
  const s: Record<string, unknown> = { ...v };
  const size = typeof s.size === "number" ? s.size : 10.5;
  if (typeof s.spacing === "string") s.spacing = ({ tight: 0.75, normal: 1, airy: 1.25 } as Record<string, number>)[s.spacing] ?? 1;
  if (typeof s.margins === "string") s.margins = ({ narrow: { x: 0.5, y: 0.45 }, wide: { x: 0.75, y: 0.7 } } as Record<string, unknown>)[s.margins] ?? { x: 0.6, y: 0.55 };
  s.nameSize ??= quarter(size * ((s.header ?? "center") === "center" ? 2 : 2.3));
  s.headingSize ??= quarter(size * 1.12);
  return s;
}

export const ResumeStyle = z.preprocess(upgradeStyle, z.object({
  font: z.enum(FONT_IDS).default("libertinus"),
  /** Name and section headings; "same" uses the body font. */
  headingFont: z.enum(["same", ...FONT_IDS]).default("same"),
  /** Body text, in points. */
  size: sized("size").default(10.5),
  nameSize: sized("nameSize").default(21),
  headingSize: sized("headingSize").default(11.75),
  /** Scales every gap: line spacing, between bullets, entries and sections. 1 is the default. */
  spacing: sized("spacing").default(1),
  /** Inches: x is left and right, y is top and bottom. */
  margins: z.object({ x: sized("margin"), y: sized("margin") }).default({ x: 0.6, y: 0.55 }),
  /** Section headings, their rule, bullets and link icons. */
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#111111"),
  header: z.enum(HEADER_STYLES).default("center"),
  headingCase: z.enum(HEADING_CASES).default("caps"),
  /** A rule under the heading, a rule running on after it, or none. Older settings stored a boolean. */
  headingRule: z.preprocess((v) => (v === true ? "below" : v === false ? "none" : v), z.enum(HEADING_RULES)).default("below"),
  entry: z.enum(ENTRY_STYLES).default("stacked"),
  /** Dates on the right of the title, or in their own column on the left. */
  dates: z.enum(DATE_POSITIONS).default("right"),
  /** Consecutive roles at the same company share one company line (promotions). */
  groupRoles: z.boolean().default(true),
  bullet: z.enum(Object.keys(BULLETS) as [keyof typeof BULLETS, ...(keyof typeof BULLETS)[]]).default("dot"),
  /** A small link icon instead of the URL written out. */
  linkIcons: z.boolean().default(false),
}));
export type ResumeStyle = z.infer<typeof ResumeStyle>;
const DEFAULT_STYLE = ResumeStyle.parse({});

/**
 * Starting points for the design settings, modelled on widely used templates. Each sets every style
 * field; the user adjusts from there.
 */
export const STYLE_PRESETS: { id: string; label: string; hint: string; style: ResumeStyle }[] = [
  { id: "classic", label: "Classic", hint: "Serif, centered, the default", style: DEFAULT_STYLE },
  {
    id: "jakes",
    label: "Jake's",
    hint: "The LaTeX template popular in tech",
    style: { ...DEFAULT_STYLE, font: "computer-modern", size: 10, nameSize: 20, headingSize: 11.25, headingCase: "smallcaps" },
  },
  {
    id: "modern",
    label: "Modern",
    hint: "Sans, color accent, one-line roles",
    style: { ...DEFAULT_STYLE, font: "asap", headingFont: "ubuntu", size: 10, nameSize: 23, headingSize: 11.25, spacing: 1.25, margins: { x: 0.5, y: 0.45 }, accent: "#9b85c4", header: "split", entry: "inline", bullet: "disc", linkIcons: true },
  },
  {
    id: "awesome",
    label: "Awesome-CV",
    hint: "Bold accent, rule beside headings",
    style: { ...DEFAULT_STYLE, font: "source-sans", headingFont: "source-sans", size: 10.5, accent: "#dc3522", headingRule: "beside", bullet: "dot", linkIcons: true },
  },
  {
    id: "moderncv",
    label: "ModernCV",
    hint: "Dates in a left column",
    style: { ...DEFAULT_STYLE, font: "lato", size: 10, nameSize: 23, headingSize: 11.25, accent: "#3873b3", header: "left", headingCase: "title", headingRule: "beside", dates: "left", bullet: "dot" },
  },
  {
    id: "compact",
    label: "Compact",
    hint: "Fits the most on a page",
    style: { ...DEFAULT_STYLE, font: "source-sans", size: 10, nameSize: 23, headingSize: 11.25, spacing: 0.75, margins: { x: 0.5, y: 0.45 }, accent: "#1f3a5f", header: "left", entry: "inline", linkIcons: true },
  },
];

const DEFAULT_LAYOUT = { order: [...SECTIONS], hide: [], paper: "us-letter" as const, pages: "one" as const, style: DEFAULT_STYLE };

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
      /** Tailoring fills exactly this many pages; "any" includes everything. */
      pages: z.enum(PAGE_LIMITS).default("one"),
      style: ResumeStyle.default(DEFAULT_STYLE),
    })
    .default(DEFAULT_LAYOUT),
  letter: z.object({ length: z.enum(["short", "standard"]).default("standard") }).default({ length: "standard" }),
  appearance: z
    .object({
      /** "system" follows the OS light/dark setting. */
      mode: z.enum(THEME_MODES).default("light"),
      light: z.enum(LIGHT_THEMES).default("cream"),
      dark: z.enum(DARK_THEMES).default("graphite"),
    })
    .default({ mode: "light", light: "cream", dark: "graphite" }),
});
export type Settings = z.infer<typeof Settings>;
export type AiSettings = Settings["ai"];
export type TailoringSettings = Settings["tailoring"];
export type ResumeLayout = Settings["resume"];
export type LetterSettings = Settings["letter"];
export type Paper = (typeof PAPERS)[number];
export type Appearance = Settings["appearance"];

/** Where a document came from, shown above the editor. Older documents have an empty object. */
export const DocMeta = z.object({
  /** "auto": tailored without AI. "profile": older documents made from the full profile. */
  source: z.enum(["ai", "auto", "profile"]).optional(),
  provider: z.string().optional(),
  model: z.string().optional(),
  latitude: z.enum(LATITUDES).optional(),
  /** Hand-edited since it was generated. */
  edited: z.boolean().optional(),
});
export type DocMeta = z.infer<typeof DocMeta>;

/* ─── Fully-resolved shapes the renderers consume ─── */

/** ResumeStyle with font ids turned into family names and the bullet into its character. */
export type ResolvedStyle = Omit<ResumeStyle, "font" | "headingFont" | "bullet"> & { font: string; headingFont: string; bullet: string };

export interface ResolvedResume {
  /** Sections to render, in order. */
  sections: Section[];
  paper: Paper;
  style: ResolvedStyle;
  contact: Profile["contact"];
  summary: string;
  experience: { company: string; title: string; url: string; location: string; start: string; end: string; bullets: string[] }[];
  projects: { name: string; tech: string[]; url: string; bullets: string[] }[];
  extras: { title: string; entries: { title: string; org: string; location: string; start: string; end: string; url: string; bullets: string[] }[] }[];
  education: Omit<Education, "id">[];
  skills: { category: string; items: string[] }[];
}

export interface ResolvedLetter {
  paper: Paper;
  style: ResolvedStyle;
  contact: Profile["contact"];
  date: string;
  recipient: { company: string; title: string };
  greeting: string;
  paragraphs: string[];
  closing: string;
}
