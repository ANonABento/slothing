import { test, expect } from "@playwright/test";
import path from "path";

const TEST_PDF = path.join(__dirname, "fixtures", "test-resume.pdf");

/**
 * Bank (Documents) Page E2E Tests
 *
 * Tests the document upload, search, filtering, and source documents UI.
 * Auth falls back to local dev user when Clerk is not configured.
 */

test.describe("Bank Page - Layout & Empty State", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("get_me_job_onboarding_completed", "true");
    });
    await page.goto("/bank");
    await page.waitForLoadState("networkidle");
  });

  test("displays page heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /documents/i })
    ).toBeVisible();
  });

  test("shows empty state message when no documents uploaded", async ({
    page,
  }) => {
    const emptyHeading = page.getByText("No documents yet");
    const entryCards = page.locator(".grid .rounded-lg");
    const hasEntries = (await entryCards.count()) > 0;

    if (!hasEntries) {
      await expect(emptyHeading).toBeVisible();
      // Empty state also has an Upload Document button
      await expect(
        page.getByRole("button", { name: /upload document/i })
      ).toBeVisible();
    }
  });

  test("displays search bar", async ({ page }) => {
    await expect(
      page.getByPlaceholder(/search your knowledge bank/i)
    ).toBeVisible();
  });

  test("displays category filter chips", async ({ page }) => {
    // "All" chip and at least a few category chips
    await expect(page.getByRole("button", { name: /^all \(/i })).toBeVisible();
    await expect(
      page.getByRole("button", { name: /experience/i })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /skills/i })
    ).toBeVisible();
  });

  test("displays sort dropdown", async ({ page }) => {
    const sortSelect = page.locator("select");
    await expect(sortSelect).toBeVisible();
    // Default should be "Newest"
    await expect(sortSelect).toHaveValue("date");
  });
});

test.describe("Bank Page - Upload Button", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("get_me_job_onboarding_completed", "true");
    });
    await page.goto("/bank");
    await page.waitForLoadState("networkidle");
  });

  test("has upload button in header", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /^upload$/i })
    ).toBeVisible();
  });

  test("upload button triggers hidden file input", async ({ page }) => {
    const fileInput = page.locator("input[type='file']");
    await expect(fileInput).toBeAttached();
    // File input should accept the right types
    await expect(fileInput).toHaveAttribute("accept", ".pdf,.txt,.docx");
  });

  test("has From Drive button", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /from drive/i })
    ).toBeVisible();
  });
});

test.describe("Bank Page - File Upload Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("get_me_job_onboarding_completed", "true");
    });
    await page.goto("/bank");
    await page.waitForLoadState("networkidle");
  });

  test("uploads a PDF and shows entries in the bank", async ({ page }) => {
    const fileInput = page.locator("input[type='file']");

    // Upload the test PDF
    await fileInput.setInputFiles(TEST_PDF);

    // Wait for the upload to complete - uploading button should appear then disappear
    await expect(
      page.getByRole("button", { name: /uploading/i })
    ).toBeVisible({ timeout: 5000 });
    await expect(
      page.getByRole("button", { name: /^upload$/i })
    ).toBeVisible({ timeout: 30000 });

    // After upload, the empty state should be replaced by entries
    // Wait for entries to appear (grouped by category with headings)
    await expect(page.getByText("No documents yet")).not.toBeVisible({
      timeout: 10000,
    });
  });
});

test.describe("Bank Page - Search & Filter", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("get_me_job_onboarding_completed", "true");
    });
    await page.goto("/bank");
    await page.waitForLoadState("networkidle");

    // Upload fixture if no entries exist
    const emptyState = page.getByText("No documents yet");
    if (await emptyState.isVisible({ timeout: 2000 }).catch(() => false)) {
      const fileInput = page.locator("input[type='file']");
      await fileInput.setInputFiles(TEST_PDF);
      await expect(
        page.getByRole("button", { name: /^upload$/i })
      ).toBeVisible({ timeout: 30000 });
      await expect(emptyState).not.toBeVisible({ timeout: 10000 });
    }
  });

  test("search filters entries by query", async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search your knowledge bank/i);

    // Type a search query that won't match anything
    await searchInput.fill("zzz_nonexistent_term_zzz");

    // Wait for API response
    await page.waitForLoadState("networkidle");

    // Should show "No matching entries" since nothing matches
    await expect(page.getByText("No matching entries")).toBeVisible({
      timeout: 5000,
    });

    // Clear search
    await searchInput.fill("");
    await page.waitForLoadState("networkidle");

    // Entries should reappear
    await expect(page.getByText("No matching entries")).not.toBeVisible({
      timeout: 5000,
    });
  });

  test("category filter chips narrow results", async ({ page }) => {
    // Click a specific category chip (e.g. "Experience")
    const experienceChip = page.getByRole("button", { name: /experience/i });
    await experienceChip.click();

    await page.waitForLoadState("networkidle");

    // The "Experience" heading should be visible if entries exist for that category
    // or "No matching entries" if no entries in that category
    const experienceHeading = page.getByRole("heading", {
      name: /experience/i,
    });
    const noMatching = page.getByText("No matching entries");

    const hasExperience = await experienceHeading
      .isVisible({ timeout: 3000 })
      .catch(() => false);
    const hasNoMatching = await noMatching
      .isVisible({ timeout: 1000 })
      .catch(() => false);

    // One of these should be true
    expect(hasExperience || hasNoMatching).toBe(true);

    // Click "All" to reset
    await page.getByRole("button", { name: /^all \(/i }).click();
    await page.waitForLoadState("networkidle");
  });
});

test.describe("Bank Page - Source Documents Section", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("get_me_job_onboarding_completed", "true");
    });
    await page.goto("/bank");
    await page.waitForLoadState("networkidle");

    // Upload fixture if no entries exist
    const emptyState = page.getByText("No documents yet");
    if (await emptyState.isVisible({ timeout: 2000 }).catch(() => false)) {
      const fileInput = page.locator("input[type='file']");
      await fileInput.setInputFiles(TEST_PDF);
      await expect(
        page.getByRole("button", { name: /^upload$/i })
      ).toBeVisible({ timeout: 30000 });
      await expect(emptyState).not.toBeVisible({ timeout: 10000 });
    }
  });

  test("shows Source Files heading after upload", async ({ page }) => {
    await expect(page.getByText("Source Files")).toBeVisible({ timeout: 5000 });
  });

  test("shows uploaded filename in source documents", async ({ page }) => {
    // The test fixture filename should appear
    await expect(page.getByText("test-resume.pdf")).toBeVisible({
      timeout: 5000,
    });
  });

  test("source document card shows file metadata", async ({ page }) => {
    // Should show file size and chunk count
    const sourceCard = page.locator("text=test-resume.pdf").locator("..");
    await expect(sourceCard).toBeVisible({ timeout: 5000 });

    // Metadata line should contain size info and chunk count
    const metadataText = sourceCard.locator(".text-xs");
    await expect(metadataText).toBeVisible();
    const text = await metadataText.textContent();
    // Should contain something like "801 B" or "0.8 KB" and "X chunks"
    expect(text).toMatch(/\d+.*chunk/);
  });

  test("source document has delete button", async ({ page }) => {
    // Each source doc card should have a delete (trash) button
    const sourceCard = page.locator("text=test-resume.pdf").locator("..");
    const deleteButton = sourceCard.getByRole("button");
    await expect(deleteButton).toBeVisible();
  });
});
