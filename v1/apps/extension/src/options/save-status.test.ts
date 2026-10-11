import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  AUTO_SAVE_DEBOUNCE_MS,
  SAVED_LINGER_MS,
  labelForStatus,
  type OptionsSaveStatus,
} from "./save-status";

describe("labelForStatus", () => {
  it("returns an empty string when idle so the badge can hide itself", () => {
    expect(labelForStatus({ state: "idle" })).toBe("");
  });

  it("returns the saving label with an ellipsis (not three dots)", () => {
    expect(labelForStatus({ state: "saving" })).toBe("Saving…");
  });

  it("returns the saved label with a check mark", () => {
    expect(labelForStatus({ state: "saved" })).toBe("Saved ✓");
  });

  it("includes the underlying error in the failure label when supplied", () => {
    expect(
      labelForStatus({
        state: "error",
        error: "Slothing servers are having a problem.",
      } as OptionsSaveStatus),
    ).toBe("Save failed — Slothing servers are having a problem.");
  });

  it("falls back to a bare failure label when no error string is supplied", () => {
    expect(labelForStatus({ state: "error" })).toBe("Save failed");
  });
});

/**
 * Verifies the debounce contract that the options page relies on:
 * rapid changes within `AUTO_SAVE_DEBOUNCE_MS` collapse into a single
 * delayed flush. Mirrors how the range-slider drag should behave (final
 * value saved 500ms after release, not during drag).
 */
describe("auto-save debounce timing", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("only calls the flush callback once when several changes land inside the debounce window", () => {
    const flush = vi.fn();
    // Cast to unknown to avoid NodeJS.Timeout vs number resolution between
    // dom lib and @types/node; we only care about the timer round-tripping.
    let timer: unknown;
    const debounced = () => {
      if (timer !== undefined) clearTimeout(timer as number);
      timer = setTimeout(flush, AUTO_SAVE_DEBOUNCE_MS);
    };

    debounced();
    vi.advanceTimersByTime(AUTO_SAVE_DEBOUNCE_MS - 50);
    debounced();
    vi.advanceTimersByTime(AUTO_SAVE_DEBOUNCE_MS - 50);
    debounced();
    vi.advanceTimersByTime(AUTO_SAVE_DEBOUNCE_MS);

    expect(flush).toHaveBeenCalledTimes(1);
  });

  it("flushes once and only once after the debounce period elapses with no further changes", () => {
    const flush = vi.fn();
    // Cast to unknown to avoid NodeJS.Timeout vs number resolution between
    // dom lib and @types/node; we only care about the timer round-tripping.
    let timer: unknown;
    const debounced = () => {
      if (timer !== undefined) clearTimeout(timer as number);
      timer = setTimeout(flush, AUTO_SAVE_DEBOUNCE_MS);
    };

    debounced();
    expect(flush).not.toHaveBeenCalled();
    vi.advanceTimersByTime(AUTO_SAVE_DEBOUNCE_MS - 1);
    expect(flush).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(flush).toHaveBeenCalledTimes(1);
  });

  it("the 'saved' linger window lasts SAVED_LINGER_MS before fading", () => {
    // Sanity-check the contract that the App's setTimeout depends on.
    expect(SAVED_LINGER_MS).toBeGreaterThanOrEqual(1000);
    expect(SAVED_LINGER_MS).toBeLessThanOrEqual(5000);
  });
});
