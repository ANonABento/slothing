const DISMISSED_DOMAINS_KEY = "slothing:sidebar:dismissedDomains";

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

function isString(value: unknown): value is string {
  return typeof value === "string";
}
