import { expect, test } from "@playwright/test";

test.skip(
  true,
  "Requires an authenticated Clerk test fixture and seeded app data.",
);

test.describe("company enrichment dossier", () => {
  test("shows GitHub and news data on the Research tab", async ({ page }) => {
    await page.route("**/api.github.com/**", async (route) => {
      if (route.request().url().includes("/repos")) {
        await route.fulfill({
          json: [
            {
              name: "web",
              html_url: "https://github.com/acme/web",
              stargazers_count: 12,
              language: "TypeScript",
              description: "Frontend",
              pushed_at: "2026-05-01T00:00:00Z",
            },
          ],
        });
        return;
      }
      await route.fulfill({
        json: {
          login: "acme",
          html_url: "https://github.com/acme",
          public_repos: 1,
          followers: 3,
        },
      });
    });
    await page.route("**/news.google.com/**", async (route) => {
      await route.fulfill({
        contentType: "application/rss+xml",
        body: "<rss><channel><item><title>Acme raises seed</title><link>https://news.example/acme</link><source>Example</source></item></channel></rss>",
      });
    });
    await page.route("**/hn.algolia.com/**", async (route) => {
      await route.fulfill({ json: { hits: [] } });
    });
    await page.route("**/levels.fyi/**", async (route) => {
      await route.fulfill({ status: 404 });
    });

    await page.goto("/opportunities/job-1/research");

    await expect(page.getByText("Public research dossier")).toBeVisible();
    await expect(page.getByText("Acme raises seed")).toBeVisible();
    await expect(page.getByText("web")).toBeVisible();
  });
});
