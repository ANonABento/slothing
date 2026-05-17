import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  DEFAULT_SIDEBAR_LAYOUT,
  dismissSidebarForDomain,
  getDismissedSidebarDomains,
  getSidebarLayoutForDomain,
  isSidebarDismissedForDomain,
  normalizeSidebarDomain,
  restoreSidebarForDomain,
  setSidebarLayoutForDomain,
} from "./storage";

const DISMISSED_STORAGE_KEY = "slothing:sidebar:dismissedDomains";
const LAYOUT_STORAGE_KEY = "slothing:sidebar:layoutByDomain";

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
    expect(store[DISMISSED_STORAGE_KEY]).toEqual(["linkedin.com"]);
  });

  it("keeps dismissal scoped to a domain", async () => {
    await dismissSidebarForDomain("www.linkedin.com");

    expect(await isSidebarDismissedForDomain("linkedin.com")).toBe(true);
    expect(await isSidebarDismissedForDomain("indeed.com")).toBe(false);
  });

  it("restores a dismissed domain", async () => {
    await dismissSidebarForDomain("www.linkedin.com");
    await dismissSidebarForDomain("waterlooworks.uwaterloo.ca");

    await restoreSidebarForDomain("linkedin.com");

    expect(await getDismissedSidebarDomains()).toEqual([
      "waterlooworks.uwaterloo.ca",
    ]);
  });

  it("returns the default sidebar layout for new domains", async () => {
    await expect(getSidebarLayoutForDomain("linkedin.com")).resolves.toEqual(
      DEFAULT_SIDEBAR_LAYOUT,
    );
  });

  it("persists floating layout per normalized domain", async () => {
    await setSidebarLayoutForDomain(
      { dock: "floating", position: { x: 120, y: 80 }, collapsed: true },
      "www.linkedin.com",
    );

    await expect(getSidebarLayoutForDomain("linkedin.com")).resolves.toEqual({
      dock: "floating",
      position: { x: 120, y: 80 },
      collapsed: true,
    });
    expect(store[LAYOUT_STORAGE_KEY]).toMatchObject({
      "linkedin.com": {
        dock: "floating",
        position: { x: 120, y: 80 },
        collapsed: true,
      },
    });
  });

  it("clears floating position when docked left or right", async () => {
    await setSidebarLayoutForDomain(
      { dock: "floating", position: { x: 120, y: 80 } },
      "linkedin.com",
    );
    await setSidebarLayoutForDomain({ dock: "left" }, "linkedin.com");

    await expect(getSidebarLayoutForDomain("linkedin.com")).resolves.toEqual({
      dock: "left",
      position: null,
      collapsed: false,
    });
  });
});
