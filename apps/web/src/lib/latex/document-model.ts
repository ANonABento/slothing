/**
 * The document model — one scan of the source, every derived view built from it.
 * See docs/specs/latex-single-source-rebuild.md §7.
 *
 * The editor needs an outline, a breadcrumb, and a field list on every keystroke. Each of
 * those is a projection of the same span array, so `scanSpans` runs exactly once per source
 * and everything else reads from the result. Storing any of these in React state instead is
 * how selection/geometry desync bugs get created.
 */
import { SPAN_SHAPES, type Span, type SpanKind } from "./contract";
import { classifyField, fieldDisplayText, type FieldMode } from "./field-edit";
import { latexToPlainText } from "./inline";
import { scanSpans } from "./scanner";
import {
  hasSettingsBlock,
  readSettings,
  type DocumentSettings,
} from "./settings";

export interface FieldDescriptor {
  index: number;
  label: string;
  /** Exactly what is stored in the source. */
  raw: string;
  mode: FieldMode;
  /** What the inspector shows. Equals `raw` for a rich field — never a lossy projection. */
  display: string;
}

export interface OutlineNode {
  spanId: string;
  kind: SpanKind;
  label: string;
  children: OutlineNode[];
}

/**
 * Settings are wrapped rather than thrown: `readSettings` is strict and rejects unknown
 * keys, which is right for validation but must never blank the editor for a document
 * written by a newer contract version.
 */
export type SettingsResult =
  | { ok: true; value: DocumentSettings }
  | { ok: false; error: string };

export interface DocumentModel {
  source: string;
  spans: Span[];
  byId: Map<string, Span>;
  outline: OutlineNode[];
  fields: Map<string, FieldDescriptor[]>;
  settings: SettingsResult;
  /**
   * False for an imported third-party .tex. Its style is its own, so the settings panel
   * must not offer controls that would throw on write.
   */
  editableSettings: boolean;
}

const MAX_LABEL = 60;

function truncate(value: string): string {
  const trimmed = value.trim();
  return trimmed.length <= MAX_LABEL
    ? trimmed
    : `${trimmed.slice(0, MAX_LABEL - 1).trimEnd()}…`;
}

/** A human label for a span: its first field's text, falling back to the kind. */
function labelFor(span: Span): string {
  const first = span.args[0]?.text ?? "";
  const text = truncate(latexToPlainText(first));
  return text.length > 0 ? text : span.kind;
}

function describeFields(span: Span): FieldDescriptor[] {
  const shape = SPAN_SHAPES[span.kind];
  return shape.fields.flatMap((field) => {
    const arg = span.args[field.index];
    if (!arg) return [];
    const mode = classifyField(arg.text);
    return [
      {
        index: field.index,
        label: field.label,
        raw: arg.text,
        mode,
        // A rich field shows its LaTeX. Showing the plain projection would invite an edit
        // that silently drops the formatting.
        display: mode === "plain" ? fieldDisplayText(arg.text) : arg.text,
      },
    ];
  });
}

function buildOutline(spans: Span[]): OutlineNode[] {
  const nodes = new Map<string, OutlineNode>();
  for (const span of spans) {
    if (!span.id) continue;
    nodes.set(span.id, {
      spanId: span.id,
      kind: span.kind,
      label: labelFor(span),
      children: [],
    });
  }

  const roots: OutlineNode[] = [];
  for (const span of spans) {
    if (!span.id) continue;
    const node = nodes.get(span.id);
    if (!node) continue;
    const parent = span.parentId ? nodes.get(span.parentId) : undefined;
    if (parent) parent.children.push(node);
    else roots.push(node);
  }
  return roots;
}

function build(source: string): DocumentModel {
  const spans = scanSpans(source);
  const byId = new Map<string, Span>();
  const fields = new Map<string, FieldDescriptor[]>();

  for (const span of spans) {
    if (!span.id) continue;
    byId.set(span.id, span);
    fields.set(span.id, describeFields(span));
  }

  let settings: SettingsResult;
  try {
    settings = { ok: true, value: readSettings(source) };
  } catch (error) {
    settings = {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "This document's settings could not be read.",
    };
  }

  return {
    source,
    spans,
    byId,
    outline: buildOutline(spans),
    fields,
    settings,
    editableSettings: hasSettingsBlock(source),
  };
}

/**
 * One-slot memo keyed on the source string.
 *
 * Identity stability is the point: the model is passed down as a prop, so returning the
 * same object for the same source is what lets `React.memo` on the outline actually work.
 * A single slot is enough — the editor only ever holds one source at a time.
 */
let cachedSource: string | null = null;
let cachedModel: DocumentModel | null = null;

export function buildDocumentModel(source: string): DocumentModel {
  if (cachedSource === source && cachedModel) return cachedModel;
  const model = build(source);
  cachedSource = source;
  cachedModel = model;
  return model;
}

/** Test seam — the memo is module-level, so suites that assert identity need a reset. */
export function resetDocumentModelCache(): void {
  cachedSource = null;
  cachedModel = null;
}

/** The path from the document root down to `spanId`, outermost first. */
export function breadcrumbFor(
  model: DocumentModel,
  spanId: string | null,
): OutlineNode[] {
  if (!spanId) return [];
  const trail: OutlineNode[] = [];
  const seen = new Set<string>();

  let current = model.byId.get(spanId);
  while (current?.id) {
    if (seen.has(current.id)) break; // defensive: never loop on malformed parent links
    seen.add(current.id);
    trail.unshift({
      spanId: current.id,
      kind: current.kind,
      label: labelFor(current),
      children: [],
    });
    current = current.parentId ? model.byId.get(current.parentId) : undefined;
  }
  return trail;
}

export function fieldsFor(
  model: DocumentModel,
  spanId: string | null,
): FieldDescriptor[] {
  if (!spanId) return [];
  return model.fields.get(spanId) ?? [];
}

/** Flatten the outline in document order — used for keyboard traversal between spans. */
export function flattenOutline(nodes: OutlineNode[]): OutlineNode[] {
  return nodes.flatMap((node) => [node, ...flattenOutline(node.children)]);
}
