import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GmailAutoStatusSection } from "./gmail-auto-status-section";

describe("GmailAutoStatusSection", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("defaults to disabled and toggles the setting", async () => {
    const fetchMock = vi
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ gmailAutoStatus: { enabled: false } }), {
          status: 200,
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true }), { status: 200 }),
      );

    render(<GmailAutoStatusSection />);

    const toggle = await screen.findByRole("button", { name: /disabled/i });
    expect(toggle).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(toggle);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenLastCalledWith("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gmailAutoStatus: { enabled: true } }),
      });
    });
    expect(
      await screen.findByText("Gmail auto-status enabled."),
    ).toBeInTheDocument();
  });

  it("rolls back on save failure", async () => {
    vi.spyOn(global, "fetch")
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ gmailAutoStatus: { enabled: true } }), {
          status: 200,
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ error: "nope" }), { status: 500 }),
      );

    render(<GmailAutoStatusSection />);

    fireEvent.click(await screen.findByRole("button", { name: /enabled/i }));

    expect(
      await screen.findByText("Could not save Gmail auto-status setting."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /enabled/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
