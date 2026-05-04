import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CTASection } from "./cta-section";

describe("CTASection", () => {
  it("should render the ATS Scanner CTA", () => {
    render(<CTASection />);
    expect(screen.getByText(/Try the free/)).toBeInTheDocument();
    expect(screen.getByText("ATS Scanner")).toBeInTheDocument();
  });

  it("should link to /ats-scanner", () => {
    render(<CTASection />);
    const scanLink = screen.getByRole("link", { name: /Scan My Resume/ });
    expect(scanLink).toHaveAttribute("href", "/ats-scanner");
  });

  it("should render the Get Started CTA", () => {
    render(<CTASection />);
    expect(screen.getByText(/Ready to stop rewriting/)).toBeInTheDocument();
  });

  it("should link the final account CTA to sign-up", () => {
    render(<CTASection />);
    const link = screen.getByRole("link", {
      name: /Create your free account/,
    });
    expect(link).toHaveAttribute("href", "/sign-up?redirect_url=/dashboard");
  });

  it("should render one final CTA paragraph", () => {
    render(<CTASection />);
    expect(
      screen.getByText(
        /Join thousands of job seekers who build tailored resumes in minutes, not hours\./,
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/transformed their career journey/),
    ).not.toBeInTheDocument();
  });

  it("should render benefit items", () => {
    render(<CTASection />);
    expect(screen.getByText("Free ATS scanner included")).toBeInTheDocument();
    expect(screen.getByText("Smart resume parsing")).toBeInTheDocument();
    expect(screen.getByText("Unlimited tailored resumes")).toBeInTheDocument();
    expect(
      screen.getByText("Knowledge bank for your career"),
    ).toBeInTheDocument();
  });
});
