import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ATSScannerPage from "./page";

describe("ATSScannerPage", () => {
  it("does not use a dollar sign icon for the free benefit", () => {
    const { container } = render(
      <ATSScannerPage params={{ locale: "en" }} />,
    );

    expect(screen.getByText("Free and Private")).toBeInTheDocument();
    expect(container.querySelector(".lucide-dollar-sign")).toBeNull();
    expect(container.querySelector(".lucide-sparkles")).not.toBeNull();
  });

  it("links the ATS filtering stat to the HBS Hidden Workers source", () => {
    render(<ATSScannerPage params={{ locale: "en" }} />);

    expect(screen.queryByText(/75%/)).not.toBeInTheDocument();
    const source = screen.getByRole("link", { name: /Hidden Workers/i });
    expect(source).toHaveAttribute(
      "href",
      "https://www.hbs.edu/managing-the-future-of-work/Documents/research/hiddenworkers09032021.pdf",
    );
  });
});
