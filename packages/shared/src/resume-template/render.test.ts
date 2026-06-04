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
