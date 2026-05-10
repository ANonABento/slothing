import { defineConfig, devices } from "@playwright/test";

if (process.env.FORCE_COLOR) {
  delete process.env.NO_COLOR;
}

export default defineConfig({
  testDir: "./tests/audit",
  testIgnore: [
    "**/.worktrees/**",
    "**/.next/**",
    "**/node_modules/**",
    "**/playwright-report/**",
    "**/test-results/**",
  ],
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "off",
    screenshot: "off",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
