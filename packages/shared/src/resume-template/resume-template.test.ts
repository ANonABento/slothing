import { describe, expect, it } from "vitest";

import { DEFAULT_GRAMMAR, layoutGrammarSchema } from "./grammar";
import { DEFAULT_TOKENS, styleTokensSchema } from "./tokens";
import { resumeDocumentModelSchema } from "./rdm";
import { resumeTemplateSchema } from "./template";
import { DEFAULT_TEMPLATES, getDefaultTemplate } from "./default-templates";
import { SAMPLE_RDMS } from "./fixtures";
import { renderHtml } from "./render-html";

describe("grammar + tokens defaults", () => {
  it("default grammar is a valid composition", () => {
    expect(layoutGrammarSchema.safeParse(DEFAULT_GRAMMAR).success).toBe(true);
  });
  it("default tokens validate", () => {
    expect(styleTokensSchema.safeParse(DEFAULT_TOKENS).success).toBe(true);
  });
  it("rejects a non-hex accent", () => {
    expect(
      styleTokensSchema.safeParse({ ...DEFAULT_TOKENS, accent: "blue" })
        .success,
    ).toBe(false);
  });
});

describe("default templates", () => {
  it("ships the v1 set of 5", () => {
    expect(DEFAULT_TEMPLATES).toHaveLength(5);
  });
  it("every template is valid against the schema", () => {
    for (const t of DEFAULT_TEMPLATES) {
      expect(resumeTemplateSchema.safeParse(t).success).toBe(true);
    }
  });
  it("template ids are unique", () => {
    const ids = DEFAULT_TEMPLATES.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("the set spans every column layout (classifier coverage)", () => {
    const cols = new Set(DEFAULT_TEMPLATES.map((t) => t.grammar.columns));
    expect(cols).toEqual(new Set(["single", "left-sidebar", "right-sidebar"]));
  });
  it("getDefaultTemplate resolves by id", () => {
    expect(getDefaultTemplate("modern")?.name).toBe("Modern");
    expect(getDefaultTemplate("nope")).toBeUndefined();
  });
});

describe("RDM fixtures", () => {
  it("all sample RDMs validate", () => {
    for (const rdm of SAMPLE_RDMS) {
      expect(resumeDocumentModelSchema.safeParse(rdm).success).toBe(true);
    }
  });
});

describe("renderHtml (real adapter — smoke)", () => {
  it("produces a self-contained HTML doc reflecting RDM + tokens", () => {
    const [tpl] = DEFAULT_TEMPLATES;
    const [rdm] = SAMPLE_RDMS;
    const { html } = renderHtml(tpl, rdm);
    expect(html).toContain("<!doctype html>");
    expect(html).toContain(rdm.basics.name);
    expect(html).toContain(tpl.tokens.accent);
    expect(html).toContain(rdm.work[0].highlights[0]);
  });
  it("escapes HTML in content", () => {
    const [tpl] = DEFAULT_TEMPLATES;
    const { html } = renderHtml(tpl, {
      ...SAMPLE_RDMS[0],
      basics: { ...SAMPLE_RDMS[0].basics, name: "A <b>& B</b>" },
    });
    expect(html).toContain("A &lt;b&gt;&amp; B&lt;/b&gt;");
    expect(html).not.toContain("<b>& B</b>");
  });
});
