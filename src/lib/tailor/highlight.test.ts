import { describe, it, expect } from "vitest";
import {
  highlightKeywords,
  suggestKeywordPlacements,
} from "./highlight";

describe("highlightKeywords", () => {
  it("should return plain text when no keywords provided", () => {
    const result = highlightKeywords("Hello world", [], []);
    expect(result).toEqual([{ text: "Hello world", type: "plain" }]);
  });

  it("should return plain text when text is empty", () => {
    const result = highlightKeywords("", ["react"], []);
    expect(result).toEqual([{ text: "", type: "plain" }]);
  });

  it("should highlight matched keywords", () => {
    const result = highlightKeywords("I know React and TypeScript", ["react"], []);
    expect(result).toEqual([
      { text: "I know ", type: "plain" },
      { text: "React", type: "matched" },
      { text: " and TypeScript", type: "plain" },
    ]);
  });

  it("should highlight missing keywords", () => {
    const result = highlightKeywords("Experience with Python programming", [], ["python"]);
    expect(result).toEqual([
      { text: "Experience with ", type: "plain" },
      { text: "Python", type: "missing" },
      { text: " programming", type: "plain" },
    ]);
  });

  it("should highlight both matched and missing keywords", () => {
    const result = highlightKeywords(
      "I use React and Python daily",
      ["react"],
      ["python"]
    );
    expect(result).toHaveLength(5);
    expect(result[1]).toEqual({ text: "React", type: "matched" });
    expect(result[3]).toEqual({ text: "Python", type: "missing" });
  });

  it("should match case-insensitively", () => {
    const result = highlightKeywords("REACT is great", ["react"], []);
    expect(result[0]).toEqual({ text: "REACT", type: "matched" });
  });

  it("should handle multiple occurrences", () => {
    const result = highlightKeywords(
      "React components in React apps",
      ["react"],
      []
    );
    const matchedSegments = result.filter((s) => s.type === "matched");
    expect(matchedSegments).toHaveLength(2);
    expect(matchedSegments[0].text).toBe("React");
    expect(matchedSegments[1].text).toBe("React");
  });

  it("should prefer matched over missing for same keyword", () => {
    const result = highlightKeywords(
      "I know React well",
      ["react"],
      ["react"]
    );
    const reactSegment = result.find((s) => s.text === "React");
    expect(reactSegment?.type).toBe("matched");
  });

  it("should match longer phrases first", () => {
    const result = highlightKeywords(
      "machine learning algorithms",
      ["machine learning"],
      []
    );
    const matched = result.filter((s) => s.type === "matched");
    expect(matched).toHaveLength(1);
    expect(matched[0].text).toBe("machine learning");
  });
});

describe("suggestKeywordPlacements", () => {
  const sections = [
    { name: "Summary", content: "Experienced developer" },
    { name: "Skills", content: "React, TypeScript" },
    { name: "Experience", content: "Built web applications using modern frameworks" },
  ];

  it("should return suggestions for each missing keyword", () => {
    const result = suggestKeywordPlacements(["python", "docker"], sections);
    expect(result.size).toBe(2);
    expect(result.has("python")).toBe(true);
    expect(result.has("docker")).toBe(true);
  });

  it("should suggest the section that contains related terms", () => {
    const result = suggestKeywordPlacements(["react hooks"], sections);
    // "react" appears in Skills section
    expect(result.get("react hooks")).toBe("Skills");
  });

  it("should default to Skills for unknown keywords", () => {
    const result = suggestKeywordPlacements(["kubernetes"], sections);
    expect(result.get("kubernetes")).toBe("Skills");
  });

  it("should handle empty keywords", () => {
    const result = suggestKeywordPlacements([], sections);
    expect(result.size).toBe(0);
  });
});
