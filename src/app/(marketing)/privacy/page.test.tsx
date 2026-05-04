import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PrivacyPage from "./page";

describe("PrivacyPage", () => {
  it("should render privacy policy content without the legacy back link", () => {
    render(<PrivacyPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Privacy Policy" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Effective March 25, 2026.")).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Back to home/ }),
    ).not.toBeInTheDocument();
  });
});
