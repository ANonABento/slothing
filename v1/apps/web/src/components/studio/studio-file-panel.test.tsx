import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StudioFilePanel } from "./studio-file-panel";
import type { StudioDocument } from "./studio-documents";

const documents: StudioDocument[] = [
  { id: "resume", name: "Resume", mode: "resume" },
  { id: "cover-letter", name: "Cover Letter", mode: "cover_letter" },
];

describe("StudioFilePanel", () => {
  it("uses theme variable classes for file row chrome", () => {
    render(
      <StudioFilePanel
        documents={documents}
        activeDocumentId="resume"
        onCreate={vi.fn()}
        onSelect={vi.fn()}
        onRename={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    const fileRow = screen.getByRole("button", {
      name: "Resume",
    }).parentElement;
    expect(fileRow?.className).toContain("rounded-md");
  });

  it("renders an icon strip when collapsed", () => {
    render(
      <StudioFilePanel
        documents={documents}
        activeDocumentId="resume"
        onCreate={vi.fn()}
        onSelect={vi.fn()}
        onRename={vi.fn()}
        onDelete={vi.fn()}
        collapsed
        onToggleCollapsed={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Expand files panel" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Show files" }));
    expect(screen.queryByRole("heading", { name: "Files" })).toBeNull();
  });

  it("toggles back to expanded from the collapsed strip", () => {
    const onToggleCollapsed = vi.fn();
    render(
      <StudioFilePanel
        documents={documents}
        activeDocumentId="resume"
        onCreate={vi.fn()}
        onSelect={vi.fn()}
        onRename={vi.fn()}
        onDelete={vi.fn()}
        collapsed
        onToggleCollapsed={onToggleCollapsed}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Expand files panel" }));

    expect(onToggleCollapsed).toHaveBeenCalledTimes(1);
  });
});
