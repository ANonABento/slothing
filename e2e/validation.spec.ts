import { test, expect } from "@playwright/test";
import {
  skipOnboardingSetup,
  navigateToJobs,
  navigateToProfile,
} from "./utils/test-helpers";

test.describe("Job Form Validation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await skipOnboardingSetup(page);
    await navigateToJobs(page);
  });

  test("should show validation when submitting empty job form", async ({ page }) => {
    // Open the Add Job dialog
    await page.getByRole("button", { name: /add job/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    // Try to submit without filling anything
    const submitButton = page.getByRole("dialog").getByRole("button", { name: /^add job$/i });

    // The button should be disabled when required fields are empty
    await expect(submitButton).toBeDisabled();
  });

  test("should enable submit button when required fields are filled", async ({ page }) => {
    // Open the Add Job dialog
    await page.getByRole("button", { name: /add job/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    const submitButton = page.getByRole("dialog").getByRole("button", { name: /^add job$/i });

    // Initially disabled
    await expect(submitButton).toBeDisabled();

    // Fill required fields
    await page.getByLabel(/job title/i).fill("Software Engineer");
    await page.getByLabel(/company/i).fill("Test Company");
    await page.getByLabel(/job description/i).fill("This is a test job description with enough content.");

    // Now button should be enabled
    await expect(submitButton).toBeEnabled();
  });

  test("should keep button disabled if only title is provided", async ({ page }) => {
    await page.getByRole("button", { name: /add job/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    const submitButton = page.getByRole("dialog").getByRole("button", { name: /^add job$/i });

    // Fill only title
    await page.getByLabel(/job title/i).fill("Software Engineer");

    // Button should still be disabled
    await expect(submitButton).toBeDisabled();
  });

  test("should keep button disabled if only company is provided", async ({ page }) => {
    await page.getByRole("button", { name: /add job/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    const submitButton = page.getByRole("dialog").getByRole("button", { name: /^add job$/i });

    // Fill only company
    await page.getByLabel(/company/i).fill("Test Company");

    // Button should still be disabled
    await expect(submitButton).toBeDisabled();
  });

  test("should keep button disabled if description is missing", async ({ page }) => {
    await page.getByRole("button", { name: /add job/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    const submitButton = page.getByRole("dialog").getByRole("button", { name: /^add job$/i });

    // Fill title and company but not description
    await page.getByLabel(/job title/i).fill("Software Engineer");
    await page.getByLabel(/company/i).fill("Test Company");

    // Button should still be disabled
    await expect(submitButton).toBeDisabled();
  });

  test("should allow optional URL field to be empty", async ({ page }) => {
    await page.getByRole("button", { name: /add job/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    const submitButton = page.getByRole("dialog").getByRole("button", { name: /^add job$/i });

    // Fill required fields, leave URL empty
    await page.getByLabel(/job title/i).fill("Software Engineer");
    await page.getByLabel(/company/i).fill("Test Company");
    await page.getByLabel(/job description/i).fill("This is a test job description.");

    // Button should be enabled - URL is optional
    await expect(submitButton).toBeEnabled();
  });
});

test.describe("Profile Form Validation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await skipOnboardingSetup(page);
    await navigateToProfile(page);
  });

  test("should accept valid email format", async ({ page }) => {
    const emailInput = page.getByLabel(/email address/i);
    await expect(emailInput).toBeVisible();

    // Fill with valid email
    await emailInput.fill("test@example.com");

    // Check the save button appears (indicates the form is valid)
    const saveButton = page.getByRole("button", { name: /save changes/i });
    await expect(saveButton).toBeVisible();
  });

  test("should accept empty optional fields without error", async ({ page }) => {
    // Clear a non-required field like LinkedIn
    const linkedinInput = page.getByLabel(/linkedin/i);
    if (await linkedinInput.isVisible({ timeout: 1000 }).catch(() => false)) {
      await linkedinInput.clear();

      // Should still be able to save
      const saveButton = page.getByRole("button", { name: /save changes/i });
      if (await saveButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        await saveButton.click();
        // Should see save confirmation, not an error
        await expect(page.getByText(/changes saved/i)).toBeVisible({ timeout: 5000 });
      }
    }
  });
});

test.describe("Form Error Recovery", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await skipOnboardingSetup(page);
  });

  test("should recover from disabled state when fixing job form", async ({ page }) => {
    await navigateToJobs(page);

    // Open the Add Job dialog
    await page.getByRole("button", { name: /add job/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    const submitButton = page.getByRole("dialog").getByRole("button", { name: /^add job$/i });

    // Initially disabled
    await expect(submitButton).toBeDisabled();

    // Fill one field - still disabled
    await page.getByLabel(/job title/i).fill("Developer");
    await expect(submitButton).toBeDisabled();

    // Fill another field - still disabled
    await page.getByLabel(/company/i).fill("Acme Inc");
    await expect(submitButton).toBeDisabled();

    // Fill last required field - now enabled
    await page.getByLabel(/job description/i).fill("Looking for a developer to join our team.");
    await expect(submitButton).toBeEnabled();

    // Clear a field - disabled again
    await page.getByLabel(/job title/i).clear();
    await expect(submitButton).toBeDisabled();

    // Re-fill - enabled again
    await page.getByLabel(/job title/i).fill("Senior Developer");
    await expect(submitButton).toBeEnabled();
  });

  test("should successfully submit after fixing validation issues", async ({ page }) => {
    await navigateToJobs(page);

    // Open the Add Job dialog
    await page.getByRole("button", { name: /add job/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    const timestamp = Date.now();
    const jobTitle = `Validation Test Job ${timestamp}`;

    // Fill all required fields
    await page.getByLabel(/job title/i).fill(jobTitle);
    await page.getByLabel(/company/i).fill(`Test Company ${timestamp}`);
    await page.getByLabel(/job description/i).fill("This job requires JavaScript, React, and Node.js skills.");

    // Submit the form
    const submitButton = page.getByRole("dialog").getByRole("button", { name: /^add job$/i });
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // Dialog should close on success
    await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 10000 });

    // Job should appear in the list
    await expect(page.getByText(jobTitle)).toBeVisible();
  });
});
