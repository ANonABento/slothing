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
        `/${locale}/extension`,
        `/${locale}/ats-scanner`,
        `/${locale}/dashboard`,
        `/${locale}/bank`,
        `/${locale}/interview`,
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
