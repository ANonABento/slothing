import { describe, expect, it } from "vitest";
import { countWordsInDiff, diffWords } from "./word-diff";

describe("diffWords", () => {
  it("returns one unchanged segment for identical text", () => {
    expect(diffWords("Built React apps.", "Built React apps.")).toEqual([
      { type: "unchanged", text: "Built React apps." },
    ]);
  });

  it("marks added words", () => {
    expect(diffWords("Built apps.", "Built scalable apps.")).toEqual([
      { type: "unchanged", text: "Built " },
      { type: "added", text: "scalable " },
      { type: "unchanged", text: "apps." },
    ]);
  });

  it("marks removed words", () => {
    expect(diffWords("Built scalable apps.", "Built apps.")).toEqual([
      { type: "unchanged", text: "Built " },
      { type: "removed", text: "scalable " },
      { type: "unchanged", text: "apps." },
    ]);
  });

  it("marks changed phrases as reworded", () => {
    expect(diffWords("Built small apps.", "Built scalable platforms.")).toEqual([
      { type: "unchanged", text: "Built " },
      {
        type: "reworded",
        text: "scalable platforms",
        beforeText: "small apps",
        afterText: "scalable platforms",
      },
      { type: "unchanged", text: "." },
    ]);
  });

  it("handles empty text", () => {
    expect(diffWords("", "GraphQL")).toEqual([
      { type: "added", text: "GraphQL" },
    ]);
    expect(diffWords("GraphQL", "")).toEqual([
      { type: "removed", text: "GraphQL" },
    ]);
  });

  it("counts only changed words", () => {
    const counts = countWordsInDiff(
      diffWords("Built small apps.", "Built scalable apps with GraphQL."),
    );

    expect(counts).toEqual({
      added: 2,
      removed: 0,
      reworded: 1,
      total: 3,
    });
  });
});
