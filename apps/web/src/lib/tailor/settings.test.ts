import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  DEFAULT_TAILOR_SETTINGS,
  TAILOR_SETTINGS_STORAGE_KEY,
  type TailorSettings,
  clearTailorSettings,
  loadTailorSettings,
  normalizeTailorSettings,
  saveTailorSettings,
} from "./settings";

describe("tailor settings", () => {
  // The global test setup stubs window.localStorage with bare vi.fn()
  // mocks; mirror the chrome-provider.test pattern and wire a real
  // in-memory store so getItem/setItem round-trip.
  let store: Record<string, string>;

  beforeEach(() => {
    store = {};
    vi.mocked(window.localStorage.getItem).mockImplementation(
      (key: string) => store[key] ?? null,
    );
    vi.mocked(window.localStorage.setItem).mockImplementation(
      (key: string, value: string) => {
        store[key] = String(value);
      },
    );
    vi.mocked(window.localStorage.removeItem).mockImplementation(
      (key: string) => {
        delete store[key];
      },
    );
    vi.mocked(window.localStorage.clear).mockImplementation(() => {
      for (const k of Object.keys(store)) delete store[k];
    });
  });

  afterEach(() => {
    store = {};
    vi.mocked(window.localStorage.getItem).mockReset();
    vi.mocked(window.localStorage.setItem).mockReset();
    vi.mocked(window.localStorage.removeItem).mockReset();
    vi.mocked(window.localStorage.clear).mockReset();
  });

  describe("storage key", () => {
    it("uses the legacy taida: prefix so existing users keep their settings", () => {
      // CLAUDE.md forbids renaming localStorage keys — guard with a test.
      expect(TAILOR_SETTINGS_STORAGE_KEY).toBe("taida:tailor:settings");
    });
  });

  describe("DEFAULT_TAILOR_SETTINGS", () => {
    it("provides sensible defaults", () => {
      expect(DEFAULT_TAILOR_SETTINGS).toEqual({
        bulletsPerRole: { min: 2, max: 4 },
        bulletsPerProject: { min: 1, max: 3 },
        maxRoles: 5,
        maxProjects: 3,
        atsStrictness: "balanced",
        dropBulletsShorterThan: 24,
      });
    });
  });

  describe("normalizeTailorSettings", () => {
    it("returns defaults for an empty input", () => {
      expect(normalizeTailorSettings({})).toEqual(DEFAULT_TAILOR_SETTINGS);
      expect(normalizeTailorSettings(null)).toEqual(DEFAULT_TAILOR_SETTINGS);
      expect(normalizeTailorSettings(undefined)).toEqual(
        DEFAULT_TAILOR_SETTINGS,
      );
    });

    it("clamps out-of-range numeric fields", () => {
      const normalized = normalizeTailorSettings({
        bulletsPerRole: { min: -10, max: 999 },
        bulletsPerProject: { min: -5, max: 100 },
        maxRoles: -1,
        maxProjects: 9999,
        dropBulletsShorterThan: -1,
      });
      expect(normalized.bulletsPerRole).toEqual({ min: 0, max: 12 });
      expect(normalized.bulletsPerProject).toEqual({ min: 0, max: 12 });
      expect(normalized.maxRoles).toBe(0);
      expect(normalized.maxProjects).toBe(20);
      expect(normalized.dropBulletsShorterThan).toBe(0);
    });

    it("ensures min <= max for bullet ranges", () => {
      const normalized = normalizeTailorSettings({
        bulletsPerRole: { min: 8, max: 3 },
      });
      // When min > max, min collapses to max so the range is valid.
      expect(normalized.bulletsPerRole.min).toBeLessThanOrEqual(
        normalized.bulletsPerRole.max,
      );
    });

    it("rejects unknown ATS strictness values", () => {
      const normalized = normalizeTailorSettings({
        atsStrictness: "nuclear" as unknown as TailorSettings["atsStrictness"],
      });
      expect(normalized.atsStrictness).toBe("balanced");
    });

    it("preserves valid input verbatim", () => {
      const input = {
        bulletsPerRole: { min: 3, max: 6 },
        bulletsPerProject: { min: 2, max: 4 },
        maxRoles: 7,
        maxProjects: 4,
        atsStrictness: "strict" as const,
        dropBulletsShorterThan: 40,
      };
      expect(normalizeTailorSettings(input)).toEqual(input);
    });
  });

  describe("loadTailorSettings", () => {
    it("returns defaults when nothing is persisted", () => {
      expect(loadTailorSettings()).toEqual(DEFAULT_TAILOR_SETTINGS);
    });

    it("returns defaults when persisted value is malformed JSON", () => {
      store[TAILOR_SETTINGS_STORAGE_KEY] = "{not json";
      expect(loadTailorSettings()).toEqual(DEFAULT_TAILOR_SETTINGS);
    });

    it("hydrates from localStorage when a valid blob is present", () => {
      store[TAILOR_SETTINGS_STORAGE_KEY] = JSON.stringify({
        bulletsPerRole: { min: 3, max: 6 },
        bulletsPerProject: { min: 2, max: 4 },
        maxRoles: 7,
        maxProjects: 4,
        atsStrictness: "strict",
        dropBulletsShorterThan: 40,
      });
      expect(loadTailorSettings()).toEqual({
        bulletsPerRole: { min: 3, max: 6 },
        bulletsPerProject: { min: 2, max: 4 },
        maxRoles: 7,
        maxProjects: 4,
        atsStrictness: "strict",
        dropBulletsShorterThan: 40,
      });
    });

    it("normalizes partial blobs (forward-compat)", () => {
      store[TAILOR_SETTINGS_STORAGE_KEY] = JSON.stringify({
        maxRoles: 9,
      });
      const result = loadTailorSettings();
      expect(result.maxRoles).toBe(9);
      // Missing fields fall back to defaults.
      expect(result.atsStrictness).toBe("balanced");
      expect(result.bulletsPerRole).toEqual({ min: 2, max: 4 });
    });
  });

  describe("saveTailorSettings", () => {
    it("writes the normalized blob to localStorage", () => {
      const written = saveTailorSettings({
        ...DEFAULT_TAILOR_SETTINGS,
        maxRoles: 8,
        atsStrictness: "strict",
      });
      expect(written.maxRoles).toBe(8);
      expect(written.atsStrictness).toBe("strict");

      const persisted = store[TAILOR_SETTINGS_STORAGE_KEY];
      expect(persisted).toBeTruthy();
      expect(JSON.parse(persisted!)).toMatchObject({
        maxRoles: 8,
        atsStrictness: "strict",
      });
    });

    it("returns a normalized copy even when input contains nonsense", () => {
      const written = saveTailorSettings({
        ...DEFAULT_TAILOR_SETTINGS,
        maxRoles: -10,
      });
      expect(written.maxRoles).toBe(0);
    });
  });

  describe("clearTailorSettings", () => {
    it("removes the persisted entry", () => {
      store[TAILOR_SETTINGS_STORAGE_KEY] = JSON.stringify(
        DEFAULT_TAILOR_SETTINGS,
      );
      clearTailorSettings();
      expect(store[TAILOR_SETTINGS_STORAGE_KEY]).toBeUndefined();
      expect(loadTailorSettings()).toEqual(DEFAULT_TAILOR_SETTINGS);
    });
  });
});
