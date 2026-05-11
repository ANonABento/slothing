import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PrivacyPage from "./page";

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

describe("PrivacyPage", () => {
  it("renders required privacy policy sections", () => {
    render(<PrivacyPage />);

    expect(
      screen.getByRole("heading", { name: "Privacy Policy" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Your privacy rights" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Cookies and local storage" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Contact" }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: "support@slothing.work" }).length,
    ).toBeGreaterThan(0);
  });

  it("does not ship placeholder legal copy", () => {
    const { container } = render(<PrivacyPage />);

    expect(container).not.toHaveTextContent(/TBD|pending legal review/i);
  });
});
