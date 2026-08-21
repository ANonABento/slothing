/**
 * Evidence assembly for span-level AI edits.
 * See docs/specs/latex-single-source-rebuild.md §8.
 *
 * The anti-fabrication work (PRs #304/#306) revises a bullet against EVIDENCE and rejects
 * any revision that introduces facts the evidence does not support. This module decides
 * what "the evidence" is for a span inside a LaTeX document.
 *
 * The honest answer for v1 is: the document itself. A rewrite may rephrase what is already
 * written and may draw on its surrounding entry for context, but it may not introduce a
 * new employer, date, tool, or metric. Bank-backed evidence would be richer, but
 * `tex_documents` has no link to bank entries yet — that is a follow-up, not something to
 * fake by handing the model a wider net and hoping.
 */
import type { DocumentModel } from "./document-model";
import { latexToPlainText } from "./inline";

export interface SpanEvidence {
  /** The text being revised. */
  target: string;
  /** Everything the model is permitted to draw on, as a prompt-ready block. */
  evidence: string;
  /** Human-readable description of where the evidence came from, shown in the UI. */
  sources: string[];
}

function plain(value: string | undefined): string {
  return value ? latexToPlainText(value).trim() : "";
}

/**
 * Build the evidence set for one field: the field itself, its entry's header, and its
 * sibling bullets. Deliberately NOT the whole document — a bullet under "Experience"
 * must not be able to borrow a fact from an unrelated project.
 */
export function buildSpanEvidence(
  model: DocumentModel,
  spanId: string,
  fieldIndex: number,
): SpanEvidence | null {
  const span = model.byId.get(spanId);
  if (!span) return null;

  const arg = span.args[fieldIndex];
  if (!arg) return null;

  const target = plain(arg.text);
  const lines: string[] = [];
  const sources: string[] = [];

  const parent = span.parentId ? model.byId.get(span.parentId) : undefined;
  const container = parent ?? span;

  if (container.kind === "entry") {
    const [organisation, role, dates] = container.args;
    const header = [
      plain(organisation?.text),
      plain(role?.text),
      plain(dates?.text),
    ]
      .filter(Boolean)
      .join(" — ");
    if (header) {
      lines.push(`ROLE: ${header}`);
      sources.push("this role's heading");
    }
  }

  // Sibling bullets give the model tone and scope without widening the fact set beyond
  // this one entry.
  if (parent) {
    const siblings = parent.childIds
      .filter((id) => id !== spanId)
      .map((id) => model.byId.get(id))
      .flatMap((sibling) => {
        const text = plain(sibling?.args[0]?.text);
        return text ? [text] : [];
      });
    if (siblings.length > 0) {
      lines.push("OTHER BULLETS IN THIS ROLE:");
      for (const sibling of siblings) lines.push(`- ${sibling}`);
      sources.push("the other bullets in this role");
    }
  }

  lines.push("THE LINE BEING REVISED:");
  lines.push(target);
  sources.push("the text you are editing");

  return { target, evidence: lines.join("\n"), sources };
}

/** The actions offered in the inspector, mapped to the existing grounded presets. */
export const SPAN_AI_ACTIONS = [
  {
    id: "rephrase",
    label: "Rewrite",
    hint: "Rephrase for clarity, same facts.",
  },
  {
    id: "shorter",
    label: "Tighten",
    hint: "Cut length without losing the point.",
  },
  {
    id: "impact",
    label: "Strengthen",
    hint: "Lead with the outcome. Adds no new facts.",
  },
  {
    id: "metric",
    label: "Quantify",
    hint: "Surface a number only if one is already there.",
  },
] as const;

export type SpanAiActionId = (typeof SPAN_AI_ACTIONS)[number]["id"];

export function isSpanAiActionId(value: unknown): value is SpanAiActionId {
  return SPAN_AI_ACTIONS.some((action) => action.id === value);
}
