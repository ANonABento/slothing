"use client";

import { ChevronDown, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";

import { deleteJobAction, updateJobAction } from "@/app/actions";
import { JOB_STATUSES, type Job, type JobStatus } from "@/lib/types";
import { Button, Card, CardTitle, Input, Label, Select, Textarea, cx } from "./ui";

export function StatusSelect({ job }: { job: Job }) {
  const [status, setStatus] = useState(job.status);
  const [, start] = useTransition();
  return (
    <label className="flex items-center gap-2">
      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">Status</span>
      <Select
        value={status}
        onChange={(e) => {
          const s = e.target.value as JobStatus;
          setStatus(s);
          start(() => void updateJobAction(job.id, { status: s }));
        }}
      >
        {JOB_STATUSES.map((s) => (
          <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>
        ))}
      </Select>
    </label>
  );
}

export function JobPanel({ job }: { job: Job }) {
  const [f, setF] = useState({ company: job.company, title: job.title, location: job.location, url: job.url, description: job.description, notes: job.notes });
  const [savedF, setSavedF] = useState(f);
  const [open, setOpen] = useState(!job.description);
  const [pending, start] = useTransition();
  const dirty = JSON.stringify(f) !== JSON.stringify(savedF);
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });

  const save = () =>
    start(async () => {
      const res = await updateJobAction(job.id, f);
      if (res.ok) setSavedF(f);
    });

  const remove = () => {
    if (window.confirm(`Delete ${job.title || "this job"} at ${job.company || "?"} and its documents? This can't be undone.`)) {
      start(() => deleteJobAction(job.id));
    }
  };

  return (
    <Card>
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
            <div><Label>Company</Label><Input value={f.company} onChange={set("company")} /></div>
            <div><Label>Title</Label><Input value={f.title} onChange={set("title")} /></div>
            <div><Label>Location</Label><Input value={f.location} onChange={set("location")} /></div>
            <div><Label>Posting URL</Label><Input value={f.url} onChange={set("url")} placeholder="https://" /></div>
          </div>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <div><Label>Job description</Label><Textarea rows={12} value={f.description} onChange={set("description")} placeholder="Paste the full job description" /></div>
            <div><Label>Notes</Label><Textarea rows={12} value={f.notes} onChange={set("notes")} placeholder="Referral, recruiter name, follow-up date…" /></div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="primary" onClick={save} disabled={!dirty || pending}>Save details</Button>
            {dirty && <span className="text-xs text-ink-3">Unsaved changes</span>}
            <Button variant="danger" size="sm" className="ml-auto" onClick={remove}>
              <Trash2 className="h-3.5 w-3.5" /> Delete job
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
