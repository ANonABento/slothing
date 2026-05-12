import { expect, test } from "@playwright/test";

test.describe("Marketing navbar – desktop", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/en");
    await page.waitForLoadState("networkidle");
  });

  test("Slothing logo is visible in navbar @smoke", async ({ page }) => {
    const navbar = page.getByRole("banner");
    await expect(navbar.getByText("Slothing")).toBeVisible();
  });

  test("navbar logo links to root", async ({ page }) => {
    const navbar = page.getByRole("banner");
    const logoLink = navbar.getByRole("link", { name: /Slothing/i }).first();
    const href = await logoLink.getAttribute("href");
    expect(href).toMatch(/^\/en(?:\/|$)/);
  });

  test("Pricing nav link is visible and points to /pricing", async ({
    page,
  }) => {
    const navbar = page.getByRole("banner");
    const pricingLink = navbar.getByRole("link", { name: /Pricing/i }).first();
    await expect(pricingLink).toBeVisible();
    const href = await pricingLink.getAttribute("href");
    expect(href).toMatch(/pricing/);
  });

  test("Extension nav link is visible and points to /extension", async ({
    page,
  }) => {
    const navbar = page.getByRole("banner");
    const extensionLink = navbar
      .getByRole("link", { name: /Extension/i })
      .first();
    await expect(extensionLink).toBeVisible();
    const href = await extensionLink.getAttribute("href");
    expect(href).toMatch(/extension/);
  });

  test("Sign In CTA is visible and links to sign-in with callbackUrl", async ({
    page,
  }) => {
    const navbar = page.getByRole("banner");
    const signInLink = navbar.getByRole("link", { name: /Sign in/i }).first();
    await expect(signInLink).toBeVisible();

    const href = await signInLink.getAttribute("href");
    expect(href).toMatch(/sign-in/);
    expect(href).toMatch(/callbackUrl/);
  });

  test("Get Started CTA is visible and links to sign-in", async ({ page }) => {
    const navbar = page.getByRole("banner");
    const getStartedLink = navbar
      .getByRole("link", { name: /Get started/i })
      .first();
    await expect(getStartedLink).toBeVisible();

    const href = await getStartedLink.getAttribute("href");
    expect(href).toMatch(/sign-in/);
  });

  test("navbar becomes scrolled after page scroll", async ({ page }) => {
    const header = page.getByRole("banner");

    // Before scroll: transparent background
    const classBeforeScroll = await header.getAttribute("class");
    expect(classBeforeScroll).toContain("bg-transparent");

    // Scroll past threshold
    await page.evaluate(() => window.scrollTo({ top: 200 }));
    await page.waitForTimeout(400);

    // After scroll: backdrop-blur applied
    const classAfterScroll = await header.getAttribute("class");
    expect(classAfterScroll).toContain("backdrop-blur");
  });
});

test.describe("Marketing navbar – mobile", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/en");
    await page.waitForLoadState("networkidle");
  });

  test("mobile menu button is visible @smoke", async ({ page }) => {
    const menuButton = page.getByRole("button", { name: /Toggle menu/i });
    await expect(menuButton).toBeVisible();
  });

  // getByRole uses the ARIA tree, so display:none elements are excluded.
  // This makes it an accurate check that desktop links aren't accessible before
  // the user opens the hamburger menu.
  test("nav links are not accessible before opening mobile menu", async ({
    page,
  }) => {
    await expect(
      page.getByRole("banner").getByRole("link", { name: /Pricing/i }),
    ).not.toBeVisible();
  });

  test("clicking mobile menu button opens navigation", async ({ page }) => {
    const menuButton = page.getByRole("button", { name: /Toggle menu/i });
    await menuButton.click();

    // Mobile nav renders conditionally — link now enters the ARIA tree
    const header = page.getByRole("banner");
    await expect(
      header.getByRole("link", { name: /Pricing/i }),
    ).toBeVisible();
  });

  test("clicking mobile menu button again closes navigation", async ({
    page,
  }) => {
    const menuButton = page.getByRole("button", { name: /Toggle menu/i });
    await menuButton.click();

    // Verify open
    await expect(
      page.getByRole("banner").getByRole("link", { name: /Pricing/i }),
    ).toBeVisible();

    // Close
    await menuButton.click();
    await expect(
      page.getByRole("banner").getByRole("link", { name: /Pricing/i }),
    ).not.toBeVisible();
  });

  test("mobile nav Sign In CTA links to sign-in", async ({ page }) => {
    const menuButton = page.getByRole("button", { name: /Toggle menu/i });
    await menuButton.click();

    const header = page.getByRole("banner");
    const signInLink = header.getByRole("link", { name: /Sign in/i }).first();
    await expect(signInLink).toBeVisible();
    const href = await signInLink.getAttribute("href");
    expect(href).toMatch(/sign-in/);
  });
});

test.describe("Marketing navbar – pricing page", () => {
  test("navbar is rendered on the pricing page", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/en/pricing");
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("banner").getByText("Slothing")).toBeVisible();
  });
});
