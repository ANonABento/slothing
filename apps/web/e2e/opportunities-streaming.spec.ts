import { expect, test } from "@playwright/test";

test.describe("opportunities progressive rendering", () => {
  test("controls are visible before opportunities finish loading", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem("get_me_job_onboarding_completed", "true");
      localStorage.removeItem("taida-opportunities");
    });

    await page.route("**/api/opportunities", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      await route.fulfill({
        json: {
          opportunities: [
            {
              id: "opportunity-1",
              type: "job",
              title: "Frontend Engineer",
              company: "Acme",
              summary: "Build thoughtful interfaces.",
              status: "pending",
              source: "Manual",
              tags: ["remote"],
              techStack: ["React"],
              scrapedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        },
      });
    });

    await page.goto("/en/opportunities");

    await expect(
      page.getByRole("heading", { name: /opportunities/i }),
    ).toBeVisible();
    await expect(page.getByTestId("opportunities-filters")).toBeVisible();
    await expect(page.getByTestId("opportunities-list")).toBeHidden();
    await expect(page.getByTestId("opportunities-list")).toBeVisible();
  });
});
