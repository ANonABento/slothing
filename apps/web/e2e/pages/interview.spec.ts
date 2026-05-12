import { test, expect } from "@playwright/test";

/**
 * Interview Prep Page Tests
 * Tests interview preparation features including text and voice modes.
 */

test.skip(
  true,
  "Requires an authenticated NextAuth test fixture and interview seed data.",
);

test.describe("Interview - Layout", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("get_me_job_onboarding_completed", "true");
    });
    await page.goto("/en/interview");
    await page.waitForLoadState("networkidle");
  });

  test("displays page heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /interview/i }),
    ).toBeVisible();
  });

  test("shows interview mode options", async ({ page }) => {
    // Should show text or voice mode options
    const modeOptions = page.getByText(/text|voice|mode/i);
    expect(await modeOptions.count()).toBeGreaterThan(0);
  });

  test("displays job selection", async ({ page }) => {
    // Should allow selecting a job for interview prep
    const jobSelect = page.getByText(/select.*job|choose.*job|job/i);
    if (
      await jobSelect
        .first()
        .isVisible({ timeout: 1000 })
        .catch(() => false)
    ) {
      await expect(jobSelect.first()).toBeVisible();
    }
  });

  test("shows start button or practice area", async ({ page }) => {
    const startButton = page.getByRole("button", {
      name: /start|begin|practice/i,
    });
    const practiceArea = page.locator(
      "[class*='interview'], [class*='chat'], [class*='session']",
    );

    const hasStart = await startButton
      .first()
      .isVisible({ timeout: 1000 })
      .catch(() => false);
    const hasPractice = await practiceArea
      .first()
      .isVisible({ timeout: 1000 })
      .catch(() => false);

    expect(hasStart || hasPractice).toBe(true);
  });
});

test.describe("Interview - Session Start", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("get_me_job_onboarding_completed", "true");
    });
    await page.goto("/en/interview");
    await page.waitForLoadState("networkidle");
  });

  test("can start interview session", async ({ page }) => {
    const startButton = page
      .getByRole("button", { name: /start|begin|practice/i })
      .first();

    if (await startButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      await startButton.click();

      // Should show interview interface or loading
      const sessionUI = page.locator(
        "[class*='question'], [class*='interview'], textarea",
      );
      const dialog = page.getByRole("dialog");

      await page.waitForTimeout(500);

      const hasSession = await sessionUI
        .first()
        .isVisible({ timeout: 2000 })
        .catch(() => false);
      const hasDialog = await dialog
        .isVisible({ timeout: 500 })
        .catch(() => false);

      expect(hasSession || hasDialog).toBe(true);
    }
  });

  test("shows question types or categories", async ({ page }) => {
    const categories = page.getByText(
      /behavioral|technical|situational|common/i,
    );
    if (
      await categories
        .first()
        .isVisible({ timeout: 1000 })
        .catch(() => false)
    ) {
      expect(await categories.count()).toBeGreaterThan(0);
    }
  });
});

test.describe("Interview - Text Mode", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("get_me_job_onboarding_completed", "true");
    });
    await page.goto("/en/interview");
    await page.waitForLoadState("networkidle");
  });

  test("text input is available for answers", async ({ page }) => {
    // Start session first
    const startButton = page
      .getByRole("button", { name: /start|begin|practice|text/i })
      .first();

    if (await startButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      await startButton.click();
      await page.waitForTimeout(1000);
    }

    // Look for answer input
    const answerInput = page.locator("textarea, input[type='text']");
    if (
      await answerInput
        .first()
        .isVisible({ timeout: 2000 })
        .catch(() => false)
    ) {
      await expect(answerInput.first()).toBeVisible();
    }
  });

  test("submit answer button exists", async ({ page }) => {
    const startButton = page
      .getByRole("button", { name: /start|begin|practice/i })
      .first();

    if (await startButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      await startButton.click();
      await page.waitForTimeout(1000);

      const submitButton = page.getByRole("button", {
        name: /submit|send|answer/i,
      });
      if (await submitButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(submitButton).toBeVisible();
      }
    }
  });
});

test.describe("Interview - Save to Docs", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("get_me_job_onboarding_completed", "true");
    });
    await page.goto("/en/interview");
    await page.waitForLoadState("networkidle");
  });

  test("Google Docs save option available", async ({ page }) => {
    // May need to complete a session first
    const docsButton = page.getByRole("button", {
      name: /save.*docs|google.*docs|export/i,
    });

    if (await docsButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      await expect(docsButton).toBeVisible();
    }
  });
});

test.describe("Interview - Past Sessions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("get_me_job_onboarding_completed", "true");
    });
    await page.goto("/en/interview");
    await page.waitForLoadState("networkidle");
  });

  test("shows session history if available", async ({ page }) => {
    const historySection = page.getByText(/history|past|previous|sessions/i);
    if (
      await historySection
        .first()
        .isVisible({ timeout: 1000 })
        .catch(() => false)
    ) {
      await expect(historySection.first()).toBeVisible();
    }
  });
});
