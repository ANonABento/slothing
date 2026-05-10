import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";
import { CTASection } from "./cta-section";

const localeState = vi.hoisted(() => ({ current: "en" }));

vi.mock("next-intl/server", () => ({
  getLocale: () => Promise.resolve(localeState.current),
  getRequestConfig: (createRequestConfig: unknown) => createRequestConfig,
}));

async function renderCTASection(locale = "en") {
  localeState.current = locale;
  const ui = await CTASection();

  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

function expectLocalizedHref(link: HTMLElement, locale: string) {
  expect(link.getAttribute("href")).toMatch(
    new RegExp(
      `^/${locale}/sign-in\\?callbackUrl=(%2F${locale}%2Fdashboard|/${locale}/dashboard)$`,
    ),
  );
}

describe("CTASection", () => {
  it("should render the ATS Scanner CTA", async () => {
    await renderCTASection();
    expect(screen.getByText(/Try the free/)).toBeInTheDocument();
    expect(screen.getByText("ATS Scanner")).toBeInTheDocument();
  });

  it("should link to /ats-scanner", async () => {
    await renderCTASection();
    const scanLink = screen.getByRole("link", { name: /Scan My Resume/ });
    expect(scanLink).toHaveAttribute("href", "/en/ats-scanner");
  });

  it("should render the Get Started CTA", async () => {
    await renderCTASection();
    expect(screen.getByText(/Ready to stop rewriting/)).toBeInTheDocument();
  });

  it("should link Get Started to sign-in", async () => {
    await renderCTASection();
    const link = screen.getByRole("link", { name: /Get Started Free/ });
    expectLocalizedHref(link, "en");
  });

  it("should preserve a non-English locale in CTA links", async () => {
    await renderCTASection("es");

    const scanLink = screen.getByRole("link", { name: /Scan My Resume/ });
    const getStarted = screen.getByRole("link", { name: /Get Started Free/ });

    expect(scanLink).toHaveAttribute("href", "/es/ats-scanner");
    expectLocalizedHref(getStarted, "es");
  });

  it("should render benefit items", async () => {
    await renderCTASection();
    expect(screen.getByText("Free ATS scanner included")).toBeInTheDocument();
    expect(screen.getByText("Smart resume parsing")).toBeInTheDocument();
    expect(screen.getByText("Unlimited tailored resumes")).toBeInTheDocument();
    expect(
      screen.getByText("Knowledge bank for your career"),
    ).toBeInTheDocument();
  });
});
