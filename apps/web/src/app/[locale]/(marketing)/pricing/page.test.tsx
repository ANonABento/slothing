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

  it("uses clearly labelled email CTAs for Pro and Student", async () => {
    await renderPricingPage();

    const proCta = screen.getByRole("link", {
      name: /Email us for waitlist access/i,
    });
    const studentCta = screen.getByRole("link", {
      name: /Email us to verify student status/i,
    });

    expect(proCta).toHaveAttribute("data-pro-cta", "waitlist");
    expect(proCta).toHaveAttribute(
      "href",
      "mailto:waitlist@slothing.work?subject=Pro%20waitlist",
    );
    expect(proCta).toHaveAttribute("target", "_blank");
    expect(proCta).toHaveAttribute("rel", "noopener noreferrer");
    expect(studentCta).toHaveAttribute(
      "href",
      "mailto:students@slothing.work?subject=Student%20verification",
    );
    expect(studentCta).toHaveAttribute("target", "_blank");
    expect(studentCta).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("clarifies Pro status in the badge", async () => {
    await renderPricingPage();

    expect(
      screen.getByText(
        "Pro is invite-only while billing ships. Email us for early access.",
      ),
    ).toBeInTheDocument();
  });

  it("renders plan comparison rows that highlight Pro upgrades", async () => {
    await renderPricingPage();

    expect(
      screen.getByRole("heading", { name: "Compare plans" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("row", { name: /Tailored resumes/i }),
    ).toHaveTextContent("Unlimited");
    expect(
      screen.getByRole("row", { name: /Generation priority/i }),
    ).toHaveTextContent("Priority");
    expect(
      screen.getByRole("row", { name: /Resume variants/i }),
    ).toHaveTextContent("Advanced variants");
  });

  it("answers core billing and upgrade questions in the FAQ", async () => {
    await renderPricingPage();

    expect(
      screen.getByRole("heading", { name: "Can I cancel Pro anytime?" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Are prices in USD?" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "What happens to my Free tier resumes if I upgrade?",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "When does Pro launch?" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Is there a refund policy?" }),
    ).toBeInTheDocument();
  });

  it("preserves non-English locale in internal links", async () => {
    await renderPricingPage("es");

    expectLocalizedSignInHref(
      screen.getByRole("link", { name: /Start free/i }),
      "es",
    );
  });
});
