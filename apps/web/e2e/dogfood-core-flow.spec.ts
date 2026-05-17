import {
  test,
  expect,
  type APIRequestContext,
  type Page,
} from "@playwright/test";
import { readFileSync } from "fs";
import path from "path";
import { createTestJob, prepareAppPage } from "./utils/test-helpers";

const RILEY_RESUME = path.join(
  __dirname,
  "..",
  "tests",
  "fixtures",
  "dogfood",
  "riley-resume.txt",
);
const EXAMPLEWORKS_JOB = path.join(
  __dirname,
  "..",
  "tests",
  "fixtures",
  "dogfood",
  "exampleworks-senior-product-engineer.md",
);

interface UploadResponse {
  document: {
    id: string;
    filename: string;
    type: string;
  };
  entriesCreated: number;
  parsing?: {
    confidence: number;
    sectionsDetected: string[];
    llmUsed: boolean;
  };
}

interface ProfileResponse {
  profile?: {
    contact?: { name?: string; email?: string };
    experiences?: Array<{ title?: string; company?: string }>;
    education?: Array<{ institution?: string }>;
    skills?: Array<{ name?: string }>;
  };
}

interface OpportunitiesResponse {
  opportunities?: Array<{ id: string; title: string; company: string }>;
}

interface BankDocumentsResponse {
  documents?: Array<{ id: string }>;
}

async function cleanCurrentUser(request: APIRequestContext) {
  const documentsResponse = await request.get("/api/bank/documents");
  if (documentsResponse.ok()) {
    const { documents = [] } =
      (await documentsResponse.json()) as BankDocumentsResponse;
    const documentIds = documents.map((document) => document.id);
    if (documentIds.length > 0) {
      await request.delete("/api/bank/documents", {
        data: { documentIds },
      });
    }
  }

  const opportunitiesResponse = await request.get(
    "/api/opportunities?limit=100",
  );
  if (opportunitiesResponse.ok()) {
    const { opportunities = [] } =
      (await opportunitiesResponse.json()) as OpportunitiesResponse;
    await Promise.all(
      opportunities.map((opportunity) =>
        request.delete(`/api/opportunities/${opportunity.id}`),
      ),
    );
  }

  await request.delete("/api/profile");
}

async function uploadRileyResume(page: Page): Promise<UploadResponse> {
  await prepareAppPage(page, "/en/bank");

  const uploadResponsePromise = page.waitForResponse(
    (response) =>
      new URL(response.url()).pathname === "/api/upload" &&
      response.request().method() === "POST",
  );

  await page.locator("input[type='file']").setInputFiles(RILEY_RESUME);
  const uploadResponse = await uploadResponsePromise;
  expect(uploadResponse.status()).toBe(200);

  const uploadData = (await uploadResponse.json()) as UploadResponse;

  const reviewDialog = page.getByRole("dialog");
  await expect(reviewDialog).toContainText("riley-resume.txt", {
    timeout: 15_000,
  });
  await reviewDialog.getByRole("button", { name: /^done$/i }).click();
  await expect(reviewDialog).not.toBeVisible();

  return uploadData;
}

async function getCreatedOpportunityId(
  request: APIRequestContext,
  title: string,
) {
  const response = await request.get("/api/opportunities?limit=100");
  expect(response.ok()).toBe(true);
  const data = (await response.json()) as OpportunitiesResponse;
  const opportunity = data.opportunities?.find((item) => item.title === title);
  expect(opportunity).toBeTruthy();
  return opportunity!.id;
}

test.describe("Dogfood core flow", () => {
  test.beforeEach(async ({ page, request }) => {
    await cleanCurrentUser(request);
    await page.addInitScript(() => {
      localStorage.clear();
      localStorage.setItem("get_me_job_onboarding_completed", "true");
    });
  });

  test("uploads, parses, creates an opportunity, checks ATS, and opens Studio with accessible bank checkboxes", async ({
    page,
    request,
  }) => {
    test.setTimeout(120_000);

    const uploadData = await uploadRileyResume(page);
    expect(uploadData.document).toMatchObject({
      filename: "riley-resume.txt",
      type: "resume",
    });
    expect(uploadData.entriesCreated).toBeGreaterThanOrEqual(15);
    expect(uploadData.parsing).toMatchObject({
      llmUsed: false,
    });

    const profileResponse = await request.get("/api/profile");
    expect(profileResponse.ok()).toBe(true);
    const { profile } = (await profileResponse.json()) as ProfileResponse;
    expect(profile?.contact).toMatchObject({
      name: "Riley Chen",
      email: "riley.chen@example.test",
    });
    expect(profile?.experiences?.length).toBeGreaterThanOrEqual(2);
    expect(profile?.education?.length).toBeGreaterThanOrEqual(1);
    expect(profile?.skills?.some((skill) => skill.name === "TypeScript")).toBe(
      true,
    );

    const jobDescription = readFileSync(EXAMPLEWORKS_JOB, "utf8");
    await prepareAppPage(page, "/en/opportunities");
    await createTestJob(page, {
      title: "Senior Product Engineer",
      company: "ExampleWorks",
      description: jobDescription,
      url: "https://example.test/jobs/senior-product-engineer",
    });

    await expect(
      page.getByRole("button", {
        name: /Open Senior Product Engineer at ExampleWorks/i,
      }),
    ).toBeVisible({ timeout: 15_000 });

    const opportunityId = await getCreatedOpportunityId(
      request,
      "Senior Product Engineer",
    );

    await page.goto(`/en/opportunities/${opportunityId}`);
    await expect(
      page.getByRole("heading", { name: "Senior Product Engineer" }),
    ).toBeVisible();

    const analyzeResponsePromise = page.waitForResponse(
      (response) =>
        new URL(response.url()).pathname ===
          `/api/opportunities/${opportunityId}/analyze` &&
        response.request().method() === "POST",
    );
    await page.getByRole("button", { name: "Analyze Match" }).click();
    expect((await analyzeResponsePromise).status()).toBe(200);

    const atsResponsePromise = page.waitForResponse(
      (response) =>
        new URL(response.url()).pathname === "/api/ats/analyze" &&
        response.request().method() === "POST",
    );
    await page.getByRole("button", { name: "ATS Check" }).click();
    expect((await atsResponsePromise).status()).toBe(200);
    await expect(
      page.getByRole("heading", { name: "ATS Compatibility Analysis" }),
    ).toBeVisible({ timeout: 10_000 });
    await page.keyboard.press("Escape");

    await prepareAppPage(page, "/en/opportunities");
    await page
      .getByRole("button", {
        name: /Open details for Senior Product Engineer/i,
      })
      .click();
    await expect(
      page.getByRole("link", { name: /Tailor in Studio/i }),
    ).toBeVisible();
    await page.getByRole("link", { name: /Tailor in Studio/i }).click();

    await expect(page).toHaveURL(/\/en\/studio\?opportunityId=/);
    await expect(page.getByLabel("Job description")).toHaveValue(
      /accessible React and TypeScript/i,
      { timeout: 15_000 },
    );

    await page.getByRole("button", { name: /open bank picker/i }).click();
    const experienceCheckbox = page.getByRole("checkbox", {
      name: /Senior Product Engineer at Acme Talent/i,
    });
    await expect(experienceCheckbox).toBeVisible();
    await experienceCheckbox.focus();
    await page.keyboard.press("Space");
    await expect(experienceCheckbox).toBeChecked();
  });
});
