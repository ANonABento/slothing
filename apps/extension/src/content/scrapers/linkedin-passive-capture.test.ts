// @vitest-environment jsdom
//
// Unit tests for the P3/#38 passive LinkedIn capture pipeline.
//
// What we cover:
//   - session-scoped jobId dedupe (visit same job twice → counted once)
//   - daily-cap counter increments + cross-day reset
//   - silent rate-limit behaviour at the 50/day boundary (no error toast)
//   - first-capture-per-session toast appears, second capture does NOT add
//     another toast
//   - the capture path does not mutate any LinkedIn-side DOM (only the toast
//     container is allowed to appear in document.body)

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ScrapedJob } from "../../shared/types";
import {
  getLinkedInDailyCapState,
  getLinkedInSeenIds,
  incrementLinkedInDailyCap,
  LINKEDIN_DAILY_CAP,
  LINKEDIN_DAILY_KEY,
  LINKEDIN_SEEN_KEY,
  LINKEDIN_TOAST_CLASS,
  localDateStamp,
  resetLinkedInCaptureSessionState,
  showLinkedInCaptureToast,
  tryCaptureLinkedInJob,
  type SendMessageFn,
} from "./linkedin-passive-capture";

interface ChromeStub {
  storage: {
    session: {
      get: (
        key: string,
        cb: (result: Record<string, unknown>) => void,
      ) => void;
      set: (entries: Record<string, unknown>, cb: () => void) => void;
      remove: (key: string, cb: () => void) => void;
    };
    local: {
      get: (
        key: string,
        cb: (result: Record<string, unknown>) => void,
      ) => void;
      set: (entries: Record<string, unknown>, cb: () => void) => void;
      remove: (key: string, cb: () => void) => void;
    };
  };
}

function buildChromeStub(
  sessionStore: Record<string, unknown>,
  localStore: Record<string, unknown>,
): ChromeStub {
  return {
    storage: {
      session: {
        get: (key, cb) => cb({ [key]: sessionStore[key] }),
        set: (entries, cb) => {
          Object.assign(sessionStore, entries);
          cb();
        },
        remove: (key, cb) => {
          delete sessionStore[key];
          cb();
        },
      },
      local: {
        get: (key, cb) => cb({ [key]: localStore[key] }),
        set: (entries, cb) => {
          Object.assign(localStore, entries);
          cb();
        },
        remove: (key, cb) => {
          delete localStore[key];
          cb();
        },
      },
    },
  };
}

const baseJob: ScrapedJob = {
  title: "Senior Engineer",
  company: "Acme Corp",
  description: "Build things and ship them.",
  requirements: [],
  url: "https://www.linkedin.com/jobs/view/12345",
  source: "linkedin",
  sourceJobId: "12345",
};

const buildImportMessage = (job: ScrapedJob) => ({
  type: "IMPORT_JOB" as const,
  payload: job,
});

function makeSendMessage(
  result: { success: boolean; error?: string } = { success: true },
): { fn: SendMessageFn; calls: Array<{ type: string; payload: unknown }> } {
  const calls: Array<{ type: string; payload: unknown }> = [];
  const fn: SendMessageFn = async (message) => {
    calls.push({ type: message.type, payload: message.payload });
    return result as { success: boolean; error?: string };
  };
  return { fn, calls };
}

describe("linkedin-passive-capture storage helpers", () => {
  let sessionStore: Record<string, unknown>;
  let localStore: Record<string, unknown>;

  beforeEach(() => {
    sessionStore = {};
    localStore = {};
    vi.stubGlobal("chrome", buildChromeStub(sessionStore, localStore));
    resetLinkedInCaptureSessionState();
    document.body.innerHTML = "";
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("getLinkedInSeenIds returns [] when nothing has been written", async () => {
    expect(await getLinkedInSeenIds()).toEqual([]);
  });

  it("getLinkedInSeenIds filters non-string entries defensively", async () => {
    sessionStore[LINKEDIN_SEEN_KEY] = ["123", 456, null, "789"];
    expect(await getLinkedInSeenIds()).toEqual(["123", "789"]);
  });

  it("daily cap state defaults to today with count 0", async () => {
    const now = new Date("2026-05-12T10:00:00Z");
    const state = await getLinkedInDailyCapState(now);
    expect(state.count).toBe(0);
    expect(state.date).toBe(localDateStamp(now));
  });

  it("daily cap state increments and persists for the same day", async () => {
    const now = new Date("2026-05-12T10:00:00Z");
    const a = await incrementLinkedInDailyCap(now);
    expect(a.count).toBe(1);
    const b = await incrementLinkedInDailyCap(now);
    expect(b.count).toBe(2);
    const c = await getLinkedInDailyCapState(now);
    expect(c.count).toBe(2);
  });

  it("daily cap state resets when the local date stamp changes", async () => {
    const day1 = new Date("2026-05-12T22:00:00");
    const day2 = new Date("2026-05-13T08:00:00");
    await incrementLinkedInDailyCap(day1);
    await incrementLinkedInDailyCap(day1);
    // Confirm we hit 2 on day 1 …
    expect((await getLinkedInDailyCapState(day1)).count).toBe(2);
    // … then the next calendar day reads as a fresh 0 even though the entry
    // from yesterday is still in storage.
    const day2State = await getLinkedInDailyCapState(day2);
    expect(day2State.count).toBe(0);
    expect(day2State.date).toBe(localDateStamp(day2));
  });

  it("daily cap state ignores malformed records", async () => {
    localStore[LINKEDIN_DAILY_KEY] = { date: 123, count: "lots" };
    const state = await getLinkedInDailyCapState(new Date());
    expect(state.count).toBe(0);
  });
});

describe("tryCaptureLinkedInJob — dedupe, cap, and enqueue", () => {
  let sessionStore: Record<string, unknown>;
  let localStore: Record<string, unknown>;

  beforeEach(() => {
    sessionStore = {};
    localStore = {};
    vi.stubGlobal("chrome", buildChromeStub(sessionStore, localStore));
    resetLinkedInCaptureSessionState();
    document.body.innerHTML = "";
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("captures a fresh LinkedIn job and enqueues via IMPORT_JOB", async () => {
    const sender = makeSendMessage();
    const toast = vi.fn();
    const result = await tryCaptureLinkedInJob(baseJob, {
      sendMessage: sender.fn,
      buildImportMessage,
      showToast: toast,
      now: () => new Date("2026-05-12T10:00:00Z"),
    });
    expect(result).toBe("captured");
    expect(sender.calls).toHaveLength(1);
    expect(sender.calls[0]?.type).toBe("IMPORT_JOB");
    expect((sender.calls[0]?.payload as ScrapedJob).sourceJobId).toBe("12345");
    expect(toast).toHaveBeenCalledTimes(1);
    expect(toast).toHaveBeenCalledWith(1);
  });

  it("dedupes when the same jobId is captured twice in one session", async () => {
    const sender = makeSendMessage();
    const toast = vi.fn();
    const opts = {
      sendMessage: sender.fn,
      buildImportMessage,
      showToast: toast,
      now: () => new Date("2026-05-12T10:00:00Z"),
    };
    const first = await tryCaptureLinkedInJob(baseJob, opts);
    const second = await tryCaptureLinkedInJob(baseJob, opts);
    expect(first).toBe("captured");
    expect(second).toBe("deduped");
    // Crucially: only one network call was made.
    expect(sender.calls).toHaveLength(1);
    // And only one daily-cap slot was consumed.
    expect((await getLinkedInDailyCapState(opts.now())).count).toBe(1);
  });

  it("captures different jobIds independently", async () => {
    const sender = makeSendMessage();
    const opts = {
      sendMessage: sender.fn,
      buildImportMessage,
      now: () => new Date("2026-05-12T10:00:00Z"),
    };
    const a = await tryCaptureLinkedInJob(
      { ...baseJob, sourceJobId: "11111" },
      opts,
    );
    const b = await tryCaptureLinkedInJob(
      { ...baseJob, sourceJobId: "22222" },
      opts,
    );
    expect(a).toBe("captured");
    expect(b).toBe("captured");
    expect(sender.calls).toHaveLength(2);
    expect(await getLinkedInSeenIds()).toEqual(["11111", "22222"]);
  });

  it("returns 'capped' silently once the daily cap is hit (no enqueue, no toast)", async () => {
    const now = new Date("2026-05-12T10:00:00Z");
    localStore[LINKEDIN_DAILY_KEY] = {
      date: localDateStamp(now),
      count: LINKEDIN_DAILY_CAP,
    };
    const sender = makeSendMessage();
    const toast = vi.fn();
    const result = await tryCaptureLinkedInJob(baseJob, {
      sendMessage: sender.fn,
      buildImportMessage,
      showToast: toast,
      now: () => now,
    });
    expect(result).toBe("capped");
    expect(sender.calls).toHaveLength(0);
    expect(toast).not.toHaveBeenCalled();
    // The seen list must NOT be updated — if the user re-visits the job
    // tomorrow, we want it to be eligible again.
    expect(await getLinkedInSeenIds()).toEqual([]);
  });

  it("re-allows capture after the daily cap resets across days", async () => {
    const day1 = new Date("2026-05-12T22:00:00");
    const day2 = new Date("2026-05-13T08:00:00");
    localStore[LINKEDIN_DAILY_KEY] = {
      date: localDateStamp(day1),
      count: LINKEDIN_DAILY_CAP,
    };

    const sender = makeSendMessage();
    const first = await tryCaptureLinkedInJob(baseJob, {
      sendMessage: sender.fn,
      buildImportMessage,
      now: () => day1,
    });
    expect(first).toBe("capped");

    // New session/day — also resets the in-memory toast flag.
    resetLinkedInCaptureSessionState();
    sessionStore[LINKEDIN_SEEN_KEY] = []; // session storage is wiped on browser restart

    const second = await tryCaptureLinkedInJob(baseJob, {
      sendMessage: sender.fn,
      buildImportMessage,
      now: () => day2,
    });
    expect(second).toBe("captured");
    expect((await getLinkedInDailyCapState(day2)).count).toBe(1);
  });

  it("only shows the toast on the FIRST capture of a session", async () => {
    const sender = makeSendMessage();
    const toast = vi.fn();
    const opts = {
      sendMessage: sender.fn,
      buildImportMessage,
      showToast: toast,
      now: () => new Date("2026-05-12T10:00:00Z"),
    };
    await tryCaptureLinkedInJob(
      { ...baseJob, sourceJobId: "11111" },
      opts,
    );
    await tryCaptureLinkedInJob(
      { ...baseJob, sourceJobId: "22222" },
      opts,
    );
    await tryCaptureLinkedInJob(
      { ...baseJob, sourceJobId: "33333" },
      opts,
    );
    expect(toast).toHaveBeenCalledTimes(1);
    expect(toast).toHaveBeenCalledWith(1);
  });

  it("skips non-linkedin jobs (other scrapers must not flow through this path)", async () => {
    const sender = makeSendMessage();
    const result = await tryCaptureLinkedInJob(
      { ...baseJob, source: "indeed" },
      { sendMessage: sender.fn, buildImportMessage },
    );
    expect(result).toBe("skipped");
    expect(sender.calls).toHaveLength(0);
  });

  it("skips when there is no sourceJobId (LinkedIn search/collections page)", async () => {
    const sender = makeSendMessage();
    const result = await tryCaptureLinkedInJob(
      { ...baseJob, sourceJobId: undefined },
      { sendMessage: sender.fn, buildImportMessage },
    );
    expect(result).toBe("skipped");
    expect(sender.calls).toHaveLength(0);
  });

  it("returns 'error' when the background reports an enqueue failure", async () => {
    const sender = makeSendMessage({ success: false, error: "network" });
    const toast = vi.fn();
    const result = await tryCaptureLinkedInJob(baseJob, {
      sendMessage: sender.fn,
      buildImportMessage,
      showToast: toast,
      now: () => new Date("2026-05-12T10:00:00Z"),
    });
    expect(result).toBe("error");
    // No success toast on a failed enqueue.
    expect(toast).not.toHaveBeenCalled();
  });
});

describe("showLinkedInCaptureToast", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("mounts a toast with the running session count", () => {
    showLinkedInCaptureToast(1);
    const toast = document.querySelector(`.${LINKEDIN_TOAST_CLASS}`);
    expect(toast).not.toBeNull();
    expect(toast?.textContent).toContain("1 LinkedIn job captured");
  });

  it("pluralises 'jobs' for counts > 1", () => {
    showLinkedInCaptureToast(3);
    const toast = document.querySelector(`.${LINKEDIN_TOAST_CLASS}`);
    expect(toast?.textContent).toContain("3 LinkedIn jobs captured");
  });

  it("replaces an existing capture toast rather than stacking", () => {
    showLinkedInCaptureToast(1);
    showLinkedInCaptureToast(2);
    const toasts = document.querySelectorAll(`.${LINKEDIN_TOAST_CLASS}`);
    expect(toasts).toHaveLength(1);
    expect(toasts[0]?.textContent).toContain("2 LinkedIn");
  });
});

describe("DOM contract — capture path must not mutate the LinkedIn page", () => {
  let sessionStore: Record<string, unknown>;
  let localStore: Record<string, unknown>;

  beforeEach(() => {
    sessionStore = {};
    localStore = {};
    vi.stubGlobal("chrome", buildChromeStub(sessionStore, localStore));
    resetLinkedInCaptureSessionState();

    // Stand up a chunk of LinkedIn-like markup. The capture path must touch
    // none of these nodes — we observe mutations and assert the only adds
    // are toast containers under document.body.
    document.body.innerHTML = `
      <main class="scaffold-layout">
        <section class="jobs-search__job-details--container">
          <h1 class="job-details-jobs-unified-top-card__job-title">Senior Engineer</h1>
          <div class="job-details-jobs-unified-top-card__company-name">Acme</div>
          <article class="jobs-description__content">
            <p>Build things.</p>
          </article>
          <button class="jobs-apply-button">Easy Apply</button>
        </section>
      </main>
    `;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("only adds the toast container to document.body — no LinkedIn-side edits", async () => {
    // Snapshot the LinkedIn-side subtree so we can verify it's untouched.
    const linkedInRoot = document.querySelector("main.scaffold-layout");
    expect(linkedInRoot).not.toBeNull();
    const beforeHtml = linkedInRoot!.outerHTML;

    const observedMutations: MutationRecord[] = [];
    const observer = new MutationObserver((records) => {
      observedMutations.push(...records);
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });

    const sender = makeSendMessage();
    await tryCaptureLinkedInJob(baseJob, {
      sendMessage: sender.fn,
      buildImportMessage,
      // Use the real toast — that's the only DOM write we allow.
      now: () => new Date("2026-05-12T10:00:00Z"),
    });

    // Flush microtasks/queued mutation callbacks.
    await Promise.resolve();
    observer.disconnect();

    // The LinkedIn subtree must be byte-identical.
    expect(linkedInRoot!.outerHTML).toBe(beforeHtml);

    // Every observed mutation must target document.body and only add nodes
    // that are toast containers (the columbus-toast class). No node belonging
    // to the LinkedIn subtree may appear as a target or as added/removed.
    for (const record of observedMutations) {
      const target = record.target as Node;
      // Allow only mutations whose target is document.body itself or a
      // toast container we own.
      const targetIsBody = target === document.body;
      const targetIsOurToast =
        target instanceof Element &&
        target.classList?.contains("columbus-toast");
      expect(targetIsBody || targetIsOurToast).toBe(true);

      // Every added node must be a columbus-toast element (not a LinkedIn
      // node that got re-parented).
      record.addedNodes.forEach((node) => {
        if (node instanceof Element) {
          expect(node.classList.contains("columbus-toast")).toBe(true);
        }
      });
      // Nothing should be removed from the LinkedIn-side either.
      record.removedNodes.forEach((node) => {
        if (node instanceof Element) {
          // A toast can replace its older self — that's the only legitimate
          // removal we expect.
          expect(node.classList.contains("columbus-toast")).toBe(true);
        }
      });
    }
  });

  it("the 'capped' branch performs ZERO DOM writes (silent rate limit)", async () => {
    const now = new Date("2026-05-12T10:00:00Z");
    localStore[LINKEDIN_DAILY_KEY] = {
      date: localDateStamp(now),
      count: LINKEDIN_DAILY_CAP,
    };

    const observedMutations: MutationRecord[] = [];
    const observer = new MutationObserver((records) => {
      observedMutations.push(...records);
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });

    const sender = makeSendMessage();
    const result = await tryCaptureLinkedInJob(baseJob, {
      sendMessage: sender.fn,
      buildImportMessage,
      now: () => now,
    });

    await Promise.resolve();
    observer.disconnect();

    expect(result).toBe("capped");
    expect(observedMutations).toHaveLength(0);
  });
});
