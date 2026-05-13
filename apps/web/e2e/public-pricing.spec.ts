import { expect, test } from "@playwright/test";

test.describe("Pricing page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/pricing");
    await page.waitForLoadState("networkidle");
  });

  test("renders without error states @smoke", async ({ page }) => {
    await expect(page.locator("h1:has-text('500')")).not.toBeVisible();
    await expect(page.locator("h1:has-text('404')")).not.toBeVisible();
    await expect(
      page.getByText(/something went wrong|page not found/i),
    ).not.toBeVisible();
  });

  test("page heading is visible @smoke", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /Pay for the weeks you need/i }),
    ).toBeVisible();
  });

  test("shows all four pricing tier cards", async ({ page }) => {
    await expect(page.getByRole("article")).toHaveCount(4);
    await expect(
      page.getByRole("heading", { name: "Self-host", level: 2 }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Hosted Free", level: 2 }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Weekly", level: 2 }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Monthly", level: 2 }),
    ).toBeVisible();
  });

  test("Hosted Free CTA links to sign-in", async ({ page }) => {
    const startFreeLink = page.getByRole("link", {
      name: /Start with your key/i,
    });
    await expect(startFreeLink).toBeVisible();

    const href = await startFreeLink.getAttribute("href");
    expect(href).toMatch(/sign-in/);
    expect(href).toMatch(/callbackUrl/);
  });

  test("paid tier CTAs use checkout buttons", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /Start Weekly/i }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Start Monthly/i }).first(),
    ).toBeVisible();
    await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
  });

  test("plan comparison table renders with correct column headers", async ({
    page,
  }) => {
    await expect(
      page.getByRole("heading", { name: /Compare plans/i }),
    ).toBeVisible();

    const table = page.getByRole("table");
    await expect(table).toBeVisible();

    await expect(
      table.getByRole("columnheader", { name: "Self-host" }),
    ).toBeVisible();
    await expect(
      table.getByRole("columnheader", { name: "Hosted Free" }),
    ).toBeVisible();
    await expect(
      table.getByRole("columnheader", { name: "Weekly" }),
    ).toBeVisible();
    await expect(
      table.getByRole("columnheader", { name: "Monthly" }),
    ).toBeVisible();
  });

  test("FAQ section renders plan questions", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /Plan questions/i }),
    ).toBeVisible();
    await expect(
      page.getByText(/Why weekly billing/i),
    ).toBeVisible();
    await expect(page.getByText(/What's BYOK/i)).toBeVisible();
  });

  test("Monthly card has Most popular badge", async ({ page }) => {
    await expect(page.getByText(/Most popular/i)).toBeVisible();
  });

  test("Self-host links to GitHub", async ({ page }) => {
    const selfHostLink = page.getByRole("link", { name: /View on GitHub/i });
    await expect(selfHostLink).toBeVisible();
    expect(await selfHostLink.getAttribute("href")).toBe(
      "https://github.com/ANonABento/slothing",
    );
  });
});
