/**
 * Minimal save-status state machine for the extension options page.
 *
 * Mirrors the pattern in apps/web/src/components/studio/save-status.ts but
 * pared down: the options surface only needs idle → saving → saved → idle,
 * with a 2s linger on "saved" and a sticky "error" state.
 *
 * Pure helpers (no React state) so they're trivially unit-testable; the
 * page glues them together with useState + setTimeout.
 */

export type OptionsSaveState = "idle" | "saving" | "saved" | "error";

export interface OptionsSaveStatus {
  state: OptionsSaveState;
  /** Human-readable error message; only set when state === "error". */
  error?: string;
}

export const SAVED_LINGER_MS = 2000;

export const AUTO_SAVE_DEBOUNCE_MS = 500;

/**
 * Returns the inline label for a given status. Kept here so the test suite
 * can assert against the exact strings without rendering the component.
 */
export function labelForStatus(status: OptionsSaveStatus): string {
  switch (status.state) {
    case "saving":
      return "Saving…";
    case "saved":
      return "Saved ✓";
    case "error":
      return status.error ? `Save failed — ${status.error}` : "Save failed";
    case "idle":
    default:
      return "";
  }
}
