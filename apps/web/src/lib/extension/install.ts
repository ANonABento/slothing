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
    ctaLabel: "Chrome listing coming soon",
    compactLabel: "Chrome soon",
    // TODO: Replace with the live Chrome Web Store listing once submitted.
    url: null,
    icon: Chrome,
    disabled: true,
  },
  {
    key: "edge",
    label: "Microsoft Edge Add-ons",
    ctaLabel: "Edge listing coming soon",
    compactLabel: "Edge soon",
    // TODO: Replace with the live Microsoft Edge Add-ons listing once submitted.
    url: null,
    icon: Compass,
    disabled: true,
  },
  {
    key: "firefox",
    label: "Firefox Add-ons",
    ctaLabel: "Firefox listing coming soon",
    compactLabel: "Firefox soon",
    // TODO: Replace with the live Firefox AMO listing once submitted.
    url: null,
    icon: Globe,
    disabled: true,
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
