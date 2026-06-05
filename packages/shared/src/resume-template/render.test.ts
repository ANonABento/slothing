import { beforeAll, describe, expect, it } from "vitest";

import { DEFAULT_TEMPLATES } from "./default-templates";
import { ALL_FIXTURES, SAMPLE_SWE } from "./fixtures";
import { renderHtml } from "./render-html";
import { renderTypeset } from "./render-typeset";
import { createNodeTypstCompiler } from "./compile-node";
import { applyNudges } from "./nudge";
import type { ResumeTemplate } from "./template";
import type { TypesetCompiler } from "./render";

/**
 * Phase 1 acceptance (spec §5/§1):
 *  - renderHtml + renderTypeset honor the grammar and stay content-resilient on
 *    short / long / overflowing / adversarial fixtures.
 *  - Typst markup COMPILES WITH NO ERRORS on every fixture × template.
 *  - The exported PDF has a SELECTABLE TEXT LAYER and the HTML has NO layout tables
 *    (ATS invariant — spec §10 gap #5).
 *  - Snapshots lock HTML + Typst output per template so render drift is reviewable.
 */

const PRIMARY_TEMPLATE_ID = "classic";
const primary = DEFAULT_TEMPLATES.find((t) => t.id === PRIMARY_TEMPLATE_ID)!;

function withTokens(
  t: ResumeTemplate,
  patch: Partial<ResumeTemplate["tokens"]>,
): ResumeTemplate {
  return { ...t, tokens: { ...t.tokens, ...patch } };
}
function withGrammar(
  t: ResumeTemplate,
  patch: Partial<ResumeTemplate["grammar"]>,
): ResumeTemplate {
  return { ...t, grammar: { ...t.grammar, ...patch } };
}

async function extractPdfText(pdf: Uint8Array): Promise<string> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const doc = await pdfjs.getDocument({
    data: new Uint8Array(pdf),
    useSystemFonts: true,
  }).promise;
  let out = "";
  for (let p = 1; p <= doc.numPages; p += 1) {
    const page = await doc.getPage(p);
    const tc = await page.getTextContent();
    out += tc.items.map((i) => ("str" in i ? i.str : "")).join(" ") + "\n";
  }
  return out;
}

describe("renderHtml — grammar coverage & content-resilience", () => {
  for (const tpl of DEFAULT_TEMPLATES) {
    for (const { name, rdm } of ALL_FIXTURES) {
      it(`renders ${tpl.id} × ${name} as a well-formed, table-free doc`, () => {
        const { html } = renderHtml(tpl, rdm);
        expect(html.startsWith("<!doctype html>")).toBe(true);
        // ATS invariant: no layout tables.
        expect(html).not.toMatch(/<table[\s>]/i);
        // Token reactivity: accent is present.
        expect(html).toContain(tpl.tokens.accent);
        // Content present (the candidate name always renders).
        expect(html).toContain(
          rdm.basics.name
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;"),
        );
      });
    }
  }

  it("escapes adversarial characters so the HTML stays well-formed", () => {
    const { html } = renderHtml(
      primary,
      ALL_FIXTURES.find((f) => f.name === "tricky")!.rdm,
    );
    // The raw, unescaped angle-bracket form must never appear.
    expect(html).not.toContain("<O'Brien>");
    expect(html).toContain("&lt;O&#39;Brien&gt;");
    // The job title's literal double-quotes are escaped in the document body.
    expect(html).toContain("Lead &quot;Hacker&quot;");
  });
});

describe("renderTypeset — emits markup for every fixture", () => {
  for (const tpl of DEFAULT_TEMPLATES) {
    for (const { name, rdm } of ALL_FIXTURES) {
      it(`emits Typst for ${tpl.id} × ${name}`, () => {
        const { src } = renderTypeset(tpl, rdm);
        expect(src).toContain("#set document");
        expect(src).toContain("#set page");
        expect(src.length).toBeGreaterThan(100);
      });
    }
  }
});

describe("HTML snapshots (per template, SWE fixture)", () => {
  for (const tpl of DEFAULT_TEMPLATES) {
    it(`html: ${tpl.id}`, () => {
      expect(renderHtml(tpl, SAMPLE_SWE).html).toMatchSnapshot();
    });
  }
});

describe("Typst snapshots (per template, SWE fixture)", () => {
  for (const tpl of DEFAULT_TEMPLATES) {
    it(`typst: ${tpl.id}`, () => {
      expect(renderTypeset(tpl, SAMPLE_SWE).src).toMatchSnapshot();
    });
  }
});

describe("token-permutation snapshots (Classic × SWE) — drift control", () => {
  const perms: { label: string; tpl: ResumeTemplate }[] = [
    { label: "accent-rust", tpl: withTokens(primary, { accent: "#b4541f" }) },
    { label: "font-slab", tpl: withTokens(primary, { fontClass: "slab" }) },
    { label: "density-airy", tpl: withGrammar(primary, { density: "airy" }) },
    {
      label: "left-sidebar",
      tpl: withGrammar(primary, { columns: "left-sidebar" }),
    },
    { label: "bullets-arrow", tpl: withGrammar(primary, { bullets: "arrow" }) },
  ];
  for (const { label, tpl } of perms) {
    it(`html: ${label}`, () =>
      expect(renderHtml(tpl, SAMPLE_SWE).html).toMatchSnapshot());
    it(`typst: ${label}`, () =>
      expect(renderTypeset(tpl, SAMPLE_SWE).src).toMatchSnapshot());
  }
});

describe("Typst COMPILES WITH NO ERRORS on every fixture × template", () => {
  let compiler: TypesetCompiler;
  beforeAll(() => {
    compiler = createNodeTypstCompiler();
  });

  for (const tpl of DEFAULT_TEMPLATES) {
    for (const { name, rdm } of ALL_FIXTURES) {
      it(`compiles ${tpl.id} × ${name}`, async () => {
        const { src } = renderTypeset(tpl, rdm);
        const pdf = await compiler.compile(src);
        expect(pdf.length).toBeGreaterThan(0);
        // %PDF- magic header.
        expect(Array.from(pdf.slice(0, 5))).toEqual([
          0x25, 0x50, 0x44, 0x46, 0x2d,
        ]);
      });
    }
  }
}, 60_000);

describe("Phase A knobs — accentPlacement / nameScale / pageMargin / dateAlignment", () => {
  it("nameScale enlarges the rendered name in both backends", () => {
    const tpl = withTokens(primary, { nameScale: 1.5 });
    // 1.9em baseline × 1.5 = 2.85em.
    expect(renderHtml(tpl, SAMPLE_SWE).html).toContain("font-size:2.85em");
    expect(renderTypeset(tpl, SAMPLE_SWE).src).toContain("size: 2.85em");
  });

  it("accentPlacement 'none' drops the accent color entirely (monochrome)", () => {
    const accent = "#b4541f";
    const colored = withTokens(primary, { accent });
    const mono = withTokens(primary, { accent, accentPlacement: "none" });
    expect(renderHtml(colored, SAMPLE_SWE).html).toContain(accent);
    expect(renderHtml(mono, SAMPLE_SWE).html).not.toContain(accent);
    expect(renderTypeset(mono, SAMPLE_SWE).src).not.toContain(accent);
  });

  it("accentPlacement 'name' colors only the name, not section chrome", () => {
    const accent = "#b4541f";
    const html = renderHtml(
      withTokens(primary, { accent, accentPlacement: "name" }),
      SAMPLE_SWE,
    ).html;
    // The name carries the accent…
    expect(html).toContain(`color:${accent}`);
    // …but section titles fall back to ink (no accent border rule).
    expect(html).not.toContain(`border-bottom:2px solid ${accent}`);
  });

  it("pageMarginPt overrides the default page padding in both backends", () => {
    const tpl = withTokens(primary, { pageMarginPt: 30 });
    expect(renderHtml(tpl, SAMPLE_SWE).html).toContain("padding: 30pt");
    expect(renderTypeset(tpl, SAMPLE_SWE).src).toContain("margin: 30pt");
  });

  it("dateAlignment 'inline' changes the entry layout vs the right-tab default", () => {
    const inline = withGrammar(primary, { dateAlignment: "inline" });
    const rightTab = withGrammar(primary, { dateAlignment: "right-tab" });
    const inlineHtml = renderHtml(inline, SAMPLE_SWE).html;
    const rightHtml = renderHtml(rightTab, SAMPLE_SWE).html;
    expect(inlineHtml).not.toBe(rightHtml);
    // Right-tab default matches the un-nudged template (byte-identical).
    expect(rightHtml).toBe(renderHtml(primary, SAMPLE_SWE).html);
  });
});

describe("Phase A knobs — Typst still COMPILES with no errors", () => {
  const perms: { label: string; tpl: ResumeTemplate }[] = [
    { label: "nameScale", tpl: withTokens(primary, { nameScale: 1.4 }) },
    {
      label: "accent-none",
      tpl: withTokens(primary, { accentPlacement: "none" }),
    },
    { label: "pageMargin", tpl: withTokens(primary, { pageMarginPt: 28 }) },
    {
      label: "dates-inline",
      tpl: withGrammar(primary, { dateAlignment: "inline" }),
    },
    {
      label: "section-spacing",
      tpl: withTokens(primary, { sectionSpacing: 1.8 }),
    },
  ];
  let compiler: TypesetCompiler;
  beforeAll(() => {
    compiler = createNodeTypstCompiler();
  });
  for (const { label, tpl } of perms) {
    it(`compiles ${label}`, async () => {
      const { src } = renderTypeset(tpl, SAMPLE_SWE);
      const pdf = await compiler.compile(src);
      expect(Array.from(pdf.slice(0, 5))).toEqual([
        0x25, 0x50, 0x44, 0x46, 0x2d,
      ]);
    });
  }
}, 60_000);

describe("Phase B — skillsLayout grid (labeled-rows table primitive)", () => {
  const grid = withGrammar(primary, { skillsLayout: "grid" });

  it("renders Skills as an aligned label|value grid in both backends", () => {
    const html = renderHtml(grid, SAMPLE_SWE).html;
    expect(html).toContain("grid-template-columns:26% 1fr");
    expect(html).toContain("Languages");
    expect(html).toContain("TypeScript, Go, Python, SQL");
    const src = renderTypeset(grid, SAMPLE_SWE).src;
    expect(src).toContain("columns: (26%, 1fr)");
  });

  it("default (list) is unchanged — byte-identical to the un-nudged template", () => {
    expect(
      renderHtml(withGrammar(primary, { skillsLayout: "list" }), SAMPLE_SWE)
        .html,
    ).toBe(renderHtml(primary, SAMPLE_SWE).html);
    // The classic list layout never emits the labeled-rows grid.
    expect(renderHtml(primary, SAMPLE_SWE).html).not.toContain(
      "grid-template-columns:26% 1fr",
    );
  });

  it("falls back to the flowing list when skill groups have no labels", () => {
    const unlabeled = {
      ...SAMPLE_SWE,
      skills: SAMPLE_SWE.skills.map((s) => ({ ...s, name: "" })),
    };
    const html = renderHtml(grid, unlabeled).html;
    // No half-empty table — degrades to the list, content still present.
    expect(html).not.toContain("grid-template-columns:26% 1fr");
    expect(html).toContain("TypeScript");
  });

  it("Typst still COMPILES with the skills grid", async () => {
    const compiler = createNodeTypstCompiler();
    const pdf = await compiler.compile(renderTypeset(grid, SAMPLE_SWE).src);
    expect(Array.from(pdf.slice(0, 5))).toEqual([0x25, 0x50, 0x44, 0x46, 0x2d]);
  }, 30_000);
});

describe("applyNudges — preview+nudge primitive (playground + Studio)", () => {
  it("layers grammar + token overrides over a base template immutably", () => {
    const out = applyNudges(primary, {
      grammar: { density: "airy" },
      tokens: { accent: "#b4541f" },
    });
    expect(out.grammar.density).toBe("airy");
    expect(out.tokens.accent).toBe("#b4541f");
    // Untouched axes inherited; base is not mutated.
    expect(out.grammar.columns).toBe(primary.grammar.columns);
    expect(primary.grammar.density).not.toBe("airy");
  });
});

describe("dual-engine parity — both backends render the SAME fixture without error", () => {
  it("renderHtml produces and renderTypeset compiles for one definition", async () => {
    const compiler = createNodeTypstCompiler();
    const tpl = applyNudges(primary, {
      tokens: { accent: "#0d7377" },
      grammar: { bullets: "arrow" },
    });
    const { html } = renderHtml(tpl, SAMPLE_SWE);
    const { src } = renderTypeset(tpl, SAMPLE_SWE);
    expect(html).toContain("<!doctype html>");
    const pdf = await compiler.compile(src);
    expect(pdf.length).toBeGreaterThan(0);
  }, 30_000);
});

describe("ATS invariant — exported PDF has a selectable text layer", () => {
  it("Typst PDF text is extractable and contains the candidate's content", async () => {
    const compiler = createNodeTypstCompiler();
    const { src } = renderTypeset(primary, SAMPLE_SWE);
    const pdf = await compiler.compile(src);
    const text = await extractPdfText(pdf);
    // A real, selectable text layer — not an image.
    expect(text).toContain("Avery Chen");
    expect(text).toContain("Northwind Systems");
    expect(text.length).toBeGreaterThan(200);
  }, 30_000);

  it("HTML output of every template is free of layout <table> elements", () => {
    for (const tpl of DEFAULT_TEMPLATES) {
      for (const { rdm } of ALL_FIXTURES) {
        expect(renderHtml(tpl, rdm).html).not.toMatch(/<table[\s>]/i);
      }
    }
  });
});
