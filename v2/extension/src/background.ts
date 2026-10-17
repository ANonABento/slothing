import type { FormField } from "@/lib/autofill";
import type { JobSummary } from "@/lib/extension";
import { api, getConnection } from "./api";
import { jobKey, tabKey, type TabState } from "./session";
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

async function save(tabId: number, s: TabState) {
  await chrome.storage.session.set({ [tabKey(tabId)]: s });
  badge(tabId, s);
  // The side panel, if open, refreshes for this tab.
  void chrome.runtime.sendMessage({ type: "tab-state", tabId }).catch(() => {});
}

type PageMessage = { type: "page"; url: string; title: string; kind: PageKind; html?: string; text?: string };
type SubmitMessage = { type: "submitted"; url: string; fields: FormField[] };
/** From the side panel: you saved, tailored or applied, so the badge should say so. */
type JobMessage = { type: "job-changed"; tabId: number; job: JobSummary };

chrome.runtime.onMessage.addListener((msg: PageMessage | SubmitMessage | JobMessage, sender) => {
  if (msg.type === "job-changed") {
    void chrome.storage.session.get(tabKey(msg.tabId)).then((stored) => {
      const prev = stored[tabKey(msg.tabId)] as TabState | undefined;
      if (prev) badge(msg.tabId, { ...prev, job: msg.job });
      if (prev) void chrome.storage.session.set({ [tabKey(msg.tabId)]: { ...prev, job: msg.job } });
    });
    return;
  }
  const tabId = sender.tab?.id;
  if (!tabId || sender.frameId !== 0) return;
  if (msg.type === "page") void onPage(tabId, msg);
  if (msg.type === "submitted") void onSubmit(tabId, msg);
});

async function onPage(tabId: number, msg: PageMessage) {
  const state: TabState = { url: msg.url, kind: msg.kind, job: null, before: null };
  await save(tabId, state);
  const conn = await getConnection();
  if (!conn) return;
  try {
    if (msg.kind.job) {
      const r = await api.seen(conn, { url: msg.url, title: msg.title, html: msg.html ?? "", text: msg.text ?? "" });
      await save(tabId, { ...state, job: r.job, before: r.before });
    } else if (msg.kind.form) {
      // An application form: the job it belongs to, by its link or the one this tab was applying for.
      const remembered = (await chrome.storage.session.get(jobKey(tabId)))[jobKey(tabId)] as string | undefined;
      const s = await api.status(conn, msg.url, remembered);
      if (s.job) await save(tabId, { ...state, job: s.job });
    }
  } catch {
    // Slothing isn't running, or the key changed: the badge still says what the page is.
  }
}

async function onSubmit(tabId: number, msg: SubmitMessage) {
  const conn = await getConnection();
  if (!conn) return;
  const stored = (await chrome.storage.session.get([tabKey(tabId), jobKey(tabId)])) as Record<string, unknown>;
  const jobId = (stored[jobKey(tabId)] as string | undefined) ?? (stored[tabKey(tabId)] as TabState | undefined)?.job?.id;
  if (!jobId) return;
  try {
    const { job } = await api.applied(conn, { jobId, url: msg.url, fields: msg.fields });
    const prev = stored[tabKey(tabId)] as TabState | undefined;
    await save(tabId, { url: msg.url, kind: prev?.kind ?? { job: false, form: true, login: false }, job, before: prev?.before ?? null });
  } catch {}
}

chrome.tabs.onRemoved.addListener((tabId) => void chrome.storage.session.remove([tabKey(tabId), jobKey(tabId)]));
