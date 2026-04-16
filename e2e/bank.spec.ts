import { test, expect } from "@playwright/test";
import path from "path";

const TEST_PDF = path.join(__dirname, "fixtures", "test-resume.pdf");
const TEST_FILENAME = path.basename(TEST_PDF); // "test-resume.pdf"

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
    // Use anchored patterns to avoid matching chunk card buttons whose accessible
    // names also contain category words (e.g. "Uploaded Resume at Kevin Experience…").
    await expect(page.getByRole("button", { name: /^all \(/i })).toBeVisible();
    await expect(
      page.getByRole("button", { name: /^experience \(/i })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /^skills \(/i })
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
  // Run serially to avoid race conditions: parallel uploads from concurrent
  // beforeEach calls can leave the DB in an unpredictable state.
  test.describe.configure({ mode: "serial" });

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

    // Wait for the filtered API response
    await page.waitForResponse(
      (resp) => resp.url().includes("/api/bank") && resp.status() === 200
    );

    // Should show "No matching entries" since nothing matches
    await expect(page.getByText("No matching entries")).toBeVisible({
      timeout: 5000,
    });

    // Clear search
    await searchInput.fill("");
    await page.waitForResponse(
      (resp) => resp.url().includes("/api/bank") && resp.status() === 200
    );

    // Entries should reappear
    await expect(page.getByText("No matching entries")).not.toBeVisible({
      timeout: 5000,
    });
  });

  test("category filter chips narrow results", async ({ page }) => {
    // Click a specific category chip (anchored pattern avoids matching chunk card buttons)
    const experienceChip = page.getByRole("button", { name: /^experience \(/i });

    // Wait for the filtered API response directly instead of relying on networkidle,
    // which can fire before the response is fully processed.
    await Promise.all([
      page.waitForResponse(
        (resp) => resp.url().includes("/api/bank") && resp.status() === 200
      ),
      experienceChip.click(),
    ]);

    // After filtering, either the Experience section heading or "No matching entries"
    // must appear — both are valid outcomes depending on what data is in the DB.
    const experienceHeading = page.getByRole("heading", {
      name: /experience/i,
    });
    const noMatching = page.getByText("No matching entries");

    await expect(experienceHeading.or(noMatching)).toBeVisible({
      timeout: 5000,
    });

    // Click "All" to reset
    await Promise.all([
      page.waitForResponse(
        (resp) => resp.url().includes("/api/bank") && resp.status() === 200
      ),
      page.getByRole("button", { name: /^all \(/i }).click(),
    ]);
  });
});

test.describe("Bank Page - Source Documents Section", () => {
  // Run serially to prevent parallel beforeEach calls from uploading the fixture
  // multiple times simultaneously (each would see "test-resume.pdf" not yet visible
  // within the 1-second timeout and all kick off an upload).
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("get_me_job_onboarding_completed", "true");
    });
    await page.goto("/bank");
    await page.waitForLoadState("networkidle");

    // Upload the test fixture only if it isn't already in the source docs section.
    // Checking by filename is more robust than checking for empty state — the DB
    // may already contain documents from a prior run with a different filename.
    const alreadyPresent = await page
      .getByText(TEST_FILENAME, { exact: true })
      .first()
      .isVisible({ timeout: 3000 })
      .catch(() => false);

    if (!alreadyPresent) {
      const fileInput = page.locator("input[type='file']");
      await fileInput.setInputFiles(TEST_PDF);
      await expect(
        page.getByRole("button", { name: /^upload$/i })
      ).toBeVisible({ timeout: 30000 });
      // Wait for the filename to appear in Source Files section
      await expect(
        page.getByText(TEST_FILENAME, { exact: true }).first()
      ).toBeVisible({ timeout: 15000 });
    }
  });

  test("shows Source Files heading after upload", async ({ page }) => {
    await expect(page.getByText("Source Files")).toBeVisible({ timeout: 5000 });
  });

  test("shows uploaded filename in source documents", async ({ page }) => {
    // The test fixture filename should appear (use .first() in case of duplicates
    // from prior test runs that left data in the SQLite DB).
    await expect(page.getByText(TEST_FILENAME).first()).toBeVisible({
      timeout: 5000,
    });
  });

  test("source document card shows file metadata", async ({ page }) => {
    // Should show file size and chunk count.
    // Use .first() to handle any duplicate uploads from prior test runs.
    const filenameEl = page.getByText(TEST_FILENAME, { exact: true }).first();
    await expect(filenameEl).toBeVisible({ timeout: 5000 });

    // The metadata <p class="text-xs"> is a sibling of the filename inside div.min-w-0
    const fileInfo = filenameEl.locator("..");
    const metadataText = fileInfo.locator(".text-xs");
    await expect(metadataText).toBeVisible();
    const text = await metadataText.textContent();
    // Should contain something like "801 B" or "0.8 KB" and "X chunks"
    expect(text).toMatch(/\d+.*chunk/);
  });

  test("source document has delete button", async ({ page }) => {
    // Each source doc card should have a delete (trash) button.
    // Use .first() to handle any duplicate uploads from prior test runs.
    const filenameEl = page.getByText(TEST_FILENAME, { exact: true }).first();
    await expect(filenameEl).toBeVisible({ timeout: 5000 });
    // p.text-sm → div.min-w-0 → card div
    const card = filenameEl.locator("../..");
    const deleteButton = card.getByRole("button");
    await expect(deleteButton).toBeVisible();
  });
});
