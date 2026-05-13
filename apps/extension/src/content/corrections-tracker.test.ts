// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";
import {
  CorrectionsTracker,
  CORRECTION_TRACK_WINDOW_MS,
  computeFieldSignature,
  wasCorrection,
} from "./corrections-tracker";
import type { DetectedField } from "@/shared/types";

type SendFn = (payload: {
  domain: string;
  fieldSignature: string;
  fieldType: string;
  originalSuggestion: string;
  userValue: string;
  confidence?: number;
}) => void;

function makeField(
  el: HTMLInputElement,
  overrides: Partial<DetectedField> = {},
): DetectedField {
  return {
    element: el,
    fieldType: overrides.fieldType ?? "email",
    confidence: overrides.confidence ?? 0.8,
    label: overrides.label ?? "Email",
    placeholder: overrides.placeholder,
  } as DetectedField;
}

describe("wasCorrection", () => {
  it("treats trimmed whitespace as not a correction", () => {
    expect(wasCorrection("kevin@hamming.ai", "  kevin@hamming.ai  ")).toBe(
      false,
    );
  });

  it("treats casing-only differences as not a correction", () => {
    // Email casing shouldn't churn the mapping — Gmail treats addresses
    // case-insensitively.
    expect(wasCorrection("Kevin@Hamming.ai", "kevin@hamming.ai")).toBe(false);
  });

  it("returns true when the user replaced the suggestion", () => {
    expect(wasCorrection("kevin@gmail.com", "kevin@hamming.ai")).toBe(true);
  });

  it("treats clearing a previously-filled field as a correction", () => {
    expect(wasCorrection("kevin@gmail.com", "")).toBe(true);
  });

  it("returns false for empty-on-empty (nothing was filled)", () => {
    expect(wasCorrection("", "")).toBe(false);
  });

  it("normalizes runs of whitespace before comparing", () => {
    expect(wasCorrection("Acme Inc.", "Acme  Inc.")).toBe(false);
  });
});

describe("computeFieldSignature", () => {
  it("includes field type, name, id, and label so different forms get different signatures", () => {
    const input = document.createElement("input");
    input.name = "email";
    input.id = "email-input";
    const sig = computeFieldSignature(
      makeField(input, { label: "Work email", fieldType: "email" }),
    );
    expect(sig).toContain("t:email");
    expect(sig).toContain("n:email");
    expect(sig).toContain("i:email-input");
    expect(sig).toContain("l:work email");
  });

  it("returns a stable signature across calls for the same field", () => {
    const input = document.createElement("input");
    input.name = "phone";
    const field = makeField(input, { fieldType: "phone", label: "Phone" });
    expect(computeFieldSignature(field)).toBe(computeFieldSignature(field));
  });
});

describe("CorrectionsTracker", () => {
  let send: Mock<Parameters<SendFn>, ReturnType<SendFn>>;
  let tracker: CorrectionsTracker;

  beforeEach(() => {
    vi.useFakeTimers();
    send = vi.fn<Parameters<SendFn>, ReturnType<SendFn>>(() => undefined);
    tracker = new CorrectionsTracker({
      send,
      domain: "example.com",
      now: () => Date.now(),
    });
  });

  afterEach(() => {
    tracker.clear();
    vi.useRealTimers();
  });

  it("fires SAVE_CORRECTION on blur when the user edits an autofilled field", () => {
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.value = "kevin@gmail.com";

    tracker.track(
      makeField(input, { fieldType: "email", label: "Email" }),
      "kevin@gmail.com",
    );

    // User edits then blurs.
    input.value = "kevin@hamming.ai";
    input.dispatchEvent(new Event("blur"));

    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        domain: "example.com",
        fieldType: "email",
        originalSuggestion: "kevin@gmail.com",
        userValue: "kevin@hamming.ai",
      }),
    );
  });

  it("does NOT fire when the user leaves the field unchanged", () => {
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.value = "kevin@gmail.com";

    tracker.track(makeField(input), "kevin@gmail.com");

    input.dispatchEvent(new Event("blur"));
    expect(send).not.toHaveBeenCalled();
  });

  it("expires the tracking window after 30 seconds and stops firing", () => {
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.value = "kevin@gmail.com";

    tracker.track(makeField(input), "kevin@gmail.com");
    expect(tracker.size()).toBe(1);

    // Advance past the window — entry should be expired.
    vi.advanceTimersByTime(CORRECTION_TRACK_WINDOW_MS + 1);
    expect(tracker.size()).toBe(0);

    // A blur after expiry must not fire the correction, even with an edit.
    input.value = "kevin@hamming.ai";
    input.dispatchEvent(new Event("blur"));
    expect(send).not.toHaveBeenCalled();
  });

  it("only fires once per tracked field even if blurred multiple times", () => {
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.value = "kevin@gmail.com";

    tracker.track(makeField(input), "kevin@gmail.com");

    input.value = "kevin@hamming.ai";
    input.dispatchEvent(new Event("blur"));
    input.dispatchEvent(new Event("blur"));
    input.dispatchEvent(new Event("blur"));

    expect(send).toHaveBeenCalledTimes(1);
  });

  it("ignores tracking when the original suggestion was empty", () => {
    const input = document.createElement("input");
    document.body.appendChild(input);

    tracker.track(makeField(input), "");
    expect(tracker.size()).toBe(0);
  });

  it("clear() removes all listeners and prevents future fires", () => {
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.value = "kevin@gmail.com";

    tracker.track(makeField(input), "kevin@gmail.com");
    tracker.clear();

    input.value = "kevin@hamming.ai";
    input.dispatchEvent(new Event("blur"));
    expect(send).not.toHaveBeenCalled();
  });
});
