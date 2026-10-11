// Greenhouse multi-step applicant flow handler (P3 / #37).
//
// Two flavours of Greenhouse application surface:
//
//   1. `boards.greenhouse.io/<company>/jobs/<id>` — a single-page form
//      embedded in the careers site. Step transitions are rare here but
//      some larger employers split the application into multiple sections
//      that use `#fragment` / `pushState` navigation.
//
//   2. `app.greenhouse.io/jobs/<id>/applications/new` — the canonical app
//      flow. Some employers embed this in an `<iframe>` on their own
//      careers domain. When iframed, URL-based listeners don't fire on the
//      outer page; we need a MutationObserver on the iframe's document
//      instead.
//
// The detection logic in this file mirrors workday.ts but uses Greenhouse-
// specific selectors and an iframe-aware "step transition" trigger.

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

const GREENHOUSE_HOST_RE = /(boards|app)\.greenhouse\.io$/i;
const GREENHOUSE_APP_FORM_RE = /\/(jobs|applications)\b/i;

/**
 * Submit selectors. Greenhouse uses `#submit_app` on boards.greenhouse.io
 * and `[data-test*="submit"]` on the embedded app domain. We also look at
 * button text to filter false positives ("Save draft" etc.).
 */
const GREENHOUSE_SUBMIT_SELECTORS = [
  "#submit_app",
  'button[type="submit"]',
  'button[data-test*="submit"]',
  'input[type="submit"]#submit_app',
];

const GREENHOUSE_SUBMIT_LABELS_RE =
  /(submit application|submit|review and submit)/i;

/** True when the URL belongs to a Greenhouse applicant flow. */
export function isGreenhouseApplyUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (!GREENHOUSE_HOST_RE.test(parsed.host)) return false;
    return GREENHOUSE_APP_FORM_RE.test(parsed.pathname);
  } catch {
    return false;
  }
}

/**
 * Returns the document we should inspect for fields. When the current page
 * iframes the `app.greenhouse.io` flow, the form lives in the iframe — we
 * try to reach into its `contentDocument` (works for same-origin / friendly
 * iframes; cross-origin frames are inaccessible and we fall back to the
 * outer document, which is harmless because the detector finds zero fields
 * there and the caller no-ops).
 */
export function getGreenhouseScopeDocument(
  root: Document = document,
): Document {
  // Direct page: the current document already is the Greenhouse form.
  if (GREENHOUSE_HOST_RE.test(root.location.host)) return root;

  // Iframed app: find an iframe pointing at greenhouse.io and try to read it.
  const frames = root.querySelectorAll<HTMLIFrameElement>("iframe");
  for (const frame of frames) {
    const src = frame.getAttribute("src") ?? "";
    if (!/greenhouse\.io/i.test(src)) continue;
    try {
      const doc = frame.contentDocument;
      if (doc) return doc;
    } catch {
      // Cross-origin frame — can't read it. Move on; the outer page will
      // still match URL-host detection if the user is on greenhouse.io
      // directly, and we no-op otherwise.
      continue;
    }
  }
  return root;
}

export interface GreenhouseHandlerDeps {
  getTabId: () => Promise<number | null>;
  getProfile: () => Promise<ExtensionProfile | null>;
  hasWebNavigationPermission: () => Promise<boolean>;
}

export class GreenhouseMultistepHandler {
  private detector = new FieldDetector();
  private deps: GreenhouseHandlerDeps;
  private submitListenerAttached = false;
  private fallbackDeclined = false;
  private iframeObserver: MutationObserver | null = null;

  constructor(deps: GreenhouseHandlerDeps) {
    this.deps = deps;
  }

  isActive(): boolean {
    if (isGreenhouseApplyUrl(window.location.href)) return true;
    // Iframed flow: outer URL might be the employer's careers site. Check
    // for a Greenhouse-app iframe on the page.
    return !!document.querySelector('iframe[src*="greenhouse.io"]');
  }

  async confirm(
    options: { baseResumeId?: string } = {},
  ): Promise<FillResult | null> {
    if (!this.isActive()) return null;

    const [tabId, profile] = await Promise.all([
      this.deps.getTabId(),
      this.deps.getProfile(),
    ]);
    if (!tabId || !profile) {
      console.warn("[Slothing] Greenhouse confirm: missing tabId or profile");
      return null;
    }

    const session: MultistepSession = {
      tabId,
      provider: "greenhouse",
      jobUrl: window.location.href,
      profile,
      baseResumeId: options.baseResumeId,
      confirmedAt: new Date().toISOString(),
    };
    await setSession(session);
    this.fallbackDeclined = false;
    this.attachSubmitWatcher(tabId);
    this.attachIframeObserver();

    return this.runFill(session);
  }

  async onStepTransition(): Promise<FillResult | null> {
    if (!this.isActive()) return null;
    const tabId = await this.deps.getTabId();
    if (!tabId) return null;

    const session = await getSession(tabId, "greenhouse");
    if (!session) return null;

    await waitForGreenhouseStepReady();
    return this.runFill(session);
  }

  async onStepTransitionViaFallback(stepHint?: {
    stepNumber?: number;
    totalSteps?: number;
  }): Promise<FillResult | null> {
    if (!this.isActive()) return null;
    if (this.fallbackDeclined) return null;
    const tabId = await this.deps.getTabId();
    if (!tabId) return null;

    const session = await getSession(tabId, "greenhouse");
    if (!session) return null;

    const accepted = await promptStepFallback({
      providerLabel: "Greenhouse",
      stepNumber: stepHint?.stepNumber,
      totalSteps: stepHint?.totalSteps,
    });

    if (!accepted) {
      this.fallbackDeclined = true;
      await clearSession(tabId);
      return null;
    }

    await waitForGreenhouseStepReady();
    return this.runFill(session);
  }

  /**
   * Greenhouse doesn't expose a numbered progress bar consistently. We
   * inspect `[data-test*="step"]` and `[role="tab"]` for an "active" hint
   * but if nothing matches we just omit the step text from the toast.
   */
  detectStepHint(): { stepNumber?: number; totalSteps?: number } {
    const doc = getGreenhouseScopeDocument();
    const candidates = doc.querySelectorAll<HTMLElement>(
      '[role="tab"], [data-test*="step"]',
    );
    if (candidates.length === 0) return {};
    const activeIdx = Array.from(candidates).findIndex(
      (node) =>
        node.getAttribute("aria-selected") === "true" ||
        /active|current/i.test(node.className),
    );
    return {
      stepNumber: activeIdx >= 0 ? activeIdx + 1 : undefined,
      totalSteps: candidates.length,
    };
  }

  destroy(): void {
    this.iframeObserver?.disconnect();
    this.iframeObserver = null;
  }

  private async runFill(session: MultistepSession): Promise<FillResult | null> {
    const fields = this.collectFields();
    if (fields.length === 0) return null;
    const mapper = new FieldMapper(session.profile);
    const engine = new AutoFillEngine(this.detector, mapper);
    return engine.fillForm(fields);
  }

  private collectFields(): DetectedField[] {
    const doc = getGreenhouseScopeDocument();
    const scope =
      doc.querySelector<HTMLElement>("#application") ??
      doc.querySelector<HTMLElement>("#main_fields") ??
      doc.querySelector<HTMLElement>("form#application_form") ??
      doc.body ??
      doc.documentElement;
    if (!scope) return [];
    const inputs = scope.querySelectorAll<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >("input, textarea, select");
    const results: DetectedField[] = [];
    for (const el of inputs) {
      if (shouldSkipForGreenhouse(el)) continue;
      const detected = this.detector.detectFieldType(el);
      if (detected.fieldType !== "unknown" || detected.confidence > 0.1) {
        results.push(detected);
      }
    }
    return results;
  }

  private attachSubmitWatcher(tabId: number): void {
    if (this.submitListenerAttached) return;
    this.submitListenerAttached = true;
    const handler = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const button = target.closest<HTMLElement>(
        'button, input[type="submit"]',
      );
      if (!button) return;
      if (!matchesGreenhouseSubmitButton(button)) return;
      void clearSession(tabId);
    };
    document.addEventListener("click", handler, true);

    // Also listen inside the iframe (same-origin case). Cross-origin
    // frames will throw; the catch keeps us robust.
    const iframe = document.querySelector<HTMLIFrameElement>(
      'iframe[src*="greenhouse.io"]',
    );
    try {
      iframe?.contentDocument?.addEventListener("click", handler, true);
    } catch {
      // ignore — cross-origin frame
    }
  }

  /**
   * When the page is the outer careers site with an iframed Greenhouse app,
   * URL changes on the outer page don't tell us about the iframe's
   * navigation. Watch the iframe's body for DOM mutations as a step-
   * transition proxy. We debounce so a single step transition doesn't fire
   * a hundred prompts.
   */
  private attachIframeObserver(): void {
    if (this.iframeObserver) return;
    const iframe = document.querySelector<HTMLIFrameElement>(
      'iframe[src*="greenhouse.io"]',
    );
    if (!iframe) return;
    let frameDoc: Document | null;
    try {
      frameDoc = iframe.contentDocument;
    } catch {
      return;
    }
    if (!frameDoc) return;

    let lastTrigger = 0;
    this.iframeObserver = new MutationObserver(() => {
      const now = Date.now();
      if (now - lastTrigger < 750) return;
      lastTrigger = now;
      // Re-trigger the step pipeline. The controller dispatches between
      // the webNav and fallback paths.
      void this.onStepTransition();
    });
    try {
      this.iframeObserver.observe(frameDoc.body ?? frameDoc.documentElement, {
        childList: true,
        subtree: true,
      });
    } catch {
      this.iframeObserver = null;
    }
  }
}

function shouldSkipForGreenhouse(
  el: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
): boolean {
  const input = el as HTMLInputElement;
  if (input.disabled) return true;
  if (
    input.type === "hidden" ||
    input.type === "submit" ||
    input.type === "button"
  ) {
    return true;
  }
  return false;
}

function matchesGreenhouseSubmitButton(button: HTMLElement): boolean {
  const matches = GREENHOUSE_SUBMIT_SELECTORS.some((sel) => {
    try {
      return button.matches(sel);
    } catch {
      return false;
    }
  });
  if (!matches) return false;
  const text =
    (button.textContent ?? "").trim() ||
    (button as HTMLInputElement).value ||
    "";
  return GREENHOUSE_SUBMIT_LABELS_RE.test(text);
}

async function waitForGreenhouseStepReady(timeoutMs = 500): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const doc = getGreenhouseScopeDocument();
    if (
      doc.querySelector("#application") ||
      doc.querySelector("#main_fields") ||
      doc.querySelector("form#application_form")
    ) {
      return;
    }
    await new Promise((r) => setTimeout(r, 50));
  }
}
