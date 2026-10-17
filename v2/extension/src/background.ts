import type { FormField } from "@/lib/autofill";
import type { JobSummary } from "@/lib/extension";
import { api, getConnection } from "./api";
import { jobKey, pageOf, rememberedJob, tabKey, type TabState } from "./session";
import type { PageKind } from "./watch";

/* ─── The background worker ───
 * Clicking the icon opens the side panel. For each tab it keeps what the page watcher found (posting,
 * form, sign-in) as the icon's badge, records postings you open as "seen", and turns a submitted form
 * into an application. The panel reads the same per-tab state from session storage.
 */

void chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});

// The chrome around a page, not the page: the app's tokens don't reach here, so Slothing's rust by value.
const BRAND = "#b8704a";
const MUTED = "#6a5e4a";

function badge(tabId: number, s: TabState) {
  const status = s.job?.status;
  const [text, color] =
    status && ["applied", "interviewing", "offer"].includes(status)
      ? ["Sent", MUTED]
      : s.kind.form
        ? ["Fill", BRAND]
        : status === "saved"
          ? ["✓", MUTED]
          : s.job && s.before
            ? ["Seen", MUTED]
            : s.job
              ? ["New", BRAND]
              : s.kind.job
                ? ["Job", BRAND]
                : ["", BRAND];
  void chrome.action.setBadgeText({ tabId, text });
  void chrome.action.setBadgeBackgroundColor({ tabId, color });
  void chrome.action.setTitle({ tabId, title: text ? `Slothing · ${s.job?.title || (s.kind.form ? "Application form" : "Job posting")}` : "Slothing" });
}

/** `notify`: tell the side panel to refresh (not when the panel itself caused the change). */
async function save(tabId: number, s: TabState, notify = true) {
  await chrome.storage.session.set({ [tabKey(tabId)]: s });
  badge(tabId, s);
  if (notify) void chrome.runtime.sendMessage({ type: "tab-state", tabId }).catch(() => {});
}

type PageMessage = { type: "page"; url: string; title: string; kind: PageKind; html?: string; text?: string };
/** You clicked Submit on a form Slothing filled. It counts once it went through (confirm), not before. */
type SubmitMessage = { type: "submit-started"; url: string; fields: FormField[] } | { type: "submit-confirmed" } | { type: "submit-failed" };
/** From the side panel: you saved, tailored or applied, so the badge should say so. */
type JobMessage = { type: "job-changed"; tabId: number; job: JobSummary };

const stateOf = async (tabId: number) => (await chrome.storage.session.get(tabKey(tabId)))[tabKey(tabId)] as TabState | undefined;

chrome.runtime.onMessage.addListener((msg: PageMessage | SubmitMessage | JobMessage, sender) => {
  if (msg.type === "job-changed") {
    void stateOf(msg.tabId).then((prev) => prev && save(msg.tabId, { ...prev, job: msg.job }, false));
    return;
  }
  const tabId = sender.tab?.id;
  if (!tabId || sender.frameId !== 0) return;
  if (msg.type === "page") void onPage(tabId, msg);
  if (msg.type === "submit-started") void chrome.storage.session.set({ [pendingKey(tabId)]: { url: msg.url, fields: msg.fields, at: Date.now() } satisfies Pending });
  if (msg.type === "submit-confirmed") void confirmSubmit(tabId);
  if (msg.type === "submit-failed") void chrome.storage.session.remove(pendingKey(tabId));
});

async function onPage(tabId: number, msg: PageMessage) {
  const prev = await stateOf(tabId);
  // The watcher reports a page again as it finishes loading. The same page keeps what was learned (and
  // isn't recorded as seen twice, which would make a first visit look like a return).
  const same = prev && pageOf(prev.url) === pageOf(msg.url);
  const state: TabState = same ? { ...prev, url: msg.url, kind: msg.kind } : { url: msg.url, kind: msg.kind, job: null, before: null };
  await save(tabId, state);
  if (same && prev.job) return;
  const conn = await getConnection();
  if (!conn) return;
  try {
    if (msg.kind.job) {
      const r = await api.seen(conn, { url: msg.url, title: msg.title, html: msg.html ?? "", text: msg.text ?? "" });
      await save(tabId, { ...state, job: r.job, before: r.before });
    } else if (msg.kind.form) {
      // An application form: the job it belongs to, by its link or the one this tab was applying for here.
      const s = await api.status(conn, msg.url, await rememberedJob(tabId, msg.url));
      if (s.job) await save(tabId, { ...state, job: s.job });
    }
  } catch {
    // Slothing isn't running, or the key changed: the badge still says what the page is.
  }
}

/* ─── Submitting ───
 * A click on Submit isn't an application: the form may refuse it (a required field). It counts when the
 * page says it went through (confirmed by the watcher) or the tab moves on to another page soon after.
 */

// In session storage, not memory: Chrome stops an idle worker, and the confirm may come after.
type Pending = { url: string; fields: FormField[]; at: number };
const pendingKey = (tabId: number) => `submit:${tabId}`;
const SUBMIT_WINDOW_MS = 60_000;
const pendingOf = async (tabId: number) => (await chrome.storage.session.get(pendingKey(tabId)))[pendingKey(tabId)] as Pending | undefined;

async function confirmSubmit(tabId: number) {
  const p = await pendingOf(tabId);
  await chrome.storage.session.remove(pendingKey(tabId));
  if (!p || Date.now() - p.at > SUBMIT_WINDOW_MS) return;
  const conn = await getConnection();
  const prev = await stateOf(tabId);
  // The job this page was matched to, else the one picked for this application on this site.
  const jobId = prev?.job?.id ?? (await rememberedJob(tabId, p.url));
  if (!conn || !jobId) return;
  try {
    const { job } = await api.applied(conn, { jobId, url: p.url, fields: p.fields });
    const now = await stateOf(tabId);
    await save(tabId, { ...(now ?? { url: p.url, kind: { job: false, form: true, login: false }, before: null }), job });
  } catch {}
}

// Leaving the page soon after Submit (to a "thanks" page, or the next step) means it went through.
chrome.tabs.onUpdated.addListener((tabId, info) => {
  if (!info.url) return;
  void pendingOf(tabId).then((p) => {
    if (p && pageOf(info.url!) !== pageOf(p.url)) void confirmSubmit(tabId);
  });
});

chrome.tabs.onRemoved.addListener((tabId) => {
  void chrome.storage.session.remove([tabKey(tabId), jobKey(tabId), pendingKey(tabId)]);
});
