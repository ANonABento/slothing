// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import type { ExtensionProfile } from "@/shared/types";

import { isWorkdayApplyUrl, WorkdayMultistepHandler } from "./workday";
import { getSession } from "./session";

// Same chrome.storage.session mock as session.test.ts — keeping it local so
// each test file is self-contained.
function installChromeStorageMock() {
  const map = new Map<string, unknown>();
  const area = {
    get(key: string, cb: (result: Record<string, unknown>) => void) {
      cb({ [key]: map.get(key) });
    },
    set(items: Record<string, unknown>, cb?: () => void) {
      for (const [k, v] of Object.entries(items)) map.set(k, v);
      cb?.();
    },
    remove(key: string, cb?: () => void) {
      map.delete(key);
      cb?.();
    },
    clear(cb?: () => void) {
      map.clear();
      cb?.();
    },
  };
  (globalThis as unknown as { chrome: unknown }).chrome = {
    storage: { session: area, local: area },
  };
}

function makeProfile(): ExtensionProfile {
  return {
    contact: {
      name: "Ada Lovelace",
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@example.com",
      phone: "+1-555-0100",
      location: "London, UK",
    },
    summary: "Analytical engine builder focused on reliable product systems.",
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    computed: {
      firstName: "Ada",
      lastName: "Lovelace",
    },
  } as unknown as ExtensionProfile;
}

/**
 * Sketch of a Workday application step. We don't try to mimic Workday's
 * full DOM (it's hundreds of nested divs); we replicate the *signals* the
 * field detector needs to match — labels, autocomplete attrs,
 * data-automation-id on the container, recognisable field names.
 */
function mountWorkdayStepDom() {
  document.body.innerHTML = `
    <div data-automation-id="applyFlowContainer">
      <div data-automation-id="progressBarItem"></div>
      <div data-automation-id="progressBarActiveItem"></div>
      <div data-automation-id="progressBarItem"></div>
      <div data-automation-id="progressBarItem"></div>

      <div data-automation-id="formField-firstName">
        <label for="firstName">First Name</label>
        <input id="firstName" name="firstName" autocomplete="given-name" data-automation-id="textInputBox" />
      </div>

      <div data-automation-id="formField-lastName">
        <label for="lastName">Last Name</label>
        <input id="lastName" name="lastName" autocomplete="family-name" data-automation-id="textInputBox" />
      </div>

      <div data-automation-id="formField-email">
        <label for="email">Email Address</label>
        <input id="email" name="email" type="email" autocomplete="email" data-automation-id="textInputBox" />
      </div>

      <button data-automation-id="bottom-navigation-next-button" type="button">Next</button>
      <button data-automation-id="submit-button" type="button">Submit application</button>
    </div>
  `;
}

const workdayApplyFixture = readFileSync(
  resolve("tests/fixtures/workday-apply-multistep.html"),
  "utf8",
);

function readFixtureDocument(): Document {
  return new DOMParser().parseFromString(workdayApplyFixture, "text/html");
}

function mountWorkdayApplyFixtureStep(
  step: "contact" | "demographics" | "review",
) {
  const fixture = readFixtureDocument();
  if (step === "contact") {
    document.body.innerHTML = fixture.body.innerHTML;
    return;
  }

  const template = fixture.getElementById(
    `step-${step}`,
  ) as HTMLTemplateElement | null;
  if (!template) throw new Error(`Missing Workday fixture step: ${step}`);
  document.body.innerHTML = template.innerHTML;
}

describe("isWorkdayApplyUrl", () => {
  it("matches a canonical Workday apply URL", () => {
    expect(
      isWorkdayApplyUrl(
        "https://acme.wd5.myworkdayjobs.com/en-US/Acme/job/Remote/Software-Engineer_R-1234/apply",
      ),
    ).toBe(true);
  });

  it("matches the applyManually variant", () => {
    expect(
      isWorkdayApplyUrl(
        "https://acme.wd5.myworkdayjobs.com/en-US/Acme/job/Remote/SWE_R1/apply/applyManually",
      ),
    ).toBe(true);
  });

  it("rejects non-Workday hosts", () => {
    expect(
      isWorkdayApplyUrl("https://boards.greenhouse.io/acme/jobs/123"),
    ).toBe(false);
  });

  it("rejects Workday hosts that aren't on the apply path", () => {
    expect(
      isWorkdayApplyUrl(
        "https://acme.wd5.myworkdayjobs.com/en-US/Acme/job/Remote/SWE_R1",
      ),
    ).toBe(false);
  });

  it("returns false on malformed URLs", () => {
    expect(isWorkdayApplyUrl("not a url")).toBe(false);
  });
});

describe("WorkdayMultistepHandler", () => {
  let handler: WorkdayMultistepHandler;
  const profile = makeProfile();

  beforeEach(() => {
    installChromeStorageMock();
    window.history.replaceState({}, "", "/en-US/Acme/job/Remote/SWE_R1/apply");
    // jsdom doesn't let us change window.location.host, so we stub the URL
    // via Location-mocked URL helpers. The handler reads `window.location.href`
    // — set it via JSDOM's pushState which already updates location.href and
    // `new URL(location.href)`.
    Object.defineProperty(window, "location", {
      configurable: true,
      value: new URL(
        "https://acme.wd5.myworkdayjobs.com/en-US/Acme/job/Remote/SWE_R1/apply",
      ),
    });
    mountWorkdayStepDom();
    handler = new WorkdayMultistepHandler({
      getTabId: async () => 1,
      getProfile: async () => profile,
      hasWebNavigationPermission: async () => true,
    });
  });

  it("isActive() recognises the Workday apply URL", () => {
    expect(handler.isActive()).toBe(true);
  });

  it("confirm() fills page 1 fields and persists a session", async () => {
    const result = await handler.confirm();
    expect(result).not.toBeNull();
    // firstName, lastName, email — all three should have been filled.
    expect(
      (document.getElementById("firstName") as HTMLInputElement).value,
    ).toBe("Ada");
    expect(
      (document.getElementById("lastName") as HTMLInputElement).value,
    ).toBe("Lovelace");
    expect((document.getElementById("email") as HTMLInputElement).value).toBe(
      "ada@example.com",
    );
  });

  it("re-fills new fields after a step transition", async () => {
    await handler.confirm();
    // Simulate page 2 — wipe the DOM, mount a new field, then call
    // onStepTransition. The handler should pick up the persisted profile
    // and fill the new input.
    document.body.innerHTML = `
      <div data-automation-id="applyFlowContainer">
        <div data-automation-id="formField-phone">
          <label for="phone">Phone</label>
          <input id="phone" name="phone" type="tel" autocomplete="tel" data-automation-id="textInputBox" />
        </div>
      </div>
    `;
    const result = await handler.onStepTransition();
    expect(result).not.toBeNull();
    expect((document.getElementById("phone") as HTMLInputElement).value).toBe(
      "+1-555-0100",
    );
  });

  it("detectStepHint reports the progress bar layout", () => {
    const hint = handler.detectStepHint();
    expect(hint.totalSteps).toBe(4);
    // The active marker (`progressBarActiveItem`) is the second node in DOM
    // order, so step 2.
    expect(hint.stepNumber).toBe(2);
  });

  it("onStepTransition no-ops when no session is persisted", async () => {
    const fresh = new WorkdayMultistepHandler({
      getTabId: async () => 1,
      getProfile: async () => profile,
      hasWebNavigationPermission: async () => true,
    });
    const result = await fresh.onStepTransition();
    expect(result).toBeNull();
  });

  it("dogfoods contact, demographic, upload, disabled, and late review steps from the Workday fixture", async () => {
    mountWorkdayApplyFixtureStep("contact");

    const firstStep = await handler.confirm();
    expect(firstStep).toMatchObject({
      filled: 3,
      errors: 0,
    });
    expect(
      (document.getElementById("firstName") as HTMLInputElement).value,
    ).toBe("Ada");
    expect(
      (document.getElementById("lastName") as HTMLInputElement).value,
    ).toBe("Lovelace");
    expect((document.getElementById("email") as HTMLInputElement).value).toBe(
      "ada@example.com",
    );
    expect(
      (document.getElementById("legalName") as HTMLInputElement).value,
    ).toBe("Locked Candidate");
    expect(
      (document.getElementById("resumeUpload") as HTMLInputElement).value,
    ).toBe("");

    mountWorkdayApplyFixtureStep("demographics");
    const demographicStep = await handler.onStepTransition();
    expect(demographicStep).toMatchObject({
      filled: 0,
      errors: 0,
    });
    expect(demographicStep?.skipped).toBeGreaterThanOrEqual(3);
    expect(
      (document.getElementById("employeeId") as HTMLInputElement).value,
    ).toBe("readonly-employee-id");
    expect((document.getElementById("gender") as HTMLSelectElement).value).toBe(
      "",
    );
    expect(
      (document.getElementById("veteranStatus") as HTMLSelectElement).value,
    ).toBe("");
    expect(
      (document.getElementById("disability") as HTMLSelectElement).value,
    ).toBe("");

    mountWorkdayApplyFixtureStep("review");
    const reviewStep = await handler.onStepTransition();
    expect(reviewStep).toMatchObject({
      filled: 1,
      errors: 0,
    });
    expect(
      (document.getElementById("reviewPhone") as HTMLInputElement).value,
    ).toBe(profile.contact.phone);

    document
      .querySelector<HTMLButtonElement>(
        '[data-automation-id="bottom-navigation-next-button"]',
      )
      ?.click();
    expect(await getSession(1, "workday")).toBeNull();
  });
});
