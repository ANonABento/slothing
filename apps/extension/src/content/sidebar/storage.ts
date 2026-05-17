import type { SidebarLayout } from "@/shared/types";

const DISMISSED_DOMAINS_KEY = "slothing:sidebar:dismissedDomains";
const LAYOUT_BY_DOMAIN_KEY = "slothing:sidebar:layoutByDomain";

export const DEFAULT_SIDEBAR_LAYOUT: SidebarLayout = {
  dock: "right",
  position: null,
  collapsed: false,
};

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
  return {
    dock,
    position: dock === "floating" ? position : null,
    collapsed: !!value?.collapsed,
  };
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}
