"use client";

import { useState, useTransition } from "react";

import { deleteJobAction, updateJobAction } from "@/app/actions";
import { JOB_STATUSES, type Job, type JobStatus } from "@/lib/types";
import { Button, Card, Input, Label, Select, Textarea } from "./ui";

export function StatusSelect({ job }: { job: Job }) {
  const [status, setStatus] = useState(job.status);
  const [, start] = useTransition();
  return (
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
  );
}

export function JobPanel({ job }: { job: Job }) {
  const [f, setF] = useState({ company: job.company, title: job.title, location: job.location, url: job.url, description: job.description, notes: job.notes });
  const [savedF, setSavedF] = useState(f);
  const [editing, setEditing] = useState(!job.description);
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
    <Card className="space-y-3 p-4">
      <div className="grid gap-2 sm:grid-cols-2">
        <div><Label>Company</Label><Input value={f.company} onChange={set("company")} /></div>
        <div><Label>Title</Label><Input value={f.title} onChange={set("title")} /></div>
        <div><Label>Location</Label><Input value={f.location} onChange={set("location")} /></div>
        <div><Label>Posting URL</Label><Input value={f.url} onChange={set("url")} placeholder="https://" /></div>
      </div>
      <div>
        <Label>Notes</Label>
        <Textarea rows={2} value={f.notes} onChange={set("notes")} placeholder="Referral, recruiter name, follow-up date…" />
      </div>
      <div>
        <div className="mb-1 flex items-center justify-between">
          <Label className="mb-0">Job description</Label>
          <button className="text-xs text-brand hover:underline" onClick={() => setEditing((e) => !e)}>{editing ? "Done" : "Edit"}</button>
        </div>
        {editing ? (
          <Textarea rows={14} value={f.description} onChange={set("description")} placeholder="Paste the full job description" />
        ) : (
          <div className="max-h-80 overflow-y-auto whitespace-pre-wrap rounded-md border border-rule px-3 py-2 text-sm leading-relaxed text-ink-2">
            {f.description || "No description yet."}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="primary" onClick={save} disabled={!dirty || pending}>Save</Button>
        {dirty && <span className="text-xs text-ink-3">Unsaved</span>}
        <Button variant="danger" className="ml-auto text-xs" onClick={remove}>Delete job</Button>
      </div>
    </Card>
  );
}
