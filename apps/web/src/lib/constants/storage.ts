import { z } from "zod";

// Theme options
export const THEMES = ["light", "dark", "system"] as const;

export type Theme = (typeof THEMES)[number];

export const themeSchema = z.enum(THEMES);

// Storage keys
export const STORAGE_KEYS = {
  ONBOARDING_COMPLETED: "get_me_job_onboarding_completed",
} as const;

/**
 * Every browser-storage namespace that Slothing owns. The Danger-Zone
 * "Reset local preferences" iterates this list — adding a new key
 * elsewhere requires adding the prefix or exact key here, otherwise the
 * advertised reset silently leaves it in place. See F5.1 in
 * `docs/legacy-duplication-audit.md` for the original survey.
 *
 * Conventions:
 * - `prefix: true` matches any key starting with the value (covers
 *   namespaces like `taida:*` and the dashed `taida-*` variant we
 *   inherited before consolidating on the colon form).
 * - `prefix: false` matches the exact key only — used for the bare
 *   `theme` / `theme-dark` keys (no prefix) and for the legacy
 *   `get_me_job_onboarding_completed` constant that pre-dates the
 *   prefix system.
 *
 * Order does not matter; we union the matches.
 */
export const LOCAL_STORAGE_KEY_PATTERNS: ReadonlyArray<{
  value: string;
  prefix: boolean;
  description: string;
}> = [
  {
    value: "taida:",
    prefix: true,
    description: "Canonical Slothing prefix (per CLAUDE.md)",
  },
  {
    value: "taida-",
    prefix: true,
    description: "Legacy dashed variant (opportunities filter state)",
  },
  {
    value: "slothing:",
    prefix: true,
    description: "Studio + Components staged-bank-entry selection",
  },
  {
    value: "slothing-prefs",
    prefix: false,
    description: "Editorial preferences (accent, fonts, radius, density)",
  },
  {
    value: "get_me_job_",
    prefix: true,
    description: "Pre-prefix-era keys (onboarding, theme — see STORAGE_KEYS)",
  },
  {
    value: "theme",
    prefix: false,
    description: "Bare theme storage key (active/inactive light-dark)",
  },
  {
    value: "theme-dark",
    prefix: false,
    description: "Bare theme-dark storage key (dark-mode preset)",
  },
];

/**
 * Returns true when `key` belongs to a Slothing-owned localStorage
 * namespace and is therefore safe to wipe in the Danger-Zone reset.
 */
export function isSlothingLocalStorageKey(key: string): boolean {
  return LOCAL_STORAGE_KEY_PATTERNS.some((pattern) =>
    pattern.prefix ? key.startsWith(pattern.value) : key === pattern.value,
  );
}
