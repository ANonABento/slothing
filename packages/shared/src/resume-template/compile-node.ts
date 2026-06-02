import { NodeCompiler } from "@myriaddreamin/typst-ts-node-compiler";

import type { TypesetCompiler } from "./render";

/**
 * Node-side implementation of the pluggable `TypesetCompiler` (spec §6), backed by
 * the official Typst Rust→WASM compiler via @myriaddreamin/typst-ts-node-compiler.
 *
 * This file is INTENTIONALLY NOT re-exported from index.ts: it pulls a native addon
 * (a devDependency) that app/browser consumers must never load. It exists for the
 * Vitest suite (assert "Typst compiles with no errors on every fixture", spec §1/§5)
 * and any server-side `compile()` (Phase 5). The browser playground supplies its own
 * WASM-backed compiler against the same interface.
 */
export function createNodeTypstCompiler(): TypesetCompiler {
  const compiler = NodeCompiler.create();
  return {
    async compile(src: string): Promise<Uint8Array> {
      // `.pdf()` throws on a compilation ERROR (unknown fonts are warnings only and
      // still produce a document). A throw here means the emitted markup is invalid.
      const pdf = compiler.pdf({ mainFileContent: src });
      if (!pdf || pdf.length === 0) {
        throw new Error("Typst produced an empty document");
      }
      return pdf;
    },
  };
}
