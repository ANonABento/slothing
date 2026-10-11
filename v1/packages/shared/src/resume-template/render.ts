import type { ResumeDocumentModel } from "./rdm";
import type { ResumeTemplate } from "./template";

/**
 * Render adapter CONTRACTS. A single ResumeTemplate definition feeds BOTH adapters
 * (spec §6): `renderHtml` (render-html.ts) and `renderTypeset` (render-typeset.ts),
 * both exported from the package index. Compilation of the Typst markup sits behind
 * the pluggable `TypesetCompiler`, so the target engine is swappable (Typst WASM in
 * the browser, node compiler in tests, server Typst/LaTeX later) with zero template
 * changes.
 */

export interface RenderHtmlResult {
  /** Complete, self-contained HTML document (inline <style>). */
  html: string;
}

export interface RenderTypesetResult {
  /** Typst markup source, fed to the compiler. */
  src: string;
}

export type RenderHtml = (
  template: ResumeTemplate,
  rdm: ResumeDocumentModel,
) => RenderHtmlResult;
export type RenderTypeset = (
  template: ResumeTemplate,
  rdm: ResumeDocumentModel,
) => RenderTypesetResult;

/** Pluggable typeset compiler — Typst WASM (playground) or server/node impl. See spec §6. */
export interface TypesetCompiler {
  compile(src: string): Promise<Uint8Array>;
}
