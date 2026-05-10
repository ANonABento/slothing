import { describe, expect, it } from "vitest";
import { SAMPLE_COMPARISON_REPORTS } from "./sample-data";
import { buildDashboardPayload } from "./aggregate";

describe("eval dashboard aggregation", () => {
  it("handles empty input", () => {
    const payload = buildDashboardPayload([], { now: new Date("2026-05-01") });
    expect(payload.runs).toEqual([]);
    expect(payload.cases).toEqual([]);
    expect(payload.evalSets).toEqual([]);
  });

  it("builds sorted runs, case rows, eval sets, and trends", () => {
    const payload = buildDashboardPayload(SAMPLE_COMPARISON_REPORTS, {
      now: new Date("2026-05-10"),
      source: "sample",
    });

    expect(payload.source).toBe("sample");
    expect(payload.runs[0].runAt).toBe(SAMPLE_COMPARISON_REPORTS[0].runAt);
    expect(payload.cases).toHaveLength(
      SAMPLE_COMPARISON_REPORTS.reduce(
        (sum, report) => sum + report.results.length,
        0,
      ),
    );
    expect(payload.evalSets).toHaveLength(1);
    expect(payload.trends.runs.length).toBeGreaterThanOrEqual(3);
  });

  it("excludes errored model outputs from averages", () => {
    const payload = buildDashboardPayload([SAMPLE_COMPARISON_REPORTS[2]]);
    expect(payload.runs[0].avgScoreGpt55).toBe(4);
  });
});
