import { existsSync } from "fs";
import { describe, expect, it } from "vitest";

import { ENGINES, renderPdf } from "../render";
import { engineBin } from "../render/run";
import { profileAsTailored, resolveResume, resolveLetter } from "../resolve";
import { profile } from "./fixture";

const resume = resolveResume(profile, profileAsTailored(profile));
const letter = resolveLetter(profile, { company: "Initech", title: "Staff Engineer" }, {
  greeting: "Dear Hiring Team,",
  paragraphs: ["First paragraph with 50% & $ symbols.", "Second paragraph."],
  closing: "Best,",
});

const available = (e: string) =>
  e === "html" ? existsSync("/Applications/Google Chrome.app") : existsSync(engineBin(e === "typst" ? "typst" : "tectonic"));

describe.each(ENGINES)("%s engine", (engine) => {
  it.skipIf(!available(engine))("renders a resume and a letter to PDF", async () => {
    for (const input of [{ kind: "resume", data: resume } as const, { kind: "letter", data: letter } as const]) {
      const pdf = await renderPdf(engine, input);
      expect(pdf.subarray(0, 4).toString()).toBe("%PDF");
    }
  }, 240_000);
});
