import { getSettings } from "./storage";

export const BADGE_TEXT = "!";
export const BADGE_COLOR = "#b8704a";
export const BADGE_TITLE = "Job detected — press Cmd+Shift+I to import";

type BadgeApi = Pick<
  typeof chrome.action,
  "setBadgeText" | "setBadgeBackgroundColor" | "setTitle"
>;

function getBadgeApi(): BadgeApi | null {
  const runtime = chrome as typeof chrome & { browserAction?: BadgeApi };
  return runtime.action ?? runtime.browserAction ?? null;
}

export async function setBadgeForTab(tabId: number): Promise<void> {
  const settings = await getSettings();
  if (!settings.notifyOnJobDetected) return;
  const badgeApi = getBadgeApi();
  if (!badgeApi) return;

  await Promise.all([
    badgeApi.setBadgeText({ text: BADGE_TEXT, tabId }),
    badgeApi.setBadgeBackgroundColor({ color: BADGE_COLOR, tabId }),
    badgeApi.setTitle({ title: BADGE_TITLE, tabId }),
  ]);
}

export async function clearBadgeForTab(tabId: number): Promise<void> {
  const badgeApi = getBadgeApi();
  if (!badgeApi) return;

  await Promise.all([
    badgeApi.setBadgeText({ text: "", tabId }),
    badgeApi.setTitle({ title: "", tabId }),
  ]);
}
