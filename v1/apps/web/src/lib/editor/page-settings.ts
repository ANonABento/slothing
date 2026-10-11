export type PageSizeId = "letter" | "a4";
export type MarginPresetId = "narrow" | "normal" | "wide" | "custom";

export interface PageMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface PageSettings {
  size: PageSizeId;
  marginPreset: MarginPresetId;
  margins: PageMargins;
}

export interface PageSizeDefinition {
  id: PageSizeId;
  label: string;
  widthIn: number;
  heightIn: number;
  printSize: string;
}

export const PAGE_SIZES: Record<PageSizeId, PageSizeDefinition> = {
  letter: {
    id: "letter",
    label: "Letter",
    widthIn: 8.5,
    heightIn: 11,
    printSize: "letter",
  },
  a4: {
    id: "a4",
    label: "A4",
    widthIn: 8.27,
    heightIn: 11.69,
    printSize: "A4",
  },
};

export const MARGIN_PRESETS: Record<
  Exclude<MarginPresetId, "custom">,
  { id: Exclude<MarginPresetId, "custom">; label: string; inches: number }
> = {
  narrow: { id: "narrow", label: "Narrow", inches: 0.5 },
  normal: { id: "normal", label: "Normal", inches: 1 },
  wide: { id: "wide", label: "Wide", inches: 1.25 },
};

export const DEFAULT_PAGE_SETTINGS: PageSettings = {
  size: "letter",
  marginPreset: "normal",
  margins: {
    top: 1,
    right: 1,
    bottom: 1,
    left: 1,
  },
};

const MIN_MARGIN_IN = 0;
const MAX_MARGIN_IN = 2;

function normalizeMargin(value: unknown, fallback: number): number {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(MAX_MARGIN_IN, Math.max(MIN_MARGIN_IN, parsed));
}

function marginsForPreset(preset: Exclude<MarginPresetId, "custom">) {
  const inches = MARGIN_PRESETS[preset].inches;
  return {
    top: inches,
    right: inches,
    bottom: inches,
    left: inches,
  };
}

export function normalizePageSettings(
  value: Partial<PageSettings> | null | undefined,
): PageSettings {
  const size = value?.size && value.size in PAGE_SIZES ? value.size : "letter";
  const requestedPreset = value?.marginPreset ?? "normal";
  const marginPreset =
    requestedPreset in MARGIN_PRESETS || requestedPreset === "custom"
      ? requestedPreset
      : "normal";

  if (marginPreset !== "custom") {
    return {
      size,
      marginPreset,
      margins: marginsForPreset(marginPreset),
    };
  }

  const fallback = DEFAULT_PAGE_SETTINGS.margins;
  const margins = value?.margins ?? fallback;
  return {
    size,
    marginPreset,
    margins: {
      top: normalizeMargin(margins.top, fallback.top),
      right: normalizeMargin(margins.right, fallback.right),
      bottom: normalizeMargin(margins.bottom, fallback.bottom),
      left: normalizeMargin(margins.left, fallback.left),
    },
  };
}

export function pageSizeToCss(settings: PageSettings): {
  width: string;
  minHeight: string;
} {
  const size = PAGE_SIZES[settings.size];
  return {
    width: `${size.widthIn}in`,
    minHeight: `${size.heightIn}in`,
  };
}

export function pageSettingsToCssVariables(settings: PageSettings) {
  const normalized = normalizePageSettings(settings);
  const size = PAGE_SIZES[normalized.size];
  return {
    "--page-width": `${size.widthIn}in`,
    "--page-height": `${size.heightIn}in`,
    "--page-margin-top": `${normalized.margins.top}in`,
    "--page-margin-right": `${normalized.margins.right}in`,
    "--page-margin-bottom": `${normalized.margins.bottom}in`,
    "--page-margin-left": `${normalized.margins.left}in`,
  } as CSSProperties;
}

export function pageSettingsToPdfMargin(settings: PageSettings) {
  const normalized = normalizePageSettings(settings);
  return {
    top: `${normalized.margins.top}in`,
    right: `${normalized.margins.right}in`,
    bottom: `${normalized.margins.bottom}in`,
    left: `${normalized.margins.left}in`,
  };
}

export function pageSettingsToPrintCss(settings: PageSettings): string {
  const normalized = normalizePageSettings(settings);
  const size = PAGE_SIZES[normalized.size];
  const margins = normalized.margins;
  return `@page { size: ${size.printSize}; margin: ${margins.top}in ${margins.right}in ${margins.bottom}in ${margins.left}in; }`;
}
import type { CSSProperties } from "react";
