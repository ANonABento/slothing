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

test.skip(
  true,
  "Requires an authenticated Clerk test fixture and seeded app data.",
);

test.describe("Opportunities Page", () => {
  test.beforeEach(async ({ page }) => {
    // Mark onboarding as completed to skip it
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("get_me_job_onboarding_completed", "true");
    });
    await page.goto("/opportunities");
  });

  test("should display opportunities page header", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /Opportunities/i }),
    ).toBeVisible();
  });

  test("should show empty state when no opportunities exist", async ({
    page,
  }) => {
    // Check for empty state or opportunity listing
    const emptyState = page.getByText(
      /no opportunities|add your first opportunity|get started/i,
    );
    const jobList = page.locator(
      "[data-testid='opportunity-list'], .opportunity-card, .opportunity-item",
    );

    const hasJobs = (await jobList.count()) > 0;
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
    const statusFilter = page
      .getByRole("combobox", { name: /status/i })
      .or(page.getByRole("button", { name: /status/i }))
      .or(page.getByText(/all statuses/i));

    const typeFilter = page
      .getByRole("combobox", { name: /type/i })
      .or(page.getByRole("button", { name: /type/i }))
      .or(page.getByText(/all types/i));

    // At least one filter should exist
    const hasStatusFilter = await statusFilter
      .first()
      .isVisible({ timeout: 1000 })
      .catch(() => false);
    const hasTypeFilter = await typeFilter
      .first()
      .isVisible({ timeout: 1000 })
      .catch(() => false);

    expect(hasStatusFilter || hasTypeFilter).toBe(true);
  });

  test("should display sort options", async ({ page }) => {
    const sortOption = page
      .getByRole("combobox", { name: /sort/i })
      .or(page.getByRole("button", { name: /sort/i }))
      .or(page.getByText(/newest|oldest|recent/i));

    await expect(sortOption.first()).toBeVisible({ timeout: 2000 });
  });
});

test.describe("Opportunity Status Updates", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("get_me_job_onboarding_completed", "true");
    });
    await page.goto("/opportunities");
  });

  test("should be able to change opportunity status", async ({ page }) => {
    // This test assumes there's at least one opportunity in the list
    // If not, we'll skip the status change check
    const jobCard = page
      .locator(".opportunity-card, [data-testid='opportunity-item']")
      .first();

    if (await jobCard.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Look for status dropdown/button within the opportunity card
      const statusButton = jobCard
        .getByRole("combobox")
        .or(
          jobCard.getByRole("button", {
            name: /saved|applied|interviewing|offered|rejected/i,
          }),
        );

      if (await statusButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        await statusButton.click();
        // Check that status options appear
        await expect(page.getByRole("option")).toBeVisible();
      }
    }
  });
});

test.describe("Opportunity CRUD + Persistence", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await skipOnboardingSetup(page);
    await navigateToJobs(page);
  });

  test("should create a opportunity and verify it appears in the list", async ({
    page,
  }) => {
    const jobData = generateUniqueJobData("CRUD");

    // Create a new opportunity
    await createTestJob(page, jobData);

    // Verify the opportunity appears in the list
    await expectJobExists(page, jobData.title);
  });

  test("should persist opportunity after page reload", async ({ page }) => {
    const jobData = generateUniqueJobData("Persist");

    // Create a new opportunity
    await createTestJob(page, jobData);

    // Verify the opportunity appears in the list
    await expectJobExists(page, jobData.title);

    // Reload the page
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Verify the opportunity still exists after reload
    await expectJobExists(page, jobData.title);
  });

  test("should delete a opportunity and verify it is removed", async ({
    page,
  }) => {
    const jobData = generateUniqueJobData("Delete");

    // Create a new opportunity first
    await createTestJob(page, jobData);
    await expectJobExists(page, jobData.title);

    // Delete the opportunity
    await deleteJob(page, jobData.title);

    // Verify the opportunity is removed from the list
    await expectJobNotExists(page, jobData.title);
  });

  test("should persist opportunity deletion after page reload", async ({
    page,
  }) => {
    const jobData = generateUniqueJobData("DeletePersist");

    // Create and then delete a opportunity
    await createTestJob(page, jobData);
    await expectJobExists(page, jobData.title);
    await deleteJob(page, jobData.title);
    await expectJobNotExists(page, jobData.title);

    // Reload the page
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Verify the opportunity is still gone after reload
    await expectJobNotExists(page, jobData.title);
  });
});

test.describe("Opportunity Status Workflow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await skipOnboardingSetup(page);
    await navigateToJobs(page);
  });

  test("should change opportunity status from saved to applied", async ({
    page,
  }) => {
    const jobData = generateUniqueJobData("StatusChange");

    // Create a opportunity (default status is "saved")
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

    // Create a opportunity and change its status
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

  test("should transition through multiple status changes", async ({
    page,
  }) => {
    const jobData = generateUniqueJobData("MultiStatus");

    // Create a opportunity
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

    // Create a opportunity and change status to rejected
    await createTestJob(page, jobData);
    await updateJobStatus(page, jobData.title, "rejected");

    // Verify status
    const status = await getJobStatus(page, jobData.title);
    expect(status.toLowerCase()).toContain("rejected");
  });
});
