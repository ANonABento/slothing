import { expect, test, type BrowserContext } from "@playwright/test";
import {
  closeExtensionContext,
  launchExtensionContext,
} from "../helpers/extension-context";

let context: BrowserContext;
let extensionId: string;
let teardownContext:
  | Awaited<ReturnType<typeof launchExtensionContext>>
  | undefined;

test.beforeAll(async () => {
  teardownContext = await launchExtensionContext();
  context = teardownContext.context;
  extensionId = teardownContext.extensionId;
});

test.afterAll(async () => {
  await closeExtensionContext(teardownContext);
});

for (const pageName of ["popup", "options"] as const) {
  test(`${pageName} page renders from the production extension bundle`, async () => {
    const page = await context.newPage();
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    try {
      await page.goto(`chrome-extension://${extensionId}/${pageName}.html`);
      await page.waitForLoadState("domcontentloaded");
      await expect(page.locator("#root")).not.toBeEmpty();
      expect(pageErrors).toEqual([]);
    } finally {
      await page.close();
    }
  });
}
