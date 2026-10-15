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
    const p = Profile.parse({ contact: { links: ["github.com/alexr", "Open to relocation", { label: "Portfolio", url: "alex.dev" }] } });
    expect(p.contact.links).toEqual([
      { label: "", url: "github.com/alexr" },
      { label: "Open to relocation", url: "" },
      { label: "Portfolio", url: "alex.dev" },
    ]);
  });

  it("puts plain-text items first and shows labels instead of URLs", () => {
    const items = contactItems(Profile.parse({ contact: { email: "a@b.co", links: [{ label: "Portfolio", url: "alex.dev" }, { label: "Open to relocation", url: "" }, { label: "", url: "https://www.github.com/alexr/" }] } }).contact);
    expect(items).toEqual([
      { text: "Open to relocation", href: null },
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

describe("entry layout", () => {
  it.skipIf(!available)("groups a promotion under one company line, and renders extra sections", async () => {
    const p = Profile.parse({
      ...profile,
      experience: [
        { id: "a", company: "Initrode", title: "Senior Engineer", start: "2023", end: "Present", bullets: [{ id: "a1", text: "Led the platform team." }] },
        { id: "b", company: "Initrode", title: "Engineer", start: "2021", end: "2023", bullets: [{ id: "b1", text: "Built the billing service." }] },
      ],
      extras: [{ id: "x", title: "Certifications", entries: [{ id: "c", title: "CKA", org: "CNCF", end: "2024" }] }],
    });
    const text = async (style: Partial<Settings["resume"]["style"]>) => {
      const layout = { ...Settings.parse({}).resume, style: { ...Settings.parse({}).resume.style, ...style } };
      const pdf = await renderPdf({ kind: "resume", data: resolveResume(p, profileAsTailored(p), layout) });
      const { extractText, getDocumentProxy } = await import("unpdf");
      return (await extractText(await getDocumentProxy(new Uint8Array(pdf)), { mergePages: true })).text;
    };
    const grouped = await text({ groupRoles: true });
    expect(grouped.match(/Initrode/g)).toHaveLength(1);
    expect(grouped).toMatch(/CERTIFICATIONS[\s\S]*CKA — CNCF/);
    expect((await text({ groupRoles: false })).match(/Initrode/g)).toHaveLength(2);
    // Dates in the left column still render (and so does every heading-rule style).
    for (const headingRule of ["below", "beside", "none"] as const) expect(await text({ dates: "left", headingRule })).toContain("2021 – 2023");
  }, 60_000);
});
