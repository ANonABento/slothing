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
    expect(screen.getAllByText(/You're not lazy\./)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Your system is\./)[0]).toBeInTheDocument();
  });

  it("should render the badge text", async () => {
    await renderHero();
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

  it("should render Scan your resume free primary CTA linking to /ats-scanner", async () => {
    await renderHero();
    const atsLink = screen.getByRole("link", {
      name: /Scan your resume free/,
    });
    expect(atsLink).toHaveAttribute("href", "/en/ats-scanner");
  });

  it("should render Create a free account secondary CTA to sign-in", async () => {
    await renderHero();
    const accountLink = screen.getByRole("link", {
      name: /Create a free account/,
    });
    expectLocalizedHref(accountLink, "en");
  });

  it.each(["es", "zh-CN", "pt-BR"])(
    "should preserve %s in CTA links",
    async (locale) => {
      await renderHero(locale);

      const atsLink = screen.getByRole("link", {
        name: /Scan your resume free/,
      });
      const accountLink = screen.getByRole("link", {
        name: /Create a free account/,
      });

      expect(atsLink).toHaveAttribute("href", `/${locale}/ats-scanner`);
      expectLocalizedHref(accountLink, locale);
    },
  );

  it("should render honest trust cues instead of fabricated metrics", async () => {
    await renderHero();
    const trustRow = screen.getByTestId("hero-social-proof");

    expect(trustRow).toBeInTheDocument();
    expect(trustRow).toHaveTextContent(/Free ATS scan/);
    expect(trustRow).toHaveTextContent(/No credit card/);
    expect(trustRow).toHaveTextContent(/Open early access/);
    expect(trustRow).toHaveTextContent(/Your data, your control/);
    expect(screen.queryByText(/\d{1,3},\d{3}\+/)).not.toBeInTheDocument();
    expect(screen.queryByText(/\/5 rating/)).not.toBeInTheDocument();
  });

  it("should keep mobile trust cues readable", async () => {
    await renderHero();

    const trustRow = screen.getByTestId("hero-social-proof");

    expect(trustRow).toHaveClass("bg-card/80");
    expect(trustRow).toHaveClass("text-foreground");
    expect(trustRow).toHaveClass("sm:text-muted-foreground");
  });

  it("should disclose that Slothing is in active development", async () => {
    await renderHero();
    expect(
      screen.getByText(/Slothing is in active development/),
    ).toBeInTheDocument();
  });

  it("should not render fabricated user counts or star ratings", async () => {
    await renderHero();
    expect(screen.queryByText(/10,000\+ job seekers/)).not.toBeInTheDocument();
    expect(screen.queryByText(/4\.9\/5 rating/)).not.toBeInTheDocument();
    expect(screen.queryByText(/^\d{2},\d{3}\+$/)).not.toBeInTheDocument();
  });
});
