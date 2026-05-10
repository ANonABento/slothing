import { expect, test } from "@playwright/test";

test.describe("bank progressive rendering", () => {
  test("filters are visible before entries finish loading", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem("get_me_job_onboarding_completed", "true");
    });

    await page.route("**/api/bank?**", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      await route.fulfill({
        json: {
          entries: [
            {
              id: "bank-entry-1",
              userId: "e2e-user",
              category: "experience",
              content: { title: "Engineer", company: "Acme" },
              confidenceScore: 1,
              createdAt: new Date().toISOString(),
            },
          ],
        },
      });
    });

    await page.goto("/en/bank");

    await expect(
      page.getByRole("heading", { name: "Documents" }),
    ).toBeVisible();
    await expect(page.getByTestId("bank-search-filters")).toBeVisible();
    await expect(page.getByTestId("bank-entries")).toBeHidden();
    await expect(page.getByTestId("bank-entries")).toBeVisible();
  });
});
