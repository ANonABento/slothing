import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

/**
 * Test data for creating opportunities
 */
export interface TestJobData {
  title: string;
  company: string;
  description: string;
  url?: string;
}

/**
 * Creates an opportunity via the UI and returns the opportunity's title for later reference.
 * This helper opens the Add Opportunity dialog, fills in the form, and submits.
 */
export async function createTestJob(
  page: Page,
  data: TestJobData,
): Promise<void> {
  // Click "Add Opportunity" button
  await page.getByRole("button", { name: /add opportunity/i }).click();

  // Wait for dialog to appear
  await expect(page.getByRole("dialog")).toBeVisible();

  // Fill in the form fields
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel(/title/i).fill(data.title);
  await dialog.getByLabel(/company/i).fill(data.company);

  if (data.url) {
    await dialog.getByLabel(/^url$/i).fill(data.url);
  }

  await dialog.getByRole("button", { name: /^next/i }).click();
  await dialog.getByRole("button", { name: /^next/i }).click();
  await dialog.getByRole("button", { name: /^next/i }).click();
  await dialog.getByLabel(/summary \/ job description/i).fill(data.description);

  await dialog.getByRole("button", { name: /^create opportunity$/i }).click();

  // Wait for dialog to close (indicates success)
  await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 10000 });
}

/**
 * Finds an opportunity card by title and returns locator for further actions.
 */
export function getJobCard(page: Page, title: string) {
  // Opportunity cards contain the title as an h3
  return page.locator(".group").filter({ hasText: title });
}

/**
 * Verifies an opportunity exists in the list by checking for its title.
 */
export async function expectJobExists(
  page: Page,
  title: string,
): Promise<void> {
  const jobCard = getJobCard(page, title);
  await expect(jobCard).toBeVisible();
}

/**
 * Verifies an opportunity does NOT exist in the list.
 */
export async function expectJobNotExists(
  page: Page,
  title: string,
): Promise<void> {
  const jobCard = getJobCard(page, title);
  await expect(jobCard).not.toBeVisible();
}

/**
 * Updates an opportunity's status via the status dropdown.
 */
export async function updateJobStatus(
  page: Page,
  jobTitle: string,
  newStatus: "saved" | "applied" | "interviewing" | "offered" | "rejected",
): Promise<void> {
  const jobCard = getJobCard(page, jobTitle);

  // Click the status dropdown within the opportunity card
  await jobCard.getByRole("combobox").first().click();

  // Select the new status from dropdown
  await page.getByRole("option", { name: new RegExp(newStatus, "i") }).click();
}

/**
 * Deletes an opportunity via the trash icon button.
 */
export async function deleteJob(page: Page, jobTitle: string): Promise<void> {
  const jobCard = getJobCard(page, jobTitle);

  // Click the delete button (trash icon)
  await jobCard
    .getByRole("button")
    .filter({ has: page.locator("svg.lucide-trash-2") })
    .click();
}

/**
 * Gets the displayed status badge text for an opportunity.
 */
export async function getJobStatus(
  page: Page,
  jobTitle: string,
): Promise<string> {
  const jobCard = getJobCard(page, jobTitle);
  const statusDropdown = jobCard.getByRole("combobox").first();
  return (await statusDropdown.textContent()) || "";
}

/**
 * Navigates to the opportunities page and waits for it to load.
 */
export async function navigateToJobs(page: Page): Promise<void> {
  await page.goto("/opportunities");
  await page.waitForLoadState("networkidle");
}

/**
 * Navigates to the profile page and waits for it to load.
 */
export async function navigateToProfile(page: Page): Promise<void> {
  await page.goto("/profile");
  await page.waitForLoadState("networkidle");
}

/**
 * Dismisses the onboarding dialog if present.
 */
export async function dismissOnboarding(page: Page): Promise<void> {
  const onboardingDialog = page.getByRole("dialog");
  if (await onboardingDialog.isVisible({ timeout: 1000 }).catch(() => false)) {
    const skipButton = page.getByRole("button", { name: /skip|close|later/i });
    if (await skipButton.isVisible({ timeout: 500 }).catch(() => false)) {
      await skipButton.click();
    }
  }
}

/**
 * Clears all local storage and reloads to get a fresh state.
 */
export async function resetAppState(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.clear();
  });
  await page.reload();
  await page.waitForLoadState("networkidle");
}

/**
 * Sets up the app state to skip onboarding (marks it as completed).
 */
export async function skipOnboardingSetup(page: Page): Promise<void> {
  await page.addInitScript(() => {
    localStorage.setItem("get_me_job_onboarding_completed", "true");
  });
}

/**
 * Prepares an app route with onboarding marked complete and waits for the
 * visible shell rather than relying on every background request to settle.
 */
export async function prepareAppPage(page: Page, path: string): Promise<void> {
  await page.addInitScript(() => {
    localStorage.setItem("get_me_job_onboarding_completed", "true");
  });
  await page.goto(path);
  await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => {
    // Notifications, sync checks, and route-specific background calls can keep
    // the network busy. The app shell assertion below is the readiness signal.
  });
  await expect(page.getByRole("main", { name: /main content/i })).toBeVisible();
}

/**
 * Opens the responsive sidebar when a test needs to inspect navigation links.
 */
export async function ensureSidebarOpen(page: Page): Promise<void> {
  const openMenuButton = page.getByRole("button", {
    name: /open navigation menu|open menu/i,
  });
  if (await openMenuButton.isVisible().catch(() => false)) {
    await openMenuButton.click();
  }

  await expect(page.locator("aside")).toBeVisible();
}

/**
 * Navigates to the bank (documents) page and waits for it to load.
 */
export async function navigateToBank(page: Page): Promise<void> {
  await page.addInitScript(() => {
    localStorage.setItem("get_me_job_onboarding_completed", "true");
  });
  await page.goto("/bank");
  await page.waitForLoadState("networkidle");
}

/**
 * Generates unique test data with timestamp suffix to avoid conflicts.
 */
export function generateUniqueJobData(baseName = "Test"): TestJobData {
  const timestamp = Date.now();
  return {
    title: `${baseName} Engineer ${timestamp}`,
    company: `${baseName} Company ${timestamp}`,
    description: `This is a test opportunity description for ${baseName} position created at ${timestamp}. Requires JavaScript, React, Node.js skills.`,
  };
}
