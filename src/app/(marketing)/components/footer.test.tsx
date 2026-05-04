import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "./footer";

describe("Footer", () => {
  it("should render public product and legal links", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: /Features/ })).toHaveAttribute(
      "href",
      "/#features",
    );
    expect(screen.getByRole("link", { name: /How It Works/ })).toHaveAttribute(
      "href",
      "/#how-it-works",
    );
    expect(screen.getByRole("link", { name: /ATS Scanner/ })).toHaveAttribute(
      "href",
      "/ats-scanner",
    );
    expect(
      screen.getByRole("link", { name: /Privacy Policy/ }),
    ).toHaveAttribute("href", "/privacy");
    expect(
      screen.getByRole("link", { name: /Terms of Service/ }),
    ).toHaveAttribute("href", "/terms");
  });

  it("should not render auth-gated resources", () => {
    render(<Footer />);
    expect(screen.queryByText("Resources")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Dashboard/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Knowledge Bank/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Interview Prep/ }),
    ).not.toBeInTheDocument();
  });
});
