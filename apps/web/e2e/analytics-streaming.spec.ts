import { expect, test } from "@playwright/test";
import { prepareAppPage } from "./utils/test-helpers";

test.describe("analytics progressive rendering", () => {
  test("stats row is visible before chart tiles finish loading", async ({
    page,
  }) => {
    await page.route("**/api/analytics/trends*", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      await route.continue();
    });
    await page.route("**/api/analytics/success", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      await route.continue();
    });

    await prepareAppPage(page, "/en/analytics");

    await expect(page.getByTestId("analytics-overview")).toBeVisible();
    await expect(page.getByTestId("analytics-trends")).toBeHidden();
    await expect(page.getByTestId("analytics-trends")).toBeVisible();
  });
});
