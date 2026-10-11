import { expect, test } from "@playwright/test";

test.describe("emails progressive rendering", () => {
  test("template form is visible while email counters load", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem("get_me_job_onboarding_completed", "true");
    });

    await page.route("**/api/opportunities", async (route) => {
      await route.fulfill({ json: { jobs: [] } });
    });
    await page.route("**/api/email/drafts", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      await route.fulfill({ json: { drafts: [] } });
    });
    await page.route("**/api/email/sends", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      await route.fulfill({ json: { sends: [] } });
    });

    await page.goto("/en/emails");

    await expect(
      page.getByRole("heading", { name: "Email Templates" }),
    ).toBeVisible();
    await expect(page.getByTestId("emails-template-form")).toBeVisible();
    await expect(
      page.getByTestId("emails-actions").getByText("Drafts (0)"),
    ).toBeHidden();
    await expect(
      page.getByTestId("emails-actions").getByText("Drafts (0)"),
    ).toBeVisible();
  });
});
