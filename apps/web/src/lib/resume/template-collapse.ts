import {
  DEFAULT_GRAMMAR,
  DEFAULT_TOKENS,
  resumeTemplateSchema,
  type ColumnLayout,
  type Density,
  type FontClass,
  type HeaderStyle,
  type ResumeTemplate,
  type SectionTitleStyle,
} from "@slothing/shared/resume-template";

/**
 * One-time migration mapping: legacy V4 "reusable" template IR → the single collapsed
 * (grammar + tokens) model (`@slothing/shared` ResumeTemplate), spec §3 Decision 3 /
 * Phase 4. The V4 IR's structure (components, evidence, geometry) is discarded — only
 * its STYLE survives, mapped onto the closed grammar. Any axis we can't read maps to
 * the curated default, so every migrated template is a valid composition.
 *
 * A local, minimal structural type for the V4 row JSON is used deliberately so this
 * migration keeps compiling after the legacy renderer/types are deleted.
 */

interface LegacyScalar<T> {
  value?: T;
}
interface LegacyV4Ir {
  id?: string;
  name?: string;
  source?: { filename?: string; type?: string };
  tokens?: {
    typography?: {
      body?: { fontFamily?: string; sizePt?: number };
      name?: { fontFamily?: string };
    };
    color?: { accent?: LegacyScalar<string> };
    spacing?: {
      sectionGapPt?: LegacyScalar<number>;
      lineHeight?: LegacyScalar<string>;
    };
    rules?: { sectionDivider?: { style?: string } | null };
    layout?: {
      headerMode?: LegacyScalar<
        "single-line" | "split" | "stacked" | "sidebar"
      >;
      columns?: LegacyScalar<number>;
    };
  };
}

const HEX = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

function classifyFontFamily(family: string | undefined): FontClass {
  const n = (family ?? "").toLowerCase();
  if (!n) return DEFAULT_TOKENS.fontClass;
  if (/slab|rockwell|clarendon|memphis/.test(n)) return "slab";
  if (
    /times|georgia|garamond|serif|minion|roman|cambria|palatino|charter/.test(n)
  )
    return "serif";
  return "sans";
}

function mapColumns(ir: LegacyV4Ir): ColumnLayout {
  const cols = ir.tokens?.layout?.columns?.value;
  const header = ir.tokens?.layout?.headerMode?.value;
  if (cols && cols >= 2)
    return header === "sidebar" ? "left-sidebar" : "left-sidebar";
  return DEFAULT_GRAMMAR.columns;
}

function mapHeader(ir: LegacyV4Ir): HeaderStyle {
  switch (ir.tokens?.layout?.headerMode?.value) {
    case "split":
      return "split";
    case "single-line":
    case "sidebar":
      return "left-aligned";
    case "stacked":
      return "centered";
    default:
      return DEFAULT_GRAMMAR.header;
  }
}

function mapSectionTitle(ir: LegacyV4Ir): SectionTitleStyle {
  return ir.tokens?.rules?.sectionDivider
    ? "full-rule"
    : DEFAULT_GRAMMAR.sectionTitle;
}

function mapDensity(ir: LegacyV4Ir): Density {
  const gap = ir.tokens?.spacing?.sectionGapPt?.value;
  const size =
    ir.tokens?.typography?.body?.sizePt ?? DEFAULT_TOKENS.baseFontSizePt;
  if (!gap || !size) return DEFAULT_GRAMMAR.density;
  const ratio = gap / size;
  if (ratio < 0.9) return "compact";
  if (ratio > 1.8) return "airy";
  return "normal";
}

function mapLineHeight(ir: LegacyV4Ir): number {
  const raw = ir.tokens?.spacing?.lineHeight?.value;
  const n = raw ? parseFloat(raw) : NaN;
  return Number.isFinite(n) && n >= 1 && n <= 2 ? n : DEFAULT_TOKENS.lineHeight;
}

function clampFontSize(size: number | undefined): number {
  if (!size || !Number.isFinite(size)) return DEFAULT_TOKENS.baseFontSizePt;
  return Math.min(14, Math.max(7, size));
}

/** Map a legacy V4 IR (parsed `template_json`) to the collapsed model. */
export function reusableIrToResumeTemplate(
  raw: unknown,
  fallbackId: string,
): ResumeTemplate {
  const ir = (raw ?? {}) as LegacyV4Ir;
  const accentRaw = ir.tokens?.color?.accent?.value;
  const accent =
    accentRaw && HEX.test(accentRaw) ? accentRaw : DEFAULT_TOKENS.accent;

  const template: ResumeTemplate = {
    id: ir.id || fallbackId,
    name: ir.name || "Imported template",
    grammar: {
      columns: mapColumns(ir),
      header: mapHeader(ir),
      sectionTitle: mapSectionTitle(ir),
      bullets: DEFAULT_GRAMMAR.bullets,
      density: mapDensity(ir),
    },
    tokens: {
      accent,
      fontClass: classifyFontFamily(ir.tokens?.typography?.body?.fontFamily),
      baseFontSizePt: clampFontSize(ir.tokens?.typography?.body?.sizePt),
      lineHeight: mapLineHeight(ir),
    },
    meta: {
      description: "Migrated from a legacy V4 template.",
      inspiredBy: ir.source?.filename
        ? `import: ${ir.source.filename}`
        : undefined,
    },
  };

  // Guarantee validity; on any mismatch, fall back to a fully-default composition.
  const parsed = resumeTemplateSchema.safeParse(template);
  return parsed.success
    ? template
    : {
        id: ir.id || fallbackId,
        name: template.name,
        grammar: DEFAULT_GRAMMAR,
        tokens: DEFAULT_TOKENS,
      };
}
