import {
  buildResumeLayout,
  type ResumeEntry,
  type ResumeLayout,
  type ResumeSection,
} from "./layout";
import type { RenderHtml } from "./render";

/**
 * Real HTML adapter (Phase 1). Consumes the shared `ResumeLayout` (the brain) and
 * serializes it to a self-contained HTML document with an inline <style>. Honors
 * EVERY grammar axis — columns / header / section-title / bullets / density — and
 * stays content-resilient: the layout flows (flex/grid), so short, long, and
 * overflowing RDMs reflow rather than overlap or clip (spec §3, §6, Phase 1).
 *
 * ATS invariant (spec §10 gap #5): output is a real text layer with NO layout
 * <table> elements — semantic flow only — so the exported PDF stays selectable and
 * machine-readable.
 */

const INK = "#1a1a1a";
const INK_MUTED = "#555555";

/** Accent color for section chrome (titles/rules/bullets/links), or ink when off. */
function chromeColor(layout: ResumeLayout): string {
  return layout.accentOnSections ? layout.accent : INK;
}
/** Accent color for the name, or ink when off. */
function nameColor(layout: ResumeLayout): string {
  return layout.accentOnName ? layout.accent : INK;
}

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

function escAttr(s: string): string {
  return esc(s);
}

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace("#", "");
  if (h.length === 3)
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Mix a color toward white; ratio 0 = color, 1 = white. */
function tint(hex: string, ratio: number): string {
  const [r, g, b] = hexToRgb(hex);
  const m = (c: number) => Math.round(c + (255 - c) * ratio);
  return `rgb(${m(r)}, ${m(g)}, ${m(b)})`;
}

function contactLineHtml(
  items: { text: string; href?: string }[],
  sep: string,
): string {
  return items
    .map((it) =>
      it.href
        ? `<a href="${escAttr(it.href)}">${esc(it.text)}</a>`
        : esc(it.text),
    )
    .join(sep);
}

function sectionTitleHtml(layout: ResumeLayout, title: string): string {
  const accent = chromeColor(layout);
  const { spacing } = layout;
  const base = `font-weight:700;color:${accent};margin:0 0 ${spacing.titleGap}em;font-size:0.92em;`;
  switch (layout.sectionTitle) {
    case "full-rule":
      return `<h2 style="${base}text-transform:uppercase;letter-spacing:0.08em;border-bottom:2px solid ${accent};padding-bottom:0.18em">${esc(
        title,
      )}</h2>`;
    case "underline-rule":
      return `<h2 style="${base}text-transform:uppercase;letter-spacing:0.06em"><span style="border-bottom:1.5px solid ${accent};padding-bottom:0.12em">${esc(
        title,
      )}</span></h2>`;
    case "small-caps":
      return `<h2 style="${base}font-variant:small-caps;text-transform:lowercase;letter-spacing:0.12em">${esc(
        title,
      )}</h2>`;
    case "accent-bar":
      return `<h2 style="${base}text-transform:uppercase;letter-spacing:0.08em;display:flex;align-items:center;gap:0.5em"><span style="display:inline-block;width:0.85em;height:0.85em;background:${accent};flex:0 0 auto"></span>${esc(
        title,
      )}</h2>`;
  }
}

function entryHtml(layout: ResumeLayout, e: ResumeEntry): string {
  const { spacing } = layout;
  const meta = [e.trailing, e.subtrailing].filter(Boolean) as string[];
  let leadLeft = [
    e.primary ? `<strong>${esc(e.primary)}</strong>` : "",
    e.secondary
      ? `<span>${e.primary ? ", " : ""}${esc(e.secondary)}</span>`
      : "",
  ].join("");

  let head: string;
  if (layout.dateAlignment === "inline") {
    // Meta flows right after the title on the same line, not a right tab stop.
    const inlineMeta = meta.length
      ? `<span style="color:${INK_MUTED}">${leadLeft ? " · " : ""}${esc(meta.join(" · "))}</span>`
      : "";
    leadLeft += inlineMeta;
    head = leadLeft ? `<div>${leadLeft}</div>` : "";
  } else {
    const leadRight = [
      e.trailing ? `<div>${esc(e.trailing)}</div>` : "",
      e.subtrailing
        ? `<div style="font-size:0.92em">${esc(e.subtrailing)}</div>`
        : "",
    ].join("");
    head =
      leadLeft || leadRight
        ? `<div style="display:flex;justify-content:space-between;align-items:baseline;gap:1em">
          <div style="min-width:0">${leadLeft}</div>
          ${leadRight ? `<div style="text-align:right;color:${INK_MUTED};white-space:nowrap;flex:0 0 auto">${leadRight}</div>` : ""}
        </div>`
        : "";
  }

  const note = e.note
    ? `<div style="color:${INK_MUTED};font-style:italic;margin-top:0.12em">${
        e.href ? `<a href="${escAttr(e.href)}">${esc(e.note)}</a>` : esc(e.note)
      }</div>`
    : e.href
      ? `<div style="margin-top:0.12em"><a href="${escAttr(e.href)}">${esc(e.href)}</a></div>`
      : "";

  const bullets = bulletsHtml(layout, e.bullets);

  return `<div style="margin-bottom:${spacing.entryGap}em">${head}${note}${bullets}</div>`;
}

function bulletsHtml(layout: ResumeLayout, bullets: string[]): string {
  if (!bullets.length) return "";
  const { bulletMarker, spacing } = layout;
  if (bulletMarker === "") {
    return `<div style="margin-top:${spacing.bulletGap}em">${bullets
      .map(
        (b) =>
          `<div style="margin-bottom:${spacing.bulletGap}em">${esc(b)}</div>`,
      )
      .join("")}</div>`;
  }
  const items = bullets
    .map(
      (b) =>
        `<li style="display:flex;gap:0.5em;margin-bottom:${spacing.bulletGap}em"><span style="flex:0 0 auto;color:${chromeColor(layout)}" aria-hidden="true">${bulletMarker}</span><span style="min-width:0">${esc(
          b,
        )}</span></li>`,
    )
    .join("");
  return `<ul style="list-style:none;margin:${spacing.bulletGap}em 0 0;padding:0">${items}</ul>`;
}

function skillsHtml(
  layout: ResumeLayout,
  rows: { label?: string; keywords: string[] }[],
): string {
  return rows
    .map((r) => {
      const label = r.label ? `<strong>${esc(r.label)}:</strong> ` : "";
      return `<div style="margin-bottom:${layout.spacing.bulletGap}em">${label}${esc(r.keywords.join(", "))}</div>`;
    })
    .join("");
}

function labeledRowsHtml(
  layout: ResumeLayout,
  rows: { label: string; value: string }[],
  labelRatio: number,
): string {
  const left = `${Math.round(labelRatio * 100)}%`;
  const cells = rows
    .map(
      (r) =>
        `<div style="font-weight:700;min-width:0">${esc(r.label)}</div><div style="min-width:0">${esc(r.value)}</div>`,
    )
    .join("");
  return `<div style="display:grid;grid-template-columns:${left} 1fr;gap:${layout.spacing.bulletGap}em 0.9em;align-items:baseline">${cells}</div>`;
}

function contactBlockHtml(
  layout: ResumeLayout,
  items: { text: string; href?: string }[],
): string {
  return items
    .map(
      (it) =>
        `<div style="margin-bottom:${layout.spacing.bulletGap}em;word-break:break-word">${
          it.href
            ? `<a href="${escAttr(it.href)}">${esc(it.text)}</a>`
            : esc(it.text)
        }</div>`,
    )
    .join("");
}

function sectionHtml(layout: ResumeLayout, section: ResumeSection): string {
  let body = "";
  switch (section.body.kind) {
    case "text":
      body = `<p style="margin:0">${esc(section.body.text)}</p>`;
      break;
    case "entries":
      body = section.body.entries.map((e) => entryHtml(layout, e)).join("");
      break;
    case "skills":
      body = skillsHtml(layout, section.body.rows);
      break;
    case "labeled-rows":
      body = labeledRowsHtml(
        layout,
        section.body.rows,
        section.body.labelRatio,
      );
      break;
    case "contact":
      body = contactBlockHtml(layout, section.body.items);
      break;
  }
  return `<section style="margin-top:${layout.spacing.sectionGap}em;break-inside:avoid">${sectionTitleHtml(
    layout,
    section.title,
  )}${body}</section>`;
}

function headerHtml(layout: ResumeLayout): string {
  const { header, spacing } = layout;
  const name = `<h1 style="margin:0;font-size:${layout.nameSizeEm}em;font-weight:700;color:${nameColor(
    layout,
  )};letter-spacing:-0.01em">${esc(header.name)}</h1>`;
  const headline = header.headline
    ? `<div style="color:${INK_MUTED};font-size:1.02em;margin-top:0.15em">${esc(header.headline)}</div>`
    : "";
  const contact = header.contact.length
    ? `<div style="color:${INK_MUTED};font-size:0.88em;margin-top:0.3em">${contactLineHtml(header.contact, "&nbsp;&nbsp;•&nbsp;&nbsp;")}</div>`
    : "";

  const wrapStyle = `padding-bottom:${spacing.headerGap * 0.5}em;margin-bottom:${spacing.headerGap * 0.5}em;border-bottom:1px solid ${tint(
    chromeColor(layout),
    0.55,
  )}`;

  switch (header.style) {
    case "centered":
      return `<header style="text-align:center;${wrapStyle}">${name}${headline}${contact}</header>`;
    case "left-aligned":
      return `<header style="${wrapStyle}">${name}${headline}${contact}</header>`;
    case "split":
      return `<header style="display:flex;justify-content:space-between;align-items:flex-end;gap:1em;${wrapStyle}">
        <div style="min-width:0">${name}${headline}</div>
        ${contact ? `<div style="text-align:right;flex:0 0 auto">${contact.replace(/margin-top:0.3em/, "margin-top:0")}</div>` : ""}
      </header>`;
  }
}

function columnHtml(layout: ResumeLayout, sections: ResumeSection[]): string {
  return sections.map((s) => sectionHtml(layout, s)).join("");
}

/** The real HTML renderer. */
export const renderHtml: RenderHtml = (template, rdm) => {
  const layout = buildResumeLayout(template, rdm);
  const lineHeight = layout.baseLineHeight * layout.spacing.lineHeightFactor;
  const header = headerHtml(layout);
  const mainCol = columnHtml(layout, layout.main);

  let bodyInner: string;
  if (layout.sidebarSide && layout.sidebar.length) {
    const sidebarBg = tint(chromeColor(layout), 0.92);
    const sidebar = `<aside style="background:${sidebarBg};padding:0.5em 0.85em;border-radius:0">${columnHtml(
      layout,
      layout.sidebar,
    )}</aside>`;
    const main = `<div style="min-width:0">${header}${mainCol}</div>`;
    const cols =
      layout.sidebarSide === "left" ? `${sidebar}${main}` : `${main}${sidebar}`;
    const templateCols = layout.sidebarSide === "left" ? "32% 1fr" : "1fr 32%";
    bodyInner = `<div style="display:grid;grid-template-columns:${templateCols};gap:1.4em;align-items:start">${cols}</div>`;
  } else {
    bodyInner = `${header}${mainCol}`;
  }

  const pagePadding =
    layout.pageMarginPt != null ? `${layout.pageMarginPt}pt` : "0.55in 0.6in";

  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<style>
  @page { size: Letter; margin: 0; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: ${layout.font.cssStack};
    font-size: ${layout.baseFontSizePt}pt;
    line-height: ${lineHeight.toFixed(3)};
    color: ${INK};
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .page { width: 8.5in; min-height: 11in; margin: 0 auto; padding: ${pagePadding}; }
  a { color: ${chromeColor(layout)}; text-decoration: none; }
  h1, h2 { font-family: ${layout.font.cssStack}; }
  p { margin: 0; }
</style></head>
<body><div class="page">${bodyInner}</div></body></html>`;

  return { html };
};
