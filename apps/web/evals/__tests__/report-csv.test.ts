import { describe, expect, it } from "vitest";
import { generateCSVReport } from "../report-csv.js";
import type { EvalRunReport } from "../types.js";

const REPORT: EvalRunReport = {
  runAt: "2026-01-01T00:00:00.000Z",
  mode: "resume",
  generator: "tailor",
  judgeEnabled: false,
  judge: "disabled",
  cases: [
    {
      caseId: "tc-1",
      caseLabel: "Comma, quote \"and newline\ncase",
      mode: "resume",
      generator: "tailor",
      output: {
        kind: "resume",
        generator: "tailor",
        rawText: "React resume",
        latencyMs: 20,
      },
      metrics: [
        { name: "keyword_overlap", score: 0.5, details: { matched: ["React"] } },
        { name: "error", score: 0, details: { message: null } },
      ],
      overallScore: 0.5,
    },
  ],
  summary: {
    totalCases: 1,
    errorCount: 0,
    avgOverallScore: 0.5,
    avgScoreByMetric: { keyword_overlap: 0.5, error: 0 },
  },
};

describe("generateCSVReport", () => {
  it("emits the required header and one row per metric plus summary", () => {
    const csv = generateCSVReport({
      ...REPORT,
      cases: [{ ...REPORT.cases[0], caseLabel: "Plain case" }],
    });
    expect(csv.split("\n")[0]).toBe(
      "case_id,case_label,mode,generator,metric,score,details,error,latency_ms",
    );
    expect(csv.split("\n")).toHaveLength(4);
  });

  it("escapes commas, quotes, and newlines", () => {
    const csv = generateCSVReport(REPORT);
    expect(csv).toContain('"Comma, quote ""and newline\ncase"');
  });
});
