import type { LucideIcon } from "lucide-react";
import { Chrome, Compass, Globe } from "lucide-react";

export type SupportedBrowser = "chrome" | "edge" | "firefox" | "safari";
export type DetectedBrowser = SupportedBrowser | "unknown";

export interface ExtensionStore {
  key: SupportedBrowser;
  label: string;
  ctaLabel: string;
  compactLabel: string;
  url: string | null;
  icon: LucideIcon;
  disabled?: boolean;
}

export const EXTENSION_STORES: ExtensionStore[] = [
  {
    key: "chrome",
    label: "Chrome Web Store",
    ctaLabel: "Install for Chrome",
    compactLabel: "Chrome",
    // TODO: Replace with the live Chrome Web Store listing once submitted.
    url: "https://chromewebstore.google.com/detail/slothing-columbus-extension/placeholder",
    icon: Chrome,
  },
  {
    key: "edge",
    label: "Microsoft Edge Add-ons",
    ctaLabel: "Install for Edge",
    compactLabel: "Edge",
    // TODO: Replace with the live Microsoft Edge Add-ons listing once submitted.
    url: "https://microsoftedge.microsoft.com/addons/detail/slothing-columbus/placeholder",
    icon: Compass,
  },
  {
    key: "firefox",
    label: "Firefox Add-ons",
    ctaLabel: "Install for Firefox",
    compactLabel: "Firefox",
    // TODO: Replace with the live Firefox AMO listing once submitted.
    url: "https://addons.mozilla.org/firefox/addon/slothing-columbus/placeholder",
    icon: Globe,
  },
  {
    key: "safari",
    label: "Safari",
    ctaLabel: "Safari support coming soon",
    compactLabel: "Safari soon",
    url: null,
    icon: Compass,
    disabled: true,
  },
];

export function detectBrowserFromUserAgent(userAgent: string): DetectedBrowser {
  const ua = userAgent.toLowerCase();

  if (!ua.trim()) return "unknown";
  if (/\bedg\//.test(ua)) return "edge";
  if (ua.includes("firefox/") || ua.includes("fxios/")) return "firefox";
  if (
    ua.includes("chrome/") ||
    ua.includes("chromium/") ||
    ua.includes("crios/")
  ) {
    return "chrome";
  }
  if (
    ua.includes("safari/") &&
    !ua.includes("chrome/") &&
    !ua.includes("chromium/") &&
    !ua.includes("crios/") &&
    !ua.includes("edg/")
  ) {
    return "safari";
  }

  return "unknown";
}

export function getExtensionStoresForBrowser(
  detectedBrowser: DetectedBrowser,
): ExtensionStore[] {
  const detected = EXTENSION_STORES.find(
    (store) => store.key === detectedBrowser,
  );

  if (!detected) return EXTENSION_STORES;

  return [
    detected,
    ...EXTENSION_STORES.filter((store) => store.key !== detected.key),
  ];
}
