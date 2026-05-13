// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";

import type { ExtensionProfile } from "@/shared/types";

import { GreenhouseMultistepHandler, isGreenhouseApplyUrl } from "./greenhouse";

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
    remove(_key: string, cb?: () => void) {
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
      name: "Grace Hopper",
      firstName: "Grace",
      lastName: "Hopper",
      email: "grace@example.com",
      phone: "+1-555-0199",
      location: "Arlington, VA",
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    computed: { firstName: "Grace", lastName: "Hopper" },
  } as unknown as ExtensionProfile;
}

function mountGreenhouseStepDom() {
  document.body.innerHTML = `
    <form id="application_form">
      <div id="application">
        <div id="main_fields">
          <label for="first_name">First Name</label>
          <input id="first_name" name="job_application[first_name]" autocomplete="given-name" />

          <label for="last_name">Last Name</label>
          <input id="last_name" name="job_application[last_name]" autocomplete="family-name" />

          <label for="email">Email</label>
          <input id="email" name="job_application[email]" type="email" autocomplete="email" />

          <label for="phone">Phone</label>
          <input id="phone" name="job_application[phone]" type="tel" autocomplete="tel" />
        </div>
      </div>
      <button type="submit" id="submit_app">Submit application</button>
    </form>
  `;
}

describe("isGreenhouseApplyUrl", () => {
  it("matches boards.greenhouse.io jobs URLs", () => {
    expect(
      isGreenhouseApplyUrl("https://boards.greenhouse.io/acme/jobs/12345"),
    ).toBe(true);
  });

  it("matches app.greenhouse.io applications URLs", () => {
    expect(
      isGreenhouseApplyUrl(
        "https://app.greenhouse.io/jobs/12345/applications/new",
      ),
    ).toBe(true);
  });

  it("rejects non-Greenhouse hosts", () => {
    expect(
      isGreenhouseApplyUrl(
        "https://acme.wd5.myworkdayjobs.com/en-US/Acme/job/Remote/SWE_R1/apply",
      ),
    ).toBe(false);
  });

  it("returns false on malformed URLs", () => {
    expect(isGreenhouseApplyUrl("not a url")).toBe(false);
  });
});

describe("GreenhouseMultistepHandler", () => {
  let handler: GreenhouseMultistepHandler;
  const profile = makeProfile();

  beforeEach(() => {
    installChromeStorageMock();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: new URL("https://boards.greenhouse.io/acme/jobs/12345"),
    });
    mountGreenhouseStepDom();
    handler = new GreenhouseMultistepHandler({
      getTabId: async () => 7,
      getProfile: async () => profile,
      hasWebNavigationPermission: async () => true,
    });
  });

  it("isActive() recognises Greenhouse application pages", () => {
    expect(handler.isActive()).toBe(true);
  });

  it("confirm() fills page 1 fields and persists a session", async () => {
    const result = await handler.confirm();
    expect(result).not.toBeNull();
    expect(
      (document.getElementById("first_name") as HTMLInputElement).value,
    ).toBe("Grace");
    expect(
      (document.getElementById("last_name") as HTMLInputElement).value,
    ).toBe("Hopper");
    expect((document.getElementById("email") as HTMLInputElement).value).toBe(
      "grace@example.com",
    );
    expect((document.getElementById("phone") as HTMLInputElement).value).toBe(
      "+1-555-0199",
    );
  });

  it("re-fills new fields after a simulated step transition", async () => {
    await handler.confirm();
    document.body.innerHTML = `
      <form id="application_form">
        <div id="application">
          <label for="custom_q">Why this company?</label>
          <input id="custom_q" name="job_application[answers_attributes][0][text_value]" />
          <label for="email_followup">Confirm email</label>
          <input id="email_followup" name="confirmation_email" type="email" autocomplete="email" />
        </div>
      </form>
    `;
    const result = await handler.onStepTransition();
    expect(result).not.toBeNull();
    // The email confirm field has a recognisable signal; it should be filled
    // even though the custom-question field isn't.
    expect(
      (document.getElementById("email_followup") as HTMLInputElement).value,
    ).toBe("grace@example.com");
  });

  it("onStepTransition no-ops when no session is persisted", async () => {
    const fresh = new GreenhouseMultistepHandler({
      getTabId: async () => 7,
      getProfile: async () => profile,
      hasWebNavigationPermission: async () => true,
    });
    const result = await fresh.onStepTransition();
    expect(result).toBeNull();
  });
});
