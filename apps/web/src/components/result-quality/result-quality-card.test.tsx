import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ResultQualityCard } from "./result-quality-card";
import type {
  ResultQualityRubric,
  ResultQualityStatus,
} from "@/lib/result-quality/rubric";

function rubric(
  status: ResultQualityStatus,
  nextActions = ["Tune the summary.", "Add quantified proof."],
): ResultQualityRubric {
  const labels: Record<ResultQualityStatus, string> = {
    ready_to_apply: "Ready to apply",
    light_tailoring: "Needs light tailoring",
    needs_evidence: "Needs evidence",
    not_a_fit: "Not a fit",
  };

  return {
    status,
    label: labels[status],
    rationale: `Rationale for ${labels[status]}.`,
    nextActions,
    reasons: [],
  };
}

describe("ResultQualityCard", () => {
  it("renders the label, rationale, and supplied actions", () => {
    render(
      <ResultQualityCard
        rubric={rubric("needs_evidence", [
          "Add project proof.",
          "Quantify one result.",
          "Remove unsupported keywords.",
        ])}
      />,
    );

    expect(screen.getByText("Needs evidence")).toBeInTheDocument();
    expect(screen.getByText(/Rationale for Needs evidence/i)).toBeInTheDocument();
    expect(screen.getByText("Add project proof.")).toBeInTheDocument();
    expect(screen.getByText("Quantify one result.")).toBeInTheDocument();
    expect(screen.getByText("Remove unsupported keywords.")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("gives each status distinguishable accessible text", () => {
    const statuses: ResultQualityStatus[] = [
      "ready_to_apply",
      "light_tailoring",
      "needs_evidence",
      "not_a_fit",
    ];

    for (const status of statuses) {
      const { unmount } = render(<ResultQualityCard rubric={rubric(status)} />);
      const card = screen.getByRole("region", {
        name: `Result quality: ${rubric(status).label}`,
      });

      expect(within(card).getByText(rubric(status).label)).toBeInTheDocument();
      unmount();
    }
  });

  it("renders only the actions supplied by the rubric", () => {
    render(
      <ResultQualityCard
        rubric={rubric("light_tailoring", ["One action.", "Two action."])}
      />,
    );

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.queryByText("Three action.")).not.toBeInTheDocument();
  });
});
