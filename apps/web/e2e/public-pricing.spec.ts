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
      page.getByRole("heading", { name: /Pricing for every job search pace/i }),
    ).toBeVisible();
  });

  test("shows all three pricing tier cards", async ({ page }) => {
    await expect(page.getByRole("article")).toHaveCount(3);
    await expect(
      page.getByRole("heading", { name: "Free", level: 2 }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Pro", level: 2 }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Student", level: 2 }),
    ).toBeVisible();
  });

  test("Free tier Start free CTA links to sign-in", async ({ page }) => {
    const startFreeLink = page.getByRole("link", { name: /Start free/i });
    await expect(startFreeLink).toBeVisible();

    const href = await startFreeLink.getAttribute("href");
    expect(href).toMatch(/sign-in/);
    expect(href).toMatch(/callbackUrl/);
  });

  test("Pro tier waitlist CTA links to email", async ({ page }) => {
    const proCtaLink = page.locator('[data-pro-cta="waitlist"]');
    await expect(proCtaLink).toBeVisible();

    const href = await proCtaLink.getAttribute("href");
    expect(href).toMatch(/^mailto:waitlist@slothing\.work/);
  });

  test("Student tier CTA links to student verification email", async ({
    page,
  }) => {
    const studentLink = page.getByRole("link", {
      name: /Email us to verify student status/i,
    });
    await expect(studentLink).toBeVisible();

    const href = await studentLink.getAttribute("href");
    expect(href).toMatch(/^mailto:students@slothing\.work/);
  });

  test("plan comparison table renders with correct column headers", async ({
    page,
  }) => {
    await expect(
      page.getByRole("heading", { name: /Compare plans/i }),
    ).toBeVisible();

    const table = page.getByRole("table");
    await expect(table).toBeVisible();

    await expect(table.getByRole("columnheader", { name: "Free" })).toBeVisible();
    await expect(table.getByRole("columnheader", { name: "Pro" })).toBeVisible();
    await expect(
      table.getByRole("columnheader", { name: "Student" }),
    ).toBeVisible();
  });

  test("FAQ section renders plan questions", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /Plan questions/i }),
    ).toBeVisible();
    await expect(
      page.getByText(/Do I need a credit card for Free/i),
    ).toBeVisible();
    await expect(page.getByText(/Can I buy Pro today/i)).toBeVisible();
  });

  test("Pro card has Most flexible badge", async ({ page }) => {
    await expect(page.getByText(/Most flexible/i)).toBeVisible();
  });

  test("Free tier lists ATS scanner as a feature", async ({ page }) => {
    await expect(page.getByText("Free ATS scanner")).toBeVisible();
  });
});
