import { existsSync } from "fs";
import { describe, expect, it } from "vitest";

import { renderPdf } from "../render";
import { typstBin } from "../render/run";
import { profileAsTailored, resolveResume, resolveLetter } from "../resolve";
import { Settings } from "../types";
import { profile } from "./fixture";

const resume = resolveResume(profile, profileAsTailored(profile));
const letter = resolveLetter(profile, { company: "Initech", title: "Staff Engineer" }, {
  greeting: "Dear Hiring Team,",
  paragraphs: ["First paragraph with 50% & $ symbols.", "Second paragraph."],
  closing: "Best,",
});

const available = existsSync(typstBin());

describe("typst render", () => {
  it.skipIf(!available)("renders a resume and a letter to PDF", async () => {
    for (const input of [{ kind: "resume", data: resume } as const, { kind: "letter", data: letter } as const]) {
      const pdf = await renderPdf(input);
      expect(pdf.subarray(0, 4).toString()).toBe("%PDF");
    }
  }, 60_000);
});

describe("typst render edge cases", () => {
  const sparse = resolveResume(
    {
      ...profile,
      contact: { name: "", email: "", phone: "", location: "", links: ["Portfolio", "https://www.example.dev/"] },
      experience: [{ ...profile.experience[0], company: "", location: "", bullets: [{ id: "x1", text: "[Internal] Moved C:\\Users\\build to 100% caching & {braces} ~ ^" }] }],
      projects: [{ id: "p", name: "Tool", url: "example.com/tool", bullets: [] }],
      education: [{ id: "e", school: "Uni", degree: "", location: "", start: "", end: "", details: "  " }],
    },
    profileAsTailored({ ...profile, experience: [{ ...profile.experience[0], bullets: [{ id: "x1", text: "[Internal] Moved C:\\Users\\build to 100% caching & {braces} ~ ^" }] }], projects: [{ id: "p", name: "Tool", url: "example.com/tool", bullets: [] }], education: [{ id: "e", school: "Uni", degree: "", location: "", start: "", end: "", details: "" }] }),
  );
  const bareLetter = resolveLetter({ ...profile, contact: { ...profile.contact, name: "山田 太郎" } }, { company: "", title: "Engineer" }, {
    greeting: "",
    paragraphs: ["Only paragraph."],
    closing: "",
  });

  it.skipIf(!available)("renders sparse/odd content without failing", async () => {
    for (const input of [{ kind: "resume", data: sparse } as const, { kind: "letter", data: bareLetter } as const]) {
      const pdf = await renderPdf(input);
      expect(pdf.subarray(0, 4).toString()).toBe("%PDF");
    }
  }, 60_000);
});

describe("typst render layout", () => {
  it.skipIf(!available)("follows section order and paper size", async () => {
    const layout = Settings.parse({ resume: { order: ["education", "skills", "experience"], hide: ["summary"], paper: "a4" } }).resume;
    const pdf = await renderPdf({ kind: "resume", data: resolveResume(profile, profileAsTailored(profile), layout) });
    const { extractText, getDocumentProxy } = await import("unpdf");
    const doc = await getDocumentProxy(new Uint8Array(pdf));
    const { width, height } = (await doc.getPage(1)).getViewport({ scale: 1 });
    expect([Math.round(width), Math.round(height)]).toEqual([595, 842]); // A4 in points
    const { text } = await extractText(doc, { mergePages: true });
    const at = (s: string) => text.search(new RegExp(s, "i"));
    expect(at("education")).toBeGreaterThanOrEqual(0);
    expect(at("education")).toBeLessThan(at("skills"));
    expect(at("skills")).toBeLessThan(at("experience"));
    expect(at("summary")).toBe(-1);
  }, 60_000);
});
