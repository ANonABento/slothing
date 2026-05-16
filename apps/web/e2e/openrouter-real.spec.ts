import {
  expect,
  test,
  type APIRequestContext,
  type Page,
} from "@playwright/test";
import { createClient } from "@libsql/client";
import { readFile } from "node:fs/promises";
import path from "node:path";

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY?.trim();
const SMOKE_MODEL =
  process.env.OPENROUTER_SMOKE_MODEL?.trim() || "openrouter/openai/gpt-4o-mini";
const PARSE_RESUME_TASK = "slothing.parse_resume";
const RESUME_FIXTURE = path.join(
  process.cwd(),
  "e2e",
  "fixtures",
  "test-resume.pdf",
);

test.describe("OpenRouter BentoRouter smoke", () => {
  test.skip(
    !OPENROUTER_KEY,
    "Set OPENROUTER_API_KEY to run the real OpenRouter smoke.",
  );

  test("fresh install parses an uploaded resume and records usage cost", async ({
    page,
    playwright,
  }, testInfo) => {
    const userId = smokeUserId("fresh", testInfo.project.name);
    const api = await playwright.request.newContext({
      baseURL: baseUrl(),
      extraHTTPHeaders: authHeaders(userId),
    });

    try {
      await addOpenRouterProvider(api, userId);
      await preferSmokeModelForParsing(api);
      await uploadResume(api);
      await expectUsageCost(api);
      await expectSettingsUsageRow(page, userId);
    } finally {
      await api.dispose();
    }
  });

  test("legacy llm_config migrates on first request, parses, and records usage cost", async ({
    page,
    playwright,
  }, testInfo) => {
    const userId = smokeUserId("upgrade", testInfo.project.name);
    await seedLegacyOpenRouterConfig(userId);

    const api = await playwright.request.newContext({
      baseURL: baseUrl(),
      extraHTTPHeaders: authHeaders(userId),
    });

    try {
      await uploadResume(api);
      await expectMigratedProvider(api);
      await expectUsageCost(api);
      await expectSettingsUsageRow(page, userId);
    } finally {
      await api.dispose();
    }
  });
});

async function addOpenRouterProvider(api: APIRequestContext, userId: string) {
  const response = await api.post("/api/settings/llm/providers", {
    data: {
      type: "openrouter",
      displayName: `OpenRouter smoke ${userId}`,
      apiKey: OPENROUTER_KEY,
      defaultModel: SMOKE_MODEL,
    },
  });
  expect(response.ok(), await response.text()).toBe(true);
}

async function preferSmokeModelForParsing(api: APIRequestContext) {
  const response = await api.put(
    `/api/settings/llm/policies/${encodeURIComponent(PARSE_RESUME_TASK)}`,
    {
      data: {
        primaryModel: SMOKE_MODEL,
        fallbacks: [],
        guardrails: {
          maxOutputTokens: 768,
          timeoutMs: 60_000,
          maxRetries: 0,
        },
      },
    },
  );
  expect(response.ok(), await response.text()).toBe(true);
}

async function uploadResume(api: APIRequestContext) {
  const response = await api.post("/api/upload?force=true", {
    multipart: {
      file: {
        name: "test-resume.pdf",
        mimeType: "application/pdf",
        buffer: await readFile(RESUME_FIXTURE),
      },
    },
  });
  expect(response.ok(), await response.text()).toBe(true);

  const body = (await response.json()) as {
    success?: boolean;
    document?: { type?: string };
  };
  expect(body.success).toBe(true);
  expect(body.document?.type).toBe("resume");
}

async function expectMigratedProvider(api: APIRequestContext) {
  const response = await api.get("/api/settings/llm/providers");
  expect(response.ok(), await response.text()).toBe(true);
  const body = (await response.json()) as {
    providers?: Array<{ type?: string; defaultModel?: string }>;
  };
  expect(body.providers).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        type: "openrouter",
        defaultModel: SMOKE_MODEL,
      }),
    ]),
  );
}

async function expectUsageCost(api: APIRequestContext) {
  await expect
    .poll(
      async () => {
        const response = await api.get("/api/settings/llm/usage");
        if (!response.ok()) return 0;
        const body = (await response.json()) as {
          rows?: Array<{
            key?: string;
            successCount?: number;
            actualCostUsd?: number;
          }>;
        };
        return (
          body.rows?.find(
            (row) =>
              row.key === PARSE_RESUME_TASK && Number(row.successCount) > 0,
          )?.actualCostUsd ?? 0
        );
      },
      { timeout: 30_000 },
    )
    .toBeGreaterThan(0);
}

async function expectSettingsUsageRow(page: Page, userId: string) {
  await page.setExtraHTTPHeaders(authHeaders(userId));
  await page.goto("/en/settings/llm");
  await page.waitForLoadState("networkidle");
  await expect(
    page.getByRole("row", { name: new RegExp(PARSE_RESUME_TASK) }),
  ).toBeVisible({ timeout: 30_000 });
}

async function seedLegacyOpenRouterConfig(userId: string) {
  const client = createClient({ url: sqliteUrl() });
  try {
    await client.execute({
      sql: `INSERT INTO settings (key, user_id, value, updated_at)
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(key, user_id) DO UPDATE SET
              value = excluded.value,
              updated_at = CURRENT_TIMESTAMP`,
      args: [
        "llm_config",
        userId,
        JSON.stringify({
          provider: "openrouter",
          apiKey: OPENROUTER_KEY,
          model: SMOKE_MODEL,
        }),
      ],
    });
  } finally {
    client.close();
  }
}

function smokeUserId(prefix: string, projectName: string) {
  return `openrouter-${prefix}-${projectName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
}

function authHeaders(userId: string) {
  return { "x-get-me-job-e2e-user": userId };
}

function baseUrl() {
  return process.env.PLAYWRIGHT_BASE_URL || `http://localhost:${port()}`;
}

function port() {
  return process.env.PORT || "8888";
}

function sqliteUrl() {
  if (process.env.TURSO_DATABASE_URL?.trim()) {
    return process.env.TURSO_DATABASE_URL.trim();
  }
  return `file:${
    process.env.GET_ME_JOB_SQLITE_PATH ||
    path.join(process.cwd(), "data", "get-me-job-e2e.db")
  }`;
}
