import { chromium, type BrowserContext, type Page } from "@playwright/test";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

export const pathToExtension = path.join(__dirname, "../../dist");
export const fixturesPath = path.join(__dirname, "../fixtures");
export const demoPath = path.join(__dirname, "../../demo");

export const CONTENT_SCRIPT_INIT_MS = 800;

export interface ExtensionContext {
  context: BrowserContext;
  extensionId: string;
  userDataDir: string;
}

export async function launchExtensionContext(): Promise<ExtensionContext> {
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "columbus-pw-"));

  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    args: [
      `--disable-extensions-except=${pathToExtension}`,
      `--load-extension=${pathToExtension}`,
      "--no-sandbox",
      "--disable-setuid-sandbox",
    ],
  });

  let [background] = context.serviceWorkers();
  if (!background) {
    background = await context.waitForEvent("serviceworker", {
      timeout: 10_000,
    });
  }

  return {
    context,
    extensionId: background.url().split("/")[2],
    userDataDir,
  };
}

export async function closeExtensionContext(
  extensionContext: ExtensionContext | undefined,
) {
  if (!extensionContext) return;
  await extensionContext.context.close();
  fs.rmSync(extensionContext.userDataDir, { recursive: true, force: true });
}

export async function loadFixture(page: Page, fixtureName: string) {
  const fixturePath = path.resolve(fixturesPath, fixtureName);
  await page.goto(`file://${fixturePath}`);
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(CONTENT_SCRIPT_INIT_MS);
}

export async function loadDemoPage(page: Page, fileName: string) {
  const filePath = path.resolve(demoPath, fileName);
  await page.goto(`file://${filePath}`);
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(CONTENT_SCRIPT_INIT_MS);
}

export async function seedExtensionStorage(
  context: BrowserContext,
  extensionId: string,
  data: Record<string, unknown>,
) {
  const page = await context.newPage();
  try {
    await page.goto(`chrome-extension://${extensionId}/popup.html`);
    await page.evaluate(
      (storageData) => chrome.storage.local.set(storageData),
      data,
    );
  } finally {
    await page.close();
  }
}

export async function sendMessageToTab<T>(
  context: BrowserContext,
  extensionId: string,
  tabUrlPart: string,
  message: { type: string; payload?: unknown },
): Promise<T> {
  const page = await context.newPage();
  try {
    await page.goto(`chrome-extension://${extensionId}/popup.html`);
    return await page.evaluate(
      async ({ urlPart, msg }) => {
        const tabs = await chrome.tabs.query({});
        const target = tabs.find((tab) => tab.id && tab.url?.includes(urlPart));
        if (!target?.id) {
          throw new Error(`No tab found for ${urlPart}`);
        }

        return await chrome.tabs.sendMessage(target.id, msg);
      },
      { urlPart: tabUrlPart, msg: message },
    );
  } finally {
    await page.close();
  }
}
