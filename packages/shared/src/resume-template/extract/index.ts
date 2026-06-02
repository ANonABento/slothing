import type { ResumeDocumentModel } from "../rdm";
import type { ResumeTemplate } from "../template";
import { DEFAULT_TEMPLATES } from "../default-templates";
import { isLikelyScanned, type PdfDocGeometry } from "./geometry";
import { computeFingerprint, type StyleFingerprint } from "./fingerprint";
import {
  classifyFingerprint,
  nearestDefaultTemplate,
  type ClassificationResult,
} from "./classify";
import { extractContent } from "./content";
import type { SectionLabeler } from "./labels";

/**
 * Extraction ORCHESTRATOR (spec §3 recommended stack / Phase 2). Ties the pieces
 * together and decides the route:
 *
 *   scanned/image PDF (no text layer) ─► route "manual"  (pick a clean template)
 *   digital PDF                        ─► route "fingerprint"
 *                                          deterministic geometry → fingerprint
 *                                          → synthesized template (+ nearest pre-select)
 *                                          + OpenResume content → RDM (review draft)
 *
 * Everything here is pdf.js-FREE. Callers (app/extension/tests) parse the PDF into a
 * `PdfDocGeometry` with their own pdf.js adapter and pass it in (spec §11).
 */

export * from "./geometry";
export * from "./fingerprint";
export * from "./classify";
export * from "./labels";
export * from "./content";

export type ExtractionRoute = "fingerprint" | "manual";

export interface ResumeExtraction {
  route: ExtractionRoute;
  /** True when the PDF has no usable text layer (image scan). */
  scanned: boolean;
  /** Draft RDM for the review UI; null only when scanned (nothing to extract). */
  rdm: ResumeDocumentModel | null;
  /** Deterministic style fingerprint; null when scanned. */
  fingerprint: StyleFingerprint | null;
  /** Synthesized (grammar+tokens) template; null when scanned. */
  classification: ClassificationResult | null;
  /** Curated template to PRE-SELECT in the dialog (always set — manual-pick-first). */
  suggestedTemplate: ResumeTemplate;
  /** Section headers we could not label semantically (LLM-labeling candidates). */
  unknownHeaders: string[];
}

export interface ExtractOptions {
  /** Optional semantic labeler (e.g. LLM) for headers the keyword map can't classify. */
  labeler?: SectionLabeler;
  /** Per-axis confidence threshold for classification. */
  threshold?: number;
}

export async function extractResume(
  doc: PdfDocGeometry,
  opts: ExtractOptions = {},
): Promise<ResumeExtraction> {
  if (isLikelyScanned(doc)) {
    return {
      route: "manual",
      scanned: true,
      rdm: null,
      fingerprint: null,
      classification: null,
      // Manual-pick-first: a clean curated default is always the fallback (spec §10 #1).
      suggestedTemplate: DEFAULT_TEMPLATES[0],
      unknownHeaders: [],
    };
  }

  const fingerprint = computeFingerprint(doc);
  const classification = classifyFingerprint(fingerprint, {
    threshold: opts.threshold,
  });
  const nearest = nearestDefaultTemplate(fingerprint, opts.threshold);
  const { rdm, unknownHeaders } = await extractContent(doc, opts.labeler);

  return {
    route: "fingerprint",
    scanned: false,
    rdm,
    fingerprint,
    classification,
    suggestedTemplate: nearest,
    unknownHeaders,
  };
}
