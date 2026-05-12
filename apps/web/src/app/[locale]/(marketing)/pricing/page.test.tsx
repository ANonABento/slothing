import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";
import { getLocalizedPageMetadata } from "@/lib/seo";
import messages from "@/messages/en.json";
import PricingPage, { generateMetadata } from "./page";

const localeState = vi.hoisted(() => ({ current: "en" }));

vi.mock("next-intl/server", () => ({
  getLocale: () => Promise.resolve(localeState.current),
  getRequestConfig: (createRequestConfig: unknown) => createRequestConfig,
}));

async function renderPricingPage(locale = "en") {
  localeState.current = locale;
  const ui = await PricingPage();

  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

function expectLocalizedSignInHref(link: HTMLElement, locale: string) {
  expect(link.getAttribute("href")).toMatch(
    new RegExp(
      `^/${locale}/sign-in\\?callbackUrl=(%2F${locale}%2Fdashboard|/${locale}/dashboard)$`,
    ),
  );
}

describe("PricingPage", () => {
  it("uses localized metadata for alternates and canonical URLs", () => {
    expect(generateMetadata({ params: { locale: "es" } })).toEqual(
      getLocalizedPageMetadata("pricing", "es"),
    );
  });

  it("renders the Free, Pro, and Student tiers with prices", async () => {
    await renderPricingPage();

    expect(screen.getByRole("heading", { name: "Free" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Pro" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Student" }),
    ).toBeInTheDocument();
    expect(screen.getByText("$0")).toBeInTheDocument();
    expect(screen.getByText("$8/mo")).toBeInTheDocument();
    expect(screen.getByText("$3/mo")).toBeInTheDocument();
  });

  it("links the Free CTA to localized sign-in", async () => {
    await renderPricingPage();

    expectLocalizedSignInHref(
      screen.getByRole("link", { name: /Start free/i }),
      "en",
    );
  });

  it("uses mailto CTAs for Pro and Student", async () => {
    await renderPricingPage();

    const proCta = screen.getByRole("link", { name: /Join waitlist/i });
    const studentCta = screen.getByRole("link", {
      name: /Verify with .edu email/i,
    });

    expect(proCta).toHaveAttribute("data-pro-cta", "waitlist");
    expect(proCta).toHaveAttribute(
      "href",
      "mailto:waitlist@slothing.work?subject=Pro%20waitlist",
    );
    expect(studentCta).toHaveAttribute(
      "href",
      "mailto:students@slothing.work?subject=Student%20verification",
    );
  });

  it("preserves non-English locale in internal links", async () => {
    await renderPricingPage("es");

    expectLocalizedSignInHref(
      screen.getByRole("link", { name: /Start free/i }),
      "es",
    );
  });
});
