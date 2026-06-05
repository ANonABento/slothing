import { describe, expect, it } from "vitest";

import { renderTypeset } from "../render-typeset";
import { DEFAULT_TEMPLATES, getDefaultTemplate } from "../default-templates";
import { SAMPLE_SWE } from "../fixtures";
import { createNodeTypstCompiler } from "../compile-node";
import {
  computeFingerprint,
  classifyFingerprint,
  nearestDefaultTemplate,
  pickCleanTemplate,
  extractContent,
  extractResume,
  isLikelyScanned,
  labelSection,
  groupIntoLines,
  type PdfDocGeometry,
  type PdfPageGeometry,
  type PdfTextItem,
} from "./index";

/**
 * Phase 2 acceptance (spec §5): fingerprint axes land within tolerance on known
 * styles; scanned PDFs route to manual; the manual-pick path works with ZERO
 * fingerprint; the classifier falls back to curated defaults per low-confidence axis;
 * content extraction recovers an RDM draft. Synthetic geometry keeps the core tests
 * deterministic (no binary fixtures); one real round-trip exercises the adapter
 * contract end-to-end through a Typst-compiled PDF.
 */

const LETTER_W = 612;
const LETTER_H = 792;

interface MkOpts {
  fontSize?: number;
  bold?: boolean;
  fontName?: string;
  color?: string;
}
function mk(text: string, x: number, y: number, o: MkOpts = {}): PdfTextItem {
  const fontSize = o.fontSize ?? 11;
  return {
    text,
    x,
    y,
    width: text.length * fontSize * 0.5,
    height: fontSize,
    fontName: o.fontName ?? "Helvetica",
    fontSize,
    bold: o.bold ?? false,
    color: o.color,
  };
}

function page(items: PdfTextItem[]): PdfPageGeometry {
  return { width: LETTER_W, height: LETTER_H, items };
}

// --- Fixture A: single-column, centered header, serif body, blue accent, disc bullets
function singleColCenteredSerif(): PdfDocGeometry {
  const accent = "#1f4e79";
  const serif = "Times New Roman";
  const items: PdfTextItem[] = [];
  // Centered name (center ≈ page center 306).
  items.push(
    mk("Jane Doe", 250, 40, { fontSize: 22, bold: true, fontName: serif }),
  );
  items.push(
    mk("jane.doe@example.com  •  (555) 222-3344  •  Boston, MA", 170, 70, {
      fontSize: 9,
      fontName: serif,
    }),
  );
  let y = 120;
  const section = (title: string) => {
    items.push(
      mk(title, 72, y, {
        fontSize: 12,
        bold: true,
        fontName: serif,
        color: accent,
      }),
    );
    y += 20;
  };
  const body = (text: string, bullet = false) => {
    items.push(
      mk((bullet ? "• " : "") + text, bullet ? 90 : 72, y, {
        fontSize: 11,
        fontName: serif,
      }),
    );
    y += 15; // ~1.36 ratio => normal density
  };
  section("EXPERIENCE");
  body("Senior Engineer, Acme Corp 2021 – Present");
  body("Built the thing that scaled to millions of users.", true);
  body("Led a team of five engineers across two products.", true);
  body("Software Engineer, Globex 2018 – 2021");
  body("Shipped the billing system end to end.", true);
  section("EDUCATION");
  body("B.S. Computer Science, MIT 2014 – 2018");
  section("SKILLS");
  body("Languages: TypeScript, Go, Python");
  body("Infra: AWS, Kubernetes, Postgres");
  return { pages: [page(items)] };
}

// --- Fixture B: two-column left-sidebar, sans body, teal accent
function twoColLeftSidebar(): PdfDocGeometry {
  const accent = "#0d7377";
  const sans = "Arial";
  const items: PdfTextItem[] = [];
  // Sidebar (left band, x 50..~210) — a real content column with headers + items.
  let ys = 60;
  const side = (text: string, header = false) => {
    items.push(
      mk(text, 50, ys, {
        fontSize: header ? 12 : 10,
        bold: header,
        fontName: sans,
        color: header ? accent : undefined,
      }),
    );
    ys += header ? 22 : 15;
  };
  side("CONTACT", true);
  side("jane.doe@example.com");
  side("Boston, Massachusetts");
  side("linkedin.com/in/janedoe");
  side("SKILLS", true);
  side("TypeScript, JavaScript");
  side("Go, Python, and Rust");
  side("AWS, Kubernetes, Docker");
  side("Postgres, Redis, Kafka");
  // Main column (right band, x 300..560) — more text, spans vertically.
  let ym = 60;
  const main = (text: string, header = false, bullet = false) => {
    items.push(
      mk((bullet ? "▸ " : "") + text, bullet ? 318 : 300, ym, {
        fontSize: header ? 12 : 11,
        bold: header,
        fontName: sans,
        color: header ? accent : undefined,
      }),
    );
    ym += header ? 22 : 15;
  };
  main("Jane Doe", false); // name in main top
  main("EXPERIENCE", true);
  main("Senior Engineer, Acme Corp 2021 – Present");
  main("Built the thing that scaled to millions.", false, true);
  main("Led a team of five engineers.", false, true);
  main("Engineer, Globex 2018 – 2021");
  main("Shipped the billing system end to end.", false, true);
  main("Improved latency across the board.", false, true);
  main("PROJECTS", true);
  main("openledger — an OSS ledger library");
  main("1.2k stars in production use.", false, true);
  return { pages: [page(items)] };
}

describe("scanned-PDF detection → manual route", () => {
  it("flags a near-empty (image) PDF as scanned", () => {
    expect(isLikelyScanned({ pages: [page([mk("Resume", 72, 72)])] })).toBe(
      true,
    );
    expect(isLikelyScanned({ pages: [page([])] })).toBe(true);
  });
  it("a text-rich PDF is not scanned", () => {
    expect(isLikelyScanned(singleColCenteredSerif())).toBe(false);
  });
  it("extractResume routes scanned PDFs to manual with a clean default", async () => {
    const res = await extractResume({ pages: [page([mk("scan", 0, 0)])] });
    expect(res.route).toBe("manual");
    expect(res.scanned).toBe(true);
    expect(res.rdm).toBeNull();
    expect(res.suggestedTemplate.id).toBe(DEFAULT_TEMPLATES[0].id);
  });
});

describe("fingerprint — single-column centered serif", () => {
  const fp = computeFingerprint(singleColCenteredSerif());
  it("detects a single column", () => {
    expect(fp.columns.value).toBe("single");
  });
  it("detects a centered header", () => {
    expect(fp.header.value).toBe("centered");
    expect(fp.header.confidence).toBeGreaterThan(0.5);
  });
  it("detects a serif font class with confidence", () => {
    expect(fp.fontClass.value).toBe("serif");
    expect(fp.fontClass.confidence).toBeGreaterThan(0.5);
  });
  it("extracts the blue accent from colored headings", () => {
    expect(fp.accent.value).toBe("#1f4e79");
    expect(fp.accent.confidence).toBeGreaterThan(0.4);
  });
  it("detects disc bullets", () => {
    expect(fp.bullets.value).toBe("disc");
  });
  it("reports a plausible body font size", () => {
    expect(fp.baseFontSizePt.value).toBeGreaterThanOrEqual(10);
    expect(fp.baseFontSizePt.value).toBeLessThanOrEqual(12);
  });
});

describe("fingerprint — two-column left sidebar", () => {
  const fp = computeFingerprint(twoColLeftSidebar());
  it("detects a left sidebar", () => {
    expect(fp.columns.value).toBe("left-sidebar");
    expect(fp.columns.confidence).toBeGreaterThan(0.4);
  });
  it("detects a sans font class", () => {
    expect(fp.fontClass.value).toBe("sans");
  });
  it("extracts the teal accent", () => {
    expect(fp.accent.value).toBe("#0d7377");
  });
  it("detects arrow bullets", () => {
    expect(fp.bullets.value).toBe("arrow");
  });
});

// --- Fixture C: right-tabbed dates (title left, date hugging the right margin)
function rightTabDates(): PdfDocGeometry {
  const accent = "#1f4e79";
  const items: PdfTextItem[] = [];
  items.push(mk("Jane Doe", 250, 40, { fontSize: 22, bold: true }));
  let y = 120;
  items.push(
    mk("EXPERIENCE", 72, y, { fontSize: 12, bold: true, color: accent }),
  );
  y += 20;
  items.push(mk("Senior Engineer, Acme Corp", 72, y, { fontSize: 11 }));
  items.push(mk("2021 – Present", 482, y, { fontSize: 11 }));
  y += 15;
  items.push(mk("• Built the thing.", 90, y, { fontSize: 11 }));
  y += 15;
  items.push(mk("Engineer, Globex", 72, y, { fontSize: 11 }));
  items.push(mk("2018 – 2021", 500, y, { fontSize: 11 }));
  y += 15;
  return { pages: [page(items)] };
}

// --- Fixture D: inline dates (meta flows after the title on the same item)
function inlineDates(): PdfDocGeometry {
  const accent = "#1f4e79";
  const items: PdfTextItem[] = [];
  items.push(
    mk("Jane Doe", 72, 40, { fontSize: 22, bold: true, color: accent }),
  );
  let y = 120;
  items.push(
    mk("EXPERIENCE", 72, y, { fontSize: 12, bold: true, color: accent }),
  );
  y += 20;
  items.push(
    mk("Senior Engineer, Acme Corp · 2021 – Present", 72, y, {
      fontSize: 11,
    }),
  );
  y += 15;
  items.push(mk("Engineer, Globex · 2018 – 2021", 72, y, { fontSize: 11 }));
  y += 15;
  return { pages: [page(items)] };
}

describe("fingerprint — Phase A axes (date alignment, name scale, margin, accent placement)", () => {
  it("reads right-tabbed dates as right-tab", () => {
    const fp = computeFingerprint(rightTabDates());
    expect(fp.dateAlignment.value).toBe("right-tab");
    expect(fp.dateAlignment.confidence).toBeGreaterThan(0.4);
  });
  it("reads inline dates as inline (no phantom right column)", () => {
    const fp = computeFingerprint(inlineDates());
    expect(fp.dateAlignment.value).toBe("inline");
    // The right-tab false-positive must not resurface as a sidebar column.
    expect(fp.columns.value).toBe("single");
  });
  it("estimates a name scale near the 1.9em baseline for a large name", () => {
    const fp = computeFingerprint(rightTabDates());
    // 22pt name over 11pt body ≈ 2.0× → scale ≈ 1.05.
    expect(fp.nameScale.value).toBeGreaterThan(0.9);
    expect(fp.nameScale.value).toBeLessThan(1.2);
    expect(fp.nameScale.confidence).toBeGreaterThan(0.4);
  });
  it("estimates a plausible page margin in points", () => {
    const fp = computeFingerprint(rightTabDates());
    expect(fp.pageMarginPt.value).toBeGreaterThanOrEqual(18);
    expect(fp.pageMarginPt.value).toBeLessThanOrEqual(96);
  });
  it("detects accent on section rules only when the name is not colored", () => {
    const fp = computeFingerprint(rightTabDates());
    expect(fp.accentPlacement.value).toBe("rules");
  });
  it("detects accent on both when the name is also colored", () => {
    const fp = computeFingerprint(inlineDates());
    expect(fp.accentPlacement.value).toBe("both");
  });
});

describe("classifier — synthesis with per-axis default fallback", () => {
  it("synthesizes a template from a strong fingerprint", () => {
    const fp = computeFingerprint(singleColCenteredSerif());
    const { template, usedDefaults } = classifyFingerprint(fp);
    expect(template.grammar.columns).toBe("single");
    expect(template.grammar.header).toBe("centered");
    expect(template.tokens.fontClass).toBe("serif");
    expect(template.tokens.accent).toBe("#1f4e79");
    // sectionTitle is a weak text-only signal → falls back to the curated default.
    expect(usedDefaults).toContain("sectionTitle");
  });
  it("a zero-signal fingerprint falls back entirely to curated defaults", () => {
    const fp = computeFingerprint({
      pages: [page([mk("x", 0, 0), mk("y", 0, 20)])],
    });
    const { template, usedDefaults } = classifyFingerprint(fp);
    expect(usedDefaults.length).toBeGreaterThan(4);
    // Result is still a fully valid composition (never broken geometry).
    expect(["single", "left-sidebar", "right-sidebar"]).toContain(
      template.grammar.columns,
    );
  });
});

describe("nearest-match + manual-pick paths", () => {
  it("nearestDefaultTemplate pre-selects a sidebar template for a sidebar upload", () => {
    const fp = computeFingerprint(twoColLeftSidebar());
    expect(nearestDefaultTemplate(fp).grammar.columns).toBe("left-sidebar");
  });
  it("pickCleanTemplate works with ZERO fingerprint (first-class manual path)", () => {
    const tpl = pickCleanTemplate("tech");
    expect(tpl.id).toBe("tech");
  });
  it("pickCleanTemplate pre-tunes confident tokens over a chosen default", () => {
    const fp = computeFingerprint(singleColCenteredSerif());
    const tpl = pickCleanTemplate("modern", fp);
    expect(tpl.id).toBe("modern");
    expect(tpl.tokens.accent).toBe("#1f4e79"); // accent was confident → applied
  });
});

describe("section labeling", () => {
  it("maps common header synonyms to canonical kinds", () => {
    expect(labelSection("WORK HISTORY")).toBe("experience");
    expect(labelSection("Employment")).toBe("experience");
    expect(labelSection("Academic Background")).toBe("education");
    expect(labelSection("Technical Skills")).toBe("skills");
    expect(labelSection("Selected Projects")).toBe("projects");
    expect(labelSection("Hobbies & Interests")).toBe("unknown");
  });
  it("an injected labeler resolves unknown headers", async () => {
    const doc = singleColCenteredSerif();
    // Force an unknown header by labeling everything "experience".
    const { rdm } = await extractContent(doc, () => "experience");
    expect(rdm.basics.name).toBe("Jane Doe");
  });
});

describe("content extraction — OpenResume-style RDM draft", () => {
  it("recovers profile, experience, and skills from synthetic geometry", async () => {
    const { rdm } = await extractContent(singleColCenteredSerif());
    expect(rdm.basics.name).toBe("Jane Doe");
    expect(rdm.basics.email).toBe("jane.doe@example.com");
    expect(rdm.work.length).toBeGreaterThanOrEqual(2);
    expect(rdm.work[0].highlights.length).toBeGreaterThanOrEqual(1);
    expect(rdm.skills.length).toBeGreaterThanOrEqual(1);
    expect(rdm.skills.some((g) => g.keywords.includes("TypeScript"))).toBe(
      true,
    );
  });
});

describe("line grouping", () => {
  it("groups items on the same baseline into one line, ordered left-to-right", () => {
    const lines = groupIntoLines(
      page([mk("World", 120, 50), mk("Hello", 50, 50)]),
      0,
    );
    expect(lines).toHaveLength(1);
    expect(lines[0].text).toBe("Hello World");
  });
});

// --- Real round-trip: render → Typst PDF → pdf.js geometry → extract.
async function pdfToGeometry(pdf: Uint8Array): Promise<PdfDocGeometry> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const doc = await pdfjs.getDocument({
    data: new Uint8Array(pdf),
    useSystemFonts: true,
  }).promise;
  const pages: PdfPageGeometry[] = [];
  for (let p = 1; p <= doc.numPages; p += 1) {
    const pg = await doc.getPage(p);
    const viewport = pg.getViewport({ scale: 1 });
    const tc = await pg.getTextContent();
    const items: PdfTextItem[] = [];
    for (const it of tc.items) {
      if (!("str" in it) || !it.str.trim()) continue;
      const tr = it.transform as number[];
      const fontSize = Math.hypot(tr[2], tr[3]) || it.height || 10;
      const x = tr[4];
      const yTop = viewport.height - tr[5] - (it.height || fontSize);
      items.push({
        text: it.str,
        x,
        y: yTop,
        width: it.width,
        height: it.height || fontSize,
        fontName: (it as { fontName?: string }).fontName ?? "",
        fontSize,
      });
    }
    pages.push({ width: viewport.width, height: viewport.height, items });
  }
  return { pages };
}

describe("real round-trip — render → Typst PDF → pdf.js geometry → extract", () => {
  it("recovers the candidate name + single-column layout from a real compiled PDF", async () => {
    const compiler = createNodeTypstCompiler();
    const { src } = renderTypeset(getDefaultTemplate("classic")!, SAMPLE_SWE);
    const pdf = await compiler.compile(src);
    const geometry = await pdfToGeometry(pdf);

    expect(isLikelyScanned(geometry)).toBe(false);
    const res = await extractResume(geometry);
    expect(res.route).toBe("fingerprint");
    expect(res.rdm?.basics.name).toContain("Avery Chen");
    expect(res.fingerprint?.columns.value).toBe("single");
  }, 30_000);
});
