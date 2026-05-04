import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Navbar } from "./navbar";

describe("Navbar", () => {
  it("should link section nav items back to home anchors", () => {
    render(<Navbar />);

    expect(
      screen.getAllByRole("link", { name: "Features" })[0],
    ).toHaveAttribute("href", "/#features");
    expect(
      screen.getAllByRole("link", { name: "How It Works" })[0],
    ).toHaveAttribute("href", "/#how-it-works");
    expect(
      screen.getAllByRole("link", { name: "Testimonials" })[0],
    ).toHaveAttribute("href", "/#testimonials");
  });

  it("should keep the header CTA on the new-user flow", () => {
    render(<Navbar />);

    expect(
      screen.getAllByRole("link", { name: "Get Started" })[0],
    ).toHaveAttribute("href", "/sign-up?redirect_url=/dashboard");
  });
});
