import { expect, test } from "@playwright/test";

test.describe("Landing page CSS bundle", () => {
  test("advertises stylesheet links that return CSS", async ({ page }) => {
    await page.goto("/");

    const stylesheetHrefs = await page.$$eval(
      'link[rel="stylesheet"]',
      (links) =>
        links.map((link) => (link as HTMLLinkElement).href).filter(Boolean),
    );
    const nextStylesheetHrefs = stylesheetHrefs.filter((href) =>
      new URL(href).pathname.startsWith("/_next/static/css/"),
    );

    expect(nextStylesheetHrefs).not.toHaveLength(0);

    for (const href of nextStylesheetHrefs) {
      const response = await page.request.get(href);
      const body = await response.text();
      const contentType = response.headers()["content-type"] ?? "";

      expect(response.status(), `${href} should return 200`).toBe(200);
      expect(contentType, `${href} should be served as CSS`).toContain(
        "text/css",
      );
      expect(body.length, `${href} should not be empty`).toBeGreaterThan(100);
      expect(body, `${href} should not be an HTML error page`).not.toMatch(
        /<!doctype html|<html/i,
      );
      expect(body, `${href} should contain compiled CSS rules`).toMatch(
        /--surface-paper|--background|box-sizing:border-box|\.gradient-text/,
      );
    }
  });

  test("applies Tailwind typography to the landing hero", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const heading = page.getByRole("heading", { level: 1 }).first();
    await expect(heading).toBeVisible();

    const fontSize = await heading.evaluate((element) =>
      Number.parseFloat(window.getComputedStyle(element).fontSize),
    );

    expect(fontSize).toBeGreaterThanOrEqual(48);
  });
});
