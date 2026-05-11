import { expect, test } from "@playwright/test";

test.describe("i18n routing", () => {
  test("redirects the root path to the default locale", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/\/en(?:\/|$)/);
  });

  test("renders dashboard chrome in Spanish", async ({ page }) => {
    await page.goto("/es/dashboard");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await expect(page.getByRole("link", { name: "Panel" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Configuración/ }),
    ).toBeVisible();
  });

  test("renders dashboard chrome in Simplified Chinese", async ({ page }) => {
    await page.goto("/zh-CN/dashboard");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
    const heading = await page
      .getByRole("heading", { level: 1 })
      .first()
      .innerText();
    expect(heading).toMatch(/[一-鿿]/u);
    await expect(page.getByRole("link", { name: "机会" })).toBeVisible();
    await expect(page.getByRole("link", { name: /设置/ })).toBeVisible();
  });

  test("renders dashboard chrome in Brazilian Portuguese", async ({ page }) => {
    await page.goto("/pt-BR/dashboard");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
    await expect(page.getByRole("link", { name: "Painel" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Add opportunity/i }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: /Oportunidades/ }),
    ).toBeVisible();
  });

  test("renders dashboard chrome in Hindi", async ({ page }) => {
    await page.goto("/hi/dashboard");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("html")).toHaveAttribute("lang", "hi");
    const heading = await page
      .getByRole("heading", { level: 1 })
      .first()
      .innerText();
    expect(heading).toMatch(/[ऀ-ॿ]/u);
    await expect(page.getByRole("link", { name: "अवसर" })).toBeVisible();
    await expect(page.getByRole("link", { name: /सेटिंग्स/ })).toBeVisible();
  });

  test("switches language from settings while preserving the route", async ({
    page,
  }) => {
    await page.goto("/en/settings");
    await page.waitForLoadState("networkidle");

    await page.getByLabel("Language").click();
    await page.getByRole("option", { name: "Español" }).click();

    await expect(page).toHaveURL(/\/es\/settings$/);
    await expect(
      page.getByRole("link", { name: /Configuración/ }),
    ).toBeVisible();
  });
});
