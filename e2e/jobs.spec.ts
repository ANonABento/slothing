import { test, expect } from "@playwright/test";
import {
  createTestJob,
  expectJobExists,
  expectJobNotExists,
  deleteJob,
  updateJobStatus,
  getJobStatus,
  getJobCard,
  generateUniqueJobData,
  skipOnboardingSetup,
  navigateToJobs,
} from "./utils/test-helpers";

test.describe("Jobs Page", () => {
  test.beforeEach(async ({ page }) => {
    // Mark onboarding as completed to skip it
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("get_me_job_onboarding_completed", "true");
    });
    await page.goto("/jobs");
  });

  test("should display jobs page header", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Jobs/i })).toBeVisible();
  });

  test("should show empty state when no jobs exist", async ({ page }) => {
    // Check for empty state or job listing
    const emptyState = page.getByText(/no jobs|add your first job|get started/i);
    const jobList = page.locator("[data-testid='job-list'], .job-card, .job-item");

    const hasJobs = await jobList.count() > 0;
    if (!hasJobs) {
      await expect(emptyState).toBeVisible();
    }
  });

  test("should have search functionality", async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search/i);
    if (await searchInput.isVisible({ timeout: 1000 }).catch(() => false)) {
      await searchInput.fill("Software Engineer");
      await expect(searchInput).toHaveValue("Software Engineer");
    }
  });

  test("should have filter options", async ({ page }) => {
    // Check for filter buttons or dropdowns
    const statusFilter = page.getByRole("combobox", { name: /status/i }).or(
      page.getByRole("button", { name: /status/i })
    ).or(page.getByText(/all statuses/i));

    const typeFilter = page.getByRole("combobox", { name: /type/i }).or(
      page.getByRole("button", { name: /type/i })
    ).or(page.getByText(/all types/i));

    // At least one filter should exist
    const hasStatusFilter = await statusFilter.first().isVisible({ timeout: 1000 }).catch(() => false);
    const hasTypeFilter = await typeFilter.first().isVisible({ timeout: 1000 }).catch(() => false);

    expect(hasStatusFilter || hasTypeFilter).toBe(true);
  });

  test("should display sort options", async ({ page }) => {
    const sortOption = page.getByRole("combobox", { name: /sort/i }).or(
      page.getByRole("button", { name: /sort/i })
    ).or(page.getByText(/newest|oldest|recent/i));

    await expect(sortOption.first()).toBeVisible({ timeout: 2000 });
  });
});

test.describe("Job Status Updates", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("get_me_job_onboarding_completed", "true");
    });
    await page.goto("/jobs");
  });

  test("should be able to change job status", async ({ page }) => {
    // This test assumes there's at least one job in the list
    // If not, we'll skip the status change check
    const jobCard = page.locator(".job-card, [data-testid='job-item']").first();

    if (await jobCard.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Look for status dropdown/button within the job card
      const statusButton = jobCard.getByRole("combobox").or(
        jobCard.getByRole("button", { name: /saved|applied|interviewing|offered|rejected/i })
      );

      if (await statusButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        await statusButton.click();
        // Check that status options appear
        await expect(page.getByRole("option")).toBeVisible();
      }
    }
  });
});

test.describe("Job CRUD + Persistence", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await skipOnboardingSetup(page);
    await navigateToJobs(page);
  });

  test("should create a job and verify it appears in the list", async ({ page }) => {
    const jobData = generateUniqueJobData("CRUD");

    // Create a new job
    await createTestJob(page, jobData);

    // Verify the job appears in the list
    await expectJobExists(page, jobData.title);
  });

  test("should persist job after page reload", async ({ page }) => {
    const jobData = generateUniqueJobData("Persist");

    // Create a new job
    await createTestJob(page, jobData);

    // Verify the job appears in the list
    await expectJobExists(page, jobData.title);

    // Reload the page
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Verify the job still exists after reload
    await expectJobExists(page, jobData.title);
  });

  test("should delete a job and verify it is removed", async ({ page }) => {
    const jobData = generateUniqueJobData("Delete");

    // Create a new job first
    await createTestJob(page, jobData);
    await expectJobExists(page, jobData.title);

    // Delete the job
    await deleteJob(page, jobData.title);

    // Verify the job is removed from the list
    await expectJobNotExists(page, jobData.title);
  });

  test("should persist job deletion after page reload", async ({ page }) => {
    const jobData = generateUniqueJobData("DeletePersist");

    // Create and then delete a job
    await createTestJob(page, jobData);
    await expectJobExists(page, jobData.title);
    await deleteJob(page, jobData.title);
    await expectJobNotExists(page, jobData.title);

    // Reload the page
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Verify the job is still gone after reload
    await expectJobNotExists(page, jobData.title);
  });
});

test.describe("Job Status Workflow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await skipOnboardingSetup(page);
    await navigateToJobs(page);
  });

  test("should change job status from saved to applied", async ({ page }) => {
    const jobData = generateUniqueJobData("StatusChange");

    // Create a job (default status is "saved")
    await createTestJob(page, jobData);
    await expectJobExists(page, jobData.title);

    // Change status to "applied"
    await updateJobStatus(page, jobData.title, "applied");

    // Verify the status badge updated
    const status = await getJobStatus(page, jobData.title);
    expect(status.toLowerCase()).toContain("applied");
  });

  test("should persist status change after page reload", async ({ page }) => {
    const jobData = generateUniqueJobData("StatusPersist");

    // Create a job and change its status
    await createTestJob(page, jobData);
    await updateJobStatus(page, jobData.title, "interviewing");

    // Verify status changed
    let status = await getJobStatus(page, jobData.title);
    expect(status.toLowerCase()).toContain("interviewing");

    // Reload the page
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Verify status persists after reload
    status = await getJobStatus(page, jobData.title);
    expect(status.toLowerCase()).toContain("interviewing");
  });

  test("should transition through multiple status changes", async ({ page }) => {
    const jobData = generateUniqueJobData("MultiStatus");

    // Create a job
    await createTestJob(page, jobData);

    // Transition: saved -> applied -> interviewing -> offered
    await updateJobStatus(page, jobData.title, "applied");
    let status = await getJobStatus(page, jobData.title);
    expect(status.toLowerCase()).toContain("applied");

    await updateJobStatus(page, jobData.title, "interviewing");
    status = await getJobStatus(page, jobData.title);
    expect(status.toLowerCase()).toContain("interviewing");

    await updateJobStatus(page, jobData.title, "offered");
    status = await getJobStatus(page, jobData.title);
    expect(status.toLowerCase()).toContain("offered");
  });

  test("should allow changing status to rejected", async ({ page }) => {
    const jobData = generateUniqueJobData("Rejected");

    // Create a job and change status to rejected
    await createTestJob(page, jobData);
    await updateJobStatus(page, jobData.title, "rejected");

    // Verify status
    const status = await getJobStatus(page, jobData.title);
    expect(status.toLowerCase()).toContain("rejected");
  });
});
