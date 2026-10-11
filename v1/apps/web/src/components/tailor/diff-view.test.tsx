import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TailorDiffView } from "./diff-view";
import type { TailorDiff } from "@/lib/tailor/diff";

const diff: TailorDiff = {
  counts: { added: 1, removed: 1, reworded: 1, total: 3 },
  sections: [
    {
      id: "summary",
      title: "Summary",
      kind: "summary",
      counts: { added: 1, removed: 1, reworded: 1, total: 3 },
      segments: [
        { type: "unchanged", text: "Built " },
        { type: "added", text: "GraphQL " },
        { type: "removed", text: "legacy " },
        {
          type: "reworded",
          text: "platforms",
          beforeText: "apps",
          afterText: "platforms",
        },
      ],
    },
  ],
};

describe("TailorDiffView", () => {
  it("renders counts, sections, and semantic diff classes", () => {
    render(<TailorDiffView diff={diff} />);

    expect(screen.getByText("Added: 1")).toBeInTheDocument();
    expect(screen.getByText("Removed: 1")).toBeInTheDocument();
    expect(screen.getByText("Reworded: 1")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Summary" }),
    ).toBeInTheDocument();
    expect(screen.getByText("GraphQL")).toHaveClass("text-success");
    expect(screen.getByText("legacy")).toHaveClass("line-through");
    expect(screen.getByText("platforms")).toHaveClass("text-warning");
  });

  it("renders a no-change state", () => {
    render(
      <TailorDiffView
        diff={{
          counts: { added: 0, removed: 0, reworded: 0, total: 0 },
          sections: [
            {
              id: "summary",
              title: "Summary",
              kind: "summary",
              counts: { added: 0, removed: 0, reworded: 0, total: 0 },
              segments: [],
            },
          ],
        }}
      />,
    );

    expect(screen.getAllByText("No changes")).not.toHaveLength(0);
    expect(screen.getByText("No changes in this section.")).toBeInTheDocument();
  });
});
