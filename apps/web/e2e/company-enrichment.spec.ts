import { expect, test } from "@playwright/test";

const jobId = "74511a9001a12005faa252c4";

test.describe("company enrichment dossier", () => {
  test("shows the unified card grid with GitHub, news, refresh, and quick links", async ({
    page,
  }) => {
    let refreshCount = 0;

    await page.route(`**/api/opportunities/${jobId}`, async (route) => {
      await route.fulfill({
        json: {
          job: {
            id: jobId,
            title: "Member of Technical Staff",
            company: "Anthropic",
            url: "https://anthropic.com/careers",
            status: "saved",
          },
        },
      });
    });

    await page.route(`**/api/companies/${jobId}/enrich**`, async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({ json: { snapshot: null, enrichedAt: null } });
        return;
      }

      refreshCount += 1;
      await route.fulfill({
        json: {
          snapshot: {
            version: 1,
            github: {
              ok: true,
              data: {
                org: "anthropics",
                resolvedSlug: "anthropics",
                url: "https://github.com/anthropics",
                totalStars: 42,
                publicRepos: 2,
                followers: 100,
                topLanguages: ["Python", "TypeScript"],
                recentRepos: [
                  {
                    name: "courses",
                    url: "https://github.com/anthropics/courses",
                    stars: 42,
                    description: "Educational material",
                  },
                ],
              },
            },
            news: {
              ok: true,
              data: {
                headlines: [
                  {
                    title: "Anthropic launches new model",
                    link: "https://news.example/anthropic",
                    source: "Example News",
                  },
                ],
              },
            },
            levels: { ok: false, error: "not_found" },
            blog: { ok: false, error: "not_found" },
            hn: { ok: true, data: { stories: [] } },
            enrichedAt: "2026-05-10T00:00:00.000Z",
          },
          enrichedAt: "2026-05-10T00:00:00.000Z",
          fromCache: false,
        },
      });
    });

    await page.goto(`/opportunities/${jobId}/research`);

    await expect(
      page.getByRole("heading", { name: "Anthropic" }),
    ).toBeVisible();
    await expect(page.getByText("Public research dossier")).toBeVisible();
    await expect(page.getByRole("heading", { name: "GitHub" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "News" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Levels" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Eng Blog" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "HN" })).toBeVisible();
    await expect(page.getByText("Anthropic launches new model")).toBeVisible();
    await expect(page.getByText("courses")).toBeVisible();
    await expect(page.getByText("Quick Research Links")).toBeVisible();
    await expect(page.getByRole("link", { name: /LinkedIn/ })).toBeVisible();

    await page.getByRole("button", { name: /Refresh/ }).click();
    await expect.poll(() => refreshCount).toBeGreaterThanOrEqual(2);
  });
});
