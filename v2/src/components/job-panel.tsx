"use client";

import { safe } from "@/lib/safe";
import { ChevronDown, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";

import { deleteJobAction, updateJobAction } from "@/app/actions";
import { JOB_STATUSES, type Job, type JobStatus } from "@/lib/types";
import { useConfirm } from "./confirm";
import { Dropdown } from "./dropdown";
import { useUnsavedGuard } from "./save-bar";
import { Button, Card, CardTitle, Eyebrow, Field, Input, Textarea, cx } from "./ui";

const STATUS_OPTIONS = JOB_STATUSES.map((s) => ({ value: s, label: s[0].toUpperCase() + s.slice(1) }));

export function StatusSelect({ job }: { job: Job }) {
  const [status, setStatus] = useState(job.status);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const change = (next: JobStatus) => {
    if (next === status) return;
    const prev = status;
    setStatus(next);
    setError("");
    start(async () => {
      const res = await safe(() => updateJobAction(job.id, { status: next }));
      if (!res.ok) {
        setStatus(prev);
        setError(res.error);
      }
    });
  };
  return (
    <div className="flex items-center gap-2">
      <Eyebrow>Status</Eyebrow>
      <Dropdown label="Job status" value={status} onChange={change} options={STATUS_OPTIONS} disabled={pending} align="end" className="w-40" />
      {error && <span className="text-xs text-warn">{error}</span>}
    </div>
  );
}

export function JobPanel({ job }: { job: Job }) {
  const [f, setF] = useState({ company: job.company, title: job.title, location: job.location, url: job.url, description: job.description, notes: job.notes });
  const [savedF, setSavedF] = useState(f);
  const [open, setOpen] = useState(!job.description);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const { confirm, dialog } = useConfirm();
  const dirty = JSON.stringify(f) !== JSON.stringify(savedF);
  useUnsavedGuard(dirty);
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });

  const save = () =>
    start(async () => {
      setError("");
      const res = await safe(() => updateJobAction(job.id, f));
      if (res.ok) setSavedF(f);
      else setError(res.error);
    });

  const remove = async () => {
    const ok = await confirm({
      title: "Delete this job?",
      body: `${job.title || "This job"}${job.company ? ` at ${job.company}` : ""}, its resume and its cover letter will be permanently deleted.`,
      confirmLabel: "Delete job",
      destructive: true,
    });
    if (ok) start(() => deleteJobAction(job.id));
  };

  return (
    <Card>
      {dialog}
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left">
        <div className="min-w-0">
          <CardTitle>Job details</CardTitle>
          {!open && <p className="truncate text-sm text-ink-3">{f.notes || f.description.slice(0, 140) || "Description, notes and links"}</p>}
        </div>
        <ChevronDown className={cx("h-5 w-5 shrink-0 text-ink-3 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="space-y-4 border-t border-rule px-5 py-5">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Field label="Company"><Input value={f.company} onChange={set("company")} /></Field>
            <Field label="Title"><Input value={f.title} onChange={set("title")} /></Field>
            <Field label="Location"><Input value={f.location} onChange={set("location")} /></Field>
            <Field label="Posting URL"><Input value={f.url} onChange={set("url")} placeholder="https://" /></Field>
          </div>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <Field label="Job description"><Textarea rows={12} className="max-h-[32rem]" value={f.description} onChange={set("description")} placeholder="Paste the full job description" /></Field>
            <Field label="Notes"><Textarea rows={12} className="max-h-[32rem]" value={f.notes} onChange={set("notes")} placeholder="Referral, recruiter name, follow-up date…" /></Field>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="primary" onClick={save} disabled={!dirty || pending}>Save details</Button>
            {error ? <span className="text-xs text-warn">{error}</span> : dirty && <span className="text-xs text-ink-3">Unsaved changes</span>}
            <Button variant="danger" size="sm" className="ml-auto" onClick={remove}>
              <Trash2 className="h-3.5 w-3.5" /> Delete job
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
