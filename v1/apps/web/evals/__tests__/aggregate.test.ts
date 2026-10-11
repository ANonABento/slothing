import { describe, expect, it } from "vitest";
import { aggregateMetrics } from "../metrics/aggregate.js";

describe("aggregateMetrics", () => {
  it("computes weighted averages", () => {
    expect(
      aggregateMetrics(
        [
          { name: "keyword_overlap", score: 1 },
          { name: "length", score: 0.5 },
        ],
        { keyword_overlap: 0.75, length: 0.25 },
      ),
    ).toBe(0.875);
  });

  it("short-circuits on generator errors", () => {
    expect(
      aggregateMetrics([
        { name: "keyword_overlap", score: 1 },
        { name: "error", score: 1 },
      ]),
    ).toBe(0);
  });

  it("returns zero for empty metrics", () => {
    expect(aggregateMetrics([])).toBe(0);
  });
});
