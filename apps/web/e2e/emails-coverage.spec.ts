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

    await prepareAppPage(page, "/en/emails");
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

  test("warns when a display-name recipient was sent recently", async ({
    page,
  }) => {
    await page.route("**/api/email/sends", async (route) => {
      await route.fulfill({
        json: {
          sends: [
            {
              id: "send-1",
              type: "cold_outreach",
              recipient: "john@acme.com",
              subject: "Hi",
              body: "Body",
              status: "sent",
              sentAt: new Date(
                Date.now() - 2 * 24 * 60 * 60 * 1000,
              ).toISOString(),
            },
          ],
        },
      });
    });
    await page.route("**/api/email/generate", async (route) => {
      await route.fulfill({
        json: { email: { subject: "Subject", body: "Body" } },
      });
    });

    await page.reload();

    await page.getByRole("button", { name: /cold outreach/i }).click();
    await page.getByPlaceholder("e.g., Linear").fill("Acme");
    await page.getByRole("button", { name: /generate email/i }).click();
    await page
      .getByPlaceholder("recipient@example.com")
      .fill("John Doe <john@acme.com>");

    await expect(
      page.getByText(/already sent this template type/i),
    ).toBeVisible();
  });
});
