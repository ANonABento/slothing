import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type * as React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  DISMISS_STORAGE_KEY,
  SidebarExtensionCard,
} from "./sidebar-extension-card";
import { EXTENSION_CONNECTED_STORAGE_KEY } from "@/lib/extension/detect";

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

describe("SidebarExtensionCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(localStorage.getItem).mockReturnValue(null);
  });

  it("renders when expanded and no localStorage flags are present", async () => {
    render(<SidebarExtensionCard collapsed={false} />);

    expect(
      await screen.findByRole("link", {
        name: "Install the Slothing browser extension",
      }),
    ).toHaveAttribute("href", "/extension");
  });

  it("does not render when collapsed", () => {
    render(<SidebarExtensionCard collapsed />);

    expect(
      screen.queryByRole("link", {
        name: "Install the Slothing browser extension",
      }),
    ).not.toBeInTheDocument();
  });

  it.each([DISMISS_STORAGE_KEY, EXTENSION_CONNECTED_STORAGE_KEY])(
    "does not render when %s is present",
    async (key) => {
      vi.mocked(localStorage.getItem).mockImplementation((requestedKey) =>
        requestedKey === key ? "true" : null,
      );

      render(<SidebarExtensionCard collapsed={false} />);

      await waitFor(() => {
        expect(
          screen.queryByRole("link", {
            name: "Install the Slothing browser extension",
          }),
        ).not.toBeInTheDocument();
      });
    },
  );

  it("persists dismissal", async () => {
    render(<SidebarExtensionCard collapsed={false} />);

    fireEvent.click(
      await screen.findByRole("button", { name: "Dismiss extension promo" }),
    );

    expect(localStorage.setItem).toHaveBeenCalledWith(
      DISMISS_STORAGE_KEY,
      "true",
    );
    expect(
      screen.queryByRole("link", {
        name: "Install the Slothing browser extension",
      }),
    ).not.toBeInTheDocument();
  });
});
