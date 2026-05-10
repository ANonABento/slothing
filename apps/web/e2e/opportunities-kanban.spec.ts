import { test, expect } from "@playwright/test";
import { prepareAppPage } from "./utils/test-helpers";

test.skip(
  true,
  "Requires an authenticated Clerk test fixture and seeded app data.",
);

test.describe("Opportunities Kanban lanes", () => {
  test("persists configured lane visibility", async ({ page }) => {
    await prepareAppPage(page, "/opportunities");

    await page.getByRole("button", { name: /kanban/i }).click();
    const board = page.getByRole("region", {
      name: /opportunity kanban board/i,
    });
    await expect(board).toBeVisible();
    await expect(board.locator("section")).toHaveCount(6);
    await expect(page.getByText("Member of Technical Staff")).toBeVisible();

    await prepareAppPage(page, "/settings");
    await page.getByRole("button", { name: "Pending" }).click();

    await prepareAppPage(page, "/opportunities");
    await page.getByRole("button", { name: /kanban/i }).click();
    await expect(
      page.getByRole("region", { name: "Pending opportunities" }),
    ).not.toBeVisible();
    await expect(board.locator("section")).toHaveCount(5);

    const hiddenLanePill = page.getByRole("button", {
      name: /in hidden lanes/i,
    });
    if (await hiddenLanePill.isVisible().catch(() => false)) {
      await hiddenLanePill.click();
      await page.getByRole("button", { name: "Show" }).first().click();
      await expect(board.locator("section")).toHaveCount(6);
    }
  });
});
