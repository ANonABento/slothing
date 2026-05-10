import { expect, test } from "@playwright/test";
import { ensureSidebarOpen, prepareAppPage } from "./utils/test-helpers";

async function stubDashboardApis(page: Parameters<typeof prepareAppPage>[0]) {
  await page.route("**/api/profile", async (route) => {
    await route.fulfill({
      json: {
        profile: {
          id: "profile-e2e",
          name: "E2E User",
          email: "e2e@example.com",
          headline: "Product engineer",
          location: "Remote",
          summary: "Builds useful things.",
        },
      },
    });
  });
  await page.route("**/api/documents", async (route) => {
    await route.fulfill({ json: { documents: [] } });
  });
  await page.route("**/api/analytics", async (route) => {
    await route.fulfill({
      json: {
        overview: { totalResumesGenerated: 0 },
        jobs: { byStatus: {} },
        recent: { jobs: [] },
      },
    });
  });
  await page.route("**/api/onboarding/dismiss", async (route) => {
    if (route.request().method() === "POST") {
      await route.fulfill({
        json: { dismissedAt: "2026-05-09T12:00:00.000Z", firstName: "E2E" },
      });
      return;
    }

    await route.fulfill({ json: { dismissedAt: null, firstName: "E2E" } });
  });
}

test.describe("Dashboard coverage", () => {
  test.beforeEach(async ({ page }) => {
    await stubDashboardApis(page);
    await prepareAppPage(page, "/dashboard");
  });

  test("renders the onboarding dashboard and stats scaffold", async ({
    page,
  }) => {
    await expect(
      page.getByRole("heading", { name: "Dashboard" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Build your workspace in three steps",
      }),
    ).toBeVisible();
    await expect(page.getByText("of 3 complete")).toBeVisible();
  });

  test("dismisses onboarding into the active dashboard", async ({ page }) => {
    await page.getByRole("button", { name: /skip onboarding/i }).click();

    await expect(page.getByRole("heading", { name: "Today" })).toBeVisible();
    await expect(page.getByText("Readiness")).toBeVisible();
    await expect(page.getByText("Pipeline")).toBeVisible();
  });

  test("quick actions route to documents and opportunities", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /skip onboarding/i }).click();
    await page.getByRole("link", { name: /upload document/i }).click();
    await expect(page).toHaveURL("/bank");

    await stubDashboardApis(page);
    await prepareAppPage(page, "/dashboard");
    await page.getByRole("button", { name: /skip onboarding/i }).click();
    await page.getByRole("link", { name: /add opportunity/i }).click();
    await expect(page).toHaveURL("/opportunities");
  });

  test("marks the sidebar Dashboard link active", async ({ page }) => {
    await ensureSidebarOpen(page);
    await expect(
      page.locator("aside").getByRole("link", { name: /dashboard/i }),
    ).toHaveAttribute("data-active", "true");
  });
});
