import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { KanbanLanesSection } from "./kanban-lanes-section";

describe("KanbanLanesSection", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("loads persisted lanes and toggles visibility", async () => {
    const fetchMock = vi
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ kanbanVisibleLanes: ["saved"] }), {
          status: 200,
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true }), { status: 200 }),
      );

    render(<KanbanLanesSection />);

    const pending = await screen.findByRole("button", { name: "Pending" });
    expect(pending).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(pending);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenLastCalledWith("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kanbanVisibleLanes: ["pending", "saved"] }),
      });
    });
    expect(await screen.findByText("Kanban lanes updated.")).toBeInTheDocument();
  });

  it("rolls back optimistic changes on save failure", async () => {
    vi.spyOn(global, "fetch")
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ kanbanVisibleLanes: ["saved"] }), {
          status: 200,
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ error: "Nope" }), { status: 500 }),
      );

    render(<KanbanLanesSection />);

    const pending = await screen.findByRole("button", { name: "Pending" });
    fireEvent.click(pending);

    expect(
      await screen.findByText("Could not save kanban lane setting."),
    ).toBeInTheDocument();
    expect(pending).toHaveAttribute("aria-pressed", "false");
  });
});
