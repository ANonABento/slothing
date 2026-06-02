import { describe, expect, it } from "vitest";

import { renderTypeset } from "../render-typeset";
import { getDefaultTemplate } from "../default-templates";
import { SAMPLE_SWE, SAMPLE_TRICKY, SAMPLE_LONG } from "../fixtures";
import { createNodeTypstCompiler } from "../compile-node";
import { embedRdmXmp, extractRdmFromXmp, hasRdmXmp } from "./xmp";

/**
 * Phase 2.5 acceptance (spec §5): exporting an RDM into a PDF and re-importing it is
 * LOSSLESS — the recovered RDM deep-equals the original (no LLM, no fingerprint).
 * Foreign PDFs (no marker) skip the fast path so extraction falls back to Phase 2.
 */

async function compiledPdf(): Promise<Uint8Array> {
  const compiler = createNodeTypstCompiler();
  const { src } = renderTypeset(getDefaultTemplate("classic")!, SAMPLE_SWE);
  return compiler.compile(src);
}

describe("XMP RDM round-trip — lossless self-re-import", () => {
  it("embeds then restores an RDM byte-for-byte from a real Typst PDF", async () => {
    const pdf = await compiledPdf();
    expect(hasRdmXmp(pdf)).toBe(false);

    const embedded = await embedRdmXmp(pdf, SAMPLE_SWE);
    expect(hasRdmXmp(embedded)).toBe(true);
    expect(embedded.slice(0, 5)).toEqual(
      new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d]),
    );

    const restored = extractRdmFromXmp(embedded);
    expect(restored).toEqual(SAMPLE_SWE);
  }, 30_000);

  it("round-trips adversarial content (quotes, unicode, brackets) without loss", async () => {
    const pdf = await compiledPdf();
    const embedded = await embedRdmXmp(pdf, SAMPLE_TRICKY);
    expect(extractRdmFromXmp(embedded)).toEqual(SAMPLE_TRICKY);
  }, 30_000);

  it("round-trips a large multi-page RDM", async () => {
    const pdf = await compiledPdf();
    const embedded = await embedRdmXmp(pdf, SAMPLE_LONG);
    expect(extractRdmFromXmp(embedded)).toEqual(SAMPLE_LONG);
  }, 30_000);

  it("a foreign PDF (no marker) returns null → falls back to Phase 2", async () => {
    const pdf = await compiledPdf();
    expect(hasRdmXmp(pdf)).toBe(false);
    expect(extractRdmFromXmp(pdf)).toBeNull();
  }, 30_000);

  it("a corrupted marker degrades to null rather than a malformed RDM", () => {
    const fakePdf = new TextEncoder().encode(
      "%PDF-1.7\n<slothing:rdm>not-valid-base64-json!!!</slothing:rdm>\n%%EOF",
    );
    expect(extractRdmFromXmp(fakePdf)).toBeNull();
  });
});
