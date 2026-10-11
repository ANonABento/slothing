import type { EvalRunReport } from "./types.js";

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "number") return String(value);
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function generateCSVReport(report: EvalRunReport): string {
  const rows: unknown[][] = [
    [
      "case_id",
      "case_label",
      "mode",
      "generator",
      "metric",
      "score",
      "details",
      "error",
      "latency_ms",
    ],
  ];

  for (const result of report.cases) {
    for (const metric of result.metrics) {
      rows.push([
        result.caseId,
        result.caseLabel,
        result.mode,
        result.generator,
        metric.name,
        metric.score,
        metric.details ?? {},
        metric.error ?? result.error ?? "",
        result.output.latencyMs,
      ]);
    }
  }

  rows.push([
    "summary",
    "Summary",
    report.mode,
    report.generator,
    "overall",
    report.summary.avgOverallScore,
    report.summary,
    "",
    "",
  ]);

  return rows.map((row) => row.map(csvEscape).join(",")).join("\n");
}
