import { $typst } from "@myriaddreamin/typst.ts/contrib/snippet";
// Vite resolves these to served asset URLs; the Typst Rust→WASM compiler + renderer
// run entirely in-browser (no server), matching spec §7/§6.
import compilerWasmUrl from "@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm?url";
import rendererWasmUrl from "@myriaddreamin/typst-ts-renderer/pkg/typst_ts_renderer_bg.wasm?url";

import type { TypesetCompiler } from "@slothing/shared/resume-template";

let configured = false;
function ensureConfigured(): void {
  if (configured) return;
  $typst.setCompilerInitOptions({ getModule: () => compilerWasmUrl });
  $typst.setRendererInitOptions({ getModule: () => rendererWasmUrl });
  configured = true;
}

/**
 * Browser implementation of the shared `TypesetCompiler` interface (spec §6),
 * backed by the Typst WASM compiler. Same contract as the node compiler used in
 * tests — the playground and the test suite drive ONE template definition through
 * interchangeable compile() backends.
 */
export const browserTypstCompiler: TypesetCompiler = {
  async compile(src: string): Promise<Uint8Array> {
    ensureConfigured();
    const pdf = await $typst.pdf({ mainContent: src });
    if (!pdf) throw new Error("Typst compilation returned no document");
    return pdf;
  },
};
