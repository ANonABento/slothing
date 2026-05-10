import { expect, test } from "@playwright/test";
import { prepareAppPage } from "./utils/test-helpers";

test.describe("Emails coverage", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/opportunities", async (route) => {
      await route.fulfill({ json: { jobs: [] } });
    });
    await page.route("**/api/email/drafts", async (route) => {
      await route.fulfill({ json: { drafts: [] } });
    });
    await page.route("**/api/email/sends", async (route) => {
      await route.fulfill({ json: { sends: [] } });
    });

    await prepareAppPage(page, "/emails");
  });

  test("renders the email template chooser", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Email Templates" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Choose Template" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /drafts \(0\)/i }),
    ).toBeVisible();
  });

  test("selects a deterministic template and shows customization fields", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /networking/i }).click();

    await expect(
      page.getByRole("heading", { name: "Customize" }),
    ).toBeVisible();
    await expect(page.getByLabel("Target Company")).toBeVisible();
    await expect(page.getByLabel("Connection Name")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /generate email/i }),
    ).toBeEnabled();
    await expect(
      page.getByText("Click 'Generate Email' to create your message"),
    ).toBeVisible();
  });

  test("opens drafts and sent sheets with empty states", async ({ page }) => {
    await page.getByRole("button", { name: /drafts \(0\)/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText(/no saved drafts/i)).toBeVisible();
    await page.keyboard.press("Escape");

    await page.getByRole("button", { name: /sent \(0\)/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText(/no sent emails/i)).toBeVisible();
  });
});
