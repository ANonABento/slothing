import { expect, test } from "@playwright/test";
import { prepareAppPage } from "./utils/test-helpers";

test.describe("Interview coverage", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/opportunities", async (route) => {
      await route.fulfill({ json: { jobs: [] } });
    });
    await page.route("**/api/interview/sessions", async (route) => {
      await route.fulfill({ json: { sessions: [] } });
    });

    await prepareAppPage(page, "/interview");
  });

  test("renders the interview prep empty state", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Interview Preparation" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "No Opportunities to Practice For" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /add an opportunity/i }),
    ).toHaveAttribute("href", "/opportunities");
  });

  test("opens and closes quick practice from a category tile", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /behavioral/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /practice behavioral/i }),
    ).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });

  test("shows quick practice controls without starting LLM generation", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /technical/i }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByText("Category")).toBeVisible();
    await expect(dialog.getByText("Questions")).toBeVisible();
    await expect(dialog.getByText("Difficulty")).toBeVisible();
    await expect(
      dialog.getByRole("button", { name: /^start$/i }),
    ).toBeEnabled();
  });
});
