import { AlertTriangle, Check, ExternalLink, FileText, Loader2, MessageSquareText, Paperclip, PenLine, Plus, Sparkles, Wand2 } from "lucide-react";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { createRoot } from "react-dom/client";

import { Dropdown } from "@/components/dropdown";
import { Button, Eyebrow, Input, buttonClass, cx } from "@/components/ui";
import type { AnswerProposal, Fill, FormField, Skip } from "@/lib/autofill";
import type { JobSummary } from "@/lib/extension";
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

/* ─── The popup ───
 * One screen for the open tab: the job it belongs to (or Save job), and, when the page has a form,
 * Fill form → what was filled and what's left → Save answers to the bank.
 */

/** Apps that render their form after load (Ashby) get a moment before "no form" is believed. */
async function readFormSoon(tab: Tab): Promise<PageForm> {
  let form = await readForm(tab);
  for (let i = 0; i < 3 && !form.fields.length && !form.blockedFrames; i++) {
    await new Promise((r) => setTimeout(r, 700));
    form = await readForm(tab);
  }
  return form;
}

type Loaded = { conn: Connection; tab: Tab; status: Status; form: PageForm | null; formError: string };

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

  const load = useCallback(async () => {
    const conn = await getConnection();
    if (!conn) return setState({ kind: "connect" });
    const tab = await activeTab();
    if (!tab) return setState({ kind: "error", error: "No tab to work with.", conn });
    try {
      const [status, form] = await Promise.all([
        api.status(conn, tab.url),
        /^https?:/.test(tab.url) ? readFormSoon(tab).then((f) => ({ f, e: "" }), (e: Error) => ({ f: null, e: e.message })) : Promise.resolve({ f: null, e: "Slothing can't read this kind of page." }),
      ]);
      applyTheme(status.theme);
      void chrome.storage.local.set({ theme: status.theme });
      setState({ kind: "ready", conn, tab, status, form: form.f, formError: form.e });
    } catch (e) {
      if (e instanceof ApiError && e.unauthorized) return setState({ kind: "connect", error: e.message });
      setState({ kind: "error", error: (e as Error).message, conn });
    }
  }, []);

  useEffect(() => {
    void chrome.storage.local.get("theme").then(({ theme }) => theme && applyTheme(theme as Status["theme"]));
    void load();
  }, [load]);

  return (
    <div className="flex max-h-[590px] min-h-[200px] w-[380px] flex-col bg-page text-ink">
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
        {state.kind === "ready" && <Main {...state} reload={load} disconnect={() => setConnection(null).then(() => setState({ kind: "connect" }))} />}
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

function Main({ conn, tab, status, form, formError, reload, disconnect }: Loaded & { reload: () => void; disconnect: () => void }) {
  const [job, setJob] = useState<JobSummary | null>(status.job);
  const [view, setView] = useState<"main" | "save">("main");
  const hasForm = Boolean(form?.fields.length);
  const open = (path: string) => chrome.tabs.create({ url: `${conn.server}${path}` });

  return (
    <>
      {view === "main" ? (
        <div className="space-y-px bg-rule">
          <JobSection conn={conn} tab={tab} status={status} job={job} setJob={setJob} hasForm={hasForm} open={open} />
          {form && (form.fields.length > 0 || form.combos > 0) ? (
            <FormSection conn={conn} tab={tab} form={form} job={job} llm={status.llm} onSaveAnswers={() => setView("save")} open={open} />
          ) : (
            <Section>
              <p className="text-xs leading-relaxed text-ink-3">
                {formError || (form?.blockedFrames ? "" : "No application form on this page. Open the application to fill it.")}
              </p>
              {form?.blockedFrames ? <FrameAccess onGranted={reload} /> : null}
            </Section>
          )}
        </div>
      ) : (
        <SaveAnswers conn={conn} tab={tab} onDone={() => setView("main")} />
      )}
      <footer className="flex items-center gap-1 border-t border-rule px-2 py-1.5">
        <button onClick={() => open("/answers")} className={buttonClass("ghost", "sm")}>
          <MessageSquareText className="h-3.5 w-3.5" /> Answer bank · {status.answers}
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

function JobSection({
  conn,
  tab,
  status,
  job,
  setJob,
  hasForm,
  open,
}: {
  conn: Connection;
  tab: Tab;
  status: Status;
  job: JobSummary | null;
  setJob: (j: JobSummary | null) => void;
  hasForm: boolean;
  open: (path: string) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [justSaved, setJustSaved] = useState<boolean | null>(null);

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const r = await api.saveJob(conn, await readPosting(tab));
      setJob(r.job);
      setJustSaved(r.created);
    } catch (e) {
      setError((e as Error).message);
    }
    setSaving(false);
  };

  if (job) {
    return (
      <Section title={justSaved ? "Saved to your jobs" : justSaved === false ? "Already in your jobs" : "This job"}>
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <div className="truncate font-display text-base font-semibold leading-snug tracking-tight">{job.title || "Untitled role"}</div>
            <div className="truncate text-sm text-ink-2">{job.company || "Unknown company"}</div>
          </div>
          <Button size="sm" variant="secondary" onClick={() => open(`/jobs/${job.id}`)}>Open</Button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <DocChip ok={job.resume} label="Resume" />
          <DocChip ok={job.letter} label="Cover letter" />
          {!job.resume && <span className="text-xs text-ink-3">Tailor it in Slothing to attach it here.</span>}
        </div>
        {!status.job && !justSaved && (
          <button onClick={() => setJob(null)} className="text-xs text-ink-3 underline-offset-2 hover:text-ink hover:underline">Not this job</button>
        )}
      </Section>
    );
  }

  const picker = status.recent.length > 0 && (
    <Dropdown
      label="The job this application is for"
      value={null}
      placeholder="Pick a saved job"
      options={status.recent.map((j) => ({ value: j.id, label: `${j.title || "Untitled"} · ${j.company || "?"}`, text: `${j.title} ${j.company}` }))}
      onChange={(id) => setJob(status.recent.find((j) => j.id === id) ?? null)}
      className="w-full"
    />
  );

  return (
    <Section title={hasForm ? "Applying for" : "Job"}>
      {hasForm && (
        <>
          <p className="text-xs leading-relaxed text-ink-3">Pick the job this form is for, so its tailored resume can be attached.</p>
          {picker}
        </>
      )}
      <div className="flex items-center gap-2">
        <Button size={hasForm ? "sm" : "md"} variant={hasForm ? "ghost" : "primary"} onClick={save} disabled={saving} className={hasForm ? "" : "w-full"}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          {saving ? "Reading the posting…" : hasForm ? "Save this page as a job" : "Save job"}
        </Button>
      </div>
      {!hasForm && !saving && <p className="text-xs leading-relaxed text-ink-3">Reads this posting: title, company, location and the full description.</p>}
      {error && <Notice tone="warn">{error}</Notice>}
    </Section>
  );
}

function DocChip({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className={cx("inline-flex h-6 items-center gap-1 rounded-chip border px-2 text-xs", ok ? "border-ok bg-ok-soft text-ok" : "border-rule bg-paper text-ink-3")}>
      {ok ? <Check className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
      {label}
    </span>
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
};

function FormSection({
  conn,
  tab,
  form,
  job,
  llm,
  onSaveAnswers,
  open,
}: {
  conn: Connection;
  tab: Tab;
  form: PageForm;
  job: JobSummary | null;
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

  const unanswered = result?.skipped.filter((s) => s.reason === "no-answer" && s.label && (s.field.kind === "text" || s.field.kind === "textarea") && !drafts[s.id]) ?? [];

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
                        <span className="text-[11px] text-ink-3">{drafts[s.id] === "none" ? "Your profile doesn't answer this" : SKIP_LABEL[s.reason]}</span>
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
      <div className="border-t border-rule pt-3">
        <Button variant="secondary" size="sm" onClick={onSaveAnswers} className="w-full">
          <PenLine className="h-3.5 w-3.5" /> Save my answers to the bank
        </Button>
      </div>
    </Section>
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
