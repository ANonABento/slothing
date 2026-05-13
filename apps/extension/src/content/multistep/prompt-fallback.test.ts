// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { dismissStepFallback, promptStepFallback } from "./prompt-fallback";

describe("promptStepFallback", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("mounts a toast with the step + provider message", async () => {
    const pending = promptStepFallback({
      stepNumber: 2,
      totalSteps: 4,
      providerLabel: "Workday",
    });

    // The toast should now be in the DOM.
    const toast = document.getElementById("slothing-multistep-toast");
    expect(toast).toBeTruthy();
    expect(toast?.textContent).toContain("step 2 of 4");
    expect(toast?.textContent).toContain("Workday");

    // Click "Yes" and expect the promise to resolve true.
    const yesBtn = Array.from(toast!.querySelectorAll("button")).find((b) =>
      /yes/i.test(b.textContent ?? ""),
    );
    expect(yesBtn).toBeTruthy();
    yesBtn!.click();
    await expect(pending).resolves.toBe(true);
    expect(document.getElementById("slothing-multistep-toast")).toBeNull();
  });

  it("resolves false on No", async () => {
    const pending = promptStepFallback({ providerLabel: "Greenhouse" });
    const toast = document.getElementById("slothing-multistep-toast")!;
    const noBtn = Array.from(toast.querySelectorAll("button")).find((b) =>
      /no/i.test(b.textContent ?? ""),
    );
    noBtn!.click();
    await expect(pending).resolves.toBe(false);
    expect(document.getElementById("slothing-multistep-toast")).toBeNull();
  });

  it("auto-dismisses to false after the 12s timeout", async () => {
    const pending = promptStepFallback({});
    vi.advanceTimersByTime(12_500);
    await expect(pending).resolves.toBe(false);
  });

  it("dismissStepFallback removes any in-flight toast as a No", async () => {
    const pending = promptStepFallback({});
    dismissStepFallback();
    await expect(pending).resolves.toBe(false);
    expect(document.getElementById("slothing-multistep-toast")).toBeNull();
  });

  it("only one toast is visible at a time (second call dismisses the first)", async () => {
    const first = promptStepFallback({ stepNumber: 1 });
    const second = promptStepFallback({ stepNumber: 2 });
    // The first prompt should auto-resolve false (the second one took over).
    await expect(first).resolves.toBe(false);
    const toast = document.getElementById("slothing-multistep-toast");
    expect(toast?.textContent).toContain("step 2");
    // Clean up so the test runner doesn't hold an unresolved promise.
    dismissStepFallback();
    await expect(second).resolves.toBe(false);
  });

  it("falls back to a generic message when no step hint is provided", async () => {
    const pending = promptStepFallback({});
    const toast = document.getElementById("slothing-multistep-toast")!;
    expect(toast.textContent).toContain("Looks like a new step");
    dismissStepFallback();
    await pending;
  });
});
