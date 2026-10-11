import { expect, test } from "@playwright/test";
import { prepareAppPage } from "./utils/test-helpers";

const job = {
  id: "job-calendar-e2e",
  title: "Frontend Engineer",
  company: "Acme",
  status: "saved",
};

test.describe("Calendar coverage", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/opportunities", async (route) => {
      await route.fulfill({ json: { jobs: [job] } });
    });
    await page.route("**/api/reminders", async (route) => {
      if (route.request().method() === "POST") {
        const body = route.request().postDataJSON();
        await route.fulfill({
          json: {
            reminder: {
              id: "reminder-e2e",
              completed: false,
              ...body,
            },
          },
        });
        return;
      }

      await route.fulfill({ json: { reminders: [] } });
    });
    await page.route("**/api/calendar/feed-url?type=all", async (route) => {
      await route.fulfill({
        json: {
          feedUrl: "https://example.test/calendar.ics",
          webcalUrl: "webcal://example.test/calendar.ics",
        },
      });
    });
    await page.route("**/api/google/auth", async (route) => {
      await route.fulfill({ json: { connected: false } });
    });

    await prepareAppPage(page, "/en/calendar");
  });

  test("renders calendar layout and empty upcoming state", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Calendar" })).toBeVisible();
    await expect(page.getByText("Upcoming Events")).toBeVisible();
    await expect(page.getByText("No upcoming events")).toBeVisible();
  });

  test("navigates months", async ({ page }) => {
    const monthHeading = page.locator("h2").first();
    const initial = await monthHeading.textContent();

    await page.getByRole("button", { name: /next month/i }).click();
    await expect(monthHeading).not.toHaveText(initial ?? "");
    await page.getByRole("button", { name: /previous month/i }).click();
    await expect(monthHeading).toHaveText(initial ?? "");
  });

  test("opens, cancels, and saves a reminder event", async ({ page }) => {
    await page.getByRole("button", { name: /create event/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: /^cancel$/i }).click();
    await expect(page.getByRole("dialog")).not.toBeVisible();

    await page.getByRole("button", { name: /create event/i }).click();
    await page.getByLabel("Title *").fill("Follow up with Acme");
    await page.getByLabel("Job *").selectOption(job.id);
    await page.getByLabel("Date *").fill("2026-05-20");
    await page.getByRole("button", { name: /^create event$/i }).click();

    await expect(page.getByRole("dialog")).not.toBeVisible();
    await expect(page.getByText("Follow up with Acme")).toBeVisible();
  });

  test("opens the subscribe dialog", async ({ page }) => {
    await page.getByRole("button", { name: /subscribe/i }).click();
    await expect(
      page.getByRole("heading", { name: "Subscribe to Calendar" }),
    ).toBeVisible();
    await expect(
      page.locator('input[value="https://example.test/calendar.ics"]'),
    ).toBeVisible();
  });
});
