"use client";

import { Loader2, Plus } from "lucide-react";
import { useActionState, useState } from "react";

import { addJobAction } from "@/app/actions";
import { Modal } from "./modal";
import { Button, Field, Input, Textarea } from "./ui";

const EMPTY = { url: "", description: "", company: "", title: "" };

/** Header action: one form for a posting's link, its pasted description, or both. Opens the new job. */
export function AddJob() {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(addJobAction, null);
  // Controlled, so a failed read keeps what was typed (a form action resets uncontrolled fields).
  const [f, setF] = useState(EMPTY);
  const bind = (k: keyof typeof EMPTY) => ({ name: k, value: f[k], readOnly: pending, onChange: (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value }) });
  const linkOnly = !f.description.trim() && !!f.url.trim();
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" /> Add job
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Add a job" size="md" closeButton>
        <form action={action} className="space-y-3">
          <Field label="Posting link">
            <Input {...bind("url")} placeholder="Greenhouse, Lever, Ashby, LinkedIn, most career sites" autoFocus />
          </Field>
          <Field label="Job description">
            <Textarea {...bind("description")} rows={9} className="max-h-[50vh]" placeholder="Paste it if the link can't be read, or to add a job without one" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Company"><Input {...bind("company")} /></Field>
            <Field label="Title"><Input {...bind("title")} /></Field>
          </div>
          <p className="text-xs leading-5 text-ink-3">
            With only a link, the posting is read from it. A pasted description is used as is. Anything left blank is filled in from the posting.
          </p>
          {state && !state.ok && <p className="text-sm text-warn">{state.error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="primary" disabled={pending || (!f.url.trim() && !f.description.trim())}>
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              {pending ? (linkOnly ? "Reading the link…" : "Reading the posting…") : "Add job"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
