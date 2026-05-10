import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";
import path from "path";
import { navigateToBank } from "./utils/test-helpers";

const TEST_PDF = path.join(__dirname, "fixtures", "test-resume.pdf");

async function ensureBankContent(page: Page): Promise<void> {
  const emptyState = page.getByText(/start with your resume|no documents yet/i);

  if (await emptyState.isVisible({ timeout: 2000 }).catch(() => false)) {
    const uploadResponse = page.waitForResponse(
      (response) =>
        response.url().includes("/api/upload") &&
        response.request().method() === "POST" &&
        response.status() === 200,
    );

    await page.locator("input[type='file']").setInputFiles(TEST_PDF);
    await uploadResponse;
    await page.getByRole("button", { name: /^upload$/i }).waitFor({
      state: "visible",
      timeout: 30000,
    });

    const doneButton = page.getByRole("button", { name: /^done$/i });
    if (await doneButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await doneButton.click();
    }
  }

  await expect(
    page.getByPlaceholder(/search your career profile/i),
  ).toBeVisible();
}

async function getMainScrollMetrics(page: Page) {
  return page.locator("main#main-content").evaluate((main) => ({
    scrollTop: main.scrollTop,
    scrollHeight: main.scrollHeight,
    clientHeight: main.clientHeight,
  }));
}

test.describe("Bank Page - Vertical Scroll", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 500 });
    await navigateToBank(page);
    await ensureBankContent(page);
  });

  test("main content scrolls vertically with mouse wheel", async ({ page }) => {
    const before = await getMainScrollMetrics(page);
    expect(before.scrollHeight).toBeGreaterThan(before.clientHeight);

    await page.mouse.move(640, 360);
    await page.mouse.wheel(0, 700);
    await expect
      .poll(async () => (await getMainScrollMetrics(page)).scrollTop)
      .toBeGreaterThan(0);
  });

  test("main content scrolls vertically with keyboard PageDown", async ({
    page,
  }) => {
    const main = page.locator("main#main-content");
    const before = await getMainScrollMetrics(page);
    expect(before.scrollHeight).toBeGreaterThan(before.clientHeight);

    await main.focus();
    await page.keyboard.press("PageDown");

    await expect
      .poll(async () => (await getMainScrollMetrics(page)).scrollTop)
      .toBeGreaterThan(0);
  });
});
