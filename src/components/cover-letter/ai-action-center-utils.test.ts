import { describe, expect, it } from "vitest";
import {
  applyTextReplacement,
  createAiActionInstruction,
  getParagraphRanges,
  normalizeTextRange,
} from "./ai-action-center-utils";

describe("AI action center utilities", () => {
  it("builds action instructions with selected text and job context", () => {
    const instruction = createAiActionInstruction({
      action: "keywords",
      selectedText: "Built internal tools.",
      jobDescription: "Requires React and API reliability.",
    });

    expect(instruction).toContain("job description keywords");
    expect(instruction).toContain("Built internal tools.");
    expect(instruction).toContain("Requires React and API reliability.");
  });

  it("normalizes text ranges within content bounds", () => {
    expect(normalizeTextRange({ start: 10, end: -2 }, 8)).toEqual({
      start: 0,
      end: 8,
    });
  });

  it("replaces the requested text range", () => {
    expect(
      applyTextReplacement("I built APIs quickly.", "I built reliable APIs.", {
        start: 0,
        end: 22,
      })
    ).toBe("I built reliable APIs.");
  });

  it("returns paragraph ranges for section rewriting", () => {
    expect(getParagraphRanges("Intro paragraph.\n\nSecond paragraph.")).toEqual([
      { label: "Section 1", text: "Intro paragraph.", start: 0, end: 16 },
      { label: "Section 2", text: "Second paragraph.", start: 18, end: 35 },
    ]);
  });
});
