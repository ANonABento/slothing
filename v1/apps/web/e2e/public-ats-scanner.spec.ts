import { expect, test } from "@playwright/test";

// Enough text to pass the MIN_RESUME_LENGTH (50 chars) and give the
// client-side parser recognisable sections. The full scan is synchronous
// and requires no API calls when using pasted text.
const SAMPLE_RESUME_TEXT = `
John Doe
Software Engineer
john.doe@example.com | (555) 123-4567 | San Francisco, CA

EXPERIENCE

Senior Software Engineer | Acme Corp | 2021 – Present
  - Built distributed microservices in Go and TypeScript
  - Led a team of 5 engineers, improving deploy frequency by 40%
  - Owned CI/CD pipeline on GitHub Actions

Software Engineer | Startup Inc | 2019 – 2021
  - Developed React front-end features used by 100k+ users
  - Wrote REST API endpoints using Node.js and Express

EDUCATION

B.S. Computer Science | State University | 2019

SKILLS

JavaScript, TypeScript, React, Node.js, Go, SQL, Git, Docker
`.trim();

test.describe("ATS Scanner page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/ats-scanner");
    await page.waitForLoadState("networkidle");
  });

  test("page loads without error states @smoke", async ({ page }) => {
    await expect(page.locator("h1:has-text('500')")).not.toBeVisible();
    await expect(page.locator("h1:has-text('404')")).not.toBeVisible();
    await expect(
      page.getByText(/something went wrong|page not found/i),
    ).not.toBeVisible();
  });

  test("page heading is visible @smoke", async ({ page }) => {
    await expect(
      page.getByRole("heading", {
        name: /Free ATS Resume Scanner/i,
        level: 1,
      }),
    ).toBeVisible();
  });

  test("three benefit cards are rendered", async ({ page }) => {
    await expect(page.getByText("Instant Results")).toBeVisible();
    await expect(page.getByText("Detailed Breakdown")).toBeVisible();
    await expect(page.getByText("Free and Private")).toBeVisible();
  });

  test("upload zone is visible", async ({ page }) => {
    await expect(
      page.getByText(/Drop a PDF here or click to browse/i),
    ).toBeVisible();
  });

  test("Scan Resume button is disabled by default", async ({ page }) => {
    const scanButton = page.getByRole("button", { name: /Scan Resume/i });
    await expect(scanButton).toBeVisible();
    await expect(scanButton).toBeDisabled();
    await expect(
      page.getByText(/Upload a resume or paste at least 50 characters/i),
    ).toBeVisible();
  });

  test("Paste text instead toggle reveals resume text area", async ({
    page,
  }) => {
    const toggleButton = page.getByRole("button", {
      name: /Paste text instead/i,
    });
    await expect(toggleButton).toBeVisible();
    await toggleButton.click();

    const resumeTextarea = page.getByLabel(/Paste your resume text/i);
    await expect(resumeTextarea).toBeVisible();
  });

  test("Scan Resume button enables after pasting enough resume text", async ({
    page,
  }) => {
    // Open the paste mode
    await page.getByRole("button", { name: /Paste text instead/i }).click();

    const resumeTextarea = page.getByLabel(/Paste your resume text/i);
    await resumeTextarea.fill(SAMPLE_RESUME_TEXT);

    const scanButton = page.getByRole("button", { name: /Scan Resume/i });
    await expect(scanButton).toBeEnabled();
  });

  test("job description textarea is visible", async ({ page }) => {
    const jobTextarea = page.locator("#job-text");
    await expect(jobTextarea).toBeVisible();
  });

  test("job URL import field is visible", async ({ page }) => {
    const jobUrlInput = page.locator("#job-url");
    await expect(jobUrlInput).toBeVisible();
  });

  test("job URL field does not import on blur", async ({ page }) => {
    let scrapeCalls = 0;
    await page.route("**/api/scanner/scrape-job", async (route) => {
      scrapeCalls += 1;
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Unexpected scrape" }),
      });
    });

    await page.locator("#job-url").fill("https://example.com/jobs/123");
    await page.locator("#job-text").focus();
    await page.waitForTimeout(300);

    expect(scrapeCalls).toBe(0);
  });

  test("text-only scan produces a results panel @smoke", async ({ page }) => {
    // Open paste mode and provide resume text
    await page.getByRole("button", { name: /Paste text instead/i }).click();
    const resumeTextarea = page.getByLabel(/Paste your resume text/i);
    await resumeTextarea.fill(SAMPLE_RESUME_TEXT);

    // Trigger the scan
    await page.getByRole("button", { name: /Scan Resume/i }).click();

    // Client-side scoring is synchronous — results appear without a network call
    await expect(
      page.getByRole("button", { name: /Scan another resume/i }),
    ).toBeVisible({ timeout: 5000 });
  });

  test("scan results show scoring axes", async ({ page }) => {
    await page.getByRole("button", { name: /Paste text instead/i }).click();
    await page.getByLabel(/Paste your resume text/i).fill(SAMPLE_RESUME_TEXT);
    await page.getByRole("button", { name: /Scan Resume/i }).click();

    await expect(
      page.getByRole("heading", { name: "Scoring axes" }),
    ).toBeVisible({ timeout: 5000 });
  });

  test("scan results include platform, content, and referral insights", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /Paste text instead/i }).click();
    await page.getByLabel(/Paste your resume text/i).fill(SAMPLE_RESUME_TEXT);
    await page
      .locator("#job-url")
      .fill("https://acme.myworkdayjobs.com/en-US/careers/job/123");
    await page.getByRole("button", { name: /Scan Resume/i }).click();

    await expect(
      page.getByRole("button", { name: /Scan another resume/i }),
    ).toBeVisible({ timeout: 5000 });
    await expect(
      page.getByRole("heading", { name: /Detected ATS: Workday Recruiting/i }),
    ).toBeVisible({ timeout: 5000 });
    await expect(
      page.getByRole("heading", { name: /Content checks/i }),
    ).toBeVisible();
    await expect(page.getByText(/referrals convert ~30/i)).toBeVisible();
  });

  test("scan results show sign-up upsell", async ({ page }) => {
    await page.getByRole("button", { name: /Paste text instead/i }).click();
    await page.getByLabel(/Paste your resume text/i).fill(SAMPLE_RESUME_TEXT);
    await page.getByRole("button", { name: /Scan Resume/i }).click();

    await expect(
      page.getByText(/Want AI-powered resume tailoring/i),
    ).toBeVisible({ timeout: 5000 });

    const signUpLink = page.getByRole("link", { name: /Sign up free/i });
    await expect(signUpLink).toBeVisible();
    const href = await signUpLink.getAttribute("href");
    expect(href).toMatch(/sign-in/);
  });

  test("Scan another resume resets to initial form", async ({ page }) => {
    await page.getByRole("button", { name: /Paste text instead/i }).click();
    await page.getByLabel(/Paste your resume text/i).fill(SAMPLE_RESUME_TEXT);
    await page.getByRole("button", { name: /Scan Resume/i }).click();

    await page
      .getByRole("button", { name: /Scan another resume/i })
      .click({ timeout: 5000 });

    // Back to initial state
    await expect(
      page.getByText(/Drop a PDF here or click to browse/i),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Scan Resume/i }),
    ).toBeDisabled();
  });
});
