import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SAMPLE_COMPARISON_REPORTS } from "./sample-data";
import { comparisonReportSchema, loadComparisonReports } from "./loader";

describe("eval report loader", () => {
  let dir: string;

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "eval-reports-"));
  });

  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it("returns an empty array when the directory is missing", () => {
    expect(loadComparisonReports(path.join(dir, "missing"))).toEqual([]);
  });

  it("loads only valid comparison json files sorted newest first", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    fs.writeFileSync(
      path.join(dir, "comparison-old.json"),
      JSON.stringify(SAMPLE_COMPARISON_REPORTS[1]),
    );
    fs.writeFileSync(
      path.join(dir, "comparison-new.json"),
      JSON.stringify(SAMPLE_COMPARISON_REPORTS[0]),
    );
    fs.writeFileSync(path.join(dir, "comparison-bad.json"), "{ nope");
    fs.writeFileSync(path.join(dir, "comparison-note.md"), "ignored");

    const reports = loadComparisonReports(dir);

    expect(reports).toHaveLength(2);
    expect(reports[0].runAt).toBe(SAMPLE_COMPARISON_REPORTS[0].runAt);
    expect(warn).toHaveBeenCalledOnce();
    warn.mockRestore();
  });

  it("validates bundled sample reports with the production schema", () => {
    expect(() =>
      SAMPLE_COMPARISON_REPORTS.forEach((report) =>
        comparisonReportSchema.parse(report),
      ),
    ).not.toThrow();
  });
});
