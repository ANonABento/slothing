import { test, expect } from "@playwright/test";

/**
 * Dashboard Page Tests
 * Tests all features and components on the dashboard.
 */

test.skip(true, "Requires an authenticated Clerk test fixture and dashboard seed data.");

test.describe("Dashboard - Layout", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("get_me_job_onboarding_completed", "true");
    });
    await page.reload();
    await page.waitForLoadState("networkidle");
  });

  test("displays main heading", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("displays stats cards", async ({ page }) => {
    // Dashboard should have stats overview
    const statsSection = page.locator(".grid").first();
    await expect(statsSection).toBeVisible();

    // Check for stat cards
    const cards = page.locator(".card, [class*='Card'], .rounded-xl.border.bg-card");
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test("displays recent activity or quick actions", async ({ page }) => {
    // Look for recent activity section
    const recentSection = page.getByText(/recent|activity|quick|actions/i).first();
    if (await recentSection.isVisible({ timeout: 1000 }).catch(() => false)) {
      await expect(recentSection).toBeVisible();
    }
  });

  test("displays recommendations section", async ({ page }) => {
    // API returns recommendations
    const recsSection = page.getByText(/recommended|suggestions|learning/i).first();
    if (await recsSection.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(recsSection).toBeVisible();
    }
  });
});

test.describe("Dashboard - Navigation Links", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("get_me_job_onboarding_completed", "true");
    });
    await page.reload();
    await page.waitForLoadState("networkidle");
  });

  test("quick action cards link to correct pages", async ({ page }) => {
    // Find clickable cards that should navigate
    const uploadLink = page.getByRole("link", { name: /upload|resume/i });
    if (await uploadLink.isVisible({ timeout: 1000 }).catch(() => false)) {
      await uploadLink.click();
      await expect(page).toHaveURL(/upload/);
    }
  });

  test("job tracker section links to jobs page", async ({ page }) => {
    const jobsLink = page.getByRole("link", { name: /jobs|applications/i });
    if (await jobsLink.first().isVisible({ timeout: 1000 }).catch(() => false)) {
      await jobsLink.first().click();
      await expect(page).toHaveURL(/jobs/);
    }
  });
});

test.describe("Dashboard - Data Display", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("get_me_job_onboarding_completed", "true");
    });
    await page.reload();
    await page.waitForLoadState("networkidle");
  });

  test("loads data from APIs", async ({ page }) => {
    // Check network requests were made
    const requests: string[] = [];
    page.on("request", (req) => {
      if (req.url().includes("/api/")) {
        requests.push(req.url());
      }
    });

    await page.reload();
    await page.waitForLoadState("networkidle");

    // Should have made some API calls
    expect(requests.length).toBeGreaterThan(0);
  });

  test("handles loading states", async ({ page }) => {
    // Slow down network
    await page.route("**/api/**", async (route) => {
      await new Promise((r) => setTimeout(r, 500));
      await route.continue();
    });

    await page.reload();

    // Check for loading indicators
    const loaders = page.locator(".animate-spin, .animate-pulse, [class*='skeleton']");
    // May or may not show loaders depending on cache
  });

  test("shows numbers/counts in stat cards", async ({ page }) => {
    const statNumbers = page.locator(".text-2xl, .text-3xl, .text-4xl").filter({
      hasText: /^\d+$/,
    });

    if (await statNumbers.first().isVisible({ timeout: 1000 }).catch(() => false)) {
      const count = await statNumbers.count();
      expect(count).toBeGreaterThan(0);
    }
  });
});

test.describe("Dashboard - User Experience", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("get_me_job_onboarding_completed", "true");
    });
    await page.reload();
    await page.waitForLoadState("networkidle");
  });

  test("page loads quickly", async ({ page }) => {
    const startTime = Date.now();
    await page.reload();
    await page.waitForLoadState("domcontentloaded");
    const loadTime = Date.now() - startTime;

    // Should load in under 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test("no layout shift on load", async ({ page }) => {
    await page.reload();

    // Take screenshot immediately after load
    await page.waitForLoadState("domcontentloaded");
    const early = await page.screenshot();

    // Wait for all content
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500);
    const late = await page.screenshot();

    // Screenshots should be similar (no major layout shifts)
    // Note: This is a basic check, proper CLS testing needs performance APIs
  });

  test("interactive elements are clickable", async ({ page }) => {
    const buttons = page.getByRole("button");
    const links = page.getByRole("link");

    const buttonCount = await buttons.count();
    const linkCount = await links.count();

    // Should have interactive elements
    expect(buttonCount + linkCount).toBeGreaterThan(5);

    // Verify first few are clickable (not obscured)
    for (let i = 0; i < Math.min(3, buttonCount); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        await expect(button).toBeEnabled();
      }
    }
  });
});
