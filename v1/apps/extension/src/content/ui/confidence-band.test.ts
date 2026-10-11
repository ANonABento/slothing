import { describe, it, expect } from "vitest";

import {
  classifyConfidence,
  SILENT_THRESHOLD,
  YELLOW_THRESHOLD,
} from "./confidence-band";

describe("classifyConfidence", () => {
  describe("silent zone (>= 0.85)", () => {
    it("classifies 1.0 as silent", () => {
      expect(classifyConfidence(1)).toBe("silent");
    });

    it("classifies exactly 0.85 as silent (inclusive lower bound)", () => {
      expect(classifyConfidence(0.85)).toBe("silent");
      expect(classifyConfidence(SILENT_THRESHOLD)).toBe("silent");
    });

    it("classifies 0.9 (the roadmap acceptance score) as silent", () => {
      expect(classifyConfidence(0.9)).toBe("silent");
    });
  });

  describe("yellow zone (0.6 <= score < 0.85)", () => {
    it("classifies 0.7 (the roadmap acceptance score) as yellow", () => {
      expect(classifyConfidence(0.7)).toBe("yellow");
    });

    it("classifies exactly 0.6 as yellow (inclusive lower bound)", () => {
      expect(classifyConfidence(0.6)).toBe("yellow");
      expect(classifyConfidence(YELLOW_THRESHOLD)).toBe("yellow");
    });

    it("classifies 0.8499 as yellow (just below silent)", () => {
      expect(classifyConfidence(0.8499)).toBe("yellow");
    });
  });

  describe("cold zone (< 0.6)", () => {
    it("classifies 0.4 (the roadmap acceptance score) as cold", () => {
      expect(classifyConfidence(0.4)).toBe("cold");
    });

    it("classifies 0.59 as cold (just below the yellow floor)", () => {
      expect(classifyConfidence(0.59)).toBe("cold");
    });

    it("classifies 0 and negative scores as cold", () => {
      expect(classifyConfidence(0)).toBe("cold");
      expect(classifyConfidence(-0.1)).toBe("cold");
    });
  });

  describe("non-finite inputs default to cold", () => {
    it("treats NaN as cold", () => {
      expect(classifyConfidence(Number.NaN)).toBe("cold");
    });

    it("treats Infinity-without-Number.isFinite as cold", () => {
      // Sanity-check that the implementation guards against +Infinity by
      // falling through to "cold" — a non-finite score is a code-path bug,
      // not a permission to silently fill.
      expect(classifyConfidence(Number.POSITIVE_INFINITY)).toBe("cold");
      expect(classifyConfidence(Number.NEGATIVE_INFINITY)).toBe("cold");
    });
  });

  it("thresholds match the roadmap-stated zone floors", () => {
    expect(SILENT_THRESHOLD).toBe(0.85);
    expect(YELLOW_THRESHOLD).toBe(0.6);
  });
});
