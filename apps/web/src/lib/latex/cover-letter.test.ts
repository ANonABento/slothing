import { describe, expect, it } from "vitest";

import {
  coverLetterTitle,
  coverLetterToTex,
  splitParagraphs,
} from "./cover-letter";
import { buildDocumentModel } from "./document-model";
import { scanSpans } from "./scanner";

const PROSE = `Dear Hiring Manager,

I am writing to apply for the Robotics Engineer role. At Bracket Bot I cut
calibration time by 40% by rewriting the solver.

I would welcome the chance to talk.

Kind regards,
Kevin Jiang`;

describe("splitParagraphs", () => {
  it("splits on blank lines", () => {
    expect(splitParagraphs(PROSE)).toHaveLength(4);
  });

  it("collapses soft wraps inside a paragraph — LaTeX does its own line breaking", () => {
    const [, second] = splitParagraphs(PROSE);
    expect(second).not.toContain("\n");
    expect(second).toContain("cut calibration time by 40%");
  });

  it("drops empty chunks from trailing or repeated blank lines", () => {
    expect(splitParagraphs("One.\n\n\n\nTwo.\n\n")).toEqual(["One.", "Two."]);
  });

  it("handles a single paragraph", () => {
    expect(splitParagraphs("Just one.")).toEqual(["Just one."]);
  });

  it("handles empty input", () => {
    expect(splitParagraphs("")).toEqual([]);
  });
});

describe("coverLetterToTex", () => {
  it("produces one addressable paragraph span per paragraph", () => {
    const { source, paragraphCount } = coverLetterToTex({
      name: "Kevin Jiang",
      contact: "kevin@example.com",
      prose: PROSE,
    });

    expect(paragraphCount).toBe(4);
    const paras = scanSpans(source).filter((span) => span.kind === "para");
    expect(paras).toHaveLength(4);
    expect(paras.every((span) => span.id !== null)).toBe(true);
  });

  it("escapes prose rather than letting it become markup", () => {
    const { source } = coverLetterToTex({
      name: "Kevin",
      contact: "k@example.com",
      prose: "I cut costs 40% & saved $2M.",
    });
    expect(source).toContain(String.raw`40\% \& saved \$2M`);
  });

  it("builds a document the editor can drive", () => {
    const { source } = coverLetterToTex({
      name: "Kevin Jiang",
      contact: "kevin@example.com",
      prose: PROSE,
    });
    const model = buildDocumentModel(source);

    // A cover letter drives the same inspector as a resume — same contract, same panel.
    expect(model.outline.length).toBeGreaterThan(0);
    expect(model.editableSettings).toBe(true);
    const firstPara = model.outline.find((node) => node.kind === "para");
    expect(firstPara?.label).toContain("Dear Hiring Manager");
  });

  it("carries the writer's name and contact into the header", () => {
    const { source } = coverLetterToTex({
      name: "Kevin Jiang",
      contact: "kevin@example.com · Waterloo",
      prose: "One paragraph.",
    });
    expect(source).toContain("{Kevin Jiang}");
    expect(source).toContain("Waterloo");
  });
});

describe("coverLetterTitle", () => {
  it("names the company when there is one", () => {
    expect(coverLetterTitle("Bracket Bot")).toBe("Cover letter — Bracket Bot");
  });

  it("falls back cleanly", () => {
    expect(coverLetterTitle(null)).toBe("Cover letter");
    expect(coverLetterTitle("   ")).toBe("Cover letter");
  });
});
