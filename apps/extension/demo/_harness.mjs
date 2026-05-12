// Test harness: Playwright Chromium with the extension loaded.
// Capabilities exposed via this script (env-var-driven):
//   MODE=launch     - start chromium with extension, hold open
//   MODE=connect    - run /extension/connect flow + verify auth via background storage
//   MODE=screenshot - take a screenshot of the popup in a given state
//   MODE=teardown   - kill the running chromium
//
// State persists at /tmp/slothing-harness-profile (so multiple invocations
// share the same auth + browser session). CDP exposed on :9333.

import { chromium } from "/home/anonabento/slothing/node_modules/.pnpm/playwright@1.59.1/node_modules/playwright/index.mjs";
import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import os from "node:os";

const MODE = process.env.MODE || "launch";
const EXT_PATH = "/home/anonabento/slothing/apps/extension/dist";
const PROFILE = path.join(os.tmpdir(), "slothing-harness-profile");
const CDP_PORT = 9333;
const SCREENSHOT_DIR = "/tmp/slothing-screenshots";

const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);

async function getOrLaunch() {
  // If chromium is up via CDP, attach. Otherwise launch.
  try {
    const browser = await chromium.connectOverCDP(`http://localhost:${CDP_PORT}`, { timeout: 2000 });
    return { browser, ctx: browser.contexts()[0], launched: false };
  } catch {
    // not running — launch
    log("launching chromium with extension");
    if (!existsSync(SCREENSHOT_DIR)) await mkdir(SCREENSHOT_DIR, { recursive: true });
    const ctx = await chromium.launchPersistentContext(PROFILE, {
      headless: false,
      args: [
        `--disable-extensions-except=${EXT_PATH}`,
        `--load-extension=${EXT_PATH}`,
        `--remote-debugging-port=${CDP_PORT}`,
      ],
      viewport: { width: 1280, height: 850 },
    });
    return { ctx, launched: true };
  }
}

async function getServiceWorker(ctx) {
  let sw = ctx.serviceWorkers()[0];
  if (!sw) sw = await ctx.waitForEvent("serviceworker", { timeout: 15000 });
  return sw;
}

async function getExtensionStorage(sw) {
  return await sw.evaluate(() => new Promise((res) =>
    chrome.storage.local.get(null, (r) => res(r)),
  ));
}

async function getAuthStatus(sw) {
  return await sw.evaluate(() => new Promise((res) => {
    chrome.runtime.sendMessage({ type: "GET_AUTH_STATUS" }, (r) => res(r));
  }));
}

async function modeLaunch() {
  const { ctx, launched } = await getOrLaunch();
  if (launched) {
    const sw = await getServiceWorker(ctx);
    log("service worker:", sw.url().slice(0, 80));
    // Open Slothing in first tab
    const p = ctx.pages()[0] ?? (await ctx.newPage());
    await p.goto("http://localhost:3000/en");
    log("opened Slothing — chromium ready on CDP", `:${CDP_PORT}`);
  } else {
    log("chromium already running, reused via CDP");
  }
  // detach (don't close)
}

async function modeConnect() {
  const { ctx } = await getOrLaunch();
  const sw = await getServiceWorker(ctx);

  // Clear any prior auth so we start fresh
  await sw.evaluate(() => new Promise((res) =>
    chrome.storage.local.remove("columbus_extension", res),
  ));
  log("cleared prior auth");

  // Get/create the Slothing tab
  let page = ctx.pages().find((p) => /localhost:3000/.test(p.url()));
  if (!page) page = await ctx.newPage();

  const ext_id = sw.url().split("/")[2];
  await page.goto(`http://localhost:3000/en/extension/connect?extensionId=${ext_id}`, {
    waitUntil: "domcontentloaded",
  });
  log("on /extension/connect");

  // The connect page may already auto-start, OR may show a button. Probe.
  await page.waitForTimeout(2000);
  const status = await page.evaluate(() => {
    const hasError = !!document.body.innerText.match(/Connection failed|couldn't reach/i);
    const hasSuccess = !!document.body.innerText.match(/connected successfully|Connected|Token saved/i);
    const hasButton = !!Array.from(document.querySelectorAll("button"))
      .find((b) => /generate|connect|retry/i.test(b.textContent || ""));
    return { hasError, hasSuccess, hasButton, text: document.body.innerText.slice(0, 300) };
  });
  log("connect-page status:", JSON.stringify(status));

  if (status.hasButton && !status.hasSuccess) {
    log("clicking the connect button");
    await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll("button"))
        .find((b) => /generate|connect/i.test(b.textContent || ""));
      if (b) b.click();
    });
    await page.waitForTimeout(2000);
  }

  // Check what landed in localStorage on the page side
  const ls = await page.evaluate(() => {
    try { return localStorage.getItem("columbus_extension_token"); }
    catch { return null; }
  });
  log("page localStorage token:", ls ? `<${ls.length} chars>` : "null");

  // Wait up to 5s for content script to pick it up
  for (let i = 0; i < 10; i++) {
    await page.waitForTimeout(500);
    const storage = await getExtensionStorage(sw);
    if (storage.columbus_extension?.authToken) {
      log("✅ extension storage has token after", (i + 1) * 0.5, "s");
      break;
    }
  }

  const finalStorage = await getExtensionStorage(sw);
  log("final extension storage:", JSON.stringify({
    hasAuth: !!finalStorage.columbus_extension?.authToken,
    tokenExpiry: finalStorage.columbus_extension?.tokenExpiry,
    apiBase: finalStorage.columbus_extension?.apiBaseUrl,
  }));

  const auth = await getAuthStatus(sw);
  log("GET_AUTH_STATUS:", JSON.stringify(auth));

  // Also tail content-script logs from the page
  const pageLogs = await page.evaluate(() => {
    // We can't retroactively get logs but we can probe localStorage now
    return { lsAfter: localStorage.getItem("columbus_extension_token") };
  });
  log("localStorage after pickup:", pageLogs.lsAfter ? "STILL THERE (pickup failed!)" : "cleared (pickup OK)");
}

async function modeScreenshot() {
  const stateLabel = process.env.LABEL || "default";
  const { ctx } = await getOrLaunch();
  const sw = await getServiceWorker(ctx);
  const ext_id = sw.url().split("/")[2];

  if (!existsSync(SCREENSHOT_DIR)) await mkdir(SCREENSHOT_DIR, { recursive: true });

  // Open the popup as a regular tab (chrome-extension:// works for screenshot)
  const popupUrl = `chrome-extension://${ext_id}/popup.html`;
  const page = await ctx.newPage();
  await page.setViewportSize({ width: 380, height: 600 });
  await page.goto(popupUrl);
  await page.waitForTimeout(1500);
  const screenshotPath = path.join(SCREENSHOT_DIR, `popup-${stateLabel}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  log("📸 wrote", screenshotPath);
  await page.close();
}

async function modeTeardown() {
  try {
    const browser = await chromium.connectOverCDP(`http://localhost:${CDP_PORT}`, { timeout: 1000 });
    const ctx = browser.contexts()[0];
    for (const p of ctx.pages()) await p.close().catch(() => {});
    await ctx.close().catch(() => {});
    await browser.close().catch(() => {});
    log("teardown done");
  } catch {
    log("nothing to tear down");
  }
}

const modes = { launch: modeLaunch, connect: modeConnect, screenshot: modeScreenshot, teardown: modeTeardown };
const fn = modes[MODE];
if (!fn) {
  console.error(`unknown MODE: ${MODE}. one of: ${Object.keys(modes).join(", ")}`);
  process.exit(2);
}
await fn();
