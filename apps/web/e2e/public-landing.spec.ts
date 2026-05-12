import { expect, test } from "@playwright/test";

test.describe("Landing page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en");
    await page.waitForLoadState("networkidle");
  });

  test("renders without error states @smoke", async ({ page }) => {
    await expect(page.locator("h1:has-text('500')")).not.toBeVisible();
    await expect(page.locator("h1:has-text('404')")).not.toBeVisible();
    await expect(
      page.getByText(/something went wrong|page not found/i),
    ).not.toBeVisible();
  });

  test("hero heading is visible", async ({ page }) => {
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();
    await expect(h1).toContainText("You");
  });

  test("hero primary CTA links to ATS scanner", async ({ page }) => {
    const ctaLink = page.getByRole("link", {
      name: /Scan your resume free/i,
    });
    await expect(ctaLink).toBeVisible();

    const href = await ctaLink.getAttribute("href");
    expect(href).toMatch(/ats-scanner/);
  });

  test("hero secondary CTA links to sign-in", async ({ page }) => {
    const createAccountLink = page.getByRole("link", {
      name: /Create a free account/i,
    });
    await expect(createAccountLink).toBeVisible();

    const href = await createAccountLink.getAttribute("href");
    expect(href).toMatch(/sign-in/);
  });

  test("hero social proof section is rendered", async ({ page }) => {
    const socialProof = page.locator('[data-testid="hero-social-proof"]');
    await expect(socialProof).toBeVisible();
  });

  test("features section is present with section id", async ({ page }) => {
    const featuresSection = page.locator("section#features");
    await expect(featuresSection).toBeVisible();
    await expect(featuresSection.getByText("Career profile")).toBeVisible();
    await expect(featuresSection.getByText("ATS Scanner")).toBeVisible();
  });

  test("how-it-works section is present", async ({ page }) => {
    const howItWorksSection = page.locator("section#how-it-works");
    await expect(howItWorksSection).toBeVisible();

    // Upload / Bank / Build steps
    await expect(howItWorksSection.getByText("Upload")).toBeVisible();
    await expect(howItWorksSection.getByText("Bank")).toBeVisible();
    await expect(howItWorksSection.getByText("Build")).toBeVisible();
  });

  test("page includes JSON-LD WebApplication structured data", async ({
    page,
  }) => {
    const jsonLdText = await page
      .locator('script[type="application/ld+json"]')
      .first()
      .textContent();
    expect(jsonLdText).toBeTruthy();

    const data = JSON.parse(jsonLdText!);
    expect(data["@type"]).toBe("WebApplication");
    expect(data.name).toBe("Slothing");
  });

  test("page title contains Slothing", async ({ page }) => {
    await expect(page).toHaveTitle(/Slothing/i);
  });
});

test.describe("Landing page – /en redirect", () => {
  test("root / redirects or renders the landing page", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Either redirected to /en or rendered directly — must not error
    await expect(page.locator("h1:has-text('500')")).not.toBeVisible();
    await expect(page.locator("h1:has-text('404')")).not.toBeVisible();
  });
});
