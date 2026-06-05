import {
  buildResumeLayout,
  type ResumeEntry,
  type ResumeLayout,
  type ResumeSection,
} from "./layout";
import type { RenderTypeset } from "./render";

/**
 * Real Typst adapter (Phase 1). Consumes the SAME shared `ResumeLayout` as the HTML
 * adapter (spec §6) and emits Typst markup, fed to the pluggable `compile()`
 * (Typst WASM in the browser, node compiler in tests). Honors every grammar axis.
 *
 * Robustness: ALL user-supplied text is emitted as Typst STRING LITERALS (`#"..."`),
 * which render literally and never interpret markup — so accents, `#`, `*`, `[`,
 * brackets, etc. in resume content can never produce a malformed/invalid document.
 * Only `\` and `"` need escaping inside a Typst string literal. This is what keeps
 * "Typst compiles with no errors on every fixture" true under arbitrary content.
 *
 * HTML/Typst will not be pixel-identical (line-breaking, hyphenation, metrics differ
 * — accepted in spec §6); the playground side-by-side exists to tune the drift.
 */

const INK = "#1a1a1a";
const INK_MUTED = "#555555";

/** Accent hex for section chrome (titles/rules/bullets/links), or ink when off. */
function chromeHex(layout: ResumeLayout): string {
  return layout.accentOnSections ? layout.accent : INK;
}
/** Accent hex for the name, or ink when off. */
function nameHex(layout: ResumeLayout): string {
  return layout.accentOnName ? layout.accent : INK;
}

/** Emit a Typst string literal that renders `s` verbatim (no markup interpretation). */
function tstr(s: string): string {
  return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

/** Inline content that renders `s` literally. */
function lit(s: string): string {
  return `#${tstr(s)}`;
}

function rgb(hex: string): string {
  return `rgb(${tstr(hex)})`;
}

/** Map the token line-height multiplier to a Typst paragraph leading (approx). */
function leadingEm(lineHeight: number): number {
  return Math.max(0.45, (lineHeight - 1) * 1.05 + 0.55);
}

function contactInline(
  items: { text: string; href?: string }[],
  sep: string,
): string {
  return items
    .map((it) =>
      it.href ? `#link(${tstr(it.href)})[${lit(it.text)}]` : lit(it.text),
    )
    .join(`#${tstr(sep)}`);
}

function sectionTitleTypst(layout: ResumeLayout, title: string): string {
  const accent = rgb(chromeHex(layout));
  const upper = title.toUpperCase();
  switch (layout.sectionTitle) {
    case "full-rule":
      return `#text(weight: "bold", fill: ${accent}, tracking: 0.08em)[${lit(upper)}]
#v(0.18em, weak: true)
#line(length: 100%, stroke: 1.2pt + ${accent})
#v(${layout.spacing.titleGap}em, weak: true)`;
    case "underline-rule":
      return `#text(weight: "bold", fill: ${accent}, tracking: 0.06em)[#underline(stroke: 1.2pt + ${accent}, offset: 0.18em)[${lit(
        upper,
      )}]]
#v(${layout.spacing.titleGap}em, weak: true)`;
    case "small-caps":
      return `#text(weight: "bold", fill: ${accent}, tracking: 0.12em)[#smallcaps[${lit(title)}]]
#v(${layout.spacing.titleGap}em, weak: true)`;
    case "accent-bar":
      return `#box(baseline: 0.1em)[#box(fill: ${accent}, width: 0.85em, height: 0.85em)] #text(weight: "bold", fill: ${accent}, tracking: 0.08em)[${lit(
        upper,
      )}]
#v(${layout.spacing.titleGap}em, weak: true)`;
  }
}

function bulletsTypst(layout: ResumeLayout, bullets: string[]): string {
  if (!bullets.length) return "";
  const { bulletMarker, spacing } = layout;
  if (bulletMarker === "") {
    return bullets
      .map((b) => `#par[${lit(b)}]\n#v(${spacing.bulletGap}em, weak: true)`)
      .join("\n");
  }
  const marker = `text(fill: ${rgb(chromeHex(layout))})[${lit(bulletMarker)}]`;
  const items = bullets.map((b) => `[${lit(b)}]`).join(", ");
  return `#list(marker: ${marker}, spacing: ${(spacing.bulletGap + 0.45).toFixed(3)}em, tight: true, ${items})`;
}

function entryTypst(layout: ResumeLayout, e: ResumeEntry): string {
  const lead =
    (e.primary ? `#text(weight: "bold")[${lit(e.primary)}]` : "") +
    (e.secondary ? `${e.primary ? lit(", ") : ""}${lit(e.secondary)}` : "");
  const meta = [e.trailing, e.subtrailing].filter(Boolean) as string[];

  let head = "";
  if (layout.dateAlignment === "inline") {
    // Meta flows right after the title (same line), not a right tab stop.
    const inlineMeta = meta.length
      ? `${lead ? lit(" · ") : ""}#text(fill: ${rgb(INK_MUTED)})[${lit(meta.join(" · "))}]`
      : "";
    const line = `${lead}${inlineMeta}`;
    head = line ? `#par[${line}]` : "";
  } else {
    const rightLines: string[] = [];
    if (e.trailing) rightLines.push(lit(e.trailing));
    if (e.subtrailing)
      rightLines.push(`#text(size: 0.92em)[${lit(e.subtrailing)}]`);
    if (lead && rightLines.length) {
      // Code-position args: bare content blocks / function calls (no leading `#`).
      head = `#grid(columns: (1fr, auto), column-gutter: 1em, [${lead}], align(right)[#text(fill: ${rgb(
        INK_MUTED,
      )})[${rightLines.join(" #linebreak() ")}]])`;
    } else if (lead) {
      head = `#par[${lead}]`;
    } else if (rightLines.length) {
      head = `#par[#text(fill: ${rgb(INK_MUTED)})[${rightLines.join(" #linebreak() ")}]]`;
    }
  }

  const note = e.note
    ? `\n#text(fill: ${rgb(INK_MUTED)}, style: "italic")[${
        e.href ? `#link(${tstr(e.href)})[${lit(e.note)}]` : lit(e.note)
      }]`
    : e.href
      ? `\n#link(${tstr(e.href)})[${lit(e.href)}]`
      : "";

  const bullets = e.bullets.length
    ? `\n${bulletsTypst(layout, e.bullets)}`
    : "";

  return `#block(breakable: true, below: ${layout.spacing.entryGap}em)[${head}${note}${bullets}]`;
}

function skillsTypst(
  layout: ResumeLayout,
  rows: { label?: string; keywords: string[] }[],
): string {
  return rows
    .map((r) => {
      const label = r.label
        ? `#text(weight: "bold")[${lit(r.label + ":")}] `
        : "";
      return `#par[${label}${lit(r.keywords.join(", "))}]\n#v(${layout.spacing.bulletGap}em, weak: true)`;
    })
    .join("\n");
}

function contactBlockTypst(
  layout: ResumeLayout,
  items: { text: string; href?: string }[],
): string {
  return items
    .map(
      (it) =>
        `#par[${it.href ? `#link(${tstr(it.href)})[${lit(it.text)}]` : lit(it.text)}]\n#v(${layout.spacing.bulletGap}em, weak: true)`,
    )
    .join("\n");
}

function sectionTypst(layout: ResumeLayout, section: ResumeSection): string {
  let body = "";
  switch (section.body.kind) {
    case "text":
      body = `#par(justify: true)[${lit(section.body.text)}]`;
      break;
    case "entries":
      body = section.body.entries.map((e) => entryTypst(layout, e)).join("\n");
      break;
    case "skills":
      body = skillsTypst(layout, section.body.rows);
      break;
    case "contact":
      body = contactBlockTypst(layout, section.body.items);
      break;
  }
  return `#block(breakable: true, above: ${layout.spacing.sectionGap}em)[
${sectionTitleTypst(layout, section.title)}
${body}
]`;
}

function headerTypst(layout: ResumeLayout): string {
  const { header, spacing } = layout;
  const name = `#text(size: ${layout.nameSizeEm}em, weight: "bold", fill: ${rgb(
    nameHex(layout),
  )})[${lit(header.name)}]`;
  const headline = header.headline
    ? `\n#v(0.12em, weak: true)\n#text(fill: ${rgb(INK_MUTED)}, size: 1.02em)[${lit(header.headline)}]`
    : "";
  const contact = header.contact.length
    ? `\n#v(0.28em, weak: true)\n#text(fill: ${rgb(INK_MUTED)}, size: 0.88em)[${contactInline(
        header.contact,
        "  •  ",
      )}]`
    : "";

  let inner: string;
  switch (header.style) {
    case "centered":
      inner = `#align(center)[${name}${headline}${contact}]`;
      break;
    case "left-aligned":
      inner = `${name}${headline}${contact}`;
      break;
    case "split":
      inner = header.contact.length
        ? `#grid(columns: (1fr, auto), column-gutter: 1em, [${name}${headline}], align(right + bottom)[#text(fill: ${rgb(
            INK_MUTED,
          )}, size: 0.88em)[${contactInline(header.contact, " #linebreak() ")}]])`
        : `${name}${headline}`;
      break;
  }

  return `${inner}
#v(${(spacing.headerGap * 0.5).toFixed(3)}em, weak: true)
#line(length: 100%, stroke: 0.5pt + ${rgb(chromeHex(layout))})
#v(${(spacing.headerGap * 0.5).toFixed(3)}em, weak: true)`;
}

function columnTypst(layout: ResumeLayout, sections: ResumeSection[]): string {
  return sections.map((s) => sectionTypst(layout, s)).join("\n");
}

/** The real Typst renderer. */
export const renderTypeset: RenderTypeset = (template, rdm) => {
  const layout = buildResumeLayout(template, rdm);
  const lineHeight = layout.baseLineHeight * layout.spacing.lineHeightFactor;
  const fontList = layout.font.typstFamilies.map((f) => tstr(f)).join(", ");

  const header = headerTypst(layout);
  const mainCol = columnTypst(layout, layout.main);

  let bodyInner: string;
  if (layout.sidebarSide && layout.sidebar.length) {
    const sidebarBody = columnTypst(layout, layout.sidebar);
    // Bare code expressions — these become grid positional args (code position).
    const sidebarBlock = `block(fill: ${rgb(chromeHex(layout))}.lighten(92%), inset: (x: 0.7em, y: 0.5em), radius: 0pt, width: 100%)[${sidebarBody}]`;
    const mainBlock = `[${header}\n${mainCol}]`;
    const [a, b, cols] =
      layout.sidebarSide === "left"
        ? [sidebarBlock, mainBlock, "(32%, 1fr)"]
        : [mainBlock, sidebarBlock, "(1fr, 32%)"];
    bodyInner = `#grid(columns: ${cols}, column-gutter: 1.4em, align: top, ${a}, ${b})`;
  } else {
    bodyInner = `${header}\n${mainCol}`;
  }

  const margin =
    layout.pageMarginPt != null
      ? `${layout.pageMarginPt}pt`
      : "(x: 0.6in, top: 0.55in, bottom: 0.55in)";

  const src = `#set document(title: ${tstr(layout.header.name)}, author: ${tstr(layout.header.name)})
#set page(width: 8.5in, height: 11in, margin: ${margin})
#set text(font: (${fontList}), size: ${layout.baseFontSizePt}pt, fill: ${rgb(INK)})
#set par(leading: ${leadingEm(lineHeight).toFixed(3)}em, justify: false)
#show link: set text(fill: ${rgb(chromeHex(layout))})

${bodyInner}
`;

  return { src };
};
