import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";
import { Hero } from "./hero";

const localeState = vi.hoisted(() => ({ current: "en" }));

vi.mock("next-intl/server", () => ({
  getLocale: () => Promise.resolve(localeState.current),
  getRequestConfig: (createRequestConfig: unknown) => createRequestConfig,
}));

async function renderHero(locale = "en") {
  localeState.current = locale;
  const ui = await Hero();

  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

function expectLocalizedHref(link: HTMLElement, locale: string) {
  const escapedLocale = locale.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  expect(link.getAttribute("href")).toMatch(
    new RegExp(
      `^/${escapedLocale}/sign-in\\?callbackUrl=(%2F${escapedLocale}%2Fdashboard|/${escapedLocale}/dashboard)$`,
    ),
  );
}

describe("Hero", () => {
  it("should render the Slothing headline", async () => {
    await renderHero();
    // Text appears in both badge and h1; verify at least one instance exists
    expect(screen.getAllByText(/You're not lazy\./)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Your system is\./)[0]).toBeInTheDocument();
  });

  it("should render the badge text", async () => {
    await renderHero();
    // Badge text is mixed with icons in a container; use regex to find substring
    expect(
      screen.getByText(/AI-Powered Resume Intelligence/),
    ).toBeInTheDocument();
  });

  it("should render the subheadline with Slothing description", async () => {
    await renderHero();
    expect(
      screen.getByText(/Slothing remembers your full career history/),
    ).toBeInTheDocument();
  });

  it("should render Try Free ATS Scanner CTA linking to /ats-scanner", async () => {
    await renderHero();
    const atsLink = screen.getByRole("link", { name: /Try Free ATS Scanner/ });
    expect(atsLink).toHaveAttribute("href", "/en/ats-scanner");
  });

  it("should render Get Started CTA linking to sign-in", async () => {
    await renderHero();
    const getStarted = screen.getByRole("link", { name: /Get Started/ });
    expectLocalizedHref(getStarted, "en");
  });

  it.each(["es", "zh-CN", "pt-BR"])(
    "should preserve %s in CTA links",
    async (locale) => {
      await renderHero(locale);

      const atsLink = screen.getByRole("link", {
        name: /Try Free ATS Scanner/,
      });
      const getStarted = screen.getByRole("link", { name: /Get Started/ });

      expect(atsLink).toHaveAttribute("href", `/${locale}/ats-scanner`);
      expectLocalizedHref(getStarted, locale);
    },
  );

  it("should render social proof section", async () => {
    await renderHero();
    expect(screen.getByText(/Join 10,000\+ job seekers/)).toBeInTheDocument();
    expect(screen.getByText("4.9/5 rating")).toBeInTheDocument();
  });

  it("should disclose illustrative hero stats", async () => {
    await renderHero();
    expect(
      screen.getByText(/Stats and ratings are illustrative/),
    ).toBeInTheDocument();
  });
});
