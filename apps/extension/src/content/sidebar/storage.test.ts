import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  dismissSidebarForDomain,
  getDismissedSidebarDomains,
  isSidebarDismissedForDomain,
  normalizeSidebarDomain,
} from "./storage";

const STORAGE_KEY = "slothing:sidebar:dismissedDomains";

describe("sidebar storage", () => {
  let store: Record<string, unknown>;

  beforeEach(() => {
    store = {};
    vi.stubGlobal("chrome", {
      storage: {
        local: {
          get: vi.fn((key: string, callback: (result: unknown) => void) => {
            callback({ [key]: store[key] });
          }),
          set: vi.fn(
            (updates: Record<string, unknown>, callback: () => void) => {
              Object.assign(store, updates);
              callback();
            },
          ),
        },
      },
    });
  });

  it("normalizes hostnames for per-domain dismissal", () => {
    expect(normalizeSidebarDomain("WWW.LinkedIn.com")).toBe("linkedin.com");
  });

  it("stores dismissed domains without duplicates", async () => {
    await dismissSidebarForDomain("www.linkedin.com");
    await dismissSidebarForDomain("linkedin.com");

    expect(await getDismissedSidebarDomains()).toEqual(["linkedin.com"]);
    expect(store[STORAGE_KEY]).toEqual(["linkedin.com"]);
  });

  it("keeps dismissal scoped to a domain", async () => {
    await dismissSidebarForDomain("www.linkedin.com");

    expect(await isSidebarDismissedForDomain("linkedin.com")).toBe(true);
    expect(await isSidebarDismissedForDomain("indeed.com")).toBe(false);
  });
});
