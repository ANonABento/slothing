import { render, screen } from "@testing-library/react";
import type * as React from "react";
import { describe, expect, it, vi } from "vitest";
import ExtensionLandingPage from "./page";

vi.mock("@/components/marketing/extension-install-buttons", () => ({
  ExtensionInstallButtons: () => <div>Install buttons</div>,
}));

vi.mock("@/lib/auth", () => ({
  getCurrentUserId: vi.fn(async () => "user-1"),
}));

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("ExtensionLandingPage", () => {
  it("renders the required extension marketing sections", async () => {
    render(await ExtensionLandingPage());

    expect(
      screen.getByRole("heading", {
        name: "Capture jobs from any site, instantly.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Less copying, more deciding" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "How it works" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Privacy and trust" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "FAQ" })).toBeInTheDocument();
    expect(
      screen.getByText("Which browsers are supported?"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /privacy policy/i }),
    ).toHaveAttribute("href", "/privacy");
    expect(screen.getByRole("link", { name: /connect it/i })).toHaveAttribute(
      "href",
      "/extension/connect",
    );
  });
});
