import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Testimonials } from "./testimonials";

describe("Testimonials", () => {
  it("should render the section header", () => {
    render(<Testimonials />);
    expect(screen.getByText("How Slothing Helps")).toBeInTheDocument();
    expect(
      screen.getByText(/Turn every application into a/),
    ).toBeInTheDocument();
  });

  it("should render outcome card titles", () => {
    render(<Testimonials />);
    expect(screen.getByText("ATS-aware tailoring")).toBeInTheDocument();
    expect(
      screen.getByText("One career profile, infinite resumes"),
    ).toBeInTheDocument();
    expect(screen.getByText("Track every application")).toBeInTheDocument();
  });

  it("should render outcome card descriptions", () => {
    render(<Testimonials />);
    expect(
      screen.getByText(
        /matches resume language against the exact ATS keywords/,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Generate a tailored resume for every role/),
    ).toBeInTheDocument();
    expect(screen.getByText(/never lose a promising lead/)).toBeInTheDocument();
  });

  it("should not render fabricated testimonials or illustrative metrics", () => {
    render(<Testimonials />);
    expect(screen.queryByText(/^[A-Z][a-z]+ [A-Z]\.$/)).not.toBeInTheDocument();
    expect(screen.queryByText(/^Now at /)).not.toBeInTheDocument();
    expect(screen.queryByText(/^\d{2},\d{3}\+$/)).not.toBeInTheDocument();
    expect(screen.queryByText(/^\d{2}%$/)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/real numbers are coming/),
    ).not.toBeInTheDocument();
  });
});
