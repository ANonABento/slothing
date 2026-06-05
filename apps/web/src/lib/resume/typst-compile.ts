/**
 * Server-side Typst → PDF compile (fidelity roadmap Phase C1).
 *
 * The DECIDED production typeset path: Typst compiles server-side via the official
 * Rust→WASM compiler (@myriaddreamin/typst-ts-node-compiler) — the same one the shared
 * test suite uses. It is deterministic (no `networkidle`/font flakiness) and far
 * lighter than the headless-Chromium HTML→PDF fallback the export route already ships.
 *
 * The native addon is imported LAZILY so it never reaches a client bundle and is only
 * loaded when a Typst export is actually requested.
 */
export async function compileTypstToPdf(src: string): Promise<Uint8Array> {
  const { NodeCompiler } =
    await import("@myriaddreamin/typst-ts-node-compiler");
  const compiler = NodeCompiler.create();
  // `.pdf()` throws only on a real compilation error (unknown fonts are warnings and
  // still produce a document), so a throw means the emitted markup is invalid.
  const pdf = compiler.pdf({ mainFileContent: src });
  if (!pdf || pdf.length === 0) {
    throw new Error("Typst produced an empty document");
  }
  return pdf;
}
