import type {
  BulletStyle,
  Density,
  HeaderStyle,
  SectionTitleStyle,
} from "./grammar";
import type { ResumeDocumentModel } from "./rdm";
import type { ResumeTemplate } from "./template";
import { FONT_STACKS, type FontClass } from "./tokens";

/**
 * The shared render BRAIN. `buildResumeLayout` turns a (template, rdm) pair into a
 * backend-agnostic, fully-resolved layout model. Both adapters — renderHtml and
 * renderTypeset — consume THIS, so per-design layout logic (section ordering,
 * sidebar split, spacing scale, header model, bullet markers) is authored ONCE and
 * cannot drift between backends (spec §6). The adapters differ only in serialization
 * syntax (HTML/CSS vs Typst markup), never in layout decisions.
 *
 * Everything is content-resilient by construction: the model carries no fixed
 * geometry, only flowing primitives, so short / long / overflowing RDMs reflow
 * instead of breaking (spec §3, Phase 1 acceptance).
 */

/** A single text run that may carry the accent color (e.g. links, the name). */
export interface ResumeContactItem {
  text: string;
  /** Present when this item links somewhere (profile/website). */
  href?: string;
}

/** An entry in Experience / Education / Projects — a titled block with bullets. */
export interface ResumeEntry {
  /** Bold lead, e.g. job title or degree. */
  primary: string;
  /** Secondary lead on the same line, e.g. organization / institution. */
  secondary?: string;
  /** Right-aligned meta, e.g. a date range. */
  trailing?: string;
  /** Second right-aligned line, e.g. location. */
  subtrailing?: string;
  /** Optional descriptive line under the lead (projects). */
  note?: string;
  /** Optional link (projects / publications). */
  href?: string;
  bullets: string[];
}

export interface ResumeSkillRow {
  label?: string;
  keywords: string[];
}

export type ResumeSectionBody =
  | { kind: "text"; text: string }
  | { kind: "entries"; entries: ResumeEntry[] }
  | { kind: "skills"; rows: ResumeSkillRow[] }
  | { kind: "contact"; items: ResumeContactItem[] };

export interface ResumeSection {
  /** Stable identity for snapshots / debugging. */
  id:
    | "summary"
    | "experience"
    | "education"
    | "skills"
    | "projects"
    | "contact";
  title: string;
  body: ResumeSectionBody;
}

export interface ResumeHeaderModel {
  name: string;
  headline?: string;
  /** Contact line shown in the header (single-column layouts only). */
  contact: ResumeContactItem[];
  style: HeaderStyle;
}

/**
 * Spacing scale in `em` (relative to base font size) so BOTH backends scale
 * identically — em is honored by HTML/CSS and by Typst. Driven by density.
 */
export interface SpacingScale {
  /** Gap above each section block. */
  sectionGap: number;
  /** Gap below a section title before its body. */
  titleGap: number;
  /** Gap between entries within a section. */
  entryGap: number;
  /** Gap between bullets. */
  bulletGap: number;
  /** Line-height multiplier applied on top of the token lineHeight. */
  lineHeightFactor: number;
  /** Gap below the header band. */
  headerGap: number;
}

export interface ResolvedFont {
  fontClass: FontClass;
  /** CSS font stack (HTML). */
  cssStack: string;
  /** Typst font family list (primary first). */
  typstFamilies: string[];
}

export interface ResumeLayout {
  template: ResumeTemplate;
  header: ResumeHeaderModel;
  /** Sections in the main column. */
  main: ResumeSection[];
  /** Sections in the sidebar; empty for single-column layouts. */
  sidebar: ResumeSection[];
  /** "left" | "right" | null (single column). */
  sidebarSide: "left" | "right" | null;
  spacing: SpacingScale;
  font: ResolvedFont;
  /** The literal marker string for a bullet, e.g. "•" / "–" / "▸" / "". */
  bulletMarker: string;
  sectionTitle: SectionTitleStyle;
  /** Base font size in points (drives both backends). */
  baseFontSizePt: number;
  /** Token line height before the density factor. */
  baseLineHeight: number;
  accent: string;
}

const DENSITY_SCALE: Record<Density, SpacingScale> = {
  compact: {
    sectionGap: 0.7,
    titleGap: 0.28,
    entryGap: 0.42,
    bulletGap: 0.12,
    lineHeightFactor: 0.95,
    headerGap: 0.6,
  },
  normal: {
    sectionGap: 1.0,
    titleGap: 0.4,
    entryGap: 0.62,
    bulletGap: 0.2,
    lineHeightFactor: 1.0,
    headerGap: 0.85,
  },
  airy: {
    sectionGap: 1.4,
    titleGap: 0.55,
    entryGap: 0.9,
    bulletGap: 0.32,
    lineHeightFactor: 1.08,
    headerGap: 1.2,
  },
};

const BULLET_MARKERS: Record<BulletStyle, string> = {
  disc: "•",
  dash: "–",
  arrow: "▸",
  none: "",
};

/** Typst font family lists per class — must mirror FONT_STACKS so backends match. */
const TYPST_FAMILIES: Record<FontClass, string[]> = {
  serif: ["Source Serif 4", "Georgia", "Times New Roman"],
  sans: ["Source Sans 3", "Helvetica Neue", "Arial"],
  slab: ["Roboto Slab", "Source Serif 4", "Georgia"],
};

/** Format a date range; undefined end => "Present". Empty inputs => "". */
export function formatDateRange(start?: string, end?: string): string {
  const left = (start ?? "").trim();
  const right = end === undefined ? (start ? "Present" : "") : end.trim();
  if (!left && !right) return "";
  if (!left) return right;
  if (!right) return left;
  return `${left} – ${right}`;
}

function contactItems(rdm: ResumeDocumentModel): ResumeContactItem[] {
  const b = rdm.basics;
  const items: ResumeContactItem[] = [];
  if (b.email) items.push({ text: b.email, href: `mailto:${b.email}` });
  if (b.phone) items.push({ text: b.phone });
  if (b.location) items.push({ text: b.location });
  if (b.website) items.push({ text: b.website, href: ensureHref(b.website) });
  for (const p of b.profiles ?? []) {
    items.push({ text: p.url || p.network, href: ensureHref(p.url) });
  }
  return items;
}

function ensureHref(url: string): string {
  if (!url) return url;
  return /^https?:\/\//i.test(url) || url.startsWith("mailto:")
    ? url
    : `https://${url}`;
}

function summarySection(rdm: ResumeDocumentModel): ResumeSection | null {
  if (!rdm.summary?.trim()) return null;
  return {
    id: "summary",
    title: "Summary",
    body: { kind: "text", text: rdm.summary.trim() },
  };
}

function experienceSection(rdm: ResumeDocumentModel): ResumeSection | null {
  if (!rdm.work.length) return null;
  const entries: ResumeEntry[] = rdm.work.map((w) => ({
    primary: w.position,
    secondary: w.organization,
    trailing: formatDateRange(w.startDate, w.endDate),
    subtrailing: w.location,
    bullets: w.highlights ?? [],
  }));
  return {
    id: "experience",
    title: "Experience",
    body: { kind: "entries", entries },
  };
}

function educationSection(rdm: ResumeDocumentModel): ResumeSection | null {
  if (!rdm.education.length) return null;
  const entries: ResumeEntry[] = rdm.education.map((e) => ({
    primary: [e.studyType, e.area].filter(Boolean).join(" "),
    secondary: e.institution,
    trailing: formatDateRange(e.startDate, e.endDate),
    subtrailing: e.score ? `GPA ${e.score}` : undefined,
    bullets: e.highlights ?? [],
  }));
  return {
    id: "education",
    title: "Education",
    body: { kind: "entries", entries },
  };
}

function skillsSection(rdm: ResumeDocumentModel): ResumeSection | null {
  if (!rdm.skills.length) return null;
  const rows: ResumeSkillRow[] = rdm.skills
    .filter((g) => g.keywords.length)
    .map((g) => ({ label: g.name, keywords: g.keywords }));
  if (!rows.length) return null;
  return { id: "skills", title: "Skills", body: { kind: "skills", rows } };
}

function projectsSection(rdm: ResumeDocumentModel): ResumeSection | null {
  if (!rdm.projects?.length) return null;
  const entries: ResumeEntry[] = rdm.projects.map((p) => ({
    primary: p.name,
    trailing: undefined,
    note: p.description,
    href: p.url ? ensureHref(p.url) : undefined,
    bullets: p.highlights ?? [],
  }));
  return {
    id: "projects",
    title: "Projects",
    body: { kind: "entries", entries },
  };
}

function contactSection(rdm: ResumeDocumentModel): ResumeSection | null {
  const items = contactItems(rdm);
  if (!items.length) return null;
  return { id: "contact", title: "Contact", body: { kind: "contact", items } };
}

function compact<T>(arr: (T | null)[]): T[] {
  return arr.filter((x): x is T => x !== null);
}

/**
 * Build the fully-resolved, backend-agnostic layout. Sidebar layouts route
 * contact + skills + education into the sidebar and keep the narrative
 * (summary / experience / projects) in the main column — a content-resilient
 * split that survives the tailor swapping data (spec §3).
 */
export function buildResumeLayout(
  template: ResumeTemplate,
  rdm: ResumeDocumentModel,
): ResumeLayout {
  const { grammar, tokens } = template;
  const isSidebar = grammar.columns !== "single";
  const sidebarSide =
    grammar.columns === "left-sidebar"
      ? "left"
      : grammar.columns === "right-sidebar"
        ? "right"
        : null;

  const header: ResumeHeaderModel = {
    name: rdm.basics.name,
    headline: rdm.basics.headline,
    // Contact lives in the header only for single-column; sidebar layouts get a Contact section.
    contact: isSidebar ? [] : contactItems(rdm),
    style: grammar.header,
  };

  let main: ResumeSection[];
  let sidebar: ResumeSection[] = [];

  if (isSidebar) {
    sidebar = compact([
      contactSection(rdm),
      skillsSection(rdm),
      educationSection(rdm),
    ]);
    main = compact([
      summarySection(rdm),
      experienceSection(rdm),
      projectsSection(rdm),
    ]);
  } else {
    main = compact([
      summarySection(rdm),
      experienceSection(rdm),
      educationSection(rdm),
      skillsSection(rdm),
      projectsSection(rdm),
    ]);
  }

  return {
    template,
    header,
    main,
    sidebar,
    sidebarSide,
    spacing: DENSITY_SCALE[grammar.density],
    font: {
      fontClass: tokens.fontClass,
      cssStack: FONT_STACKS[tokens.fontClass],
      typstFamilies: TYPST_FAMILIES[tokens.fontClass],
    },
    bulletMarker: BULLET_MARKERS[grammar.bullets],
    sectionTitle: grammar.sectionTitle,
    baseFontSizePt: tokens.baseFontSizePt,
    baseLineHeight: tokens.lineHeight,
    accent: tokens.accent,
  };
}
