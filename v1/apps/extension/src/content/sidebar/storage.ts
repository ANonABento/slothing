import type { SidebarLayout } from "@/shared/types";

const DISMISSED_DOMAINS_KEY = "slothing:sidebar:dismissedDomains";
const LAYOUT_BY_DOMAIN_KEY = "slothing:sidebar:layoutByDomain";

export const DEFAULT_SIDEBAR_LAYOUT: SidebarLayout = {
  dock: "right",
  position: null,
  collapsed: false,
};

// Bounds for the user-resizable panel (px). Shared by the resize handler and
// the storage normalizer so persisted sizes and live drags agree.
export const SIDEBAR_MIN_WIDTH = 280;
export const SIDEBAR_MAX_WIDTH = 560;
export const SIDEBAR_MIN_HEIGHT = 320;
export const SIDEBAR_MAX_HEIGHT = 900;

/**
 * Clamps a candidate dimension into [min, max]; returns undefined for any
 * non-finite input so the panel falls back to its CSS default size.
 */
export function clampSidebarDimension(
  value: number | undefined,
  min: number,
  max: number,
): number | undefined {
  if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
  return Math.min(Math.max(Math.round(value), min), max);
}

export function normalizeSidebarDomain(hostname: string): string {
  return hostname
    .trim()
    .toLowerCase()
    .replace(/^www\./, "");
}

export async function getDismissedSidebarDomains(): Promise<string[]> {
  return new Promise((resolve) => {
    chrome.storage.local.get(DISMISSED_DOMAINS_KEY, (result) => {
      const value = result[DISMISSED_DOMAINS_KEY];
      resolve(Array.isArray(value) ? value.filter(isString) : []);
    });
  });
}

export async function isSidebarDismissedForDomain(
  hostname = window.location.hostname,
): Promise<boolean> {
  const domain = normalizeSidebarDomain(hostname);
  const dismissedDomains = await getDismissedSidebarDomains();
  return dismissedDomains.includes(domain);
}

export async function dismissSidebarForDomain(
  hostname = window.location.hostname,
): Promise<void> {
  const domain = normalizeSidebarDomain(hostname);
  const dismissedDomains = await getDismissedSidebarDomains();
  const next = Array.from(new Set([...dismissedDomains, domain]));

  return new Promise((resolve) => {
    chrome.storage.local.set({ [DISMISSED_DOMAINS_KEY]: next }, resolve);
  });
}

export async function restoreSidebarForDomain(
  hostname = window.location.hostname,
): Promise<void> {
  const domain = normalizeSidebarDomain(hostname);
  const dismissedDomains = await getDismissedSidebarDomains();
  const next = dismissedDomains.filter((item) => item !== domain);

  return new Promise((resolve) => {
    chrome.storage.local.set({ [DISMISSED_DOMAINS_KEY]: next }, resolve);
  });
}

export async function getSidebarLayoutForDomain(
  hostname = window.location.hostname,
): Promise<SidebarLayout> {
  const domain = normalizeSidebarDomain(hostname);
  return new Promise((resolve) => {
    chrome.storage.local.get(LAYOUT_BY_DOMAIN_KEY, (result) => {
      const byDomain = result[LAYOUT_BY_DOMAIN_KEY];
      const value =
        byDomain && typeof byDomain === "object"
          ? (byDomain as Record<string, Partial<SidebarLayout>>)[domain]
          : undefined;
      resolve(normalizeSidebarLayout(value));
    });
  });
}

export async function setSidebarLayoutForDomain(
  updates: Partial<SidebarLayout>,
  hostname = window.location.hostname,
): Promise<SidebarLayout> {
  const domain = normalizeSidebarDomain(hostname);
  const current = await getSidebarLayoutForDomain(hostname);
  const next = normalizeSidebarLayout({ ...current, ...updates });

  return new Promise((resolve) => {
    chrome.storage.local.get(LAYOUT_BY_DOMAIN_KEY, (result) => {
      const byDomain =
        result[LAYOUT_BY_DOMAIN_KEY] &&
        typeof result[LAYOUT_BY_DOMAIN_KEY] === "object"
          ? (result[LAYOUT_BY_DOMAIN_KEY] as Record<string, SidebarLayout>)
          : {};
      chrome.storage.local.set(
        { [LAYOUT_BY_DOMAIN_KEY]: { ...byDomain, [domain]: next } },
        () => resolve(next),
      );
    });
  });
}

function normalizeSidebarLayout(
  value: Partial<SidebarLayout> | undefined,
): SidebarLayout {
  const dock =
    value?.dock === "left" || value?.dock === "floating" ? value.dock : "right";
  const position =
    value?.position &&
    Number.isFinite(value.position.x) &&
    Number.isFinite(value.position.y)
      ? { x: value.position.x, y: value.position.y }
      : null;
  const width = clampSidebarDimension(
    value?.width,
    SIDEBAR_MIN_WIDTH,
    SIDEBAR_MAX_WIDTH,
  );
  const height = clampSidebarDimension(
    value?.height,
    SIDEBAR_MIN_HEIGHT,
    SIDEBAR_MAX_HEIGHT,
  );
  return {
    dock,
    position: dock === "floating" ? position : null,
    collapsed: !!value?.collapsed,
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {}),
  };
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}
