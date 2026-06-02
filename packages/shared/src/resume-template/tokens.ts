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

export interface StyleTokens {
  /** Single accent color (hex). Drives section rules, links, name emphasis. */
  accent: string;
  fontClass: FontClass;
  /** Base body font size in points (typical resume range 9–11pt). */
  baseFontSizePt: number;
  /** Unitless line height multiplier. Density also nudges this in render. */
  lineHeight: number;
}

export const styleTokensSchema = z.object({
  accent: z.string().regex(HEX_COLOR, "accent must be a hex color"),
  fontClass: z.enum(FONT_CLASSES),
  baseFontSizePt: z.number().min(7).max(14),
  lineHeight: z.number().min(1).max(2),
});

export const DEFAULT_TOKENS: StyleTokens = {
  accent: "#1f4e79",
  fontClass: "sans",
  baseFontSizePt: 10.5,
  lineHeight: 1.35,
};
