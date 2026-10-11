import { chromium, type Browser } from "playwright-core";

import type { ResolvedLetter, ResolvedResume } from "../types";
import { letterHtml, resumeHtml } from "./html";
import { letterTex, resumeTex } from "./latex";
import { compileInTemp, engineBin } from "./run";
import { LETTER_TYP, RESUME_TYP } from "./typst";

export const ENGINES = ["html", "typst", "latex"] as const;
export type Engine = (typeof ENGINES)[number];

export type RenderInput = { kind: "resume"; data: ResolvedResume } | { kind: "letter"; data: ResolvedLetter };

const g = globalThis as unknown as { __slothingBrowser?: Promise<Browser> };

async function browser() {
  g.__slothingBrowser ??= chromium.launch({ channel: "chrome", headless: true });
  const b = await g.__slothingBrowser;
  if (!b.isConnected()) {
    g.__slothingBrowser = undefined;
    return browser();
  }
  return b;
}

async function htmlToPdf(html: string): Promise<Buffer> {
  const page = await (await browser()).newPage();
  try {
    await page.setContent(html, { waitUntil: "load" });
    return await page.pdf({ preferCSSPageSize: true, printBackground: true });
  } finally {
    await page.close();
  }
}

/** Source text for an engine — handy for debugging and for downloading the .typ/.tex. */
export function renderSource(engine: Engine, input: RenderInput): string {
  if (engine === "html") return input.kind === "resume" ? resumeHtml(input.data) : letterHtml(input.data);
  if (engine === "typst") return input.kind === "resume" ? RESUME_TYP : LETTER_TYP;
  return input.kind === "resume" ? resumeTex(input.data) : letterTex(input.data);
}

export async function renderPdf(engine: Engine, input: RenderInput): Promise<Buffer> {
  const source = renderSource(engine, input);
  switch (engine) {
    case "html":
      return htmlToPdf(source);
    case "typst":
      return compileInTemp(
        { "main.typ": source, "data.json": JSON.stringify(input.data) },
        engineBin("typst"),
        ["compile", "main.typ", "out.pdf"],
        "out.pdf",
      );
    case "latex":
      // First compile downloads the TeX bundle, so allow a generous timeout.
      return compileInTemp({ "main.tex": source }, engineBin("tectonic"), ["-X", "compile", "--untrusted", "main.tex"], "main.pdf", 180_000);
  }
}
