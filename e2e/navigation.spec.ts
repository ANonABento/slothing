import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test.beforeEach(async ({ page }) => {
    // Skip onboarding for navigation tests
    await page.goto("/dashboard");
    await page.evaluate(() => {
      localStorage.setItem("get_me_job_onboarding_completed", "true");
    });
  });

  test("should display sidebar with all navigation items", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    // Get sidebar navigation
    const sidebar = page.locator("aside");

    // Check main navigation items are visible in sidebar
    await expect(sidebar.getByRole("link", { name: /Dashboard/i })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: /Upload/i })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: /Profile/i })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: /Documents/i })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: /Jobs/i })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: /Interview/i })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: /Analytics/i })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: /Settings/i })).toBeVisible();
  });

  test("should navigate to Dashboard", async ({ page }) => {
    await page.goto("/jobs");
    await page.waitForLoadState("networkidle");
    const sidebar = page.locator("aside");
    await sidebar.getByRole("link", { name: /Dashboard/i }).click();
    await expect(page).toHaveURL("/dashboard");
  });

  test("should navigate to Upload page", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");
    const sidebar = page.locator("aside");
    await sidebar.getByRole("link", { name: /Upload/i }).click();
    await expect(page).toHaveURL("/upload");
  });

  test("should navigate to Profile page", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");
    const sidebar = page.locator("aside");
    await sidebar.getByRole("link", { name: /Profile/i }).click();
    await expect(page).toHaveURL("/profile");
  });

  test("should navigate to Jobs page", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");
    const sidebar = page.locator("aside");
    await sidebar.getByRole("link", { name: /Jobs/i }).click();
    await expect(page).toHaveURL("/jobs");
  });

  test("should navigate to Interview page", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");
    const sidebar = page.locator("aside");
    await sidebar.getByRole("link", { name: /Interview/i }).click();
    await expect(page).toHaveURL("/interview");
  });

  test("should navigate to Analytics page", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");
    const sidebar = page.locator("aside");
    await sidebar.getByRole("link", { name: /Analytics/i }).click();
    await expect(page).toHaveURL("/analytics");
  });

  test("should navigate to Settings page", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");
    const sidebar = page.locator("aside");
    await sidebar.getByRole("link", { name: /Settings/i }).click();
    await expect(page).toHaveURL("/settings");
  });

  test("should highlight active navigation item", async ({ page }) => {
    await page.goto("/jobs");
    await page.waitForLoadState("networkidle");
    const sidebar = page.locator("aside");
    const activeLink = sidebar.getByRole("link", { name: /Jobs/i });
    await expect(activeLink).toHaveClass(/gradient-bg/);
  });

  test("should show app logo in sidebar", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");
    const sidebar = page.locator("aside");
    await expect(sidebar.getByText("Get Me Job")).toBeVisible();
  });
});

test.describe("Keyboard Shortcuts", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard");
    await page.evaluate(() => {
      localStorage.setItem("get_me_job_onboarding_completed", "true");
    });
  });

  test("should open keyboard shortcuts help with ?", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");
    await page.keyboard.press("Shift+?");
    // Use heading specifically
    await expect(page.getByRole("heading", { name: "Keyboard Shortcuts" })).toBeVisible();
  });

  test("should navigate with keyboard shortcuts", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    // Press 'j' to go to Jobs
    await page.keyboard.press("j");
    await expect(page).toHaveURL("/jobs");
    await page.waitForLoadState("networkidle");

    // Press 'p' to go to Profile (from jobs page)
    await page.keyboard.press("p");
    await expect(page).toHaveURL("/profile");
    await page.waitForLoadState("networkidle");

    // Press 's' to go to Settings
    await page.keyboard.press("s");
    await expect(page).toHaveURL("/settings");
  });

  test("should close keyboard shortcuts dialog with Escape", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");
    await page.keyboard.press("Shift+?");
    await expect(page.getByRole("heading", { name: "Keyboard Shortcuts" })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("heading", { name: "Keyboard Shortcuts" })).not.toBeVisible();
  });
});
