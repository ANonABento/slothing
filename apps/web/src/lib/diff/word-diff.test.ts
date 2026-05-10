import { describe, expect, it } from "vitest";
import { diffWords, summarizeWordDiff } from "./word-diff";

describe("diffWords", () => {
  it("returns a known added-word diff", () => {
    expect(diffWords("Built APIs", "Built secure APIs")).toEqual([
      { text: "Built", type: "unchanged", side: "both" },
      { text: "secure", type: "added", side: "after" },
      { text: "APIs", type: "unchanged", side: "both" },
    ]);
  });

  it("returns a known removed-word diff", () => {
    expect(diffWords("Built legacy APIs", "Built APIs")).toEqual([
      { text: "Built", type: "unchanged", side: "both" },
      { text: "legacy", type: "removed", side: "before" },
      { text: "APIs", type: "unchanged", side: "both" },
    ]);
  });

  it("classifies replacement pairs as reworded", () => {
    expect(diffWords("Built APIs", "Designed APIs")).toEqual([
      { text: "Built", type: "reworded", side: "before" },
      { text: "Designed", type: "reworded", side: "after" },
      { text: "APIs", type: "unchanged", side: "both" },
    ]);
  });

  it("handles repeated words deterministically", () => {
    expect(diffWords("React React", "React TypeScript React")).toEqual([
      { text: "React", type: "unchanged", side: "both" },
      { text: "TypeScript", type: "added", side: "after" },
      { text: "React", type: "unchanged", side: "both" },
    ]);
  });

  it("keeps punctuation attached to the changed word", () => {
    expect(diffWords("Built APIs.", "Built APIs!")).toEqual([
      { text: "Built", type: "unchanged", side: "both" },
      { text: "APIs.", type: "reworded", side: "before" },
      { text: "APIs!", type: "reworded", side: "after" },
    ]);
  });

  it("summarizes additions, removals, and reworded words", () => {
    const segments = diffWords("Built legacy APIs", "Designed secure APIs");

    expect(summarizeWordDiff(segments)).toEqual({
      added: 0,
      removed: 0,
      reworded: 2,
      unchanged: 1,
      total: 2,
    });
  });

  it("handles empty before and after text", () => {
    expect(diffWords("", "Fresh draft")).toEqual([
      { text: "Fresh draft", type: "added", side: "after" },
    ]);
    expect(diffWords("Old draft", "")).toEqual([
      { text: "Old draft", type: "removed", side: "before" },
    ]);
  });
});
