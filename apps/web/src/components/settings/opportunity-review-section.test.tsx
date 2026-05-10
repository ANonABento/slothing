import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { OpportunityReviewSection } from "./opportunity-review-section";

describe("OpportunityReviewSection", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("loads the persisted setting and toggles it", async () => {
    const fetchMock = vi
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ opportunityReview: { enabled: false } }),
          { status: 200 }
        )
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true }), { status: 200 })
      );

    render(<OpportunityReviewSection />);

    const toggle = await screen.findByRole("button", { name: /disabled/i });
    expect(toggle).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(toggle);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenLastCalledWith("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opportunityReview: { enabled: true } }),
      });
    });
    expect(await screen.findByText("Review queue enabled.")).toBeInTheDocument();
  });
});
