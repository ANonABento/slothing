import { describe, expect, it } from "vitest";

import { compile, isEngineAvailable } from "./compile";
import { generateCoverLetterTex, generateResumeTex } from "./generate";
import { extractHitMap } from "./hitmap";
import { scanSpans } from "./scanner";
import { readSettings } from "./settings";

const RESUME = {
  name: "Kevin Jiang",
  contact: "kevin@example.com · Waterloo, ON",
  sections: [
    {
      title: "Experience",
      entries: [
        {
          organisation: "Bracket Bot",
          role: "Robotics Engineer",
          dates: "2025–2026",
          bullets: [
            "Cut calibration time 40% by rewriting the solver.",
            "Shipped real-time telemetry to production.",
          ],
        },
      ],
    },
    { title: "Skills", text: "TypeScript, Rust, Python" },
  ],
};

describe("generateResumeTex", () => {
  it("produces a document where every span is addressable", () => {
    const spans = scanSpans(generateResumeTex(RESUME));
    expect(spans.every((span) => span.id !== null)).toBe(true);
    expect(spans.map((s) => s.kind)).toEqual([
      "header",
      "section",
      "entry",
      "item",
      "item",
      "section",
      "skills",
    ]);
  });

  it("mints a distinct id for every span", () => {
    const ids = scanSpans(generateResumeTex(RESUME)).map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("nests bullets under their entry", () => {
    const spans = scanSpans(generateResumeTex(RESUME));
    const entry = spans.find((s) => s.kind === "entry");
    expect(entry?.childIds).toHaveLength(2);
  });

  it("escapes content rather than letting it become markup", () => {
    const tex = generateResumeTex({
      ...RESUME,
      sections: [
        {
          title: "Experience",
          entries: [
            {
              organisation: "A & B",
              role: "100% Engineer",
              dates: "2025",
              bullets: ["Saved $5M_total"],
            },
          ],
        },
      ],
    });
    expect(tex).toContain(String.raw`{A \& B}`);
    expect(tex).toContain(String.raw`{100\% Engineer}`);
    expect(tex).toContain(String.raw`Saved \$5M\_total`);
  });

  it("writes settings the reader can read back", () => {
    const tex = generateResumeTex({ ...RESUME, settings: { font: "Times" } });
    expect(readSettings(tex).font).toBe("Times");
  });

  it("handles an entry with no bullets without emitting a malformed body", () => {
    const tex = generateResumeTex({
      ...RESUME,
      sections: [
        {
          title: "Experience",
          entries: [
            { organisation: "Org", role: "Role", dates: "2025", bullets: [] },
          ],
        },
      ],
    });
    const entry = scanSpans(tex).find((s) => s.kind === "entry");
    expect(entry).toBeDefined();
    expect(entry?.args).toHaveLength(4);
  });
});

describe("generateCoverLetterTex", () => {
  it("emits one addressable paragraph per input paragraph", () => {
    const tex = generateCoverLetterTex({
      name: "Kevin Jiang",
      contact: "kevin@example.com",
      paragraphs: ["First paragraph.", "Second paragraph.", "Third."],
    });
    const paras = scanSpans(tex).filter((s) => s.kind === "para");
    expect(paras).toHaveLength(3);
    expect(paras.every((p) => p.id !== null)).toBe(true);
  });
});

const describeWithEngine = isEngineAvailable() ? describe : describe.skip;

describeWithEngine("generated documents compile (requires Tectonic)", () => {
  it("compiles a generated resume and every span appears in the hit map", async () => {
    const tex = generateResumeTex(RESUME);
    const result = await compile({ source: tex, mode: "preview" });

    expect(result.log.ok).toBe(true);
    expect(Buffer.from(result.pdf.slice(0, 5)).toString()).toBe("%PDF-");

    // The acceptance criterion: every generated span is clickable in the render.
    const generated = scanSpans(tex)
      .map((s) => s.id)
      .filter((id): id is string => id !== null);
    expect(result.hitMap!.ids.sort()).toEqual(generated.sort());
  }, 90_000);

  it("compiles a generated cover letter through the identical path", async () => {
    const tex = generateCoverLetterTex({
      name: "Kevin Jiang",
      contact: "kevin@example.com",
      paragraphs: ["Dear hiring manager,", "I would like to apply.", "Thanks."],
    });
    const result = await compile({ source: tex, mode: "export" });
    expect(result.log.ok).toBe(true);
    expect(result.pdf.byteLength).toBeGreaterThan(1000);
  }, 90_000);

  it("round-trips: generate → compile → re-scan keeps ids stable", async () => {
    const tex = generateResumeTex(RESUME);
    const before = scanSpans(tex).map((s) => s.id);

    // Simulate a download/re-upload cycle — the source is the artifact of record.
    const roundTripped = Buffer.from(tex, "utf8").toString("utf8");
    const after = scanSpans(roundTripped).map((s) => s.id);
    expect(after).toEqual(before);

    const result = await compile({ source: roundTripped, mode: "preview" });
    const mapped = await extractHitMap(result.pdf);
    expect(mapped.ids.sort()).toEqual(
      before.filter((id): id is string => id !== null).sort(),
    );
  }, 90_000);
});
