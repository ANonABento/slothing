import { z } from "zod";

/**
 * The layout grammar — a small, CLOSED vocabulary. A cloned/curated template is
 * always a valid composition of these primitives, never free-form geometry. Any
 * axis the fingerprint cannot determine confidently falls back to a curated
 * default for THAT axis only. See docs/resume-template-cloning-spec.md §3.
 */

export const COLUMN_LAYOUTS = [
  "single",
  "left-sidebar",
  "right-sidebar",
] as const;
export type ColumnLayout = (typeof COLUMN_LAYOUTS)[number];

export const HEADER_STYLES = ["centered", "left-aligned", "split"] as const;
export type HeaderStyle = (typeof HEADER_STYLES)[number];

export const SECTION_TITLE_STYLES = [
  "underline-rule",
  "full-rule",
  "small-caps",
  "accent-bar",
] as const;
export type SectionTitleStyle = (typeof SECTION_TITLE_STYLES)[number];

export const BULLET_STYLES = ["disc", "dash", "arrow", "none"] as const;
export type BulletStyle = (typeof BULLET_STYLES)[number];

export const DENSITIES = ["compact", "normal", "airy"] as const;
export type Density = (typeof DENSITIES)[number];

/**
 * Where entry meta (date range / location) sits. `right-tab` = right-aligned tab
 * stop (the classic look). `inline` = flowing right after the title. This is an
 * explicit axis because right-aligned dates are also the #1 fingerprint
 * false-positive (they used to read as a phantom sidebar column) — see
 * `extract/fingerprint.ts`. Optional + defaulted to `right-tab` so existing
 * templates render byte-identically (fidelity roadmap Phase A).
 */
export const DATE_ALIGNMENTS = ["right-tab", "inline"] as const;
export type DateAlignment = (typeof DATE_ALIGNMENTS)[number];

export const DEFAULT_DATE_ALIGNMENT: DateAlignment = "right-tab";

export interface LayoutGrammar {
  columns: ColumnLayout;
  header: HeaderStyle;
  sectionTitle: SectionTitleStyle;
  bullets: BulletStyle;
  density: Density;
  /** Optional (Phase A). Resolved to {@link DEFAULT_DATE_ALIGNMENT} when absent. */
  dateAlignment?: DateAlignment;
}

export const layoutGrammarSchema = z.object({
  columns: z.enum(COLUMN_LAYOUTS),
  header: z.enum(HEADER_STYLES),
  sectionTitle: z.enum(SECTION_TITLE_STYLES),
  bullets: z.enum(BULLET_STYLES),
  density: z.enum(DENSITIES),
  dateAlignment: z.enum(DATE_ALIGNMENTS).optional(),
});

/** Curated per-axis defaults used when a fingerprint axis is low-confidence (§3). */
export const DEFAULT_GRAMMAR: LayoutGrammar = {
  columns: "single",
  header: "centered",
  sectionTitle: "full-rule",
  bullets: "disc",
  density: "normal",
  dateAlignment: DEFAULT_DATE_ALIGNMENT,
};
