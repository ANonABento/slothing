// Controller that wires the Workday + Greenhouse multi-step handlers into
// the content-script entry point.
//
// Responsibilities:
//   - Decide which (if any) provider handler is active for the current URL.
//   - Forward step-transition events from the background (webNavigation) to
//     the active handler.
//   - When webNavigation is unavailable, fall back to MutationObserver +
//     URL change detection and surface the prompted toast.
//
// The controller is created once per content-script load. It's intentionally
// thin — almost all logic lives in the per-provider handlers — so the
// wiring in `content/index.ts` stays compact.

import type { ExtensionProfile } from "@/shared/types";
import { sendMessage, Messages } from "@/shared/messages";
import { WorkdayMultistepHandler, isWorkdayApplyUrl } from "./workday";
import { GreenhouseMultistepHandler, isGreenhouseApplyUrl } from "./greenhouse";
import { dismissStepFallback } from "./prompt-fallback";
import type { MultistepProvider } from "./session";

export interface MultistepControllerDeps {
  getProfile: () => Promise<ExtensionProfile | null>;
}

interface ActiveHandler {
  provider: MultistepProvider;
  workday?: WorkdayMultistepHandler;
  greenhouse?: GreenhouseMultistepHandler;
}

export class MultistepController {
  private deps: MultistepControllerDeps;
  private active: ActiveHandler | null = null;
  private lastUrl = window.location.href;
  private fallbackUrlInterval: ReturnType<typeof setInterval> | null = null;
  private cachedTabId: number | null = null;
  private cachedHasWebNav: boolean | null = null;

  constructor(deps: MultistepControllerDeps) {
    this.deps = deps;
  }

  /**
   * Initialise the controller for the current page. Returns the provider
   * that's active (or `null` if neither Workday nor Greenhouse matches).
   * Safe to call multiple times — the second call no-ops if the provider
   * hasn't changed.
   */
  init(): MultistepProvider | null {
    const provider = this.detectProvider();
    if (!provider) {
      this.active = null;
      return null;
    }
    if (this.active?.provider === provider) return provider;

    const sharedDeps = {
      getTabId: () => this.getTabId(),
      getProfile: () => this.deps.getProfile(),
      hasWebNavigationPermission: () => this.hasWebNavigationPermission(),
    };

    if (provider === "workday") {
      this.active = {
        provider,
        workday: new WorkdayMultistepHandler(sharedDeps),
      };
    } else {
      this.active = {
        provider,
        greenhouse: new GreenhouseMultistepHandler(sharedDeps),
      };
    }
    this.startFallbackUrlWatcher();
    return provider;
  }

  /**
   * The user clicked "Auto-fill this application" in the sidebar. This
   * captures the session, fills page 1, and arms the step pipeline.
   * If webNavigation isn't already granted (Firefox first-run), we ask for
   * it here — explicitly at the moment of intent, per the permission
   * strategy confirmed 2026-05-12.
   */
  async confirm(options: { baseResumeId?: string } = {}): Promise<boolean> {
    const provider = this.init();
    if (!provider) return false;

    // Try to obtain webNavigation now so future step transitions can take
    // the silent path. If the user declines (Firefox) the fallback toast
    // takes over — we still proceed with the first-page fill.
    void this.requestWebNavigationPermission();

    if (provider === "workday" && this.active?.workday) {
      const result = await this.active.workday.confirm(options);
      return !!result;
    }
    if (provider === "greenhouse" && this.active?.greenhouse) {
      const result = await this.active.greenhouse.confirm(options);
      return !!result;
    }
    return false;
  }

  /**
   * Handle a step-transition message from the background's webNavigation
   * listener. Dispatched in `content/index.ts`.
   */
  async onWebNavigationTransition(): Promise<void> {
    if (!this.active) return;
    this.lastUrl = window.location.href;
    if (this.active.workday) {
      await this.active.workday.onStepTransition();
    } else if (this.active.greenhouse) {
      await this.active.greenhouse.onStepTransition();
    }
  }

  /**
   * Tear down per-provider watchers. Called from `pagehide`.
   */
  destroy(): void {
    if (this.fallbackUrlInterval) {
      clearInterval(this.fallbackUrlInterval);
      this.fallbackUrlInterval = null;
    }
    this.active?.workday?.destroy();
    this.active?.greenhouse?.destroy();
    dismissStepFallback();
  }

  private detectProvider(): MultistepProvider | null {
    const url = window.location.href;
    if (isWorkdayApplyUrl(url)) return "workday";
    if (isGreenhouseApplyUrl(url)) return "greenhouse";
    // Iframed Greenhouse on a third-party careers site.
    if (document.querySelector('iframe[src*="greenhouse.io"]')) {
      return "greenhouse";
    }
    return null;
  }

  /**
   * When webNavigation isn't granted, watch for URL changes (history.pushState
   * / hashchange / popstate) and trigger the prompted-fallback path. The
   * iframe-Greenhouse case is covered by a MutationObserver inside its handler.
   */
  private startFallbackUrlWatcher(): void {
    if (this.fallbackUrlInterval) return;
    const tick = async () => {
      if (!this.active) return;
      // If webNavigation IS granted, the background already fires us
      // explicit transition events — skip the fallback to avoid double-
      // prompting.
      if (await this.hasWebNavigationPermission()) return;
      if (window.location.href === this.lastUrl) return;
      this.lastUrl = window.location.href;
      if (this.active.workday) {
        const hint = this.active.workday.detectStepHint();
        await this.active.workday.onStepTransitionViaFallback(hint);
      } else if (this.active.greenhouse) {
        const hint = this.active.greenhouse.detectStepHint();
        await this.active.greenhouse.onStepTransitionViaFallback(hint);
      }
    };
    // 500ms is a sensible balance — webNav-listener latency on real
    // browsers is ~100-300ms, and we don't want to thrash on every
    // hashchange.
    this.fallbackUrlInterval = setInterval(() => {
      void tick();
    }, 500);
    window.addEventListener("popstate", () => void tick());
    window.addEventListener("hashchange", () => void tick());
  }

  private async getTabId(): Promise<number | null> {
    if (this.cachedTabId !== null) return this.cachedTabId;
    const response = await sendMessage<{ tabId: number | null }>(
      Messages.getTabId(),
    );
    if (response.success && response.data?.tabId != null) {
      this.cachedTabId = response.data.tabId;
      return this.cachedTabId;
    }
    return null;
  }

  private async hasWebNavigationPermission(): Promise<boolean> {
    if (this.cachedHasWebNav !== null) return this.cachedHasWebNav;
    try {
      const response = await sendMessage<{ granted: boolean }>(
        Messages.hasWebNavigationPermission(),
      );
      this.cachedHasWebNav = !!(response.success && response.data?.granted);
    } catch {
      this.cachedHasWebNav = false;
    }
    return this.cachedHasWebNav;
  }

  private async requestWebNavigationPermission(): Promise<boolean> {
    try {
      const response = await sendMessage<{ granted: boolean }>(
        Messages.requestWebNavigationPermission(),
      );
      const granted = !!(response.success && response.data?.granted);
      this.cachedHasWebNav = granted;
      return granted;
    } catch {
      this.cachedHasWebNav = false;
      return false;
    }
  }
}
