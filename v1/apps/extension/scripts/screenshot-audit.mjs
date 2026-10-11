import { chromium } from "@playwright/test";
import { createServer } from "node:http";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const extensionRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(extensionRoot, "../..");
const distChrome = path.join(extensionRoot, "dist");
const outputDir = path.resolve(
  repoRoot,
  process.argv[2] || "docs/audits/extension-redesign-2026-05-17/screenshots",
);
const fixturePath = path.join(
  extensionRoot,
  "tests",
  "fixtures",
  "linkedin-mock.html",
);

const profile = {
  id: "profile-screenshot-audit",
  contact: {
    name: "Riley Chen",
    email: "riley.chen@example.com",
    phone: "+1 555 010 1200",
    location: "Seattle, WA, United States",
    linkedin: "https://www.linkedin.com/in/rileychen",
    github: "https://github.com/rileychen",
    website: "https://rileychen.example.com",
  },
  summary: "Platform engineer focused on reliable product infrastructure.",
  experiences: [
    {
      id: "exp-1",
      company: "Northwind Labs",
      title: "Staff Software Engineer",
      location: "Seattle, WA",
      startDate: "2021-01",
      current: true,
      description: "Leads platform engineering for customer-facing systems.",
      highlights: ["Built deployment automation", "Mentored engineers"],
      skills: ["TypeScript", "React", "Node.js"],
    },
  ],
  education: [],
  skills: [
    {
      id: "skill-1",
      name: "TypeScript",
      category: "technical",
      proficiency: "expert",
    },
  ],
  projects: [],
  certifications: [],
  computed: {
    firstName: "Riley",
    lastName: "Chen",
    currentCompany: "Northwind Labs",
    currentTitle: "Staff Software Engineer",
    yearsExperience: 9,
    skillsList: "TypeScript, React, Node.js",
  },
  updatedAt: new Date().toISOString(),
};

const settings = {
  autoFillEnabled: true,
  showConfidenceIndicators: true,
  minimumConfidence: 0.5,
  learnFromAnswers: true,
  notifyOnJobDetected: true,
  autoTrackApplicationsEnabled: true,
  captureScreenshotEnabled: false,
};

if (!existsSync(path.join(distChrome, "manifest.json"))) {
  throw new Error("Missing dist/manifest.json. Run build:chrome first.");
}

await mkdir(outputDir, { recursive: true });

const userDataDir = path.join(tmpdir(), `slothing-extension-audit-${Date.now()}`);
const apiServer = await startApiServer();
const apiBaseUrl = `http://127.0.0.1:${apiServer.address().port}`;
const context = await chromium.launchPersistentContext(userDataDir, {
  headless: false,
  viewport: { width: 1280, height: 900 },
  args: [
    `--disable-extensions-except=${distChrome}`,
    `--load-extension=${distChrome}`,
    "--no-sandbox",
    "--disable-setuid-sandbox",
  ],
});

try {
  let [worker] = context.serviceWorkers();
  if (!worker) {
    worker = await context.waitForEvent("serviceworker", { timeout: 10_000 });
  }
  const extensionId = worker.url().split("/")[2];
  const extensionBase = `chrome-extension://${extensionId}`;

  await screenshotPopupUnauthed(extensionBase);
  await seedExtensionState(extensionBase);
  await screenshotOptions(extensionBase);
  await screenshotUnsupportedPopup(extensionBase);
  const jobPage = await openJobFixture();
  await screenshotJobPopup(extensionBase, jobPage);
  await screenshotSidebarStates(jobPage);
  await screenshotInlineContentUi();

  await writeFile(
    path.join(outputDir, "manifest.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        extensionId,
        screenshots: [
          "01-popup-unauthenticated.png",
          "02-options-authenticated.png",
          "03-popup-unsupported.png",
          "04-popup-job-detected.png",
          "05-sidebar-right.png",
          "06-sidebar-collapsed.png",
          "07-sidebar-left.png",
          "08-sidebar-floating.png",
          "09-inline-content-ui.png",
        ],
      },
      null,
      2,
    ),
  );

  console.log(`Wrote extension screenshot audit to ${outputDir}`);
} finally {
  await context.close().catch(() => {});
  await new Promise((resolve) => apiServer.close(resolve));
  await rm(userDataDir, { recursive: true, force: true }).catch(() => {});
}

function startApiServer() {
  return new Promise((resolve) => {
    const server = createServer((request, response) => {
      if (
        request.method === "GET" &&
        request.url === "/api/extension/auth/verify"
      ) {
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ ok: true }));
        return;
      }
      if (
        request.method === "GET" &&
        request.url === "/api/extension/profile"
      ) {
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify(profile));
        return;
      }
      response.writeHead(404, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "not found" }));
    });
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}

async function screenshotInlineContentUi() {
  const page = await context.newPage();
  const url = "https://www.linkedin.com/jobs/view/inline-ui-audit.html";
  try {
    await page.route(url, (route) =>
      route.fulfill({
        status: 200,
        contentType: "text/html",
        body: `<!doctype html>
          <html>
            <head>
              <title>Inline UI Audit</title>
              <style>
                body {
                  margin: 0;
                  padding: 32px;
                  font-family: system-ui, sans-serif;
                  background: #f7f7f7;
                  color: #1a1530;
                }
                main {
                  max-width: 720px;
                  display: grid;
                  gap: 18px;
                }
                label {
                  display: grid;
                  gap: 6px;
                  font-weight: 700;
                }
                input, textarea {
                  width: 420px;
                  padding: 10px;
                  border: 1px solid #ccc;
                  border-radius: 6px;
                  font: inherit;
                }
                .fixture-row {
                  position: relative;
                  min-height: 92px;
                }
              </style>
            </head>
            <body>
              <main>
                <h1>Inline UI audit</h1>
                <label>
                  Highlighted field
                  <input class="slothing-field-highlight" value="Riley Chen" />
                </label>
                <label>
                  Filled field
                  <input class="slothing-field-filled" value="riley.chen@example.com" />
                </label>
                <div class="fixture-row">
                  <span class="slothing-zone-badge" tabindex="0">?</span>
                  <div class="slothing-zone-popover" style="left: 34px; top: 0;">
                    <span class="slothing-zone-popover__title">Review suggestions</span>
                    <ul class="slothing-zone-popover__list">
                      <li>
                        <button class="slothing-zone-popover__item">
                          <span class="slothing-zone-popover__label">Profile value</span>
                          <span class="slothing-zone-popover__value">Staff Software Engineer</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="fixture-row">
                  <div class="slothing-suggestions" style="position: static; width: 420px;">
                    <div class="slothing-suggestion-item">
                      <div class="slothing-suggestion-question">Why are you interested?</div>
                      <div class="slothing-suggestion-answer">I like platform roles where reliability work supports product teams.</div>
                      <div class="slothing-suggestion-similarity">82%</div>
                    </div>
                  </div>
                </div>
                <div class="slothing-toast" style="position: static; width: max-content;">
                  Answer saved
                </div>
              </main>
            </body>
          </html>`,
      }),
    );
    await page.setViewportSize({ width: 960, height: 720 });
    await page.goto(url);
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(800);
    await page.screenshot({
      path: path.join(outputDir, "09-inline-content-ui.png"),
      fullPage: true,
    });
  } finally {
    await page.close();
  }
}

async function screenshotPopupUnauthed(extensionBase) {
  const page = await context.newPage();
  try {
    await page.setViewportSize({ width: 390, height: 620 });
    await page.goto(`${extensionBase}/popup.html`);
    await page.locator(".popup").waitFor({ timeout: 10_000 });
    await page.screenshot({
      path: path.join(outputDir, "01-popup-unauthenticated.png"),
      fullPage: true,
    });
  } finally {
    await page.close();
  }
}

async function seedExtensionState() {
  let [worker] = context.serviceWorkers();
  if (!worker) {
    worker = await context.waitForEvent("serviceworker", { timeout: 10_000 });
  }
  await worker.evaluate(
    ({ seededProfile, seededSettings, seededApiBaseUrl }) =>
      Promise.all([
        new Promise((resolve, reject) => {
          chrome.storage.local.set(
            {
              slothing_extension: {
                apiBaseUrl: seededApiBaseUrl,
                authToken: "screenshot-token",
                tokenExpiry: "2099-01-01T00:00:00.000Z",
                lastSeenAuthAt: new Date().toISOString(),
                cachedProfile: seededProfile,
                profileCachedAt: new Date().toISOString(),
                settings: seededSettings,
              },
            },
            () => {
              const message = chrome.runtime.lastError?.message;
              if (message) reject(new Error(message));
              else resolve(undefined);
            },
          );
        }),
        new Promise((resolve, reject) => {
          chrome.storage.session.set(
            {
              slothing_auth_cache: {
                authenticated: true,
                at: new Date().toISOString(),
              },
            },
            () => {
              const message = chrome.runtime.lastError?.message;
              if (message) reject(new Error(message));
              else resolve(undefined);
            },
          );
        }),
      ]),
    { seededProfile: profile, seededSettings: settings, seededApiBaseUrl: apiBaseUrl },
  );
}

async function screenshotOptions(extensionBase) {
  const page = await context.newPage();
  try {
    await page.setViewportSize({ width: 1180, height: 860 });
    await page.goto(`${extensionBase}/options.html`);
    await page.locator("h1", { hasText: "Slothing Settings" }).waitFor({
      timeout: 10_000,
    });
    await page.screenshot({
      path: path.join(outputDir, "02-options-authenticated.png"),
      fullPage: true,
    });
  } finally {
    await page.close();
  }
}

async function screenshotUnsupportedPopup(extensionBase) {
  const unsupported = await context.newPage();
  const popup = await context.newPage();
  try {
    await unsupported.route("https://example.com/", (route) =>
      route.fulfill({
        status: 200,
        contentType: "text/html",
        body: "<!doctype html><title>Unsupported</title><main>Unsupported page</main>",
      }),
    );
    await unsupported.goto("https://example.com/");
    const unsupportedTabId = await tabIdForUrl("example.com");
    await popup.goto(`${extensionBase}/popup.html`);
    await popup.evaluate((tabId) => chrome.tabs.update(tabId, { active: true }), unsupportedTabId);
    await popup.reload();
    await popup.setViewportSize({ width: 390, height: 620 });
    await popup.locator(".popup").waitFor({ timeout: 10_000 });
    await popup.screenshot({
      path: path.join(outputDir, "03-popup-unsupported.png"),
      fullPage: true,
    });
  } finally {
    await popup.close();
    await unsupported.close();
  }
}

async function openJobFixture() {
  const page = await context.newPage();
  const html = await readFile(fixturePath, "utf8");
  const url = "https://www.linkedin.com/jobs/view/linkedin-mock.html";
  await page.route(url, (route) =>
    route.fulfill({ status: 200, contentType: "text/html", body: html }),
  );
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(url);
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(1200);
  return page;
}

async function screenshotJobPopup(extensionBase, jobPage) {
  const popup = await context.newPage();
  try {
    const jobTabId = await tabIdForUrl("linkedin-mock.html");
    await popup.goto(`${extensionBase}/popup.html`);
    await popup.evaluate((tabId) => chrome.tabs.update(tabId, { active: true }), jobTabId);
    await popup.reload();
    await popup.setViewportSize({ width: 390, height: 620 });
    await popup.locator(".popup").waitFor({ timeout: 10_000 });
    await popup.locator("text=Job").first().waitFor({ timeout: 10_000 });
    await popup.screenshot({
      path: path.join(outputDir, "04-popup-job-detected.png"),
      fullPage: true,
    });
  } finally {
    await popup.close();
    await jobPage.bringToFront();
  }
}

async function screenshotSidebarStates(page) {
  await page.bringToFront();
  await page.locator("#slothing-job-page-sidebar-host").waitFor({
    state: "attached",
    timeout: 10_000,
  });
  await page.waitForFunction(() =>
    document
      .querySelector("#slothing-job-page-sidebar-host")
      ?.shadowRoot?.textContent?.includes("Tailor resume"),
  );
  await page.screenshot({
    path: path.join(outputDir, "05-sidebar-right.png"),
    fullPage: true,
  });

  await clickShadowButton(page, "Collapse Slothing sidebar");
  await page.waitForTimeout(300);
  await page.screenshot({
    path: path.join(outputDir, "06-sidebar-collapsed.png"),
    fullPage: true,
  });

  await clickShadowButton(page, "Open Slothing sidebar");
  await clickShadowButton(page, "Dock Slothing sidebar on the left");
  await page.waitForTimeout(300);
  await page.screenshot({
    path: path.join(outputDir, "07-sidebar-left.png"),
    fullPage: true,
  });

  await clickShadowButton(page, "Float Slothing sidebar");
  await page.waitForTimeout(300);
  await page.screenshot({
    path: path.join(outputDir, "08-sidebar-floating.png"),
    fullPage: true,
  });
}

async function clickShadowButton(page, label) {
  await page.locator("#slothing-job-page-sidebar-host").evaluate(
    (host, buttonLabel) => {
      const button = Array.from(
        host.shadowRoot?.querySelectorAll("button") || [],
      ).find(
        (candidate) => candidate.getAttribute("aria-label") === buttonLabel,
      );
      if (!(button instanceof HTMLButtonElement)) {
        throw new Error(`Button not found: ${buttonLabel}`);
      }
      button.click();
    },
    label,
  );
}

async function tabIdForUrl(part) {
  const pages = await context.backgroundPages();
  void pages;
  let [worker] = context.serviceWorkers();
  if (!worker) {
    worker = await context.waitForEvent("serviceworker", { timeout: 10_000 });
  }
  return worker.evaluate((urlPart) => {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({}, (tabs) => {
        const tab = tabs.find((candidate) => candidate.url?.includes(urlPart));
        if (!tab?.id) reject(new Error(`No tab found for ${urlPart}`));
        else resolve(tab.id);
      });
    });
  }, part);
}
