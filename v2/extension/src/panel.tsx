import { AlertTriangle, Check, ExternalLink, FileText, History, Loader2, MessageSquareText, Paperclip, PenLine, Plus, Send, Sparkles, Wand2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createRoot } from "react-dom/client";

import { Dropdown } from "@/components/dropdown";
import { Button, Eyebrow, FitChip, Input, buttonClass, cx } from "@/components/ui";
import type { AnswerProposal, Fill, FormField, Skip } from "@/lib/autofill";
import type { JobSummary } from "@/lib/extension";
import type { Warning } from "@/lib/types";
import { ago } from "@/lib/format";
import { hostOf, jobKey, pageOf, rememberedJob, tabKey, type RememberedJob, type TabState } from "./session";
import {
  ApiError,
  activeTab,
  api,
  fetchPdf,
  fillPage,
  getConnection,
  parseConnection,
  readForm,
  readPosting,
  revealField,
  setConnection,
  type Connection,
  type PageForm,
  type Status,
  type Tab,
} from "./api";

/* ─── The side panel ───
 * Stays open beside the page and follows the tab you're on: the job it is (seen, saved, applied) with
 * Save and Tailor, and, when the page has a form, Fill form → what's left → Save answers / Mark applied.
 */

/** Apps that render their form after load (Ashby) get a moment before "no form" is believed. */
async function readFormSoon(tab: Tab): Promise<PageForm> {
  let form: PageForm = { fields: [], combos: 0, blockedFrames: 0 };
  for (let i = 0; i < 3 && !form.fields.length && !form.blockedFrames; i++) {
    await new Promise((r) => setTimeout(r, 700));
    form = await readForm(tab);
  }
  return form;
}

type Loaded = { conn: Connection; tab: Tab; status: Status; form: PageForm | null; formError: string; looking: boolean; before: string | null; login: boolean };

type FillResult = {
  filled: { id: string; source: Fill["source"] | "ai"; label: string }[];
  attached: { doc: "resume" | "letter"; name: string }[];
  skipped: (Skip & { label: string; field: FormField })[];
  docError: string;
};

const DOC = { resume: "Resume", letter: "Cover letter" } as const;

function applyTheme(theme: Status["theme"]) {
  const dark = theme.mode === "dark" || (theme.mode === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? theme.dark : theme.light;
}

function App() {
  const [state, setState] = useState<{ kind: "loading" } | { kind: "connect"; error?: string } | { kind: "error"; error: string; conn?: Connection } | ({ kind: "ready" } & Loaded)>({
    kind: "loading",
  });

  // Each load gets a number; a slower, older one (from the tab you just left) is dropped when it lands.
  const latest = useRef(0);
  const load = useCallback(async () => {
    const run = ++latest.current;
    const current = () => run === latest.current;
    const conn = await getConnection();
    if (!conn) return setState({ kind: "connect" });
    const tab = await activeTab();
    if (!tab) return setState({ kind: "error", error: "No tab to work with.", conn });
    try {
      const readable = /^https?:/.test(tab.url);
      // What the background worker knows about this tab: the job it's applying for, when you'd seen it.
      const remembered = await rememberedJob(tab.id, tab.url);
      const tabState = (await chrome.storage.session.get(tabKey(tab.id)))[tabKey(tab.id)] as TabState | undefined;
      const [status, form] = await Promise.all([
        api.status(conn, tab.url, remembered),
        readable ? readForm(tab).then((f) => ({ f, e: "" }), (e: Error) => ({ f: null, e: e.message })) : Promise.resolve({ f: null, e: "Slothing can't read this kind of page." }),
      ]);
      if (!current()) return;
      applyTheme(status.theme);
      void chrome.storage.local.set({ theme: status.theme });
      const late = readable && form.f && !form.f.fields.length && !form.f.blockedFrames;
      const sameTab = tabState && pageOf(tabState.url) === pageOf(tab.url);
      const before = sameTab ? tabState.before : null;
      const login = Boolean(sameTab && tabState.kind.login);
      setState({ kind: "ready", conn, tab, status, form: form.f, formError: form.e, looking: Boolean(late), before, login });
      // A form some apps render after load (Ashby): keep looking a moment, without holding up the rest.
      if (late) {
        const again = await readFormSoon(tab).catch(() => null);
        if (current()) setState((s) => (s.kind === "ready" && s.tab.id === tab.id ? { ...s, form: again ?? s.form, looking: false } : s));
      }
    } catch (e) {
      if (!current()) return;
      if (e instanceof ApiError && e.unauthorized) return setState({ kind: "connect", error: e.message });
      setState({ kind: "error", error: (e as Error).message, conn });
    }
  }, []);

  useEffect(() => {
    void chrome.storage.local.get("theme").then(({ theme }) => theme && applyTheme(theme as Status["theme"]));
    void load();
    // Follow the tab you're on: switching tabs, a new page in this one, or the background learning more.
    let timer: ReturnType<typeof setTimeout> | undefined;
    const soon = () => {
      clearTimeout(timer);
      timer = setTimeout(load, 250);
    };
    const onActivated = () => soon();
    const onUpdated = (_id: number, info: { url?: string; status?: string }, t: chrome.tabs.Tab) => t.active && (info.url || info.status === "complete") && soon();
    const onMessage = (msg: { type?: string; tabId?: number }) => {
      if (msg?.type === "tab-state") void activeTab().then((t) => t?.id === msg.tabId && soon());
    };
    // A panel opened as a page for testing (?tab=) follows only its tab.
    const pinned = new URLSearchParams(location.search).has("tab");
    if (!pinned) chrome.tabs.onActivated.addListener(onActivated);
    chrome.tabs.onUpdated.addListener(onUpdated);
    chrome.runtime.onMessage.addListener(onMessage);
    // Connected (or disconnected) from the app's Extension page while the panel is open.
    const onStorage = (changes: Record<string, unknown>, area: string) => area === "local" && "connection" in changes && soon();
    chrome.storage.onChanged.addListener(onStorage);
    return () => {
      chrome.storage.onChanged.removeListener(onStorage);
      chrome.tabs.onActivated.removeListener(onActivated);
      chrome.tabs.onUpdated.removeListener(onUpdated);
      chrome.runtime.onMessage.removeListener(onMessage);
    };
  }, [load]);

  return (
    <div className="flex h-screen min-w-[300px] flex-col bg-page text-ink">
      <header className="flex h-12 shrink-0 items-center gap-2 border-b border-rule bg-header px-4">
        <img src="icon.png" alt="" className="h-6 w-6 rounded-control" />
        <div className="font-display text-base font-bold tracking-tight">Slothing</div>
        {state.kind === "ready" && state.status.profile.name && <div className="truncate text-xs text-ink-3">· {state.status.profile.name}</div>}
        {"conn" in state && state.conn && (
          <a href={state.conn.server} target="_blank" rel="noreferrer" title="Open Slothing" className="ml-auto grid h-8 w-8 place-items-center rounded-control text-ink-3 hover:bg-rule-bg hover:text-ink">
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {state.kind === "loading" && (
          <div className="grid h-40 place-items-center text-ink-3">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}
        {state.kind === "connect" && <Connect error={state.error} onConnected={load} />}
        {state.kind === "error" && (
          <div className="space-y-3 p-4">
            <Notice tone="warn">{state.error}</Notice>
            <div className="flex gap-2">
              <Button size="sm" variant="primary" onClick={() => (setState({ kind: "loading" }), load())}>Try again</Button>
              <Button size="sm" variant="ghost" onClick={() => setState({ kind: "connect" })}>Change connection</Button>
            </div>
          </div>
        )}
        {/* Keyed by tab and page, so a new page starts fresh (no fill results from the last one). */}
        {state.kind === "ready" && <Main key={`${state.tab.id}:${pageOf(state.tab.url)}`} {...state} reload={load} disconnect={() => setConnection(null).then(() => setState({ kind: "connect" }))} />}
      </div>
    </div>
  );
}

/* ─── Connecting ─── */

function Connect({ error, onConnected }: { error?: string; onConnected: () => void }) {
  const [text, setText] = useState("");
  const [bad, setBad] = useState("");
  const save = async () => {
    const c = parseConnection(text);
    if (!c) return setBad("Paste the whole connection key, like http://localhost:3000#…");
    await setConnection(c);
    onConnected();
  };
  return (
    <div className="space-y-4 p-4">
      {error && <Notice tone="warn">{error}</Notice>}
      <div>
        <h1 className="font-display text-lg font-semibold tracking-tight">Connect to Slothing</h1>
        <p className="mt-1 text-sm leading-relaxed text-ink-2">
          Open Slothing, go to <span className="font-medium text-ink">Extension</span> in the sidebar and click <span className="font-medium text-ink">Connect extension</span>. That&apos;s it.
        </p>
      </div>
      <div className="space-y-2 border-t border-rule pt-4">
        <p className="text-xs text-ink-3">Or paste the connection key from that page:</p>
        <Input value={text} onChange={(e) => (setText(e.target.value), setBad(""))} onKeyDown={(e) => e.key === "Enter" && save()} placeholder="http://localhost:3000#…" aria-label="Connection key" />
        {bad && <p className="text-xs text-warn">{bad}</p>}
        <Button size="sm" variant="primary" onClick={save} disabled={!text.trim()}>Connect</Button>
      </div>
    </div>
  );
}

/* ─── The open tab ─── */

function Main({ conn, tab, status, form, formError, looking, before, login, reload, disconnect }: Loaded & { reload: () => void; disconnect: () => void }) {
  const [job, setJobState] = useState<JobSummary | null>(status.job);
  const [view, setView] = useState<"main" | "save">("main");
  const hasForm = Boolean(form?.fields.length);
  const open = (path: string) => chrome.tabs.create({ url: `${conn.server}${path}` });
  // The background may learn the job after the panel opened (it records the posting as seen).
  useEffect(() => {
    if (status.job) setJobState(status.job);
  }, [status.job]);
  // On a form, the job you pick is remembered for this tab, so the next step of the form knows it too.
  const setJob = (j: JobSummary | null) => {
    setJobState(j);
    if (j) void chrome.runtime.sendMessage({ type: "job-changed", tabId: tab.id, job: j }).catch(() => {});
    if (!hasForm) return;
    if (j) void chrome.storage.session.set({ [jobKey(tab.id)]: { jobId: j.id, host: hostOf(tab.url) } satisfies RememberedJob });
    else void chrome.storage.session.remove(jobKey(tab.id));
  };

  return (
    <>
      {view === "main" ? (
        <div className="space-y-px bg-rule">
          <JobSection conn={conn} tab={tab} status={status} job={job} setJob={setJob} hasForm={hasForm} before={before} open={open} />
          {form && (form.fields.length > 0 || form.combos > 0) ? (
            <FormSection conn={conn} tab={tab} form={form} job={job} setJob={setJob} llm={status.llm} onSaveAnswers={() => setView("save")} open={open} />
          ) : job && !login && !form?.blockedFrames && !formError ? null : (
            <Section>
              <p className="text-xs leading-relaxed text-ink-3">
                {login ? "A sign-in page. Sign in yourself (Slothing never touches passwords), then fill the application." : looking ? "Looking for an application form…" : formError || (form?.blockedFrames ? "" : "No application form on this page. Open the application to fill it.")}
              </p>
              {form?.blockedFrames ? <FrameAccess onGranted={reload} /> : null}
            </Section>
          )}
        </div>
      ) : (
        <SaveAnswers conn={conn} tab={tab} onDone={() => setView("main")} />
      )}
      <footer className="mt-auto flex flex-wrap items-center gap-1 border-t border-rule px-2 py-1.5">
        <button onClick={() => open("/answers")} className={buttonClass("ghost", "sm")}>
          <MessageSquareText className="h-3.5 w-3.5" /> Answers · {status.answers}
        </button>
        <button onClick={() => open("/?view=seen")} className={buttonClass("ghost", "sm")} title={status.autoSave ? "Postings you open are recorded under Jobs → Seen" : "Recording postings is off (Extension page)"}>
          <History className="h-3.5 w-3.5" /> {status.autoSave ? "History" : "History off"}
        </button>
        <button onClick={disconnect} className={buttonClass("ghost", "sm", "ml-auto text-ink-3")}>Disconnect</button>
      </footer>
    </>
  );
}

function Section({ title, aside, children }: { title?: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <section className="space-y-3 bg-page px-4 py-4">
      {title && (
        <div className="flex items-center justify-between gap-2">
          <Eyebrow>{title}</Eyebrow>
          {aside}
        </div>
      )}
      {children}
    </section>
  );
}

function Notice({ tone, children }: { tone: "warn" | "ok" | "plain"; children: ReactNode }) {
  return (
    <div
      className={cx(
        "rounded-control border px-3 py-2 text-xs leading-relaxed",
        tone === "warn" ? "border-warn bg-warn-soft text-ink-2" : tone === "ok" ? "border-ok bg-ok-soft text-ink-2" : "border-rule bg-paper text-ink-2",
      )}
    >
      {children}
    </div>
  );
}

const STATUS_LABEL: Record<JobSummary["status"], string> = {
  seen: "Seen",
  saved: "In your jobs",
  applied: "Applied",
  interviewing: "Interviewing",
  offer: "Offer",
  rejected: "Rejected",
  archived: "Archived",
};

function JobSection({
  conn,
  tab,
  status,
  job,
  setJob,
  hasForm,
  before,
  open,
}: {
  conn: Connection;
  tab: Tab;
  status: Status;
  job: JobSummary | null;
  setJob: (j: JobSummary | null) => void;
  hasForm: boolean;
  before: string | null;
  open: (path: string) => void;
}) {
  const [busy, setBusy] = useState<"" | "save" | "tailor-ai" | "tailor" | "letter">("");
  const [error, setError] = useState("");
  const [note, setNote] = useState("");

  const run = async (kind: typeof busy, fn: () => Promise<JobSummary>, done: string) => {
    setBusy(kind);
    setError("");
    setNote("");
    try {
      setJob(await fn());
      setNote(done);
    } catch (e) {
      setError((e as Error).message);
    }
    setBusy("");
  };
  const save = () => run("save", async () => (await api.saveJob(conn, await readPosting(tab))).job, "Saved to your jobs.");
  const tailor = (ai: boolean) => run(ai ? "tailor-ai" : "tailor", async () => (await api.tailor(conn, job!.id, ai)).job, "Resume tailored. Look it over before you send it.");
  const writeLetter = () => run("letter", async () => (await api.letter(conn, job!.id)).job, "Cover letter written. Look it over before you send it.");

  if (job) {
    const seen = job.status === "seen";
    const eyebrow = seen ? (before ? `Seen before · ${ago(before).toLowerCase()}` : "New · added to your history") : job.appliedAt ? `Applied · ${ago(job.appliedAt).toLowerCase()}` : STATUS_LABEL[job.status];
    return (
      <Section title={eyebrow}>
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <div className="line-clamp-2 font-display text-base font-semibold leading-snug tracking-tight">{job.title || "Untitled role"}</div>
            <div className="truncate text-sm text-ink-2">{job.company || "Unknown company"}</div>
          </div>
          <Button size="sm" variant="secondary" onClick={() => open(`/jobs/${job.id}`)}>Open</Button>
        </div>
        {job.fit && <FitChip fit={job.fit} detail />}
        {seen ? (
          <>
            <Button variant="primary" onClick={save} disabled={busy !== ""} className="w-full">
              {busy === "save" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              {busy === "save" ? "Saving…" : "Save to my jobs"}
            </Button>
            <p className="text-xs leading-relaxed text-ink-3">It&apos;s in your history (Jobs → Seen). Save it to tailor a resume and apply.</p>
          </>
        ) : (
          <>
            <DocRow label="Resume" ok={job.resume} warnings={job.warnings.resume} onView={() => open(`/api/pdf?kind=resume&job=${encodeURIComponent(job.id)}`)} onReview={() => open(`/jobs/${job.id}`)}>
              {job.described && (
                <div className="flex gap-2">
                  <Button variant="primary" size="sm" onClick={() => tailor(status.llm)} disabled={busy !== ""} className="flex-1">
                    {busy.startsWith("tailor") ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : status.llm ? <Sparkles className="h-3.5 w-3.5" /> : <Wand2 className="h-3.5 w-3.5" />}
                    {busy.startsWith("tailor") ? "Tailoring…" : status.llm ? "Tailor resume" : "Tailor without AI"}
                  </Button>
                  {status.llm && (
                    <Button variant="ghost" size="sm" onClick={() => tailor(false)} disabled={busy !== ""} title="Pick and fit your bullets by relevance, no AI">
                      Without AI
                    </Button>
                  )}
                </div>
              )}
            </DocRow>
            {busy === "tailor-ai" && <p className="text-xs text-ink-3">AI tailoring takes up to a minute.</p>}
            <DocRow label="Cover letter" ok={job.letter} warnings={job.warnings.letter} onView={() => open(`/api/pdf?kind=letter&job=${encodeURIComponent(job.id)}`)} onReview={() => open(`/jobs/${job.id}`)}>
              {job.described && status.llm && (
                <Button variant="secondary" size="sm" onClick={writeLetter} disabled={busy !== ""} className="w-full">
                  {busy === "letter" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <PenLine className="h-3.5 w-3.5" />}
                  {busy === "letter" ? "Writing…" : "Write cover letter"}
                </Button>
              )}
            </DocRow>
            {busy === "letter" && <p className="text-xs text-ink-3">Takes about half a minute.</p>}
          </>
        )}
        {note && <Notice tone="ok">{note}</Notice>}
        {error && <Notice tone="warn">{error}</Notice>}
        {hasForm && !status.job && (
          <button onClick={() => setJob(null)} className="text-xs text-ink-3 underline-offset-2 hover:text-ink hover:underline">Not this job</button>
        )}
      </Section>
    );
  }

  const picker = status.recent.length > 0 && (
    <Dropdown
      label="The job this application is for"
      value={null}
      placeholder="Pick a job"
      options={status.recent.map((j) => ({ value: j.id, label: `${j.title || "Untitled"} · ${j.company || "?"}`, text: `${j.title} ${j.company}` }))}
      onChange={(id) => setJob(status.recent.find((j) => j.id === id) ?? null)}
      className="w-full"
    />
  );

  return (
    <Section title={hasForm ? "Applying for" : "Job"}>
      {hasForm && (
        <>
          <p className="text-xs leading-relaxed text-ink-3">Pick the job this form is for, so its tailored resume is attached and the application is recorded.</p>
          {picker}
        </>
      )}
      <Button size={hasForm ? "sm" : "md"} variant={hasForm ? "ghost" : "primary"} onClick={save} disabled={busy !== ""} className={hasForm ? "" : "w-full"}>
        {busy === "save" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        {busy === "save" ? "Reading the posting…" : hasForm ? "Save this page as a job" : "Save job"}
      </Button>
      {!hasForm && busy === "" && <p className="text-xs leading-relaxed text-ink-3">Reads this page as a posting: title, company, location and the full description.</p>}
      {error && <Notice tone="warn">{error}</Notice>}
    </Section>
  );
}

/** A tailored document: what it is, a link to its PDF and what to check before sending, or the button that makes it. */
function DocRow({ label, ok, warnings, onView, onReview, children }: { label: string; ok: boolean; warnings: Warning[]; onView: () => void; onReview: () => void; children: ReactNode }) {
  if (!ok) return children ? <div className="space-y-1.5">{children}</div> : null;
  const shown = warnings.slice(0, 4);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-6 items-center gap-1 rounded-chip border border-ok bg-ok-soft px-2 text-xs text-ok">
          <Check className="h-3 w-3" />
          {label}
        </span>
        <span className="text-xs text-ink-3">{warnings.length ? `${warnings.length} to check` : "Nothing flagged"}</span>
        <button onClick={onView} className="ml-auto inline-flex items-center gap-1 text-xs text-brand underline-offset-2 hover:underline">
          <FileText className="h-3 w-3" /> View PDF
        </button>
      </div>
      {shown.length > 0 && (
        <Notice tone="warn">
          <ul className="space-y-1">
            {shown.map((w, i) => (
              <li key={i}>
                <span className="font-medium text-ink">{w.where}</span>: {w.message}
              </li>
            ))}
          </ul>
          <button onClick={onReview} className="mt-1.5 text-brand underline-offset-2 hover:underline">
            {warnings.length > shown.length ? `${warnings.length - shown.length} more on the job page` : "Fix on the job page"}
          </button>
        </Notice>
      )}
    </div>
  );
}

/* ─── Filling ─── */

const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`;
const SKIP_LABEL: Record<Skip["reason"], string> = {
  "no-answer": "No saved answer",
  "no-option": "No option matches your answer",
  "no-profile-value": "Not in your profile",
  "no-document": "No PDF for this job yet",
  "has-value": "Already filled",
  upload: "Upload this yourself",
  "other-company": "Your saved answer names another company",
};

function FormSection({
  conn,
  tab,
  form,
  job,
  setJob,
  llm,
  onSaveAnswers,
  open,
}: {
  conn: Connection;
  tab: Tab;
  form: PageForm;
  job: JobSummary | null;
  setJob: (j: JobSummary | null) => void;
  llm: boolean;
  onSaveAnswers: () => void;
  open: (path: string) => void;
}) {
  const [busy, setBusy] = useState<"" | "fill" | "draft">("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<FillResult | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const byId = new Map(form.fields.map((f) => [f.id, f]));
  const label = (id: string) => byId.get(id)?.label || byId.get(id)?.name || "Unlabelled field";

  const fillForm = async () => {
    setBusy("fill");
    setError("");
    try {
      // Read again: the page may have changed since the popup opened (a step of a multi-page form).
      const fresh = await readForm(tab);
      const fields = new Map(fresh.fields.map((f) => [f.id, f]));
      const plan = await api.fill(conn, job?.id, fresh.fields);
      const attached: FillResult["attached"] = [];
      let docError = "";
      const pageFills = [];
      for (const f of plan.fills) {
        if (f.source === "file") {
          try {
            const file = await fetchPdf(conn, job!.id, f.doc);
            pageFills.push({ id: f.id, file });
            attached.push({ doc: f.doc, name: file.name });
          } catch (e) {
            docError = (e as Error).message;
          }
        } else pageFills.push({ id: f.id, value: f.value, option: f.option, loose: f.source === "profile" });
      }
      const done = new Set(await fillPage(tab, pageFills));
      setResult({
        filled: plan.fills.filter((f) => f.source !== "file" && done.has(f.id)).map((f) => ({ id: f.id, source: f.source, label: fields.get(f.id)?.label ?? "" })),
        attached: attached.filter((a) => plan.fills.some((f) => f.source === "file" && f.doc === a.doc && done.has(f.id))),
        skipped: [
          ...plan.skipped.filter((s) => s.reason !== "has-value"),
          // Planned, but the page couldn't apply it (a dropdown without that option, a field that went away).
          ...plan.fills.filter((f) => !done.has(f.id) && fields.has(f.id)).map((f): Skip => ({ id: f.id, reason: f.source === "file" ? "upload" : "no-option" })),
        ].map((s) => ({ ...s, label: fields.get(s.id)?.label || fields.get(s.id)?.name || "", field: fields.get(s.id)! })),
        docError,
      });
    } catch (e) {
      setError((e as Error).message);
    }
    setBusy("");
  };

  const unanswered = result?.skipped.filter((s) => (s.reason === "no-answer" || s.reason === "other-company") && s.label && (s.field.kind === "text" || s.field.kind === "textarea") && !drafts[s.id]) ?? [];

  const draft = async () => {
    setBusy("draft");
    setError("");
    try {
      const { drafts: out } = await api.draft(conn, job?.id, unanswered.map((s) => ({ id: s.id, question: s.label, long: s.field.kind === "textarea" })));
      const usable = out.filter((d) => d.text);
      const done = new Set(await fillPage(tab, usable.map((d) => ({ id: d.id, value: d.text }))));
      const next = { ...drafts };
      for (const d of out) next[d.id] = done.has(d.id) ? d.warning || "ok" : "none";
      setDrafts(next);
    } catch (e) {
      setError((e as Error).message);
    }
    setBusy("");
  };

  const fromProfile = result?.filled.filter((f) => f.source === "profile").length ?? 0;
  const fromBank = result?.filled.filter((f) => f.source === "bank").length ?? 0;
  const drafted = Object.values(drafts).filter((v) => v !== "none").length;
  const left = result?.skipped.filter((s) => !(drafts[s.id] && drafts[s.id] !== "none")) ?? [];

  return (
    <Section title="Application form" aside={<span className="text-xs text-ink-3">{plural(form.fields.length, "field")}</span>}>
      {!result ? (
        <>
          <Button variant="primary" onClick={fillForm} disabled={busy !== ""} className="w-full">
            {busy === "fill" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
            {busy === "fill" ? "Filling…" : "Fill form"}
          </Button>
          <p className="text-xs leading-relaxed text-ink-3">
            From your profile and answer bank{job?.resume ? ", with this job's tailored resume attached" : ""}. Fields you&apos;ve already filled are left alone. Nothing is submitted.
          </p>
        </>
      ) : (
        <div className="space-y-2">
          <Notice tone={result.filled.length + result.attached.length ? "ok" : "plain"}>
            <span className="font-semibold text-ink">{plural(result.filled.length + drafted, "field")} filled</span>
            {result.filled.length + drafted > 0 && (
              <span className="text-ink-3"> · {[fromProfile && `${fromProfile} from your profile`, fromBank && `${fromBank} from your answers`, drafted && `${drafted} drafted by AI`].filter(Boolean).join(", ")}</span>
            )}
            {result.attached.map((a) => (
              <div key={a.doc} className="mt-1 flex items-center gap-1.5">
                <Paperclip className="h-3 w-3 shrink-0" />
                <span className="truncate">{DOC[a.doc]} attached · {a.name}</span>
              </div>
            ))}
          </Notice>
          {result.docError && <Notice tone="warn">{result.docError}</Notice>}
          {left.length > 0 && (
            <div>
              <div className="mb-1 mt-3 text-xs font-semibold text-ink-2">Left for you · {left.length}</div>
              <ul className="divide-y divide-rule rounded-control border border-rule bg-paper">
                {left.map((s) => (
                  <li key={s.id}>
                    <button onClick={() => revealField(tab, s.id)} className="flex w-full items-start gap-2 px-3 py-2 text-left hover:bg-rule-bg" title="Show this field on the page">
                      <span className="min-w-0 flex-1">
                        <span className="line-clamp-2 text-xs text-ink">{s.label || "Unlabelled field"}</span>
                        <span className="text-[11px] text-ink-3">{drafts[s.id] === "none" ? "Your profile doesn't answer this" : s.reason === "other-company" && s.company ? `Your saved answer names ${s.company}` : SKIP_LABEL[s.reason]}</span>
                      </span>
                      {s.reason === "no-document" && job && (
                        <span onClick={(e) => (e.stopPropagation(), open(`/jobs/${job.id}`))} className="shrink-0 text-[11px] text-brand hover:underline">Tailor</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {Object.entries(drafts).filter(([, w]) => w !== "ok" && w !== "none").map(([id, w]) => (
            <Notice key={id} tone="warn">
              <span className="font-semibold">Check “{label(id).slice(0, 60)}”: </span>
              {w}
            </Notice>
          ))}
          {llm && unanswered.length > 0 && (
            <Button variant="secondary" size="sm" onClick={draft} disabled={busy !== ""} className="w-full">
              {busy === "draft" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              {busy === "draft" ? "Drafting from your profile…" : `Draft ${plural(unanswered.length, "answer")} with AI`}
            </Button>
          )}
          {drafted > 0 && <p className="text-xs text-ink-3">AI drafts are outlined like the rest. Read them before you submit.</p>}
          <Button variant="ghost" size="sm" onClick={fillForm} disabled={busy !== ""}>Fill again</Button>
        </div>
      )}
      {error && <Notice tone="warn">{error}</Notice>}
      <div className="space-y-2 border-t border-rule pt-3">
        <Button variant="secondary" size="sm" onClick={onSaveAnswers} className="w-full">
          <PenLine className="h-3.5 w-3.5" /> Save my answers to the bank
        </Button>
        {job && <MarkApplied conn={conn} tab={tab} job={job} setJob={setJob} />}
      </div>
    </Section>
  );
}

/**
 * Submitting a form Slothing filled marks the job applied by itself (the page watcher sees the
 * submit). This is for everything else: a form it didn't fill, or a submit it missed.
 */
function MarkApplied({ conn, tab, job, setJob }: { conn: Connection; tab: Tab; job: JobSummary; setJob: (j: JobSummary) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  if (job.appliedAt) return <p className="flex items-center gap-1.5 text-xs text-ink-3"><Check className="h-3.5 w-3.5 text-ok" /> Applied {ago(job.appliedAt).toLowerCase()}. What you sent is on the job page.</p>;
  const mark = async () => {
    setBusy(true);
    setError("");
    try {
      const { fields } = await readForm(tab);
      setJob((await api.applied(conn, { jobId: job.id, url: tab.url, fields })).job);
    } catch (e) {
      setError((e as Error).message);
    }
    setBusy(false);
  };
  return (
    <>
      <Button variant="ghost" size="sm" onClick={mark} disabled={busy} className="w-full" title="Records what's on the form now, and moves the job to Applied">
        <Send className="h-3.5 w-3.5" /> {busy ? "Saving…" : "I submitted it: mark applied"}
      </Button>
      {error && <Notice tone="warn">{error}</Notice>}
    </>
  );
}

/* ─── Saving answers ─── */

function SaveAnswers({ conn, tab, onDone }: { conn: Connection; tab: Tab; onDone: () => void }) {
  const [proposals, setProposals] = useState<AnswerProposal[] | null>(null);
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        // What's on the form now, including what you just typed.
        const { fields } = await readForm(tab);
        const { proposals } = await api.propose(conn, fields);
        setProposals(proposals);
        // Replacing an answer you already wrote is opt-in; new ones are ticked.
        setPicked(new Set(proposals.filter((p) => p.status === "new" || !p.replaces?.answer.trim()).map((p) => p.fieldId)));
      } catch (e) {
        setError((e as Error).message);
      }
    })();
  }, [conn, tab]);

  const save = async () => {
    if (!proposals) return;
    setSaving(true);
    setError("");
    try {
      const chosen = proposals.filter((p) => picked.has(p.fieldId)).map((p) => ({ question: p.question, answer: p.answer, replaces: p.replaces?.id }));
      setSaved((await api.saveAnswers(conn, tab.url, chosen)).saved);
    } catch (e) {
      setError((e as Error).message);
    }
    setSaving(false);
  };

  const toggle = (id: string) => setPicked((s) => {
    const n = new Set(s);
    if (n.has(id)) n.delete(id);
    else n.add(id);
    return n;
  });

  return (
    <Section title="Save to your answer bank">
      {saved > 0 ? (
        <>
          <Notice tone="ok">Saved {plural(saved, "answer")}. The next form that asks gets them filled in.</Notice>
          <Button size="sm" variant="secondary" onClick={onDone}>Back</Button>
        </>
      ) : !proposals ? (
        error ? <Notice tone="warn">{error}</Notice> : <div className="grid h-20 place-items-center text-ink-3"><Loader2 className="h-5 w-5 animate-spin" /></div>
      ) : (
        <>
          {proposals.length === 0 ? (
            <p className="text-sm text-ink-2">Nothing new to save. Your bank already has every answer on this form, or the questions you answered are profile fields (name, email, links).</p>
          ) : (
            <>
              <p className="text-xs leading-relaxed text-ink-3">The questions you answered on this form. Name, email and links aren&apos;t here: they come from your profile.</p>
              <ul className="space-y-1.5">
                {proposals.map((p) => (
                  <li key={p.fieldId}>
                    <label className={cx("flex cursor-pointer gap-2.5 rounded-control border bg-paper px-3 py-2", picked.has(p.fieldId) ? "border-rule-strong" : "border-rule opacity-70")}>
                      <input type="checkbox" checked={picked.has(p.fieldId)} onChange={() => toggle(p.fieldId)} className="mt-0.5 accent-[var(--brand)]" />
                      <span className="min-w-0 flex-1">
                        <span className="line-clamp-2 text-xs font-medium text-ink">{p.question}</span>
                        <span className="mt-0.5 line-clamp-3 whitespace-pre-line text-xs text-ink-2">{p.answer}</span>
                        {p.status === "update" && (
                          <span className="mt-1 flex items-start gap-1 text-[11px] text-ink-3">
                            <AlertTriangle className="mt-px h-3 w-3 shrink-0" />
                            {p.replaces?.answer.trim() ? <span className="line-clamp-2">Replaces your saved answer: “{p.replaces.answer}”</span> : "Answers a question you saved without an answer"}
                          </span>
                        )}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </>
          )}
          {error && <Notice tone="warn">{error}</Notice>}
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={onDone}>Back</Button>
            {proposals.length > 0 && (
              <Button size="sm" variant="primary" onClick={save} disabled={saving || picked.size === 0} className="ml-auto">
                {saving ? "Saving…" : `Save ${plural(picked.size, "answer")}`}
              </Button>
            )}
          </div>
        </>
      )}
    </Section>
  );
}

/* ─── Embedded forms ─── */

function FrameAccess({ onGranted }: { onGranted: () => void }) {
  const ask = async () => {
    if (await chrome.permissions.request({ origins: ["<all_urls>"] })) onGranted();
  };
  return (
    <div className="space-y-2">
      <p className="text-xs leading-relaxed text-ink-2">The application form is embedded from another site (often Greenhouse), which Slothing can only read with access to all sites. It still only reads a page when you click here.</p>
      <Button size="sm" variant="secondary" onClick={ask}>Allow embedded forms</Button>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
