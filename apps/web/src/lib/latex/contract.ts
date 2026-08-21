/**
 * The Slothing LaTeX document contract — shared types and identity.
 * See docs/specs/latex-single-source-rebuild.md §3.
 *
 * A Slothing document IS a .tex file. These types describe the addressable spans the
 * scanner finds inside it; they are a *view* over the source, never a replacement for it.
 * The source is always the artifact of record.
 */
import { randomBytes } from "crypto";

export const CONTRACT_VERSION = 1;

export type SpanKind =
  | "header"
  | "section"
  | "entry"
  | "item"
  | "para"
  | "skills"
  /**
   * A neutral anchor in an IMPORTED document. It renders nothing of its own — it just
   * makes an existing piece of someone else's .tex addressable. The structural kinds
   * above cannot be used for that: `\slothingItem` emits its own `\item`, so wrapping a
   * bullet that already sits in a foreign list breaks the document.
   */
  | "mark";

/** Macro name (without the leading backslash) → span kind. */
export const MACRO_KINDS: Record<string, SpanKind> = {
  slothingHeader: "header",
  slothingSection: "section",
  slothingEntry: "entry",
  slothingItem: "item",
  slothingPara: "para",
  slothingSkills: "skills",
  slothingMark: "mark",
};

/**
 * Required brace-argument count per macro, and which of those arguments hold editable
 * text. `body` arguments (an entry's item list) are structural — they contain nested
 * spans, so the inspector edits the children, never the container's raw text.
 */
export const SPAN_SHAPES: Record<
  SpanKind,
  { macro: string; arity: number; fields: { index: number; label: string }[] }
> = {
  header: {
    macro: "slothingHeader",
    arity: 2,
    fields: [
      { index: 0, label: "Name" },
      { index: 1, label: "Contact" },
    ],
  },
  section: {
    macro: "slothingSection",
    arity: 1,
    fields: [{ index: 0, label: "Title" }],
  },
  entry: {
    macro: "slothingEntry",
    arity: 4,
    fields: [
      { index: 0, label: "Organisation" },
      { index: 1, label: "Role" },
      { index: 2, label: "Dates" },
    ],
  },
  item: {
    macro: "slothingItem",
    arity: 1,
    fields: [{ index: 0, label: "Text" }],
  },
  para: {
    macro: "slothingPara",
    arity: 1,
    fields: [{ index: 0, label: "Text" }],
  },
  skills: {
    macro: "slothingSkills",
    arity: 1,
    fields: [{ index: 0, label: "Text" }],
  },
  mark: {
    macro: "slothingMark",
    arity: 1,
    fields: [{ index: 0, label: "Text" }],
  },
};

const ID_PREFIXES: Record<SpanKind, string> = {
  header: "hdr",
  section: "sec",
  entry: "ent",
  item: "itm",
  para: "par",
  skills: "skl",
  mark: "mrk",
};

/** `<kind>-<6 hex>`, e.g. `itm-c4d883`. Opaque on purpose — slugs collide on reorder. */
export function createSpanId(kind: SpanKind): string {
  return `${ID_PREFIXES[kind]}-${randomBytes(3).toString("hex")}`;
}

const ID_PATTERN = /^(?:hdr|sec|ent|itm|par|skl|mrk)-[0-9a-f]{6}$/;

export function isSpanId(value: string): boolean {
  return ID_PATTERN.test(value);
}

/** A byte range in the source. `text` is the raw slice — not unescaped. */
export interface SpanArg {
  start: number;
  end: number;
  text: string;
}

export interface Span {
  id: string | null;
  kind: SpanKind;
  macro: string;
  /** Offset of the leading backslash. */
  start: number;
  /** Offset one past the final closing brace. */
  end: number;
  args: SpanArg[];
  /** Ids of spans nested inside this one, outermost-first. */
  childIds: string[];
  parentId: string | null;
}
