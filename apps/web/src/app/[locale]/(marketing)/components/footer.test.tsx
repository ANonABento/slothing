import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";
import { Footer } from "./footer";

function renderFooter(locale: string) {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Footer />
    </NextIntlClientProvider>,
  );
}

function hrefs() {
  return screen
    .getAllByRole("link")
    .map((link) => link.getAttribute("href") ?? "");
}

describe("Footer", () => {
  it("links marketing visitors only to public routes", () => {
    renderFooter("en");

    expect(screen.getByRole("heading", { name: "Resources" })).toBeVisible();
    expect(screen.queryByRole("link", { name: "Dashboard" })).toBeNull();
    expect(screen.queryByRole("link", { name: "Documents" })).toBeNull();
    expect(screen.queryByRole("link", { name: "Interview Prep" })).toBeNull();

    expect(screen.getByRole("link", { name: "ATS Scanner" })).toHaveAttribute(
      "href",
      "/en/ats-scanner",
    );
    expect(
      screen.getByRole("link", { name: "Browser Extension" }),
    ).toHaveAttribute("href", "/en/extension");

    expect(hrefs()).not.toEqual(
      expect.arrayContaining(["/en/dashboard", "/en/bank", "/en/interview"]),
    );
  });

  it.each(["es", "zh-CN"])(
    "prefixes internal links with %s and leaves section anchors unchanged",
    (locale) => {
      renderFooter(locale);

      const renderedHrefs = hrefs();
      const escapedLocale = locale.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      expect(renderedHrefs).toEqual([
        `/${locale}`,
        "#features",
        "#how-it-works",
        `/${locale}/pricing`,
        `/${locale}/ats-scanner`,
        `/${locale}/extension`,
        `/${locale}/privacy`,
        `/${locale}/terms`,
      ]);

      for (const href of renderedHrefs.filter((href) => href.startsWith("/"))) {
        expect(href, `footer link "${href}" missing /${locale} prefix`).toMatch(
          new RegExp(`^/${escapedLocale}(?:/|$|\\?)`),
        );
      }
    },
  );
});
