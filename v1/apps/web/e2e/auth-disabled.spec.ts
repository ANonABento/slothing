import { expect, test } from "@playwright/test";

const AUTH_CONFIGURED =
  Boolean(process.env.GOOGLE_CLIENT_ID) &&
  Boolean(process.env.GOOGLE_CLIENT_SECRET) &&
  Boolean(process.env.NEXTAUTH_SECRET);

test.describe("disabled auth sign-in", () => {
  test("renders an explicit disabled state instead of redirecting", async ({
    page,
    request,
  }) => {
    test.skip(AUTH_CONFIGURED, "Auth is configured for this Playwright run.");

    const response = await request.get("/en/sign-in", { maxRedirects: 0 });
    expect(response.status()).toBe(200);
    expect(response.headers().location).toBeUndefined();

    await page.goto("/en/sign-in");
    await expect(
      page.getByRole("heading", {
        name: "Sign-in is disabled in this environment",
      }),
    ).toBeVisible();
    await expect(page.getByText("GOOGLE_CLIENT_ID")).toBeVisible();
    await expect(page.getByText("GOOGLE_CLIENT_SECRET")).toBeVisible();
    await expect(page.getByText("NEXTAUTH_SECRET")).toBeVisible();
    await expect(page.getByText(".env.example")).toBeVisible();
  });

  test("disabled auth page has a Back to home link", async ({ page }) => {
    test.skip(AUTH_CONFIGURED, "Auth is configured for this Playwright run.");

    await page.goto("/en/sign-in");

    const backLink = page.getByRole("link", { name: /Back to home/i });
    await expect(backLink).toBeVisible();

    const href = await backLink.getAttribute("href");
    expect(href).toBe("/");
  });

  test("disabled auth page shows missing env var names", async ({ page }) => {
    test.skip(AUTH_CONFIGURED, "Auth is configured for this Playwright run.");

    await page.goto("/en/sign-in");

    // All three missing keys should be visible as <code> elements
    for (const envVar of [
      "GOOGLE_CLIENT_ID",
      "GOOGLE_CLIENT_SECRET",
      "NEXTAUTH_SECRET",
    ]) {
      await expect(page.locator(`code:has-text("${envVar}")`)).toBeVisible();
    }
  });

  test("disabled auth page mentions .env.example", async ({ page }) => {
    test.skip(AUTH_CONFIGURED, "Auth is configured for this Playwright run.");

    await page.goto("/en/sign-in");
    await expect(page.locator('code:has-text(".env.example")')).toBeVisible();
  });

  test("disabled auth page Slothing brand link is visible", async ({
    page,
  }) => {
    test.skip(AUTH_CONFIGURED, "Auth is configured for this Playwright run.");

    await page.goto("/en/sign-in");

    // Brand link with Slothing name at top of card
    await expect(page.getByText("Slothing").first()).toBeVisible();
  });
});
