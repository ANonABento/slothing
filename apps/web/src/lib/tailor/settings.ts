/**
 * Per-user Tailor settings.
 *
 * These knobs affect how the AI Tailor + Manual Tailor flows assemble the
 * resume. The current generator (see `./generate.ts`) hardcodes most of
 * these values — exposing them here lets users customise behaviour without
 * touching the generator. Persistence is browser-local (no server round
 * trip) so the dialog reacts instantly.
 *
 * Storage key uses the legacy `taida:` prefix per CLAUDE.md — do not rename
 * this; existing users have data under it.
 */

export type AtsStrictness = "loose" | "balanced" | "strict";

export interface BulletRange {
  min: number;
  max: number;
}

export interface TailorSettings {
  bulletsPerRole: BulletRange;
  bulletsPerProject: BulletRange;
  maxRoles: number;
  maxProjects: number;
  atsStrictness: AtsStrictness;
  /** Bullets whose length (characters) is below this threshold are dropped. */
  dropBulletsShorterThan: number;
}

export const DEFAULT_TAILOR_SETTINGS: TailorSettings = {
  bulletsPerRole: { min: 2, max: 4 },
  bulletsPerProject: { min: 1, max: 3 },
  maxRoles: 5,
  maxProjects: 3,
  atsStrictness: "balanced",
  dropBulletsShorterThan: 24,
};

/**
 * localStorage key for the persisted settings blob.
 *
 * NOTE: legacy `taida:` prefix is intentional. Do not rebrand — existing
 * users would lose their settings on rename.
 */
export const TAILOR_SETTINGS_STORAGE_KEY = "taida:tailor:settings";

const ATS_VALUES: ReadonlySet<AtsStrictness> = new Set([
  "loose",
  "balanced",
  "strict",
]);

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function clampInt(value: unknown, min: number, max: number, fallback: number) {
  if (!isFiniteNumber(value)) return fallback;
  const rounded = Math.round(value);
  if (rounded < min) return min;
  if (rounded > max) return max;
  return rounded;
}

function normalizeRange(
  raw: unknown,
  fallback: BulletRange,
  bounds: { min: number; max: number },
): BulletRange {
  const candidate = (raw ?? {}) as Partial<BulletRange>;
  const min = clampInt(candidate.min, bounds.min, bounds.max, fallback.min);
  const max = clampInt(candidate.max, bounds.min, bounds.max, fallback.max);
  // Guarantee min <= max.
  if (min > max) return { min: max, max };
  return { min, max };
}

/**
 * Validate + clamp a raw blob into a well-formed TailorSettings. Anything
 * malformed falls back to the default for that field — we never throw,
 * because the dialog should always have a usable starting point.
 */
export function normalizeTailorSettings(raw: unknown): TailorSettings {
  const candidate = (raw ?? {}) as Partial<TailorSettings>;
  return {
    bulletsPerRole: normalizeRange(
      candidate.bulletsPerRole,
      DEFAULT_TAILOR_SETTINGS.bulletsPerRole,
      { min: 0, max: 12 },
    ),
    bulletsPerProject: normalizeRange(
      candidate.bulletsPerProject,
      DEFAULT_TAILOR_SETTINGS.bulletsPerProject,
      { min: 0, max: 12 },
    ),
    maxRoles: clampInt(
      candidate.maxRoles,
      0,
      20,
      DEFAULT_TAILOR_SETTINGS.maxRoles,
    ),
    maxProjects: clampInt(
      candidate.maxProjects,
      0,
      20,
      DEFAULT_TAILOR_SETTINGS.maxProjects,
    ),
    atsStrictness:
      candidate.atsStrictness &&
      ATS_VALUES.has(candidate.atsStrictness as AtsStrictness)
        ? (candidate.atsStrictness as AtsStrictness)
        : DEFAULT_TAILOR_SETTINGS.atsStrictness,
    dropBulletsShorterThan: clampInt(
      candidate.dropBulletsShorterThan,
      0,
      500,
      DEFAULT_TAILOR_SETTINGS.dropBulletsShorterThan,
    ),
  };
}

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

/**
 * Load settings from localStorage. Falls back to defaults for missing /
 * corrupt / SSR contexts. Never throws.
 */
export function loadTailorSettings(): TailorSettings {
  const storage = getStorage();
  if (!storage) return { ...DEFAULT_TAILOR_SETTINGS };
  let raw: string | null = null;
  try {
    raw = storage.getItem(TAILOR_SETTINGS_STORAGE_KEY);
  } catch {
    return { ...DEFAULT_TAILOR_SETTINGS };
  }
  if (!raw) return { ...DEFAULT_TAILOR_SETTINGS };
  try {
    return normalizeTailorSettings(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_TAILOR_SETTINGS };
  }
}

/**
 * Persist settings to localStorage. Returns the normalized value that
 * was written, so callers can update local state without re-reading. SSR
 * safe (returns the input untouched).
 */
export function saveTailorSettings(next: TailorSettings): TailorSettings {
  const normalized = normalizeTailorSettings(next);
  const storage = getStorage();
  if (!storage) return normalized;
  try {
    storage.setItem(TAILOR_SETTINGS_STORAGE_KEY, JSON.stringify(normalized));
  } catch {
    // Storage quota / privacy mode — swallow. The in-memory copy still
    // works for this session.
  }
  return normalized;
}

/**
 * Remove any persisted settings, effectively reverting to defaults on
 * the next load.
 */
export function clearTailorSettings(): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.removeItem(TAILOR_SETTINGS_STORAGE_KEY);
  } catch {
    // ignore
  }
}
