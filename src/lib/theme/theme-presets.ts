export type ThemeColorKey = "primary" | "background" | "card";

export type ThemePresetId = "default" | "ocean" | "forest" | "custom";

export type ThemeColors = Record<ThemeColorKey, string>;

export interface ThemePreset {
  id: Exclude<ThemePresetId, "custom">;
  label: string;
  description: string;
  colors: ThemeColors;
}

export interface ThemePreference {
  presetId: ThemePresetId;
  customColors: ThemeColors;
}

interface ParsedHsl {
  hue: number;
  saturation: number;
  lightness: number;
}

export const THEME_PRESET_STORAGE_KEY = "get_me_job_theme_preset";
export const CUSTOM_THEME_STORAGE_KEY = "get_me_job_custom_theme";
export const THEME_CHANGE_EVENT = "get-me-job-theme-change";

export const DEFAULT_CUSTOM_THEME: ThemeColors = {
  primary: "196 78% 42%",
  background: "210 30% 98%",
  card: "0 0% 100%",
};

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "default",
    label: "Taida",
    description: "The standard violet and coral workspace.",
    colors: {
      primary: "258 65% 58%",
      background: "30 25% 99%",
      card: "30 20% 99.5%",
    },
  },
  {
    id: "ocean",
    label: "Ocean",
    description: "Cool teal controls with clean white surfaces.",
    colors: {
      primary: "190 86% 38%",
      background: "205 45% 98%",
      card: "0 0% 100%",
    },
  },
  {
    id: "forest",
    label: "Forest",
    description: "Grounded green with soft neutral surfaces.",
    colors: {
      primary: "145 55% 34%",
      background: "42 24% 98%",
      card: "0 0% 100%",
    },
  },
];

const CONTROLLED_VARIABLES = [
  "--background",
  "--foreground",
  "--card",
  "--card-foreground",
  "--popover",
  "--popover-foreground",
  "--primary",
  "--primary-foreground",
  "--secondary",
  "--secondary-foreground",
  "--muted",
  "--muted-foreground",
  "--accent",
  "--accent-foreground",
  "--border",
  "--input",
  "--ring",
  "--gradient-primary",
  "--gradient-hero",
] as const;

export function hexToHslString(hex: string): string {
  const normalized = normalizeHex(hex);
  const red = parseInt(normalized.slice(0, 2), 16) / 255;
  const green = parseInt(normalized.slice(2, 4), 16) / 255;
  const blue = parseInt(normalized.slice(4, 6), 16) / 255;

  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;

  if (max === min) {
    return `0 0% ${Math.round(lightness * 100)}%`;
  }

  const delta = max - min;
  const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  let hue: number;

  switch (max) {
    case red:
      hue = (green - blue) / delta + (green < blue ? 6 : 0);
      break;
    case green:
      hue = (blue - red) / delta + 2;
      break;
    default:
      hue = (red - green) / delta + 4;
      break;
  }

  return `${Math.round(hue * 60)} ${Math.round(saturation * 100)}% ${Math.round(lightness * 100)}%`;
}

export function hslStringToHex(hsl: string): string {
  const parsed = parseHslString(hsl);
  const saturation = parsed.saturation / 100;
  const lightness = parsed.lightness / 100;
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const huePrime = parsed.hue / 60;
  const x = chroma * (1 - Math.abs((huePrime % 2) - 1));
  const match = lightness - chroma / 2;
  let red = 0;
  let green = 0;
  let blue = 0;

  if (huePrime >= 0 && huePrime < 1) {
    red = chroma;
    green = x;
  } else if (huePrime >= 1 && huePrime < 2) {
    red = x;
    green = chroma;
  } else if (huePrime >= 2 && huePrime < 3) {
    green = chroma;
    blue = x;
  } else if (huePrime >= 3 && huePrime < 4) {
    green = x;
    blue = chroma;
  } else if (huePrime >= 4 && huePrime < 5) {
    red = x;
    blue = chroma;
  } else {
    red = chroma;
    blue = x;
  }

  return `#${toHexChannel(red + match)}${toHexChannel(green + match)}${toHexChannel(blue + match)}`;
}

export function buildThemeVariables(colors: ThemeColors): Record<string, string> {
  const primary = parseHslString(colors.primary);
  const background = parseHslString(colors.background);
  const card = parseHslString(colors.card);
  const darkBackground = background.lightness < 45;
  const secondaryLightness = darkBackground ? clamp(background.lightness + 8, 10, 28) : clamp(background.lightness - 4, 90, 98);
  const borderLightness = darkBackground ? clamp(background.lightness + 12, 14, 34) : clamp(background.lightness - 8, 84, 94);

  return {
    "--background": formatHsl(background),
    "--foreground": readableForeground(background),
    "--card": formatHsl(card),
    "--card-foreground": readableForeground(card),
    "--popover": formatHsl(card),
    "--popover-foreground": readableForeground(card),
    "--primary": formatHsl(primary),
    "--primary-foreground": readableForeground(primary),
    "--secondary": `${background.hue} 14% ${secondaryLightness}%`,
    "--secondary-foreground": readableForeground({ ...background, lightness: secondaryLightness }),
    "--muted": `${background.hue} 12% ${secondaryLightness}%`,
    "--muted-foreground": darkBackground ? `${background.hue} 8% 64%` : `${background.hue} 8% 42%`,
    "--accent": `${(primary.hue + 112) % 360} ${clamp(primary.saturation, 45, 90)}% ${darkBackground ? 62 : 56}%`,
    "--accent-foreground": "0 0% 100%",
    "--border": `${background.hue} 12% ${borderLightness}%`,
    "--input": `${background.hue} 12% ${borderLightness}%`,
    "--ring": formatHsl(primary),
    "--gradient-primary": `linear-gradient(135deg, hsl(${formatHsl(primary)}) 0%, hsl(${(primary.hue + 112) % 360} ${clamp(primary.saturation, 45, 90)}% ${darkBackground ? 62 : 56}%) 100%)`,
    "--gradient-hero": `linear-gradient(135deg, hsl(${formatHsl(primary)} / 0.06) 0%, hsl(${(primary.hue + 112) % 360} ${clamp(primary.saturation, 45, 90)}% ${darkBackground ? 62 : 56}% / 0.04) 100%)`,
  };
}

export function applyThemePreference(root: HTMLElement, preference: ThemePreference): void {
  if (preference.presetId === "default") {
    clearThemeVariables(root);
    return;
  }

  const colors = preference.presetId === "custom"
    ? preference.customColors
    : THEME_PRESETS.find((preset) => preset.id === preference.presetId)?.colors;

  if (!colors) {
    clearThemeVariables(root);
    return;
  }

  const variables = buildThemeVariables(colors);
  for (const [name, value] of Object.entries(variables)) {
    root.style.setProperty(name, value);
  }
}

export function saveThemePreference(preference: ThemePreference, storage: Storage = localStorage): void {
  storage.setItem(THEME_PRESET_STORAGE_KEY, preference.presetId);
  storage.setItem(CUSTOM_THEME_STORAGE_KEY, JSON.stringify(preference.customColors));
}

export function readThemePreference(storage: Storage = localStorage): ThemePreference {
  const storedPreset = storage.getItem(THEME_PRESET_STORAGE_KEY);
  return {
    presetId: isThemePresetId(storedPreset) ? storedPreset : "default",
    customColors: readCustomColors(storage),
  };
}

export function notifyThemePreferenceChanged(): void {
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

function clearThemeVariables(root: HTMLElement): void {
  for (const variable of CONTROLLED_VARIABLES) {
    root.style.removeProperty(variable);
  }
}

function readCustomColors(storage: Storage): ThemeColors {
  const stored = storage.getItem(CUSTOM_THEME_STORAGE_KEY);
  if (!stored) return DEFAULT_CUSTOM_THEME;

  try {
    const parsed = JSON.parse(stored) as Partial<Record<ThemeColorKey, unknown>>;
    return {
      primary: typeof parsed.primary === "string" ? parseHslString(parsed.primary) && parsed.primary : DEFAULT_CUSTOM_THEME.primary,
      background: typeof parsed.background === "string" ? parseHslString(parsed.background) && parsed.background : DEFAULT_CUSTOM_THEME.background,
      card: typeof parsed.card === "string" ? parseHslString(parsed.card) && parsed.card : DEFAULT_CUSTOM_THEME.card,
    };
  } catch {
    return DEFAULT_CUSTOM_THEME;
  }
}

function isThemePresetId(value: string | null): value is ThemePresetId {
  return value === "default" || value === "ocean" || value === "forest" || value === "custom";
}

function normalizeHex(hex: string): string {
  const trimmed = hex.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(trimmed)) {
    return trimmed
      .split("")
      .map((char) => `${char}${char}`)
      .join("")
      .toLowerCase();
  }

  if (/^[0-9a-fA-F]{6}$/.test(trimmed)) {
    return trimmed.toLowerCase();
  }

  throw new Error(`Invalid hex color: ${hex}`);
}

function parseHslString(hsl: string): ParsedHsl {
  const match = hsl.trim().match(/^(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%$/);
  if (!match) {
    throw new Error(`Invalid HSL color: ${hsl}`);
  }

  const hue = Number(match[1]);
  const saturation = Number(match[2]);
  const lightness = Number(match[3]);

  if (hue < 0 || hue > 360 || saturation < 0 || saturation > 100 || lightness < 0 || lightness > 100) {
    throw new Error(`Invalid HSL color: ${hsl}`);
  }

  return { hue, saturation, lightness };
}

function formatHsl(hsl: ParsedHsl): string {
  return `${hsl.hue} ${hsl.saturation}% ${hsl.lightness}%`;
}

function readableForeground(color: ParsedHsl): string {
  return color.lightness < 54 ? "0 0% 100%" : "258 20% 13%";
}

function toHexChannel(channel: number): string {
  return Math.round(clamp(channel, 0, 1) * 255).toString(16).padStart(2, "0");
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
