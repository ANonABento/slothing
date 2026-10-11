import { expect, test } from "@playwright/test";
import {
  closeExtensionContext,
  CONTENT_SCRIPT_INIT_MS,
  launchExtensionContext,
  loadFixture,
  type ExtensionContext,
} from "../helpers/extension-context";

let extensionContext: ExtensionContext;

test.beforeAll(async () => {
  extensionContext = await launchExtensionContext();
});

test.afterAll(async () => {
  await closeExtensionContext(extensionContext);
});

test("injects one Slothing sidebar on a desktop job page", async () => {
  const page = await extensionContext.context.newPage();
  try {
    await page.setViewportSize({ width: 1280, height: 900 });
    await loadFixture(page, "linkedin-mock.html");

    await expectSidebarText(page, "Slothing");
    await expectSidebarText(page, "Senior Software Engineer");
    await expectSidebarText(page, "Tailor resume");

    expect(await sidebarHostCount(page)).toBe(1);

    await page.evaluate(() => {
      document.body.appendChild(document.createElement("div"));
    });
    await page.waitForTimeout(CONTENT_SCRIPT_INIT_MS);

    expect(await sidebarHostCount(page)).toBe(1);
  } finally {
    await page.close();
  }
});

test("hides the sidebar below the desktop breakpoint", async () => {
  const page = await extensionContext.context.newPage();
  try {
    await page.setViewportSize({ width: 900, height: 900 });
    await loadFixture(page, "linkedin-mock.html");

    expect(await sidebarHostCount(page)).toBe(0);
  } finally {
    await page.close();
  }
});

test("persists dismissal for the current domain only", async () => {
  const page = await extensionContext.context.newPage();
  try {
    await page.setViewportSize({ width: 1280, height: 900 });
    await loadFixture(page, "linkedin-mock.html");

    await clickSidebarButton(page, "Dismiss Slothing sidebar for this domain");
    await page.reload();
    await page.waitForTimeout(CONTENT_SCRIPT_INIT_MS);

    expect(await sidebarHostCount(page)).toBe(0);
  } finally {
    await page.close();
  }
});

async function sidebarHostCount(page: import("@playwright/test").Page) {
  return page.locator("#slothing-job-page-sidebar-host").count();
}

async function expectSidebarText(
  page: import("@playwright/test").Page,
  text: string,
) {
  await expect
    .poll(async () => sidebarText(page), { timeout: 10_000 })
    .toContain(text);
}

async function clickSidebarButton(
  page: import("@playwright/test").Page,
  label: string,
) {
  await page
    .locator("#slothing-job-page-sidebar-host")
    .evaluate((host, buttonLabel) => {
      const root = host.shadowRoot;
      const button = Array.from(root?.querySelectorAll("button") || []).find(
        (candidate) => candidate.getAttribute("aria-label") === buttonLabel,
      ) as HTMLButtonElement | undefined;
      button?.click();
    }, label);
}

async function sidebarText(page: import("@playwright/test").Page) {
  return page.locator("#slothing-job-page-sidebar-host").evaluate((host) => {
    return host.shadowRoot?.textContent || "";
  });
}
