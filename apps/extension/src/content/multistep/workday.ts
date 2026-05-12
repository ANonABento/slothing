// Workday multi-step applicant flow handler (P3 / #36).
//
// Workday applications are wizard-shaped — the URL changes by hash + history
// state as the user clicks "Next". We:
//
// 1. Detect that we're on a `myworkdayjobs.com/.../job/.../apply` flow (or
//    the post-click `applyManually` route).
// 2. Wait for the user to click the explicit "Auto-fill this application"
//    button in the sidebar. No automatic capture — multi-step fills only
//    start on explicit intent (per #36 acceptance).
// 3. Persist the session in `chrome.storage.session` keyed by tabId.
// 4. On every step transition (broadcast from the background's
//    webNavigation listener, or surfaced via the prompted-fallback toast
//    when webNavigation is unavailable), re-run the field detector against
//    the new DOM and fill with the persisted profile.
// 5. Stop on submit click (we watch for `[data-automation-id]` submit
//    selectors), tab close (chrome wipes session storage), or 30-min
//    inactivity (handled by the session TTL).

import type { DetectedField, ExtensionProfile } from "@/shared/types";
import { FieldDetector } from "../auto-fill/field-detector";
import { FieldMapper } from "../auto-fill/field-mapper";
import { AutoFillEngine, type FillResult } from "../auto-fill/engine";
import {
  clearSession,
  getSession,
  setSession,
  type MultistepSession,
} from "./session";
import { promptStepFallback } from "./prompt-fallback";

/** URL substring that identifies a Workday host. */
const WORKDAY_HOST_RE = /\.myworkdayjobs\.com$/i;

/**
 * URL match for the apply flow itself. Workday URLs typically look like:
 *   https://acme.wd5.myworkdayjobs.com/en-US/Acme/job/Remote/Software-Engineer_R-1234/apply
 *   …/applyManually
 *   …/apply/applyManually
 */
const WORKDAY_APPLY_PATH_RE =
  /\/job\/[^/]+\/[^/]+\/(apply|applyManually|apply\/applyManually)(\/|$)/i;

/**
 * Selectors used to find Workday submit buttons. `[data-automation-id]` is
 * Workday's stable hook even across UI refreshes — we match on the prefix
 * and check the text to filter out "Next" / "Save and continue" etc.
 */
const WORKDAY_SUBMIT_SELECTORS = [
  'button[data-automation-id="bottom-navigation-next-button"]',
  'button[data-automation-id*="submit"]',
  'button[data-automation-id*="Submit"]',
];

/** Submit-button labels we treat as final (vs. "Next" / "Save and continue"). */
const WORKDAY_SUBMIT_LABELS_RE = /(submit application|submit|review and submit)/i;

/** True when the given URL is a Workday applicant page. */
export function isWorkdayApplyUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (!WORKDAY_HOST_RE.test(parsed.host)) return false;
    return WORKDAY_APPLY_PATH_RE.test(parsed.pathname);
  } catch {
    return false;
  }
}

export interface WorkdayHandlerDeps {
  /** Returns the current tab's id, fetched from the background. */
  getTabId: () => Promise<number | null>;
  /** Loads the current profile snapshot (cache-OK). */
  getProfile: () => Promise<ExtensionProfile | null>;
  /** True when webNavigation has been granted (Chrome MV3 = always; Firefox = optional). */
  hasWebNavigationPermission: () => Promise<boolean>;
}

/**
 * Public surface used by the content-script entry point. Construct one of
 * these per tab and forward the lifecycle hooks (step transition,
 * pagehide).
 */
export class WorkdayMultistepHandler {
  private detector = new FieldDetector();
  private deps: WorkdayHandlerDeps;
  private submitListenerAttached = false;
  private fallbackDeclined = false;

  constructor(deps: WorkdayHandlerDeps) {
    this.deps = deps;
  }

  /** True when the current URL is one we should be watching. */
  isActive(): boolean {
    return isWorkdayApplyUrl(window.location.href);
  }

  /**
   * Called when the user clicks the explicit "Auto-fill this application"
   * sidebar action. Captures the snapshot, runs the first fill, and arms
   * the submit-button watcher so a final submit clears state.
   */
  async confirm(options: {
    baseResumeId?: string;
  } = {}): Promise<FillResult | null> {
    if (!this.isActive()) return null;

    const [tabId, profile] = await Promise.all([
      this.deps.getTabId(),
      this.deps.getProfile(),
    ]);
    if (!tabId || !profile) {
      console.warn("[Columbus] Workday confirm: missing tabId or profile");
      return null;
    }

    const session: MultistepSession = {
      tabId,
      provider: "workday",
      jobUrl: window.location.href,
      profile,
      baseResumeId: options.baseResumeId,
      confirmedAt: new Date().toISOString(),
    };
    await setSession(session);
    this.fallbackDeclined = false;
    this.attachSubmitWatcher(tabId);

    return this.runFill(session);
  }

  /**
   * Fired by the background when `webNavigation.onHistoryStateUpdated`
   * sees a navigation on this tab. We re-run the fill against the new DOM.
   * If webNavigation isn't available the prompted-fallback path covers this.
   */
  async onStepTransition(): Promise<FillResult | null> {
    if (!this.isActive()) return null;
    const tabId = await this.deps.getTabId();
    if (!tabId) return null;

    const session = await getSession(tabId, "workday");
    if (!session) return null;

    // Workday re-renders the whole step DOM; wait a tick so the new form
    // fields are present before the detector runs.
    await waitForWorkdayStepReady();
    return this.runFill(session);
  }

  /**
   * No-webNavigation fallback path. Called from a MutationObserver / URL
   * watcher in the content script when we notice the page changed but
   * never got a webNavigation event. Asks the user "fill this page too?".
   */
  async onStepTransitionViaFallback(stepHint?: {
    stepNumber?: number;
    totalSteps?: number;
  }): Promise<FillResult | null> {
    if (!this.isActive()) return null;
    if (this.fallbackDeclined) return null;
    const tabId = await this.deps.getTabId();
    if (!tabId) return null;

    const session = await getSession(tabId, "workday");
    if (!session) return null;

    const accepted = await promptStepFallback({
      providerLabel: "Workday",
      stepNumber: stepHint?.stepNumber,
      totalSteps: stepHint?.totalSteps,
    });

    if (!accepted) {
      this.fallbackDeclined = true;
      await clearSession(tabId);
      return null;
    }

    await waitForWorkdayStepReady();
    return this.runFill(session);
  }

  /**
   * Detects the page-progress hint Workday surfaces as
   * `[data-automation-id="progressBarItem"]` so the fallback toast can say
   * "step 2 of 4" instead of "a new step".
   */
  detectStepHint(): { stepNumber?: number; totalSteps?: number } {
    const items = document.querySelectorAll<HTMLElement>(
      '[data-automation-id="progressBarItem"], [data-automation-id="progressBarActiveItem"]',
    );
    if (items.length === 0) return {};
    const active = Array.from(items).findIndex((node) =>
      /active|current/i.test(node.getAttribute("data-automation-id") ?? ""),
    );
    return {
      stepNumber: active >= 0 ? active + 1 : undefined,
      totalSteps: items.length,
    };
  }

  /** Detach watchers — called from `pagehide`. */
  destroy(): void {
    // Submit listener is on document so it lives with the page; explicit
    // detach happens via the controller wrapper in index.ts.
  }

  private async runFill(session: MultistepSession): Promise<FillResult | null> {
    const fields = this.collectFields();
    if (fields.length === 0) return null;
    const mapper = new FieldMapper(session.profile);
    const engine = new AutoFillEngine(this.detector, mapper);
    return engine.fillForm(fields);
  }

  /**
   * Workday doesn't always wrap fields in `<form>` — some steps render the
   * inputs as bare divs inside the application shell. We scope to the
   * Workday application container if present, else fall back to the whole
   * document, then call into `FieldDetector.detectFieldType` per input.
   */
  private collectFields(): DetectedField[] {
    const scope =
      document.querySelector<HTMLElement>('[data-automation-id="applyFlowContainer"]') ??
      document.querySelector<HTMLElement>('[data-automation-id*="application"]') ??
      document.body;
    if (!scope) return [];

    const inputs = scope.querySelectorAll<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >("input, textarea, select");
    const results: DetectedField[] = [];
    for (const el of inputs) {
      if (shouldSkipForWorkday(el)) continue;
      const detected = this.detector.detectFieldType(el);
      if (
        detected.fieldType !== "unknown" ||
        detected.confidence > 0.1
      ) {
        results.push(detected);
      }
    }
    return results;
  }

  /**
   * Watch for a click on a Workday submit button. The watcher lives on the
   * document so it survives Workday's step-level DOM re-renders.
   */
  private attachSubmitWatcher(tabId: number): void {
    if (this.submitListenerAttached) return;
    this.submitListenerAttached = true;
    document.addEventListener(
      "click",
      (event) => {
        const target = event.target as HTMLElement | null;
        if (!target) return;
        const button = target.closest<HTMLButtonElement>("button");
        if (!button) return;
        if (!matchesWorkdaySubmitButton(button)) return;
        // Don't preventDefault — we don't want to block submission. Just
        // clear the session so the next page (confirmation / "thanks for
        // applying") doesn't try to autofill anything.
        void clearSession(tabId);
      },
      true,
    );
  }
}

function shouldSkipForWorkday(
  el: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
): boolean {
  const input = el as HTMLInputElement;
  if (input.disabled) return true;
  if (input.type === "hidden" || input.type === "submit" || input.type === "button") {
    return true;
  }
  return false;
}

function matchesWorkdaySubmitButton(button: HTMLButtonElement): boolean {
  if (
    WORKDAY_SUBMIT_SELECTORS.some((sel) => {
      try {
        return button.matches(sel);
      } catch {
        return false;
      }
    })
  ) {
    const text = (button.textContent ?? "").trim();
    return WORKDAY_SUBMIT_LABELS_RE.test(text);
  }
  return false;
}

/**
 * Workday animates between steps; the next-step DOM mounts a frame or two
 * later. Resolve when at least one Workday-marked input is present or 500ms
 * has elapsed, whichever comes first.
 */
async function waitForWorkdayStepReady(timeoutMs = 500): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (
      document.querySelector(
        '[data-automation-id="textInputBox"], [data-automation-id="formField"], [data-automation-id*="input"]',
      )
    ) {
      return;
    }
    await new Promise((r) => setTimeout(r, 50));
  }
}
