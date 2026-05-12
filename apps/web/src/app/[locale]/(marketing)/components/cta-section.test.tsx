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
  const escapedLocale = locale.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  expect(link.getAttribute("href")).toMatch(
    new RegExp(
      `^/${escapedLocale}/sign-in\\?callbackUrl=(%2F${escapedLocale}%2Fdashboard|/${escapedLocale}/dashboard)$`,
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
    const ctaCopy = screen.getByText(
      "Build tailored resumes in minutes, not hours, and keep every version organized.",
    );

    expect(ctaCopy).toBeInTheDocument();
    expect(ctaCopy.textContent?.match(/[.!?]/g)).toHaveLength(1);
    expect(screen.queryByText(/Join thousands/i)).not.toBeInTheDocument();
  });

  it("should link Get Started to sign-in", async () => {
    await renderCTASection();
    const link = screen.getByRole("link", { name: /Get Started Free/ });
    expectLocalizedHref(link, "en");
  });

  it.each(["es", "zh-CN", "pt-BR"])(
    "should preserve %s in CTA links",
    async (locale) => {
      await renderCTASection(locale);

      const scanLink = screen.getByRole("link", { name: /Scan My Resume/ });
      const getStarted = screen.getByRole("link", {
        name: /Get Started Free/,
      });

      expect(scanLink).toHaveAttribute("href", `/${locale}/ats-scanner`);
      expectLocalizedHref(getStarted, locale);
    },
  );

  it("should render benefit items", async () => {
    await renderCTASection();
    expect(screen.getByText("Free ATS scanner included")).toBeInTheDocument();
    expect(screen.getByText("Smart resume parsing")).toBeInTheDocument();
    expect(
      screen.getByText("5 free tailored resumes/month"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Knowledge bank for your career"),
    ).toBeInTheDocument();
  });
});
