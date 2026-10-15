import type { ResolvedLetter, ResolvedResume } from "../types";
import { contactItems } from "./contact";
import { compileInTemp, evalInTemp, fontArgs, typstBin } from "./run";
import { LETTER_TYP, RESUME_TYP } from "./typst";

export type RenderInput = { kind: "resume"; data: ResolvedResume } | { kind: "letter"; data: ResolvedLetter };

/** The Typst template for a document — handy for debugging. The data is passed separately as data.json. */
export function renderSource(input: RenderInput): string {
  return input.kind === "resume" ? RESUME_TYP : LETTER_TYP;
}

const files = (input: RenderInput) => ({
  "main.typ": renderSource(input),
  "data.json": JSON.stringify({ ...input.data, contactItems: contactItems(input.data.contact) }),
});

export async function renderPdf(input: RenderInput): Promise<Buffer> {
  return compileInTemp(files(input), typstBin(), ["compile", ...fontArgs(), "main.typ", "out.pdf"], "out.pdf");
}

/** How long a resume runs: pages, and how full the last page is (0–1). Lays it out without writing a PDF. */
export async function measureResume(data: ResolvedResume): Promise<{ pages: number; fill: number }> {
  const out = await evalInTemp(files({ kind: "resume", data }), typstBin(), ["eval", ...fontArgs(), "query(<slothing-end>).first().value", "--in", "main.typ", "--format", "json"]);
  const end = JSON.parse(out) as { page: number; y: number; top: number; bottom: number };
  return { pages: end.page, fill: Math.min(1, Math.max(0, (end.y - end.top) / (end.bottom - end.top))) };
}
