import { chromium } from "@playwright/test";
import { existsSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const extensionRoot = path.resolve(__dirname, "..");
const distChrome = path.join(extensionRoot, "dist");
const profileDir =
  process.env.SLOTHING_CHROME_PROFILE_DIR ||
  path.join(tmpdir(), "slothing-chrome-manual");
const startUrl =
  process.argv[2] ||
  "https://waterlooworks.uwaterloo.ca/myAccount/co-op/full/jobs.htm";

if (!existsSync(path.join(distChrome, "manifest.json"))) {
  throw new Error("Missing dist/manifest.json. Run build:chrome first.");
}

mkdirSync(profileDir, { recursive: true });

console.log("Launching Chrome/Chromium with Slothing extension");
console.log(`  extension: ${distChrome}`);
console.log(`  profile: ${profileDir}`);
console.log(`  start URL: ${startUrl}`);
console.log();
console.log("Console output from pages and the extension service worker follows.");
console.log("Type `dump` here to query the active WaterlooWorks tab state.");
console.log("Press Ctrl+C in this terminal to close Chrome.");
console.log();

const context = await chromium.launchPersistentContext(profileDir, {
  headless: false,
  args: [
    `--disable-extensions-except=${distChrome}`,
    `--load-extension=${distChrome}`,
    "--no-sandbox",
    "--disable-setuid-sandbox",
  ],
});

function attachPage(page) {
  console.log(`[chrome:page] opened ${page.url() || "about:blank"}`);
  page.on("console", (message) => {
    console.log(
      `[chrome:console:${message.type()}] ${page.url()} ${message.text()}`,
    );
  });
  page.on("pageerror", (error) => {
    console.log(`[chrome:pageerror] ${page.url()} ${error.stack || error}`);
  });
  page.on("framenavigated", (frame) => {
    if (frame === page.mainFrame()) {
      console.log(`[chrome:navigation] ${frame.url()}`);
    }
  });
}

for (const page of context.pages()) attachPage(page);
context.on("page", attachPage);

let [worker] = context.serviceWorkers();
if (!worker) {
  worker = await context.waitForEvent("serviceworker", { timeout: 10_000 });
}
const extensionId = worker.url().split("/")[2];
console.log(`[chrome:extension] id ${extensionId}`);
worker.on("console", (message) => {
  console.log(`[chrome:service-worker:${message.type()}] ${message.text()}`);
});

const page = context.pages()[0] || (await context.newPage());
await page.goto(startUrl).catch((error) => {
  console.log(`[chrome:navigation:error] ${error.message}`);
});

async function dumpState() {
  try {
    const state = await worker.evaluate(async () => {
      const tabs = await chrome.tabs.query({});
      const waterlooTabs = tabs.filter((tab) =>
        /waterlooworks\.uwaterloo\.ca/.test(tab.url || ""),
      );
      const targets = waterlooTabs.length > 0 ? waterlooTabs : tabs;
      const results = [];
      for (const tab of targets) {
        if (!tab.id) continue;
        const entry = {
          id: tab.id,
          active: tab.active,
          url: tab.url || null,
          title: tab.title || null,
          surface: null,
          ww: null,
          error: null,
        };
        const send = (message) =>
          new Promise((resolve, reject) => {
            chrome.tabs.sendMessage(tab.id, message, (response) => {
              const err = chrome.runtime.lastError;
              if (err) reject(new Error(err.message));
              else resolve(response);
            });
          });
        try {
          entry.surface = await send({ type: "GET_SURFACE_CONTEXT" });
        } catch (error) {
          entry.error = String(error.message || error);
        }
        try {
          entry.ww = await send({ type: "WW_GET_PAGE_STATE" });
        } catch {
          // Non-WW or content-script missing; surface error above is enough.
        }
        results.push(entry);
      }
      const storage = await chrome.storage.local.get("slothing_extension");
      return {
        tabs: results,
        auth: {
          hasToken: !!storage.slothing_extension?.authToken,
          apiBaseUrl: storage.slothing_extension?.apiBaseUrl || null,
          profileName:
            storage.slothing_extension?.cachedProfile?.contact?.name || null,
        },
      };
    });
    console.log(`[chrome:dump] ${JSON.stringify(state, null, 2)}`);
  } catch (error) {
    console.log(`[chrome:dump:error] ${error.stack || error.message || error}`);
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});
rl.on("line", (line) => {
  if (line.trim() === "dump") void dumpState();
});

async function shutdown() {
  await context.close().catch(() => {});
  process.exit(0);
}

process.on("SIGINT", () => void shutdown());
process.on("SIGTERM", () => void shutdown());

await new Promise(() => {});
