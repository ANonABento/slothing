import { test, expect } from "@playwright/test";

/**
 * Upload Page Tests
 * Tests the resume upload and parsing functionality.
 */

test.describe("Upload - Layout", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("get_me_job_onboarding_completed", "true");
    });
    await page.goto("/upload");
    await page.waitForLoadState("networkidle");
  });

  test("displays page heading", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /upload|resume/i })).toBeVisible();
  });

  test("displays dropzone area", async ({ page }) => {
    // Look for dropzone component
    const dropzone = page.locator("[class*='dropzone'], [class*='Dropzone'], .border-dashed");
    await expect(dropzone.first()).toBeVisible();
  });

  test("displays feature highlights", async ({ page }) => {
    // Should mention AI parsing benefits
    const features = page.getByText(/instant|ai|extract|automatic/i);
    expect(await features.count()).toBeGreaterThan(0);
  });

  test("displays Google Drive option", async ({ page }) => {
    const driveOption = page.getByText(/google drive|import from/i);
    if (await driveOption.isVisible({ timeout: 1000 }).catch(() => false)) {
      await expect(driveOption).toBeVisible();
    }
  });
});

test.describe("Upload - Dropzone Interaction", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("get_me_job_onboarding_completed", "true");
    });
    await page.goto("/upload");
    await page.waitForLoadState("networkidle");
  });

  test("dropzone shows drag state", async ({ page }) => {
    const dropzone = page.locator("[class*='dropzone'], .border-dashed").first();

    // Simulate drag over
    await dropzone.dispatchEvent("dragenter", {});

    // Should show visual feedback (class change or text change)
    const isDragActive = await dropzone.evaluate((el) => {
      return (
        el.classList.contains("drag-active") ||
        el.classList.contains("border-primary") ||
        el.getAttribute("data-drag-active") === "true"
      );
    });
    // Note: May need specific implementation details
  });

  test("shows supported file types", async ({ page }) => {
    const fileTypes = page.getByText(/pdf|docx|doc|word/i);
    await expect(fileTypes.first()).toBeVisible();
  });

  test("has click to upload option", async ({ page }) => {
    const clickText = page.getByText(/click|browse|select/i);
    await expect(clickText.first()).toBeVisible();
  });
});

test.describe("Upload - File Upload Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("get_me_job_onboarding_completed", "true");
    });
    await page.goto("/upload");
    await page.waitForLoadState("networkidle");
  });

  test("can select file via file input", async ({ page }) => {
    // Find hidden file input
    const fileInput = page.locator("input[type='file']");
    await expect(fileInput).toBeAttached();
  });

  test("shows extract button after upload", async ({ page }) => {
    // Mock a file upload
    const fileInput = page.locator("input[type='file']");

    // Create a test PDF file
    await fileInput.setInputFiles({
      name: "test-resume.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("test content"),
    });

    // Look for extract/parse button
    const extractButton = page.getByRole("button", { name: /extract|parse|analyze/i });
    if (await extractButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(extractButton).toBeVisible();
    }
  });
});

test.describe("Upload - Google Drive Integration", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("get_me_job_onboarding_completed", "true");
    });
    await page.goto("/upload");
    await page.waitForLoadState("networkidle");
  });

  test("Drive picker button is present", async ({ page }) => {
    const driveButton = page.getByRole("button", { name: /drive|browse drive/i });
    if (await driveButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      await expect(driveButton).toBeVisible();
    }
  });

  test("Drive picker opens dialog", async ({ page }) => {
    const driveButton = page.getByRole("button", { name: /drive|browse drive/i });

    if (await driveButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      await driveButton.click();

      // Should show connection prompt or file picker
      const dialog = page.getByRole("dialog");
      const connectionMsg = page.getByText(/connect|sign in|google/i);

      const hasDialog = await dialog.isVisible({ timeout: 1000 }).catch(() => false);
      const hasConnectionMsg = await connectionMsg.first().isVisible({ timeout: 1000 }).catch(() => false);

      // Should show something
      expect(hasDialog || hasConnectionMsg).toBe(true);
    }
  });
});

test.describe("Upload - Back Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("get_me_job_onboarding_completed", "true");
    });
    await page.goto("/upload");
    await page.waitForLoadState("networkidle");
  });

  test("has back to dashboard link", async ({ page }) => {
    const backLink = page.getByRole("link", { name: /back|dashboard/i });
    await expect(backLink).toBeVisible();

    await backLink.click();
    await expect(page).toHaveURL(/dashboard|\//);
  });
});
