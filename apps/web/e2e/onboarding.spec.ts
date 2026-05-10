import { test, expect, type Page } from "@playwright/test";

const onboardingHeading = (page: Page) =>
  page.getByRole("dialog").locator("h2.text-2xl");

test.describe("Onboarding Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/dashboard");
    await page.evaluate(() => {
      localStorage.removeItem("get_me_job_onboarding_completed");
    });
    await page.reload();
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 5000 });
  });

  test("should show onboarding dialog on first visit", async ({ page }) => {
    await expect(onboardingHeading(page)).toHaveText("Welcome to Slothing");
  });

  test("should navigate through onboarding steps", async ({ page }) => {
    // Step 1: Welcome
    await expect(onboardingHeading(page)).toHaveText("Welcome to Slothing");
    await page.getByRole("button", { name: /I have a resume/i }).click();

    // Step 2: Upload Resume
    await expect(onboardingHeading(page)).toHaveText(/Upload Your Resume/i);
    await page.getByRole("button", { name: /continue/i }).click();

    // Step 3: Review Your Profile
    await expect(onboardingHeading(page)).toHaveText(/Review Your Profile/i);
    await page.getByRole("button", { name: /continue/i }).click();

    // Step 4: Configure AI
    await expect(onboardingHeading(page)).toHaveText(/Configure AI/i);
    await page.getByRole("button", { name: /continue/i }).click();

    // Step 5: All Set (last step)
    await expect(onboardingHeading(page)).toHaveText(/All Set|You're All Set/i);
  });

  test("should allow skipping onboarding", async ({ page }) => {
    await page.getByRole("button", { name: "Skip setup" }).click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });

  test("should close onboarding and persist completion", async ({ page }) => {
    // Navigate through all steps
    await page.getByRole("button", { name: /I have a resume/i }).click();
    for (let i = 0; i < 3; i++) {
      const continueButton = page.getByRole("button", { name: /continue/i });
      if (await continueButton.isVisible({ timeout: 500 }).catch(() => false)) {
        await continueButton.click();
        await page.waitForTimeout(100);
      }
    }

    // Click "Get Started" on the last step
    const getStartedButton = page.getByRole("button", { name: /get started/i });
    if (await getStartedButton.isVisible({ timeout: 500 }).catch(() => false)) {
      await getStartedButton.click();
    }

    // Verify dialog is closed
    await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 2000 });

    // Reload and verify onboarding doesn't show again
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Dialog should not appear after completion
    await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 2000 });
  });

  test("from-scratch path saves seed profile", async ({ page }) => {
    await page
      .getByRole("button", { name: /I'm starting from scratch/i })
      .click();

    await expect(onboardingHeading(page)).toHaveText(
      /Build Your Starter Profile/i,
    );
    await page.getByLabel("Name").fill("Ada Lovelace");
    await page.getByLabel("Email").fill("ada@example.com");
    await page.getByLabel("Target role").fill("Frontend intern");
    await page.getByLabel("Background summary").fill("Building my first role.");
    await page.getByLabel("Top skills").fill("Research, Excel");
    await page
      .getByRole("button", { name: /Add a role, project, or honour/i })
      .click();
    await page.getByLabel("Company / organisation").fill("Campus Cafe");
    await page.getByLabel("Role / title").fill("Barista");
    await page
      .getByLabel("Role highlights")
      .fill("Pulled espresso shots\nTrained 3 new baristas");
    await page.getByLabel("Project name").fill("Community pantry dashboard");
    await page
      .getByLabel("What did you build?")
      .fill("Tracked donations and volunteer shifts.");
    await page
      .getByLabel("Project highlights")
      .fill("Built a filterable tracker\nPresented findings to class");
    await page
      .getByLabel("Honours, awards, leadership")
      .fill("Residence council secretary");
    await page.getByRole("button", { name: /Save and continue/i }).click();

    await expect(onboardingHeading(page)).toHaveText(/Configure AI/i);
    await page.getByRole("button", { name: /Skip setup/i }).click();
    await expect(page.getByRole("dialog")).not.toBeVisible();

    await page.goto("/en/profile");
    await expect(page.getByText("Campus Cafe")).toBeVisible();
    await expect(page.getByText("Community pantry dashboard")).toBeVisible();
  });
});
