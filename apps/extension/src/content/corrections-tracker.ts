// Corrections feedback loop (#33).
//
// When the autofill writes a value into a field we register it here for a
// 30-second window. If the user edits the value and the final value differs
// from the original suggestion when they blur the field, we POST a
// SAVE_CORRECTION message to the background script so the per-domain field
// mapping grows stronger over time.
//
// This module deliberately has no DOM-querying side-effects at import time so
// it stays pure-importable from tests.

import type { DetectedField, FieldType, FieldSignals } from "@/shared/types";
import { Messages, sendMessage } from "@/shared/messages";

/**
 * Default tracking window. Per the roadmap we track for 30s after fill so
 * we only learn from "I am correcting what you just filled" edits, not from
 * a user revisiting the form 20 minutes later. Exposed for tests.
 */
export const CORRECTION_TRACK_WINDOW_MS = 30_000;

export interface CorrectionTrackingOptions {
  /** Override the tracking window. Defaults to 30s. */
  windowMs?: number;
  /** Override the domain (defaults to `window.location.hostname`). */
  domain?: string;
  /**
   * Override the sender used to deliver the SAVE_CORRECTION message. Tests
   * inject this; production code uses the chrome.runtime sendMessage wrapper.
   */
  send?: (payload: {
    domain: string;
    fieldSignature: string;
    fieldType: FieldType;
    originalSuggestion: string;
    userValue: string;
    confidence?: number;
  }) => void | Promise<void>;
  /**
   * Override the timer source. Tests pass a fake-timer Date.now / setTimeout
   * pair via vi.useFakeTimers; production uses globalThis.
   */
  now?: () => number;
}

interface TrackedEntry {
  element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
  originalSuggestion: string;
  fieldType: FieldType;
  fieldSignature: string;
  confidence: number;
  startedAt: number;
  blurHandler: (event: Event) => void;
  expiryTimer: ReturnType<typeof setTimeout>;
  fired: boolean;
}

/**
 * Pure heuristic: returns true when the user's final value should be treated
 * as a correction of the original suggestion. We normalize whitespace + case
 * because trailing spaces, casing differences in emails, and a stray newline
 * in a textarea shouldn't count as "the user disagreed with our suggestion."
 *
 * Exported so the unit test can lock the behavior in independently.
 */
export function wasCorrection(original: string, current: string): boolean {
  const a = normalize(original);
  const b = normalize(current);
  if (b.length === 0) {
    // Clearing the field is also a correction — but only if the original
    // was non-empty. An empty-on-empty pair is not a correction.
    return a.length > 0;
  }
  return a !== b;
}

function normalize(value: string): string {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}

/**
 * Build a stable signature for a field. The roadmap calls for a
 * `fieldSignature` keyed against `(user_id, domain, field_signature)`, so we
 * want something that's stable across form re-renders (e.g. React keys
 * regenerating on every state change) yet specific enough to disambiguate
 * the email field on /apply from the email field on /signup.
 *
 * We combine: field type, autocomplete hint, name, id, label, placeholder,
 * and the form's path-derived id. None of these alone is reliable —
 * Workday uses `data-automation-id`, Lever uses `name`, Greenhouse uses `id`
 * — but the conjunction is.
 */
export function computeFieldSignature(field: DetectedField): string {
  const el = field.element;
  const signals = gatherSignalSubset(el);
  const parts = [
    `t:${field.fieldType}`,
    signals.autocomplete ? `ac:${signals.autocomplete}` : "",
    signals.name ? `n:${signals.name}` : "",
    signals.id ? `i:${signals.id}` : "",
    field.label ? `l:${normalize(field.label).slice(0, 80)}` : "",
    field.placeholder ? `p:${normalize(field.placeholder).slice(0, 60)}` : "",
  ].filter(Boolean);
  return parts.join("|");
}

function gatherSignalSubset(
  el: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
): Pick<FieldSignals, "name" | "id" | "autocomplete"> {
  return {
    name: el.name?.toLowerCase() || "",
    id: el.id?.toLowerCase() || "",
    autocomplete: el.autocomplete || "",
  };
}

export class CorrectionsTracker {
  private readonly entries = new Map<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
    TrackedEntry
  >();
  private readonly windowMs: number;
  private readonly domain: string;
  private readonly send: NonNullable<CorrectionTrackingOptions["send"]>;
  private readonly now: () => number;

  constructor(options: CorrectionTrackingOptions = {}) {
    this.windowMs = options.windowMs ?? CORRECTION_TRACK_WINDOW_MS;
    this.domain = options.domain ?? this.getDefaultDomain();
    this.send = options.send ?? defaultSender;
    this.now = options.now ?? (() => Date.now());
  }

  /**
   * Register a field that was just autofilled. The tracker will fire
   * SAVE_CORRECTION on blur within the next 30 seconds if and only if the
   * user has edited the value to something different from the suggestion.
   *
   * Calling `track` on a field that's already tracked replaces the prior
   * entry so the most recent suggestion is the one we diff against.
   */
  track(field: DetectedField, originalSuggestion: string): void {
    const el = field.element;
    if (originalSuggestion.length === 0) {
      // Nothing to compare against — bail.
      return;
    }
    this.untrack(el);

    const fieldSignature = computeFieldSignature(field);
    const fieldType = field.fieldType;
    const startedAt = this.now();

    const blurHandler = (event: Event) => {
      const target = event.target as
        | HTMLInputElement
        | HTMLTextAreaElement
        | HTMLSelectElement
        | null;
      if (!target) return;
      const entry = this.entries.get(target);
      if (!entry || entry.fired) return;
      const elapsed = this.now() - entry.startedAt;
      if (elapsed > this.windowMs) return;

      const userValue = readValue(target);
      if (!wasCorrection(entry.originalSuggestion, userValue)) return;

      entry.fired = true;

      void Promise.resolve(
        this.send({
          domain: this.domain,
          fieldSignature: entry.fieldSignature,
          fieldType: entry.fieldType,
          originalSuggestion: entry.originalSuggestion,
          userValue,
          confidence: entry.confidence,
        }),
      ).catch((err) => {
        console.error("[Columbus] saveCorrection failed:", err);
      });

      // Once we've fired the correction we can stop listening — no point
      // re-firing on every subsequent blur.
      this.untrack(target);
    };

    el.addEventListener("blur", blurHandler);

    const expiryTimer = setTimeout(() => {
      this.untrack(el);
    }, this.windowMs);

    this.entries.set(el, {
      element: el,
      originalSuggestion,
      fieldType,
      fieldSignature,
      confidence: field.confidence,
      startedAt,
      blurHandler,
      expiryTimer,
      fired: false,
    });
  }

  /** Stop tracking a single field (also called automatically on 30s expiry). */
  untrack(
    element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  ): void {
    const entry = this.entries.get(element);
    if (!entry) return;
    element.removeEventListener("blur", entry.blurHandler);
    clearTimeout(entry.expiryTimer);
    this.entries.delete(element);
  }

  /** Stop tracking every field. Called on page hide. */
  clear(): void {
    for (const entry of this.entries.values()) {
      entry.element.removeEventListener("blur", entry.blurHandler);
      clearTimeout(entry.expiryTimer);
    }
    this.entries.clear();
  }

  /** Number of fields currently being tracked. Exposed for tests. */
  size(): number {
    return this.entries.size;
  }

  private getDefaultDomain(): string {
    try {
      // hostname strips port + path so two ports on the same host (rare) share
      // a mapping. Matches the server-side normalization in the route.
      return typeof window === "undefined"
        ? "unknown"
        : window.location.hostname || "unknown";
    } catch {
      return "unknown";
    }
  }
}

function readValue(
  el: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
): string {
  if (el instanceof HTMLSelectElement) {
    const selected = el.options[el.selectedIndex];
    return selected?.text ?? el.value ?? "";
  }
  return el.value ?? "";
}

async function defaultSender(payload: {
  domain: string;
  fieldSignature: string;
  fieldType: FieldType;
  originalSuggestion: string;
  userValue: string;
  confidence?: number;
}): Promise<void> {
  await sendMessage(Messages.saveCorrection(payload));
}
