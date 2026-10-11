/**
 * PDF text extraction, for proving two documents render the same thing.
 *
 * Used by the annotation pass: annotating a document is supposed to be structurally
 * invisible — same render, just addressable — so the check is that the text coming out of
 * the compiled PDF is unchanged.
 */

/**
 * Normalise for comparison. Whitespace and line breaking are exactly the things LaTeX is
 * entitled to move around when the source gains macros, so comparing raw extracted text
 * would fail on changes that are not real. Word sequence is the meaningful invariant.
 */
export function normalizePdfText(text: string): string {
  return (
    text
      .replace(/ /g, " ")
      // Ligatures the extractor may or may not decompose.
      .replace(/ﬁ/g, "fi")
      .replace(/ﬂ/g, "fl")
      .replace(/[‘’]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/\s+/g, " ")
      .trim()
  );
}

export async function extractPdfText(pdf: Uint8Array): Promise<string> {
  const pdfParse = (await import("pdf-parse")).default;
  const result = await pdfParse(Buffer.from(pdf));
  return normalizePdfText(result.text ?? "");
}

export interface RenderComparison {
  identical: boolean;
  /** First differing position, for a useful message rather than "they differ". */
  divergenceAt: number | null;
  beforeLength: number;
  afterLength: number;
}

export function compareRenderedText(
  before: string,
  after: string,
): RenderComparison {
  const a = normalizePdfText(before);
  const b = normalizePdfText(after);
  if (a === b) {
    return {
      identical: true,
      divergenceAt: null,
      beforeLength: a.length,
      afterLength: b.length,
    };
  }

  let index = 0;
  while (index < a.length && index < b.length && a[index] === b[index]) {
    index += 1;
  }
  return {
    identical: false,
    divergenceAt: index,
    beforeLength: a.length,
    afterLength: b.length,
  };
}
