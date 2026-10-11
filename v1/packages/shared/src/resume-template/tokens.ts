import { z } from "zod";

/**
 * Style tokens — the parametric "knobs" extracted from an upload or nudged by the
 * user in the playground / import dialog. Modeled after RenderCV's `design` block
 * (see docs/resume-template-cloning-spec.md §10). Fonts are a TEMPLATE-LEVEL token
 * (a font *class*, mapped to a curated font), not a free-for-all — matching the
 * market norm (Resume.io forbids free font choice).
 */

export const FONT_CLASSES = ["serif", "sans", "slab"] as const;
export type FontClass = (typeof FONT_CLASSES)[number];

/** Curated font stack per class. Both render backends must serve identical webfonts. */
export const FONT_STACKS: Record<FontClass, string> = {
  serif: '"Source Serif 4", Georgia, "Times New Roman", serif',
  sans: '"Source Sans 3", "Helvetica Neue", Arial, sans-serif',
  slab: '"Roboto Slab", "Source Serif 4", Georgia, serif',
};

const HEX_COLOR = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

/**
 * Where the accent color is applied. `both` = name + section chrome (the classic
 * look); `name` = colored name, monochrome sections; `rules` = monochrome name,
 * colored section titles/rules/bullets/links; `none` = fully monochrome. See the
 * fidelity roadmap Phase A — defaulted to `both` so existing templates are
 * unchanged.
 */
export const ACCENT_PLACEMENTS = ["both", "name", "rules", "none"] as const;
export type AccentPlacement = (typeof ACCENT_PLACEMENTS)[number];

export const DEFAULT_ACCENT_PLACEMENT: AccentPlacement = "both";
/** Name size multiplier on the baseline 1.9em name. */
export const DEFAULT_NAME_SCALE = 1;
/** Section-gap multiplier layered on top of density (1 = density default). */
export const DEFAULT_SECTION_SPACING = 1;

export interface StyleTokens {
  /** Single accent color (hex). Drives section rules, links, name emphasis. */
  accent: string;
  fontClass: FontClass;
  /** Base body font size in points (typical resume range 9–11pt). */
  baseFontSizePt: number;
  /** Unitless line height multiplier. Density also nudges this in render. */
  lineHeight: number;
  /** Optional (Phase A). Resolved to {@link DEFAULT_ACCENT_PLACEMENT} when absent. */
  accentPlacement?: AccentPlacement;
  /**
   * Optional (Phase A) page margin, in points, applied to all four sides. When
   * absent the per-engine default margin is kept (HTML `0.55in 0.6in` / Typst
   * `(x: 0.6in, y: 0.55in)`) so existing templates render byte-identically.
   */
  pageMarginPt?: number;
  /** Optional (Phase A) name size multiplier. Resolved to {@link DEFAULT_NAME_SCALE}. */
  nameScale?: number;
  /** Optional (Phase A) section-gap multiplier. Resolved to {@link DEFAULT_SECTION_SPACING}. */
  sectionSpacing?: number;
}

export const styleTokensSchema = z.object({
  accent: z.string().regex(HEX_COLOR, "accent must be a hex color"),
  fontClass: z.enum(FONT_CLASSES),
  baseFontSizePt: z.number().min(7).max(14),
  lineHeight: z.number().min(1).max(2),
  accentPlacement: z.enum(ACCENT_PLACEMENTS).optional(),
  pageMarginPt: z.number().min(18).max(96).optional(),
  nameScale: z.number().min(0.6).max(1.8).optional(),
  sectionSpacing: z.number().min(0.4).max(2.5).optional(),
});

export const DEFAULT_TOKENS: StyleTokens = {
  accent: "#1f4e79",
  fontClass: "sans",
  baseFontSizePt: 10.5,
  lineHeight: 1.35,
  accentPlacement: DEFAULT_ACCENT_PLACEMENT,
  nameScale: DEFAULT_NAME_SCALE,
  sectionSpacing: DEFAULT_SECTION_SPACING,
};
