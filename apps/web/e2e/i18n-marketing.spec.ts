import { expect, test } from "@playwright/test";

const NON_EN_LOCALES = [
  "es",
  "zh-CN",
  "pt-BR",
  "hi",
  "fr",
  "ja",
  "ko",
] as const;

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function pickThree(): readonly string[] {
  const seed = Number(process.env.PLAYWRIGHT_LOCALE_SEED ?? Date.now());

  return [...NON_EN_LOCALES]
    .sort((a, b) => {
      const hashA = [...a].reduce(
        (total, char) => total + char.charCodeAt(0),
        seed,
      );
      const hashB = [...b].reduce(
        (total, char) => total + char.charCodeAt(0),
        seed,
      );
      return (hashA % 97) - (hashB % 97);
    })
    .slice(0, 3);
}

function localePathPattern(locale: string) {
  return new RegExp(`^/${escapeRegExp(locale)}(?:/|$|\\?)`);
}

test.describe("marketing locale preservation", () => {
  for (const locale of pickThree()) {
    test(`internal marketing links stay in /${locale}`, async ({ page }) => {
      await page.goto(`/${locale}`);

      await expect(
        page.getByRole("link", { name: /Get Started/ }).first(),
      ).toBeVisible();

      const internalHrefs = await page.locator("a[href]").evaluateAll((anchors) =>
        anchors
          .map((anchor) => anchor.getAttribute("href") ?? "")
          .filter((href) => href.startsWith("/") && !href.startsWith("//")),
      );

      for (const href of internalHrefs) {
        expect(href, `marketing link "${href}" missing /${locale} prefix`).toMatch(
          localePathPattern(locale),
        );
      }

      await page.getByRole("link", { name: /Get Started/ }).first().click();
      await expect(page).toHaveURL(
        new RegExp(`/${escapeRegExp(locale)}/sign-in`),
      );

      const url = new URL(page.url());
      expect(url.searchParams.get("callbackUrl")).toMatch(
        new RegExp(`^/${escapeRegExp(locale)}/`),
      );
    });
  }

  test("header and footer links preserve locale on /es", async ({ page }) => {
    await page.goto("/es");

    const links = page.locator("header a[href], footer a[href]");
    const count = await links.count();

    for (let index = 0; index < count; index += 1) {
      const link = links.nth(index);
      const href = await link.getAttribute("href");

      if (!href || href.startsWith("#")) {
        continue;
      }

      expect(href, `header/footer link "${href}" missing /es prefix`).toMatch(
        /^\/es(?:\/|$|\?)/,
      );
    }
  });

  test("no regression on /en flow", async ({ page }) => {
    await page.goto("/en");
    await page.getByRole("link", { name: /Get Started/ }).first().click();
    await expect(page).toHaveURL(/\/en\/sign-in/);

    const url = new URL(page.url());
    expect(url.searchParams.get("callbackUrl")).toMatch(/^\/en\//);
  });
});
