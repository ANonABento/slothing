import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  webServer:
    process.env.SLOTHING_INTEGRATION === "1"
      ? {
          command: "pnpm --filter @slothing/web dev -- -p 3100",
          url: process.env.SLOTHING_BASE_URL || "http://localhost:3100",
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
          env: {
            TURSO_DATABASE_URL:
              process.env.TURSO_DATABASE_URL ||
              `file:./apps/web/data/extension-e2e-${process.pid}.db`,
            NEXTAUTH_URL:
              process.env.SLOTHING_BASE_URL || "http://localhost:3100",
          },
        }
      : undefined,
  use: {
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  // Extension tests launch their own persistent Chromium context via beforeAll
  projects: [
    {
      name: "chromium",
    },
  ],
});
