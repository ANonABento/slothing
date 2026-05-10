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

    await expect(
      page.getByRole("heading", { name: "Tablero" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /Configuración/ })).toBeVisible();
  });

  test("switches language from settings while preserving the route", async ({
    page,
  }) => {
    await page.goto("/en/settings");
    await page.waitForLoadState("networkidle");

    await page.getByLabel("Language").click();
    await page.getByRole("option", { name: "Español" }).click();

    await expect(page).toHaveURL(/\/es\/settings$/);
    await expect(page.getByRole("link", { name: /Configuración/ })).toBeVisible();
  });
});
