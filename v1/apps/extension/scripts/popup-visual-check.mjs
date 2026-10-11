// Visual + behavioural check for the popup state machine (PR 1). Renders the
// real built popup bundle with chrome.* stubbed, drives it through each
// detection scenario, screenshots it, and asserts the rendered text.
import pkg from "/home/anonabento/slothing/node_modules/.pnpm/playwright-core@1.59.1/node_modules/playwright-core/index.js";
const { chromium } = pkg;

const EXE =
  "/home/anonabento/.cache/ms-playwright/chromium-1217/chrome-linux64/chrome";
const POPUP =
  "file:///home/anonabento/slothing-ext-pr/apps/extension/dist/popup.html";
const OUT = "/home/anonabento/slothing-ext-pr/apps/extension/.visual";

const WW_URL = "https://waterlooworks.uwaterloo.ca/myAccount/co-op/full/jobs.htm";

function surface(over) {
  return {
    tab: { url: WW_URL, host: "waterlooworks.uwaterloo.ca", supported: true, contentScriptReady: true },
    page: {
      hasApplicationForm: false,
      detectedFieldCount: 0,
      detectedUploadCount: 0,
      documentUploads: [],
      job: null,
      ...over,
    },
    workspace: { visible: false, dismissed: false, layout: "sidebar" },
  };
}

// Each scenario stubs GET_SURFACE_CONTEXT + the generic bulk page-state message
// the popup actually sends (BULK_WATERLOOWORKS_GET_PAGE_STATE, …). `wwRowsByCall`
// returns the detected rowCount for the Nth probe — a falling-then-rising series
// exercises the retry-until-rows path.
const SCENARIOS = {
  "ww-list": {
    surface: surface({}),
    wwRowsByCall: [50],
    mustHave: ["WaterlooWorks", "Scrape"],
    mustNotHave: ["No job detected"],
  },
  "ww-list-late": {
    // First probe sees 0 rows (table still loading), retry sees 50.
    surface: surface({}),
    wwRowsByCall: [0, 0, 50],
    mustHave: ["WaterlooWorks", "Scrape"],
    mustNotHave: ["No job detected"],
  },
  "single-job": {
    surface: surface({ job: { title: "Software Developer Back-End C#, .NET", company: "LVM Tech" } }),
    wwRowsByCall: [0],
    mustHave: ["Job detected", "Software Developer"],
    mustNotHave: ["WaterlooWorks", "No job detected"],
  },
  "no-posting": {
    surface: { ...surface({}), tab: { url: "https://linkedin.com/feed", host: "linkedin.com", supported: true, contentScriptReady: true } },
    wwRowsByCall: [0],
    mustHave: ["No job detected"],
    mustNotHave: ["WaterlooWorks", "Scrape"],
  },
  "application-form": {
    surface: surface({ hasApplicationForm: true, detectedFieldCount: 9 }),
    wwRowsByCall: [0],
    mustHave: ["Application detected", "9 fields"],
    mustNotHave: ["No job detected", "WaterlooWorks"],
  },
};

const browser = await chromium.launch({ executablePath: EXE, args: ["--no-sandbox"] });
let failures = 0;

for (const [name, sc] of Object.entries(SCENARIOS)) {
  const ctx = await browser.newContext({ viewport: { width: 400, height: 720 } });
  const page = await ctx.newPage();
  await page.addInitScript((scenario) => {
    let bulkProbeCalls = 0;
    const reply = (msg) => {
      const t = msg && msg.type;
      if (t === "GET_AUTH_STATUS")
        return { success: true, data: { isAuthenticated: true, apiBaseUrl: "http://localhost:3000" } };
      if (t === "GET_PROFILE") return { success: true, data: null };
      if (t === "GET_SURFACE_CONTEXT") return scenario.surface;
      if (typeof t === "string" && /^BULK_.*_GET_PAGE_STATE$/.test(t)) {
        const series = scenario.wwRowsByCall;
        const rows = series[Math.min(bulkProbeCalls, series.length - 1)];
        bulkProbeCalls++;
        return { success: true, data: { detected: rows > 0, rowCount: rows, hasNextPage: false } };
      }
      return { success: true, data: {} };
    };
    window.chrome = {
      runtime: {
        id: "stub",
        lastError: undefined,
        getURL: (p) => p,
        openOptionsPage: () => {},
        sendMessage: (msg, cb) => {
          const r = reply(msg);
          if (typeof cb === "function") { cb(r); return; }
          return Promise.resolve(r);
        },
        onMessage: { addListener: () => {}, removeListener: () => {} },
      },
      tabs: {
        query: () => Promise.resolve([{ id: 1, url: scenario.surface.tab.url }]),
        sendMessage: (_id, msg) => Promise.resolve(reply(msg)),
        onUpdated: { addListener: () => {}, removeListener: () => {} },
        reload: () => Promise.resolve(),
      },
      storage: {
        local: { get: () => Promise.resolve({}), set: () => Promise.resolve() },
      },
    };
  }, sc);

  await page.goto(POPUP, { waitUntil: "networkidle" });
  // Wait for the first expected string (covers the retry-until-rows backoff),
  // falling back to a short settle if it never appears.
  await page
    .locator("body", { hasText: sc.mustHave[0] })
    .waitFor({ timeout: 5000 })
    .catch(() => {});
  await page.waitForTimeout(200);
  const text = (await page.locator("body").innerText()).replace(/\s+/g, " ");
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });

  const missing = sc.mustHave.filter((s) => !text.includes(s));
  const leaked = sc.mustNotHave.filter((s) => text.includes(s));
  const ok = missing.length === 0 && leaked.length === 0;
  if (!ok) failures++;
  console.log(`[${ok ? "PASS" : "FAIL"}] ${name}`);
  if (missing.length) console.log(`   missing: ${JSON.stringify(missing)}`);
  if (leaked.length) console.log(`   leaked : ${JSON.stringify(leaked)}`);
  console.log(`   text   : ${text.slice(0, 220)}`);
  await ctx.close();
}

await browser.close();
console.log(failures === 0 ? "\nALL VISUAL CHECKS PASSED" : `\n${failures} SCENARIO(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
