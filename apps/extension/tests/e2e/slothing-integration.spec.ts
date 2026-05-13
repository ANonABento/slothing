import { expect, test, type BrowserContext } from "@playwright/test";
import {
  closeExtensionContext,
  loadDemoPage,
  launchExtensionContext,
  seedExtensionStorage,
  sendMessageToTab,
} from "../helpers/extension-context";

const integrationEnabled = process.env.SLOTHING_INTEGRATION === "1";
const slothingBaseUrl =
  process.env.SLOTHING_BASE_URL || "http://localhost:3000";

test.skip(
  !integrationEnabled,
  "Set SLOTHING_INTEGRATION=1 to run the Slothing import pipeline test.",
);

let context: BrowserContext;
let extensionId: string;
let teardownContext:
  | Awaited<ReturnType<typeof launchExtensionContext>>
  | undefined;

test.beforeAll(async ({ request }) => {
  teardownContext = await launchExtensionContext();
  context = teardownContext.context;
  extensionId = teardownContext.extensionId;

  const authResponse = await request.post(
    `${slothingBaseUrl}/api/extension/auth`,
    {
      data: {
        deviceInfo: "Playwright Columbus integration",
        transport: "runtime",
      },
    },
  );
  expect(authResponse.ok()).toBe(true);
  const auth = (await authResponse.json()) as {
    token: string;
    expiresAt: string;
  };

  await seedExtensionStorage(context, extensionId, {
    authToken: auth.token,
    tokenExpiry: auth.expiresAt,
    apiBaseUrl: slothingBaseUrl,
    settings: {
      autoFillEnabled: true,
      showConfidenceIndicators: true,
      minimumConfidence: 0.5,
      learnFromAnswers: true,
      notifyOnJobDetected: true,
    },
  });
});

test.afterAll(async () => {
  await closeExtensionContext(teardownContext);
});

test("imports a scraped fixture job through the extension into Slothing", async () => {
  test.setTimeout(180_000);

  const jobPage = await context.newPage();
  try {
    await loadDemoPage(jobPage, "job-form.html");

    const status = await sendMessageToTab<{
      hasJobListing: boolean;
      scrapedJob: { title: string; company: string } | null;
    }>(context, extensionId, "job-form.html", { type: "GET_PAGE_STATUS" });
    expect(status.hasJobListing).toBe(true);
    expect(status.scrapedJob).toMatchObject({
      title: "Senior Software Engineer",
      company: "Acme Corp",
    });

    const importResponse = await sendMessageToTab<{
      success: boolean;
      data?: {
        imported: number;
        opportunityIds: string[];
        pendingCount: number;
      };
      error?: string;
    }>(context, extensionId, "job-form.html", { type: "TRIGGER_IMPORT" });

    expect(importResponse.success).toBe(true);
    expect(importResponse.data?.imported).toBe(1);
    expect(importResponse.data?.opportunityIds).toHaveLength(1);
    expect(importResponse.data?.pendingCount).toBeGreaterThanOrEqual(1);

    const appPage = await context.newPage();
    await appPage.goto(`${slothingBaseUrl}/opportunities`);
    await expect(
      appPage.getByRole("link", { name: "Senior Software Engineer" }).first(),
    ).toBeVisible({ timeout: 30_000 });
    await expect(appPage.getByText("Acme Corp").first()).toBeVisible();
    await appPage.close();
  } finally {
    await jobPage.close();
  }
});
