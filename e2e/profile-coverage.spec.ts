import { expect, test } from "@playwright/test";
import { ensureSidebarOpen, prepareAppPage } from "./utils/test-helpers";

const emptyProfile = {
  id: "profile-e2e",
  name: "",
  email: "",
  headline: "",
  location: "",
  summary: "",
  phone: "",
  linkedin: "",
  github: "",
  website: "",
};

test.describe("Profile coverage", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/profile", async (route) => {
      if (route.request().method() === "PUT") {
        const update = route.request().postDataJSON();
        await route.fulfill({
          json: { profile: { ...emptyProfile, ...update } },
        });
        return;
      }

      await route.fulfill({ json: { profile: emptyProfile } });
    });

    await prepareAppPage(page, "/profile");
  });

  test("renders the profile form shell", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Profile" })).toBeVisible();
    await expect(page.getByLabel("Full name")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /save changes/i }),
    ).toBeDisabled();
  });

  test("switches between profile sections", async ({ page }) => {
    const preferences = page.getByRole("tab", { name: /preferences/i });
    const privacy = page.getByRole("tab", { name: /privacy/i });

    await preferences.click();
    await expect(preferences).toHaveAttribute("aria-selected", "true");
    await expect(page.getByText("Target Salary Range")).toBeVisible();

    await privacy.click();
    await expect(privacy).toHaveAttribute("aria-selected", "true");
    await expect(page.getByText("Open to recruiter outreach")).toBeVisible();
  });

  test("enables save after edits and can discard", async ({ page }) => {
    const nameInput = page.getByLabel("Full name");
    const saveButton = page.getByRole("button", { name: /save changes/i });

    await nameInput.fill("Taylor Test");
    await expect(saveButton).toBeEnabled();
    await page.getByRole("button", { name: /discard/i }).click();
    await expect(nameInput).toHaveValue("");
    await expect(saveButton).toBeDisabled();
  });

  test("saves deterministic profile changes without LLM calls", async ({
    page,
  }) => {
    await page.getByLabel("Full name").fill("Taylor Test");
    await page.getByRole("button", { name: /save changes/i }).click();
    await expect(page.getByText("Changes saved")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Taylor Test" }),
    ).toBeVisible();
  });

  test("navigates to profile from the sidebar", async ({ page }) => {
    await prepareAppPage(page, "/dashboard");
    await ensureSidebarOpen(page);
    await page
      .locator("aside")
      .getByRole("link", { name: /profile/i })
      .click();
    await expect(page).toHaveURL("/profile");
  });
});
