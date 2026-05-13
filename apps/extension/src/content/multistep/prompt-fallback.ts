// Prompted fallback toast for multi-step flows when webNavigation is
// unavailable (Firefox users who declined the optional permission, or any
// future browser where the API is gated).
//
// On each detected step transition we show a non-blocking in-page toast:
//   "Looks like step 2 of 4 — fill this page too?"   [Yes] [No]
//
// - "Yes"  → resolve(true). The caller re-runs the autofill engine against
//   the new DOM with the persisted session profile.
// - "No"   → resolve(false). The caller clears the session for the rest of
//   the flow (no more prompts until the user re-triggers "Auto-fill this
//   application" from the sidebar).
// - 12s timeout → resolve(false). Treated as "No" so a user who tabs away
//   doesn't come back to a stranded prompt.
//
// The toast uses the same violet/cream palette as the popup
// (apps/extension/src/popup/styles.css) so it doesn't look like a foreign
// browser dialog. We deliberately avoid the forbidden `bg-white` etc.
// Tailwind classes — this is plain DOM, but the *values* are mirrored from
// the popup tokens so the design system stays consistent.

export interface PromptStepFallbackOptions {
  /** 1-indexed step number ("step 2 of 4"). Pass undefined if unknown. */
  stepNumber?: number;
  /** Total step count for the message. Pass undefined to drop the "of 4" suffix. */
  totalSteps?: number;
  /** ATS provider name (capitalised) — used in the secondary line. */
  providerLabel?: string;
}

const TOAST_CONTAINER_ID = "slothing-multistep-toast";
const TOAST_TIMEOUT_MS = 12_000;

/**
 * Show the prompt and resolve with the user's choice. Safe to call from
 * either provider handler; only one toast is visible at a time (an in-flight
 * prompt is auto-resolved as `false` before a new one mounts).
 */
export function promptStepFallback(
  options: PromptStepFallbackOptions = {},
): Promise<boolean> {
  // If there's already a toast on screen, dismiss it as a "No" so the new
  // prompt can take over. Without this two rapid step transitions could
  // stack toasts on top of each other.
  const existing = document.getElementById(TOAST_CONTAINER_ID);
  if (existing) {
    existing.dispatchEvent(new CustomEvent("slothing-dismiss"));
    existing.remove();
  }

  return new Promise<boolean>((resolve) => {
    const toast = document.createElement("div");
    toast.id = TOAST_CONTAINER_ID;
    toast.setAttribute("role", "dialog");
    toast.setAttribute("aria-live", "polite");
    toast.setAttribute("aria-label", "Continue auto-fill on this step?");

    // Inline-style the toast so we don't have to mount yet another CSS file
    // and risk page-CSS overriding us. All colors mirror the popup tokens.
    Object.assign(toast.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      maxWidth: "320px",
      padding: "14px 16px",
      background: "#ffffff",
      color: "#241c30",
      border: "1px solid #e6dfd6",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(36, 28, 48, 0.12)",
      fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif",
      fontSize: "14px",
      lineHeight: "1.45",
      zIndex: "2147483647",
    } satisfies Partial<CSSStyleDeclaration>);

    const title = document.createElement("div");
    title.style.fontWeight = "600";
    title.style.marginBottom = "4px";
    const stepText =
      options.stepNumber && options.totalSteps
        ? `Looks like step ${options.stepNumber} of ${options.totalSteps}`
        : options.stepNumber
          ? `Looks like step ${options.stepNumber}`
          : "Looks like a new step";
    title.textContent = `${stepText} — fill this page too?`;
    toast.appendChild(title);

    if (options.providerLabel) {
      const sub = document.createElement("div");
      sub.style.fontSize = "12px";
      sub.style.color = "#6b6373";
      sub.style.marginBottom = "10px";
      sub.textContent = `${options.providerLabel} multi-step application`;
      toast.appendChild(sub);
    }

    const actions = document.createElement("div");
    actions.style.display = "flex";
    actions.style.gap = "8px";
    actions.style.justifyContent = "flex-end";

    const noBtn = document.createElement("button");
    noBtn.type = "button";
    noBtn.textContent = "No";
    Object.assign(noBtn.style, {
      padding: "6px 12px",
      background: "transparent",
      color: "#6b6373",
      border: "1px solid #e6dfd6",
      borderRadius: "8px",
      cursor: "pointer",
      font: "inherit",
    });

    const yesBtn = document.createElement("button");
    yesBtn.type = "button";
    yesBtn.textContent = "Yes, fill";
    Object.assign(yesBtn.style, {
      padding: "6px 12px",
      background: "#6d4aaa",
      color: "#ffffff",
      border: "1px solid #6d4aaa",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
      font: "inherit",
    });

    actions.appendChild(noBtn);
    actions.appendChild(yesBtn);
    toast.appendChild(actions);

    let settled = false;
    const settle = (value: boolean) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      toast.remove();
      resolve(value);
    };

    yesBtn.addEventListener("click", () => settle(true));
    noBtn.addEventListener("click", () => settle(false));
    toast.addEventListener("slothing-dismiss", () => settle(false));

    const timeoutId = window.setTimeout(() => settle(false), TOAST_TIMEOUT_MS);

    document.body.appendChild(toast);
    // Focus the primary action so keyboard users don't get lost.
    yesBtn.focus();
  });
}

/**
 * Forcibly remove any in-flight prompt. Used on `pagehide` so we don't leak
 * a toast into a bfcache restore.
 */
export function dismissStepFallback(): void {
  const existing = document.getElementById(TOAST_CONTAINER_ID);
  if (!existing) return;
  existing.dispatchEvent(new CustomEvent("slothing-dismiss"));
  existing.remove();
}
