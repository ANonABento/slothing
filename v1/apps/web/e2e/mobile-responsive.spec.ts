import { mkdirSync } from "node:fs";
import path from "node:path";
import {
  expect,
  test,
  type APIRequestContext,
  type Locator,
  type Page,
} from "@playwright/test";
import { prepareAppPage } from "./utils/test-helpers";

const SCREENSHOT_DIR = path.join(
  process.cwd(),
  "e2e",
  "__screenshots__",
  "mobile",
);

const VIEWPORTS = [
  { label: "iphone-se", width: 375, height: 667 },
  { label: "ipad-portrait", width: 768, height: 1024 },
  { label: "ipad-landscape", width: 1024, height: 768 },
] as const;

const ROUTE_DEFINITIONS = [
  { label: "dashboard", path: "/en/dashboard" },
  { label: "opportunities-list", path: "/en/opportunities", view: "list" },
  { label: "opportunities-kanban", path: "/en/opportunities", view: "kanban" },
  { label: "opportunity-detail", path: "__OPPORTUNITY_DETAIL__" },
  { label: "studio", path: "/en/studio" },
  { label: "profile", path: "/en/profile" },
  { label: "bank", path: "/en/bank" },
  { label: "answer-bank", path: "/en/answer-bank" },
  { label: "calendar", path: "/en/calendar" },
  { label: "emails", path: "/en/emails" },
  { label: "interview", path: "/en/interview" },
  { label: "salary", path: "/en/salary" },
  { label: "analytics", path: "/en/analytics" },
  { label: "settings", path: "/en/settings" },
] as const;

type Viewport = (typeof VIEWPORTS)[number];
type RouteDefinition = (typeof ROUTE_DEFINITIONS)[number];

interface TouchTargetFinding {
  tag: string;
  role: string | null;
  ariaLabel: string | null;
  text: string;
  width: number;
  height: number;
}

const TOUCH_TARGET_EXCEPTIONS: Array<{
  reason: string;
  matches: (finding: TouchTargetFinding) => boolean;
}> = [
  {
    reason:
      "Inline prose links are text navigation, not standalone touch controls.",
    matches: (finding) => finding.tag === "A" && finding.height < 30,
  },
  {
    reason:
      "Compact calendar and icon toolbar controls already have visible neighboring targets.",
    matches: (finding) =>
      finding.width >= 32 &&
      finding.height >= 32 &&
      /(previous|next|copy|close|clear|expand|collapse|download|export|edit|delete|remove|open|toggle)/i.test(
        `${finding.ariaLabel ?? ""} ${finding.text}`,
      ),
  },
  {
    reason:
      "Segmented controls use compact tabs as part of a grouped mode switch.",
    matches: (finding) =>
      finding.role === "tab" ||
      /^(list|kanban|resume|cover letter)$/i.test(finding.text),
  },
];

let seededOpportunityId: string | null = null;

test.describe("Mobile responsive route sweep", () => {
  test.beforeAll(async ({ request }) => {
    seededOpportunityId = await createSeedOpportunity(request);
  });

  for (const viewport of VIEWPORTS) {
    test.describe(`${viewport.label} ${viewport.width}x${viewport.height}`, () => {
      test.use({ viewport });

      for (const route of ROUTE_DEFINITIONS) {
        test(`${route.label} renders without mobile regressions`, async ({
          page,
        }, testInfo) => {
          test.skip(
            testInfo.project.name !== "chromium",
            "Mobile screenshot baselines are only maintained for Chromium.",
          );

          const path = resolveRoutePath(route, seededOpportunityId);
          test.skip(
            path === null,
            "Opportunity detail route needs a seeded opportunity.",
          );
          if (path === null) return;

          await prepareResponsivePage(page, path);
          await setOpportunityView(page, route);

          await assertNoHorizontalOverflow(page, viewport);
          await assertNavigationMode(page, viewport, route);
          await assertCriticalActionsReachable(page, route, viewport);
          await assertTouchTargets(page);
          await captureRouteScreenshot(page, route.label, viewport);
        });
      }
    });
  }
});

test.describe("Mobile responsive modal fit", () => {
  test.beforeAll(async ({ request }) => {
    seededOpportunityId =
      seededOpportunityId ?? (await createSeedOpportunity(request));
  });

  for (const viewport of VIEWPORTS) {
    test.describe(`${viewport.label} modals`, () => {
      test.use({ viewport });

      test("Add Opportunity wizard fits and closes from backdrop", async ({
        page,
      }, testInfo) => {
        test.skip(
          testInfo.project.name !== "chromium",
          "Mobile modal baselines are only maintained for Chromium.",
        );

        await prepareResponsivePage(page, "/en/opportunities");
        await page
          .getByRole("button", { name: /add opportunity|new opportunity/i })
          .first()
          .click();

        await assertDialogFitsViewport(page, viewport, /add opportunity/i);
        await closeDialogWithBackdrop(page, viewport);
      });

      test("Onboarding dialog fits and closes from backdrop", async ({
        page,
      }, testInfo) => {
        test.skip(
          testInfo.project.name !== "chromium",
          "Mobile modal baselines are only maintained for Chromium.",
        );

        await page.addInitScript(() => {
          localStorage.removeItem("get_me_job_onboarding_completed");
        });
        await page.goto("/en/dashboard");

        await assertDialogFitsViewport(page, viewport, /welcome to slothing/i);
        await closeDialogWithBackdrop(page, viewport);
      });

      test("Calendar create-event dialog fits and closes from backdrop", async ({
        page,
      }, testInfo) => {
        test.skip(
          testInfo.project.name !== "chromium",
          "Mobile modal baselines are only maintained for Chromium.",
        );

        test.skip(
          seededOpportunityId === null,
          "Calendar create-event dialog needs a seeded opportunity.",
        );

        await prepareResponsivePage(page, "/en/calendar");
        await page
          .getByRole("button", { name: /create event/i })
          .first()
          .click();

        await assertDialogFitsViewport(page, viewport, /create event/i);
        await closeDialogWithBackdrop(page, viewport);
      });
    });
  }
});

async function prepareResponsivePage(page: Page, routePath: string) {
  await page.addInitScript(() => {
    localStorage.setItem("get_me_job_onboarding_completed", "true");
    localStorage.setItem("taida:opportunities:filters-open", "false");
  });

  await prepareAppPage(page, routePath);
}

async function createSeedOpportunity(
  request: APIRequestContext,
): Promise<string | null> {
  const response = await request.post("/api/opportunities", {
    data: {
      title: "Software Engineer, AI Products",
      company: "Anthropic",
      description:
        "Build responsive, accessible application workflows with TypeScript, React, and product engineering judgment.",
      location: "San Francisco, CA",
      type: "full-time",
      remote: true,
      url: "https://www.anthropic.com/careers",
      status: "saved",
      requirements: ["TypeScript", "React", "Accessibility"],
      responsibilities: ["Build reliable UI", "Partner with product teams"],
      keywords: ["typescript", "react", "accessibility"],
    },
  });

  if (!response.ok()) {
    return null;
  }

  const body = (await response.json()) as {
    job?: { id?: string };
    opportunity?: { id?: string };
  };
  return body.opportunity?.id ?? body.job?.id ?? null;
}

function resolveRoutePath(
  route: RouteDefinition,
  opportunityId: string | null,
): string | null {
  if (route.path !== "__OPPORTUNITY_DETAIL__") return route.path;
  return opportunityId ? `/en/opportunities/${opportunityId}` : null;
}

async function setOpportunityView(page: Page, route: RouteDefinition) {
  if (route.path !== "/en/opportunities") return;
  if (!("view" in route)) return;

  await page.getByRole("button", { name: new RegExp(route.view, "i") }).click();
}

async function assertNoHorizontalOverflow(page: Page, viewport: Viewport) {
  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));

  expect(dimensions.scrollWidth, {
    message: `Expected no horizontal overflow at ${viewport.label}; document scrollWidth=${dimensions.scrollWidth}, innerWidth=${dimensions.innerWidth}`,
  }).toBeLessThanOrEqual(viewport.width + 1);
}

async function assertNavigationMode(
  page: Page,
  viewport: Viewport,
  route: RouteDefinition,
) {
  const mobileMenuButton = page.getByRole("button", {
    name: /open navigation menu|open menu/i,
  });
  const sidebar = page.locator("aside[aria-label='Main navigation']");
  const sidebarBox = await sidebar.boundingBox();
  expect(
    sidebarBox,
    "Expected the primary sidebar to be mounted",
  ).not.toBeNull();

  if (viewport.width < 1024) {
    await expect(mobileMenuButton).toBeVisible();
    const mobileHeader = page.locator("header").filter({
      has: page.getByRole("button", {
        name: /open navigation menu|open menu/i,
      }),
    });
    await expect(mobileHeader.getByText("Slothing")).toBeVisible();
    await expect(
      mobileHeader.getByText(getMobileHeaderTitle(route)),
    ).toBeVisible();
    expect(
      sidebarBox!.x + sidebarBox!.width,
      "Expected mobile sidebar to be off canvas until opened",
    ).toBeLessThanOrEqual(1);
    return;
  }

  await expect(mobileMenuButton).toBeHidden();
  expect(sidebarBox!.x).toBeGreaterThanOrEqual(0);
  expect(sidebarBox!.x + sidebarBox!.width).toBeLessThanOrEqual(
    viewport.width + 1,
  );
}

function getMobileHeaderTitle(route: RouteDefinition): string {
  if (route.path === "__OPPORTUNITY_DETAIL__") return "Opportunities";

  switch (route.path) {
    case "/en/dashboard":
      return "Dashboard";
    case "/en/opportunities":
      return "Opportunities";
    case "/en/studio":
      return "Document Studio";
    case "/en/profile":
      return "Profile";
    case "/en/bank":
      return "Documents";
    case "/en/answer-bank":
      return "Answer Bank";
    case "/en/calendar":
      return "Calendar";
    case "/en/emails":
      return "Email Templates";
    case "/en/interview":
      return "Interview Prep";
    case "/en/salary":
      return "Salary Tools";
    case "/en/analytics":
      return "Analytics";
    case "/en/settings":
      return "Settings";
    default:
      return "Main navigation";
  }
}

async function assertCriticalActionsReachable(
  page: Page,
  route: RouteDefinition,
  viewport: Viewport,
) {
  const action = getCriticalAction(page, route);
  if (!action) return;

  await expect(action).toBeVisible();
  const box = await action.boundingBox();
  expect(
    box,
    `Expected critical action for ${route.label} to have a box`,
  ).not.toBeNull();
  expect(
    box!.x,
    `${route.label} critical action starts offscreen`,
  ).toBeGreaterThanOrEqual(0);
  expect(
    box!.x + box!.width,
    `${route.label} critical action exceeds viewport width`,
  ).toBeLessThanOrEqual(viewport.width + 1);
}

function getCriticalAction(page: Page, route: RouteDefinition): Locator | null {
  switch (route.label) {
    case "opportunities-list":
    case "opportunities-kanban":
      return page
        .getByRole("button", { name: /add opportunity|new opportunity/i })
        .first();
    case "bank":
      return page
        .getByRole("button", { name: /add entry|upload|new/i })
        .first();
    case "calendar":
      return page.getByRole("button", { name: /create event/i }).first();
    case "settings":
      return page.getByRole("heading", { name: /settings/i }).first();
    default:
      return null;
  }
}

async function assertTouchTargets(page: Page) {
  const findings = await page.evaluate(() => {
    const interactiveSelector = [
      "button",
      "a[href]",
      "input[type=button]",
      "input[type=submit]",
      "input[type=checkbox]",
      "input[type=radio]",
      "[role=button]",
      "[role=tab]",
      "[role=menuitem]",
    ].join(",");

    return Array.from(
      document.querySelectorAll<HTMLElement>(interactiveSelector),
    )
      .filter((element) => {
        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        const disabled =
          element.hasAttribute("disabled") ||
          element.getAttribute("aria-disabled") === "true";

        return (
          !disabled &&
          rect.width > 0 &&
          rect.height > 0 &&
          style.visibility !== "hidden" &&
          style.display !== "none" &&
          style.pointerEvents !== "none" &&
          element.getAttribute("aria-hidden") !== "true" &&
          (rect.width < 44 || rect.height < 44)
        );
      })
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName,
          role: element.getAttribute("role"),
          ariaLabel: element.getAttribute("aria-label"),
          text: (element.innerText || element.textContent || "")
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 80),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        };
      });
  });

  const unexpected = findings.filter(
    (finding) =>
      !TOUCH_TARGET_EXCEPTIONS.some((exception) => exception.matches(finding)),
  );

  expect(unexpected, formatTouchTargetMessage(findings)).toHaveLength(0);
}

function formatTouchTargetMessage(findings: TouchTargetFinding[]) {
  if (findings.length === 0) {
    return "All interactive touch targets are at least 44x44.";
  }

  const exceptions = TOUCH_TARGET_EXCEPTIONS.map(
    ({ reason }) => `- ${reason}`,
  ).join("\n");
  const details = findings
    .map(
      (finding) =>
        `${finding.tag} ${finding.width}x${finding.height} "${finding.ariaLabel ?? finding.text}"`,
    )
    .join("\n");

  return `Unexpected undersized touch targets. Documented exceptions:\n${exceptions}\n\nFindings:\n${details}`;
}

async function assertDialogFitsViewport(
  page: Page,
  viewport: Viewport,
  titlePattern: RegExp,
) {
  const dialog = page.getByRole("dialog").filter({ hasText: titlePattern });
  await expect(dialog).toBeVisible({ timeout: 5000 });

  const box = await dialog.boundingBox();
  expect(box, "Expected dialog to have a bounding box").not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.width).toBeLessThanOrEqual(viewport.width + 1);
  expect(box!.height).toBeLessThanOrEqual(viewport.height + 1);
}

async function closeDialogWithBackdrop(page: Page, viewport: Viewport) {
  const dialog = page.getByRole("dialog").first();
  await expect(dialog).toBeVisible();

  await page.mouse.click(viewport.width - 8, viewport.height - 8);
  await expect(dialog).not.toBeVisible({ timeout: 2000 });
}

async function captureRouteScreenshot(
  page: Page,
  routeLabel: string,
  viewport: Viewport,
) {
  mkdirSync(SCREENSHOT_DIR, { recursive: true });
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, `${routeLabel}-${viewport.label}.png`),
    fullPage: true,
    animations: "disabled",
  });
}
