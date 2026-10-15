import { existsSync } from "fs";
import { describe, expect, it } from "vitest";

import { measureResume, renderPdf } from "../render";
import { contactItems } from "../render/contact";
import { typstBin } from "../render/run";
import { profileAsTailored, resolveLetter, resolveResume } from "../resolve";
import { Profile, STYLE_PRESETS, Settings } from "../types";
import { profile } from "./fixture";

describe("contact links", () => {
  it("reads old plain-string links as a URL or as plain text", () => {
    const p = Profile.parse({ contact: { links: ["github.com/alexr", "Dual Citizen (U.S. & Canada)", { label: "Portfolio", url: "alex.dev" }] } });
    expect(p.contact.links).toEqual([
      { label: "", url: "github.com/alexr" },
      { label: "Dual Citizen (U.S. & Canada)", url: "" },
      { label: "Portfolio", url: "alex.dev" },
    ]);
  });

  it("puts plain-text items first and shows labels instead of URLs", () => {
    const items = contactItems(Profile.parse({ contact: { email: "a@b.co", links: [{ label: "Portfolio", url: "alex.dev" }, { label: "Dual Citizen", url: "" }, { label: "", url: "https://www.github.com/alexr/" }] } }).contact);
    expect(items).toEqual([
      { text: "Dual Citizen", href: null },
      { text: "a@b.co", href: "mailto:a@b.co" },
      { text: "Portfolio", href: "https://alex.dev" },
      { text: "github.com/alexr", href: "https://www.github.com/alexr/" },
    ]);
  });
});

const available = existsSync(typstBin());

describe("resume design", () => {
  it.skipIf(!available)("every preset renders a resume and a letter, and design changes the layout", async () => {
    const withTools = Profile.parse({ ...profile, projects: profile.projects.map((p) => ({ ...p, tech: ["TypeScript", "SQLite"] })) });
    const fills = new Set<number>();
    for (const preset of STYLE_PRESETS) {
      const layout = { ...Settings.parse({}).resume, style: preset.style };
      const data = resolveResume(withTools, profileAsTailored(withTools), layout);
      const pdf = await renderPdf({ kind: "resume", data });
      expect(pdf.subarray(0, 4).toString()).toBe("%PDF");
      const { extractText, getDocumentProxy } = await import("unpdf");
      const { text } = await extractText(await getDocumentProxy(new Uint8Array(pdf)), { mergePages: true });
      expect(text).toContain("TypeScript | SQLite");
      fills.add(Math.round((await measureResume(data)).fill * 1000));
      const letter = resolveLetter(withTools, { company: "Initech", title: "Engineer" }, { greeting: "Hi,", paragraphs: ["Body."], closing: "Best," }, layout);
      expect((await renderPdf({ kind: "letter", data: letter })).subarray(0, 4).toString()).toBe("%PDF");
    }
    // Font, size and spacing really reach the page: no two presets fill it the same.
    expect(fills.size).toBe(STYLE_PRESETS.length);
  }, 120_000);
});
