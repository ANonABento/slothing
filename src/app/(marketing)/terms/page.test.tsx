import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TermsPage from "./page";

describe("TermsPage", () => {
  it("should render terms content without the legacy back link", () => {
    render(<TermsPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Terms of Service" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Effective March 25, 2026.")).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Back to home/ }),
    ).not.toBeInTheDocument();
  });
});
