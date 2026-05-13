// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ExtensionProfile } from "@/shared/types";

import {
  MULTISTEP_SESSION_TTL_MS,
  clearSession,
  getSession,
  listSessions,
  purgeExpiredSessions,
  setSession,
  type MultistepSession,
} from "./session";

// Minimal in-memory chrome.storage.session mock. We mount it on `globalThis`
// because the module under test reads `chrome.storage.session` directly.
function installChromeStorageMock() {
  const map = new Map<string, unknown>();
  const area = {
    get(
      key: string,
      cb: (result: Record<string, unknown>) => void,
    ) {
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
  return { map, area };
}

function makeProfile(): ExtensionProfile {
  return {
    contact: { firstName: "Ada", lastName: "Lovelace", email: "ada@example.com" },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    computed: { firstName: "Ada", lastName: "Lovelace" },
  } as unknown as ExtensionProfile;
}

function makeSession(overrides: Partial<MultistepSession> = {}): MultistepSession {
  return {
    tabId: 42,
    provider: "workday",
    jobUrl: "https://acme.wd5.myworkdayjobs.com/en-US/Acme/job/Remote/SWE_R1/apply",
    profile: makeProfile(),
    confirmedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("multistep/session", () => {
  beforeEach(() => {
    installChromeStorageMock();
  });

  it("round-trips a session for a tab", async () => {
    const session = makeSession();
    await setSession(session);
    const got = await getSession(session.tabId);
    expect(got).toMatchObject({ tabId: 42, provider: "workday" });
  });

  it("returns null for missing sessions", async () => {
    expect(await getSession(999)).toBeNull();
  });

  it("filters by provider when one is supplied", async () => {
    await setSession(makeSession({ provider: "workday" }));
    expect(await getSession(42, "greenhouse")).toBeNull();
    expect(await getSession(42, "workday")).not.toBeNull();
  });

  it("evicts expired sessions on read", async () => {
    const old = new Date(Date.now() - MULTISTEP_SESSION_TTL_MS - 1000).toISOString();
    await setSession(makeSession({ confirmedAt: old }));
    expect(await getSession(42)).toBeNull();
    // And the next read shouldn't find it lingering in storage.
    const everything = await listSessions();
    expect(everything).toEqual([]);
  });

  it("clearSession removes the entry", async () => {
    await setSession(makeSession());
    await clearSession(42);
    expect(await getSession(42)).toBeNull();
  });

  it("purgeExpiredSessions sweeps stale entries but keeps fresh ones", async () => {
    const old = new Date(Date.now() - MULTISTEP_SESSION_TTL_MS - 1).toISOString();
    await setSession(makeSession({ tabId: 1, confirmedAt: old }));
    await setSession(makeSession({ tabId: 2 }));
    await purgeExpiredSessions();
    expect(await getSession(1)).toBeNull();
    expect(await getSession(2)).not.toBeNull();
  });

  it("listSessions returns only live sessions", async () => {
    await setSession(makeSession({ tabId: 1 }));
    await setSession(makeSession({ tabId: 2, provider: "greenhouse" }));
    const live = await listSessions();
    expect(live.map((s) => s.tabId).sort()).toEqual([1, 2]);
  });

  it("overwrites on repeat setSession (re-confirm refreshes the TTL)", async () => {
    const first = new Date(Date.now() - 5_000).toISOString();
    await setSession(makeSession({ confirmedAt: first }));
    const second = new Date().toISOString();
    await setSession(makeSession({ confirmedAt: second }));
    const got = await getSession(42);
    expect(got?.confirmedAt).toBe(second);
  });
});

describe("multistep/session timer handling", () => {
  beforeEach(() => {
    installChromeStorageMock();
    vi.useFakeTimers();
  });

  it("treats a session that just crossed the TTL boundary as expired", async () => {
    const now = Date.now();
    vi.setSystemTime(now);
    await setSession(makeSession({ confirmedAt: new Date(now).toISOString() }));
    vi.setSystemTime(now + MULTISTEP_SESSION_TTL_MS + 1);
    expect(await getSession(42)).toBeNull();
    vi.useRealTimers();
  });
});
