import type { ResolvedLetter, ResolvedResume } from "../types";
import { contactItems } from "./contact";
import { compileInTemp, typstBin } from "./run";
import { LETTER_TYP, RESUME_TYP } from "./typst";

export type RenderInput = { kind: "resume"; data: ResolvedResume } | { kind: "letter"; data: ResolvedLetter };

/** The Typst template for a document — handy for debugging. The data is passed separately as data.json. */
export function renderSource(input: RenderInput): string {
  return input.kind === "resume" ? RESUME_TYP : LETTER_TYP;
}

export async function renderPdf(input: RenderInput): Promise<Buffer> {
  return compileInTemp(
    { "main.typ": renderSource(input), "data.json": JSON.stringify({ ...input.data, contactItems: contactItems(input.data.contact) }) },
    typstBin(),
    ["compile", "main.typ", "out.pdf"],
    "out.pdf",
  );
}
