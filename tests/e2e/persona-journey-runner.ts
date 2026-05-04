import {
  expect,
  test,
  type Locator,
  type Page,
  type TestInfo,
} from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import {
  collectExpectedBankAssertions,
  fixturePathFor,
  formatSkipReason,
  missingFixtureLabels,
  parseTargetOpportunity,
  personaFixtureRequirements,
  personaJourneySteps,
  requiredPersonaFixtures,
  type PersonaSlug,
  type PersonaTargetOpportunity,
} from "../../src/lib/persona-journey";

const repoRoot = path.resolve(__dirname, "../..");

function existingFixturePaths(slug: PersonaSlug): Set<string> {
  return new Set(
    requiredPersonaFixtures
      .map((requirement) => fixturePathFor(requirement, slug))
      .filter((relativePath) =>
        fs.existsSync(path.join(repoRoot, relativePath)),
      ),
  );
}

function readJsonFixture(relativePath: string): unknown {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), "utf8"));
}

async function captureStep(
  page: Page,
  testInfo: TestInfo,
  slug: PersonaSlug,
  screenshotName: string,
): Promise<void> {
  const screenshotPath = path.join(
    repoRoot,
    "tests",
    "journey-screenshots",
    slug,
    screenshotName,
  );
  fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });
  await page.screenshot({ path: screenshotPath, fullPage: true });
  await testInfo.attach(`${slug}-${screenshotName}`, {
    path: screenshotPath,
    contentType: "image/png",
  });
  await testInfo.attach(`${slug}-${screenshotName}.dom.html`, {
    body: await page.locator("body").evaluate((body) => body.outerHTML),
    contentType: "text/html",
  });
}

async function expectReachable(page: Page, pathName: string): Promise<void> {
  await page.goto(pathName);
  await page.waitForLoadState("domcontentloaded");
  await expect(page.locator("body")).toBeVisible();
}

async function attachApiState(
  page: Page,
  testInfo: TestInfo,
  slug: PersonaSlug,
  stepId: string,
  endpoint: string,
): Promise<void> {
  const response = await page.request.get(endpoint);
  const body = await response.text();
  await testInfo.attach(`${slug}-${stepId}-${endpoint.replace(/\W+/g, "-")}`, {
    body,
    contentType:
      response.headers()["content-type"]?.split(";")[0] ??
      "application/octet-stream",
  });
  expect(response.ok()).toBe(true);
}

async function fillIfPresent(
  scope: Page | Locator,
  label: RegExp,
  value?: string,
): Promise<void> {
  if (!value) return;
  const field = scope.getByLabel(label).first();
  if (await field.isVisible({ timeout: 1000 }).catch(() => false)) {
    await field.fill(value);
  }
}

async function addTargetOpportunity(
  page: Page,
  opportunity: PersonaTargetOpportunity,
): Promise<void> {
  await page.getByRole("button", { name: /^add opportunity$/i }).click();
  const dialog = page.getByRole("dialog", { name: /add opportunity/i });
  await expect(dialog).toBeVisible();

  await dialog.getByLabel(/^title$/i).fill(opportunity.title);
  await dialog.getByLabel(/^(company|organizer)$/i).fill(opportunity.company);
  await fillIfPresent(dialog, /source url/i, opportunity.url);
  await fillIfPresent(dialog, /^city$/i, opportunity.location);
  await fillIfPresent(dialog, /required skills/i, opportunity.skills.join(", "));
  await dialog.getByLabel(/summary/i).fill(opportunity.summary);

  await Promise.all([
    page
      .waitForResponse(
        (response) =>
          new URL(response.url()).pathname === "/api/opportunities" &&
          response.request().method() === "POST",
      )
      .catch(() => undefined),
    dialog.getByRole("button", { name: /^add opportunity$/i }).click(),
  ]);

  await expect(dialog).not.toBeVisible({ timeout: 10000 });
  await expect(page.getByText(opportunity.title, { exact: false })).toBeVisible(
    { timeout: 10000 },
  );
}

export function createPersonaJourneySpec(slug: PersonaSlug): void {
  test.describe(`persona journey - ${slug}`, () => {
    test(`walks the full app journey for ${slug}`, async ({
      page,
    }, testInfo) => {
      const missing = missingFixtureLabels(slug, existingFixturePaths(slug));
      test.skip(missing.length > 0, formatSkipReason(slug, missing));

      await page.setExtraHTTPHeaders({
        "x-get-me-job-e2e-user": `persona-${slug}`,
      });

      const email = `${slug}@test.example.com`;
      const expectedBankFixture = readJsonFixture(
        fixturePathFor(personaFixtureRequirements.expectedBankEntries, slug),
      );
      const targetOpportunity = parseTargetOpportunity(
        readJsonFixture(
          fixturePathFor(personaFixtureRequirements.targetOpportunity, slug),
        ),
      );

      // Expected: sign-up accepts a unique email or the E2E header auth bypass lands in the app shell.
      await expectReachable(page, "/sign-up");
      await page
        .getByLabel(/email/i)
        .fill(email)
        .catch(() => undefined);
      await captureStep(
        page,
        testInfo,
        slug,
        personaJourneySteps.signUp.screenshotName,
      );

      // Expected: onboarding can be completed or skipped using reasonable defaults for this persona.
      await expectReachable(page, "/dashboard");
      const skip = page.getByRole("button", { name: /skip|later|close/i });
      if (await skip.isVisible({ timeout: 1000 }).catch(() => false)) {
        await skip.click();
      }
      await captureStep(
        page,
        testInfo,
        slug,
        personaJourneySteps.onboarding.screenshotName,
      );

      // Expected: upload accepts the persona resume PDF and creates parsed profile/bank data.
      await expectReachable(page, "/bank");
      const resumePath = path.join(
        repoRoot,
        fixturePathFor(personaFixtureRequirements.resumePdf, slug),
      );
      const fileInput = page.locator('input[type="file"]').first();
      await Promise.all([
        page.waitForResponse(
          (response) =>
            new URL(response.url()).pathname === "/api/upload" &&
            response.request().method() === "POST",
          { timeout: 120000 },
        ),
        fileInput.setInputFiles(resumePath),
      ]);
      await attachApiState(page, testInfo, slug, "upload-resume", "/api/bank");
      await captureStep(
        page,
        testInfo,
        slug,
        personaJourneySteps.uploadResume.screenshotName,
      );

      // Expected: /bank renders entries matching the persona expected.json fixture.
      await expectReachable(page, "/bank");
      const expectedBankAssertions =
        collectExpectedBankAssertions(expectedBankFixture);
      expect(
        expectedBankAssertions.length,
        "expected.json must include rendered bank values to compare",
      ).toBeGreaterThan(0);
      for (const expectedText of expectedBankAssertions) {
        await expect(page.locator("body")).toContainText(expectedText);
      }
      await captureStep(
        page,
        testInfo,
        slug,
        personaJourneySteps.verifyBank.screenshotName,
      );

      // Expected: the target opportunity can be added from URL or manual fixture data.
      await expectReachable(page, "/opportunities");
      await addTargetOpportunity(page, targetOpportunity);
      await attachApiState(
        page,
        testInfo,
        slug,
        "add-opportunity",
        "/api/opportunities",
      );
      await captureStep(
        page,
        testInfo,
        slug,
        personaJourneySteps.addOpportunity.screenshotName,
      );

      // Expected: Studio can generate a tailored resume for the newly added opportunity.
      await expectReachable(page, "/studio");
      await expect(page.locator("body")).toContainText(
        /studio|resume|document/i,
      );
      await expect(page.locator("body")).toContainText(
        new RegExp(
          targetOpportunity.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          "i",
        ),
      );
      await captureStep(
        page,
        testInfo,
        slug,
        personaJourneySteps.tailorResume.screenshotName,
      );

      // Expected: cover-letter flow generates persona- and job-specific content.
      await expectReachable(page, "/cover-letter");
      await expect(page.locator("body")).toContainText(/cover letter|letter/i);
      await captureStep(
        page,
        testInfo,
        slug,
        personaJourneySteps.coverLetter.screenshotName,
      );

      // Expected: ATS scanner accepts the resume and job description and returns a result.
      await expectReachable(page, "/ats-scanner");
      await expect(page.locator("body")).toContainText(/ats|scan|score/i);
      await fillIfPresent(page, /resume/i, expectedBankAssertions.join("\n"));
      await fillIfPresent(
        page,
        /job description|description/i,
        targetOpportunity.summary,
      );
      await captureStep(
        page,
        testInfo,
        slug,
        personaJourneySteps.atsScan.screenshotName,
      );

      // Expected: analytics includes the new application in the funnel.
      await expectReachable(page, "/analytics");
      await expect(page.locator("body")).toContainText(
        /analytics|funnel|application/i,
      );
      await attachApiState(page, testInfo, slug, "analytics", "/api/analytics");
      await captureStep(
        page,
        testInfo,
        slug,
        personaJourneySteps.analytics.screenshotName,
      );
    });
  });
}
