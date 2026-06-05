import {
  DEFAULT_DATE_ALIGNMENT,
  DEFAULT_GRAMMAR,
  type LayoutGrammar,
} from "../grammar";
import {
  DEFAULT_ACCENT_PLACEMENT,
  DEFAULT_NAME_SCALE,
  DEFAULT_TOKENS,
  type StyleTokens,
} from "../tokens";
import { DEFAULT_TEMPLATES, getDefaultTemplate } from "../default-templates";
import type { ResumeTemplate } from "../template";
import type { StyleFingerprint } from "./fingerprint";

/**
 * Classifier: STYLE FINGERPRINT → (layout grammar + style tokens) template — the one
 * template model (spec §3 Decision 1/3). This is parametric synthesis (Approach C):
 * every axis whose fingerprint confidence clears the threshold is taken from the
 * upload; every weak axis falls back to the CURATED DEFAULT for THAT AXIS ONLY
 * (Approach A as a per-axis fallback). The result is therefore always a valid
 * composition of known-good primitives — never fragile reconstructed geometry.
 */

export const DEFAULT_CONFIDENCE_THRESHOLD = 0.5;

export interface ClassifyOptions {
  /** Per-axis confidence below which the curated default is used. */
  threshold?: number;
  /** Curated baseline supplying defaults for weak axes (defaults to grammar/token defaults). */
  base?: { grammar: LayoutGrammar; tokens: StyleTokens };
  /** Id/name for the synthesized template. */
  id?: string;
  name?: string;
}

export interface AxisDecision {
  axis: string;
  confidence: number;
  /** True when the upload's value was used; false when the curated default was. */
  fromUpload: boolean;
}

export interface ClassificationResult {
  template: ResumeTemplate;
  /** Per-axis record of upload-vs-default so the UI can explain/flag low-confidence axes. */
  decisions: AxisDecision[];
  /** Axis names that fell back to the curated default. */
  usedDefaults: string[];
}

/**
 * Synthesize a template from a fingerprint. Weak axes degrade to the curated default
 * for that axis only — the worst case is "a clean curated template that resembles
 * yours," never a broken layout (spec §3).
 */
export function classifyFingerprint(
  fp: StyleFingerprint,
  opts: ClassifyOptions = {},
): ClassificationResult {
  const threshold = opts.threshold ?? DEFAULT_CONFIDENCE_THRESHOLD;
  const base = opts.base ?? {
    grammar: DEFAULT_GRAMMAR,
    tokens: DEFAULT_TOKENS,
  };
  const decisions: AxisDecision[] = [];
  const usedDefaults: string[] = [];

  function pick<T>(
    axis: string,
    conf: number,
    uploadValue: T,
    defaultValue: T,
  ): T {
    const fromUpload = conf >= threshold;
    decisions.push({ axis, confidence: conf, fromUpload });
    if (!fromUpload) usedDefaults.push(axis);
    return fromUpload ? uploadValue : defaultValue;
  }

  const grammar: LayoutGrammar = {
    columns: pick(
      "columns",
      fp.columns.confidence,
      fp.columns.value,
      base.grammar.columns,
    ),
    header: pick(
      "header",
      fp.header.confidence,
      fp.header.value,
      base.grammar.header,
    ),
    sectionTitle: pick(
      "sectionTitle",
      fp.sectionTitle.confidence,
      fp.sectionTitle.value,
      base.grammar.sectionTitle,
    ),
    bullets: pick(
      "bullets",
      fp.bullets.confidence,
      fp.bullets.value,
      base.grammar.bullets,
    ),
    density: pick(
      "density",
      fp.density.confidence,
      fp.density.value,
      base.grammar.density,
    ),
    dateAlignment: pick(
      "dateAlignment",
      fp.dateAlignment.confidence,
      fp.dateAlignment.value,
      base.grammar.dateAlignment ?? DEFAULT_DATE_ALIGNMENT,
    ),
  };

  const tokens: StyleTokens = {
    accent: pick(
      "accent",
      fp.accent.confidence,
      fp.accent.value,
      base.tokens.accent,
    ),
    fontClass: pick(
      "fontClass",
      fp.fontClass.confidence,
      fp.fontClass.value,
      base.tokens.fontClass,
    ),
    baseFontSizePt: pick(
      "baseFontSizePt",
      fp.baseFontSizePt.confidence,
      fp.baseFontSizePt.value,
      base.tokens.baseFontSizePt,
    ),
    lineHeight: base.tokens.lineHeight,
    accentPlacement: pick(
      "accentPlacement",
      fp.accentPlacement.confidence,
      fp.accentPlacement.value,
      base.tokens.accentPlacement ?? DEFAULT_ACCENT_PLACEMENT,
    ),
    nameScale: pick(
      "nameScale",
      fp.nameScale.confidence,
      fp.nameScale.value,
      base.tokens.nameScale ?? DEFAULT_NAME_SCALE,
    ),
    pageMarginPt: pick(
      "pageMarginPt",
      fp.pageMarginPt.confidence,
      fp.pageMarginPt.value,
      base.tokens.pageMarginPt,
    ),
    // Section spacing is nudge-only (no reliable geometric signal); keep the base.
    sectionSpacing: base.tokens.sectionSpacing,
  };

  return {
    template: {
      id: opts.id ?? "cloned",
      name: opts.name ?? "Cloned template",
      grammar,
      tokens,
      meta: {
        description: "Synthesized from an uploaded resume's style fingerprint.",
      },
    },
    decisions,
    usedDefaults,
  };
}

const COLUMN_WEIGHT = 3;
const HEADER_WEIGHT = 1;
const TITLE_WEIGHT = 1;
const DENSITY_WEIGHT = 1;
const FONT_WEIGHT = 2;

/**
 * Nearest curated default template (Approach A) — used to PRE-SELECT a template in
 * the import dialog. Distance weights the most visually defining axes (columns, font)
 * highest. Only confident axes participate, so a sparse fingerprint still snaps
 * sensibly. This pre-selection is an enhancement, never a hard dependency: "pick a
 * clean template" (below) is always available (spec §10 gap #1).
 */
export function nearestDefaultTemplate(
  fp: StyleFingerprint,
  threshold = DEFAULT_CONFIDENCE_THRESHOLD,
): ResumeTemplate {
  let best = DEFAULT_TEMPLATES[0];
  let bestScore = Infinity;
  for (const tpl of DEFAULT_TEMPLATES) {
    let score = 0;
    if (fp.columns.confidence >= threshold)
      score += tpl.grammar.columns === fp.columns.value ? 0 : COLUMN_WEIGHT;
    if (fp.header.confidence >= threshold)
      score += tpl.grammar.header === fp.header.value ? 0 : HEADER_WEIGHT;
    if (fp.sectionTitle.confidence >= threshold)
      score +=
        tpl.grammar.sectionTitle === fp.sectionTitle.value ? 0 : TITLE_WEIGHT;
    if (fp.density.confidence >= threshold)
      score += tpl.grammar.density === fp.density.value ? 0 : DENSITY_WEIGHT;
    if (fp.fontClass.confidence >= threshold)
      score += tpl.tokens.fontClass === fp.fontClass.value ? 0 : FONT_WEIGHT;
    if (score < bestScore) {
      bestScore = score;
      best = tpl;
    }
  }
  return best;
}

/**
 * First-class "pick a clean template" path (spec §10 gap #1 / Phase 2): works with
 * ZERO fingerprint. Returns a curated default, optionally pre-tuned with whatever
 * confident tokens we did extract (accent/font) so manual pick still benefits from
 * any signal without depending on it.
 */
export function pickCleanTemplate(
  templateId: string,
  fp?: StyleFingerprint,
  threshold = DEFAULT_CONFIDENCE_THRESHOLD,
): ResumeTemplate {
  const base = getDefaultTemplate(templateId) ?? DEFAULT_TEMPLATES[0];
  if (!fp) return base;
  return {
    ...base,
    tokens: {
      ...base.tokens,
      accent:
        fp.accent.confidence >= threshold
          ? fp.accent.value
          : base.tokens.accent,
      fontClass:
        fp.fontClass.confidence >= threshold
          ? fp.fontClass.value
          : base.tokens.fontClass,
    },
  };
}
