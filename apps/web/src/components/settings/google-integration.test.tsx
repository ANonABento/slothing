import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GOOGLE_FEATURES } from "@/lib/google/types";
import { GoogleIntegration } from "./google-integration";

vi.mock("@/components/google", () => ({
  GoogleConnectButton: () => <button type="button">Connect Google</button>,
}));

describe("GoogleIntegration", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ calendarSync: { pullEnabled: false } }),
      }),
    );
  });

  it("renders every Google feature from the shared descriptor", async () => {
    render(<GoogleIntegration />);

    for (const feature of GOOGLE_FEATURES) {
      expect(await screen.findByText(feature.label)).toBeInTheDocument();
    }
  });

  it("loads and saves the auto-link toggle", async () => {
    render(<GoogleIntegration />);

    const toggle = await screen.findByRole("button", { name: "Off" });
    await waitFor(() => expect(toggle).not.toBeDisabled());
    fireEvent.click(toggle);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/api/settings",
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify({ calendarSync: { pullEnabled: true } }),
        }),
      );
    });
  });
});
