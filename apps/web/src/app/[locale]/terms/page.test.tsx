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

  it("states jurisdiction without placeholder legal copy", () => {
    const { container } = render(<TermsPage />);

    expect(container).toHaveTextContent(
      /laws of Ontario and the federal laws of Canada/i,
    );
    expect(container).toHaveTextContent(/courts located in Ontario, Canada/i);
    expect(container).not.toHaveTextContent(/TBD|pending legal review/i);
  });
});
