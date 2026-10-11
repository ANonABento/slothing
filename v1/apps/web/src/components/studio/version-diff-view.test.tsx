import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type {
  BuilderDraftState,
  BuilderVersion,
} from "@/lib/builder/version-history";
import { VersionDiffView } from "./version-diff-view";

const comparedState: BuilderDraftState = {
  documentMode: "resume",
  selectedIds: [],
  sections: [],
  templateId: "classic",
  html: "",
  content: {
    type: "doc",
    content: [
      {
        type: "resumeSection",
        attrs: { title: "Experience" },
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: "Built legacy APIs" }],
          },
        ],
      },
    ],
  },
};

const currentState: BuilderDraftState = {
  ...comparedState,
  content: {
    type: "doc",
    content: [
      {
        type: "resumeSection",
        attrs: { title: "Experience" },
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: "Designed secure APIs" }],
          },
        ],
      },
    ],
  },
};

const version: BuilderVersion = {
  id: "version-1",
  kind: "manual",
  name: "Initial draft",
  savedAt: "2026-04-29T12:00:00.000Z",
  state: comparedState,
};

describe("VersionDiffView", () => {
  it("renders metadata, section counts, and word-level indicators", () => {
    render(
      <VersionDiffView
        currentDraftState={currentState}
        onOpenChange={vi.fn()}
        open
        version={version}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Compare to current" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Initial draft saved/)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Experience" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("2 reworded")[0]).toBeInTheDocument();
    expect(screen.getByText("Built legacy")).toHaveAttribute(
      "data-diff-type",
      "reworded",
    );
    expect(screen.getByText("Designed secure")).toHaveAttribute(
      "data-diff-type",
      "reworded",
    );
  });

  it("switches to compared version only mode", () => {
    render(
      <VersionDiffView
        currentDraftState={currentState}
        onOpenChange={vi.fn()}
        open
        version={version}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Compared version only" }),
    );

    expect(screen.getByText("Built legacy APIs")).toBeInTheDocument();
    expect(screen.queryByText("Current draft")).not.toBeInTheDocument();
  });

  it("calls the close handler through dialog open change", () => {
    const onOpenChange = vi.fn();

    render(
      <VersionDiffView
        currentDraftState={currentState}
        onOpenChange={onOpenChange}
        open
        version={version}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
