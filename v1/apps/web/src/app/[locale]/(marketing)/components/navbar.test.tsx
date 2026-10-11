import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "@/components/theme-provider";
import messages from "@/messages/en.json";
import { Navbar } from "./navbar";

vi.mock("@/i18n/navigation", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/i18n/navigation")>();

  return {
    ...actual,
    usePathname: () => "/pricing",
    useRouter: () => ({
      replace: vi.fn(),
    }),
  };
});

function renderNavbar(locale: string) {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider>
        <Navbar />
      </ThemeProvider>
    </NextIntlClientProvider>,
  );
}

function internalHrefs() {
  return screen
    .getAllByRole("link")
    .map((link) => link.getAttribute("href") ?? "")
    .filter((href) => href.startsWith("/") && !href.startsWith("//"));
}

function anchorHrefs() {
  return screen
    .getAllByRole("link")
    .map((link) => link.getAttribute("href") ?? "")
    .filter((href) => href.startsWith("#"));
}

function expectLocalePrefixedInternalHrefs(locale: string) {
  const escapedLocale = locale.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  for (const href of internalHrefs()) {
    expect(href, `navbar link "${href}" missing /${locale} prefix`).toMatch(
      new RegExp(`^/${escapedLocale}(?:/|$|\\?)`),
    );
  }
}

describe("Navbar", () => {
  it.each(["es", "zh-CN"])("prefixes internal links with %s", (locale) => {
    renderNavbar(locale);

    expect(screen.getAllByLabelText("Change language").length).toBeGreaterThan(
      0,
    );
    expectLocalePrefixedInternalHrefs(locale);
    expect(anchorHrefs()).toEqual(["#features", "#how-it-works"]);
  });

  it("prefixes mobile menu CTAs and keeps section anchors literal", () => {
    renderNavbar("es");

    fireEvent.click(screen.getByRole("button", { name: "Toggle menu" }));

    expect(screen.getAllByLabelText("Change language").length).toBeGreaterThan(
      1,
    );
    expectLocalePrefixedInternalHrefs("es");
    expect(anchorHrefs()).toEqual([
      "#features",
      "#how-it-works",
      "#features",
      "#how-it-works",
    ]);

    const signInLinks = screen.getAllByRole("link", { name: "Sign In" });
    const getStartedLinks = screen.getAllByRole("link", {
      name: "Get Started",
    });

    expect(signInLinks).toHaveLength(2);
    expect(getStartedLinks).toHaveLength(2);

    for (const link of [...signInLinks, ...getStartedLinks]) {
      expect(link.getAttribute("href")).toMatch(
        /^\/es\/sign-in\?callbackUrl=(%2Fes%2Fdashboard|\/es\/dashboard)$/,
      );
    }
  });
});
