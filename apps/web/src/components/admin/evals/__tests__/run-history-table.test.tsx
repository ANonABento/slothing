import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { buildDashboardPayload } from "@/lib/admin/evals/aggregate";
import { SAMPLE_COMPARISON_REPORTS } from "@/lib/admin/evals/sample-data";
import { RunHistoryTable } from "../run-history-table";

describe("RunHistoryTable", () => {
  it("renders runs, expands case rows, and opens sample output", () => {
    const payload = buildDashboardPayload([SAMPLE_COMPARISON_REPORTS[0]], {
      source: "sample",
    });

    render(
      <RunHistoryTable
        runs={payload.runs}
        cases={payload.cases}
        model="all"
      />,
    );

    expect(screen.getByText("Run History")).toBeInTheDocument();
    expect(screen.getAllByText(/View samples/i)).toHaveLength(4);

    fireEvent.click(screen.getAllByText(/View samples/i)[0]);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("GPT-5.5 output")).toBeInTheDocument();
    expect(screen.getByText("Claude output")).toBeInTheDocument();
  });
});
