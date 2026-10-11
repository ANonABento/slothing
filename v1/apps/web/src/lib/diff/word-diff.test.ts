import { describe, expect, it } from "vitest";
import { countWordsInDiff, diffWords, summarizeWordDiff } from "./word-diff";

describe("diffWords", () => {
  it("returns one unchanged segment for identical text", () => {
    expect(diffWords("Built React apps.", "Built React apps.")).toEqual([
      { type: "unchanged", text: "Built React apps.", side: "both" },
    ]);
  });

  it("marks added words on the after side", () => {
    expect(diffWords("Built apps.", "Built scalable apps.")).toEqual([
      { type: "unchanged", text: "Built ", side: "both" },
      { type: "added", text: "scalable ", side: "after" },
      { type: "unchanged", text: "apps.", side: "both" },
    ]);
  });

  it("marks removed words on the before side", () => {
    expect(diffWords("Built scalable apps.", "Built apps.")).toEqual([
      { type: "unchanged", text: "Built ", side: "both" },
      { type: "removed", text: "scalable ", side: "before" },
      { type: "unchanged", text: "apps.", side: "both" },
    ]);
  });

  it("marks changed phrases as reworded for both sides", () => {
    expect(diffWords("Built small apps.", "Built scalable platforms.")).toEqual([
      { type: "unchanged", text: "Built ", side: "both" },
      {
        type: "reworded",
        text: "scalable platforms",
        side: "both",
        beforeText: "small apps",
        afterText: "scalable platforms",
      },
      { type: "unchanged", text: ".", side: "both" },
    ]);
  });

  it("handles repeated words deterministically", () => {
    expect(diffWords("React React", "React TypeScript React")).toEqual([
      { type: "unchanged", text: "React ", side: "both" },
      { type: "added", text: "TypeScript ", side: "after" },
      { type: "unchanged", text: "React", side: "both" },
    ]);
  });

  it("handles empty text", () => {
    expect(diffWords("", "GraphQL")).toEqual([
      { type: "added", text: "GraphQL", side: "after" },
    ]);
    expect(diffWords("GraphQL", "")).toEqual([
      { type: "removed", text: "GraphQL", side: "before" },
    ]);
  });

  it("counts only changed words for tailor diffs", () => {
    const counts = countWordsInDiff(
      diffWords("Built small apps.", "Built scalable apps with GraphQL."),
    );

    expect(counts).toEqual({
      added: 2,
      removed: 0,
      reworded: 1,
      unchanged: 0,
      total: 3,
    });
  });

  it("summarizes additions, removals, reworded, and unchanged words", () => {
    const segments = diffWords("Built legacy APIs", "Designed secure APIs");

    expect(summarizeWordDiff(segments)).toEqual({
      added: 0,
      removed: 0,
      reworded: 2,
      unchanged: 1,
      total: 2,
    });
  });
});
