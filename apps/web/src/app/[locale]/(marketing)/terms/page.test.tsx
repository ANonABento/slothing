import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TermsPage from "./page";

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    children,
    href,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("TermsPage", () => {
  it("renders required terms sections", () => {
    render(<TermsPage />);

    expect(
      screen.getByRole("heading", { name: "Terms of Service" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Acceptable use" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Disclaimer and limitation of liability",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Governing law" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Disputes" }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: "support@slothing.work" }).length,
    ).toBeGreaterThan(0);
  });

  it("flags jurisdiction and dispute terms for legal review", () => {
    const { container } = render(<TermsPage />);

    expect(container).toHaveTextContent(
      /governing-law and dispute[-\s]*resolution sections below are still being finalized with legal counsel/i,
    );
    expect(container).toHaveTextContent(
      /specific governing jurisdiction .* published before any material change to billing or service terms/i,
    );
    expect(container).toHaveTextContent(/finalized with legal counsel/i);
    expect(container).toHaveTextContent(
      /formal dispute resolution terms .* will be published before any material change to billing or service terms/i,
    );
  });
});
