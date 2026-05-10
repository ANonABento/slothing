import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { GOOGLE_FEATURES } from "@/lib/google/types";
import { GoogleIntegration } from "./google-integration";

vi.mock("@/components/google", () => ({
  GoogleConnectButton: () => <button type="button">Connect Google</button>,
}));

describe("GoogleIntegration", () => {
  it("renders every Google feature from the shared descriptor", async () => {
    render(<GoogleIntegration />);

    for (const feature of GOOGLE_FEATURES) {
      expect(await screen.findByText(feature.label)).toBeInTheDocument();
    }
  });
});
