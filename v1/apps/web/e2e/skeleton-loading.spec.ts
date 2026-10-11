import { expect, test } from "@playwright/test";
import { prepareAppPage } from "./utils/test-helpers";

test.describe("Skeleton loading states", () => {
  test("shows skeletons while navigating from dashboard to analytics", async ({
    page,
  }) => {
    await page.route("**/api/analytics", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1_200));
      await route.fulfill({
        json: {
          overview: {},
          jobs: { byStatus: {}, total: 0, applied: 0 },
          recent: { jobs: [] },
          trends: {},
        },
      });
    });

    await prepareAppPage(page, "/en/dashboard");
    const navigation = page.goto("/en/analytics");
    await expect(page.locator("[data-skeleton='true']").first()).toBeVisible({
      timeout: 1_000,
    });
    await navigation;
  });
});
