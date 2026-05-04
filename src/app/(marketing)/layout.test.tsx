import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MarketingLayout from "./layout";

describe("MarketingLayout", () => {
  it("should render shared marketing chrome around legal content", () => {
    render(
      <MarketingLayout>
        <h1>Privacy Policy</h1>
      </MarketingLayout>,
    );

    expect(screen.getAllByRole("link", { name: /Taida/ })[0]).toHaveAttribute(
      "href",
      "/",
    );
    expect(
      screen.getAllByRole("link", { name: "Features" })[0],
    ).toHaveAttribute("href", "/#features");
    expect(
      screen.getByRole("link", { name: "Privacy Policy" }),
    ).toHaveAttribute("href", "/privacy");
    expect(
      screen.getByRole("heading", { name: "Privacy Policy" }),
    ).toBeInTheDocument();
  });
});
