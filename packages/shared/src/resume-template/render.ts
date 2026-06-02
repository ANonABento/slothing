import { FONT_STACKS } from "./tokens";
import type { ResumeDocumentModel } from "./rdm";
import type { ResumeTemplate } from "./template";

/**
 * Render adapter contracts. A single ResumeTemplate definition feeds BOTH adapters
 * (spec §6). Phase 1 implements the real, content-resilient adapters that fully honor
 * the layout grammar; this module ships the interfaces + a deliberately minimal
 * `stubRenderHtml` so the playground is clickable in Phase 0.
 */

export interface RenderHtmlResult {
  /** Complete, self-contained HTML document (inline <style>). */
  html: string;
}

export interface RenderTypesetResult {
  /** Typst markup source, fed to the compiler. */
  src: string;
}

export type RenderHtml = (
  template: ResumeTemplate,
  rdm: ResumeDocumentModel,
) => RenderHtmlResult;
export type RenderTypeset = (
  template: ResumeTemplate,
  rdm: ResumeDocumentModel,
) => RenderTypesetResult;

/** Pluggable typeset compiler — Typst WASM (playground) or server impl. See spec §6. */
export interface TypesetCompiler {
  compile(src: string): Promise<Uint8Array>;
}

const DENSITY_GAP_REM: Record<string, number> = {
  compact: 0.5,
  normal: 0.85,
  airy: 1.25,
};

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    c === "&"
      ? "&amp;"
      : c === "<"
        ? "&lt;"
        : c === ">"
          ? "&gt;"
          : c === '"'
            ? "&quot;"
            : "&#39;",
  );
}

/**
 * PHASE 0 PLACEHOLDER. Not the real renderer — it ignores most of the grammar
 * (columns/header/sectionTitle variants). It exists only to give the playground a
 * recognizable, token-reactive preview. Phase 1 replaces it with the real adapter.
 */
export const stubRenderHtml: RenderHtml = (template, rdm) => {
  const { tokens } = template;
  const gap = DENSITY_GAP_REM[template.grammar.density] ?? 0.85;
  const font = FONT_STACKS[tokens.fontClass];
  const dates = (s?: string, e?: string) =>
    `${s ?? ""}${s || e ? " – " : ""}${e ?? "Present"}`;

  const section = (title: string, body: string) =>
    body
      ? `<section style="margin-top:${gap}rem"><h2 style="font-size:1em;text-transform:uppercase;letter-spacing:.06em;color:${esc(
          tokens.accent,
        )};border-bottom:2px solid ${esc(tokens.accent)};padding-bottom:2px;margin:0 0 ${gap / 2}rem">${esc(
          title,
        )}</h2>${body}</section>`
      : "";

  const work = rdm.work
    .map(
      (w) =>
        `<div style="margin-bottom:${gap / 2}rem"><strong>${esc(w.position)}</strong>, ${esc(
          w.organization,
        )} <span style="float:right;color:#555">${esc(dates(w.startDate, w.endDate))}</span><ul style="margin:.25rem 0 0;padding-left:1.1rem">${w.highlights
          .map((h) => `<li>${esc(h)}</li>`)
          .join("")}</ul></div>`,
    )
    .join("");

  const edu = rdm.education
    .map(
      (e) =>
        `<div>${esc(e.studyType ?? "")} ${esc(e.area)} — ${esc(e.institution)}</div>`,
    )
    .join("");

  const skills = rdm.skills
    .map(
      (g) =>
        `<div>${g.name ? `<strong>${esc(g.name)}:</strong> ` : ""}${esc(g.keywords.join(", "))}</div>`,
    )
    .join("");

  const body = `
    <header style="text-align:center;border-bottom:3px solid ${esc(tokens.accent)};padding-bottom:.5rem">
      <h1 style="margin:0;font-size:1.8em;color:${esc(tokens.accent)}">${esc(rdm.basics.name)}</h1>
      ${rdm.basics.headline ? `<div style="color:#555">${esc(rdm.basics.headline)}</div>` : ""}
      <div style="font-size:.85em;color:#555">${[
        rdm.basics.email,
        rdm.basics.phone,
        rdm.basics.location,
      ]
        .filter(Boolean)
        .map((x) => esc(x as string))
        .join("  •  ")}</div>
    </header>
    ${rdm.summary ? section("Summary", `<p style="margin:0">${esc(rdm.summary)}</p>`) : ""}
    ${section("Experience", work)}
    ${section("Education", edu)}
    ${section("Skills", skills)}`;

  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
    body{font-family:${font};font-size:${tokens.baseFontSizePt}pt;line-height:${tokens.lineHeight};color:#1a1a1a;max-width:8.5in;margin:0 auto;padding:0.6in}
    h1,h2{font-family:${font}}
    ul{list-style:${template.grammar.bullets === "none" ? "none" : "disc"}}
  </style></head><body>${body}
    <!-- PHASE 0 STUB renderer — replace with real renderHtml in Phase 1 -->
  </body></html>`;

  return { html };
};
