"use client";

import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { useFormStatus } from "react-dom";

import { createJobAction } from "@/app/actions";
import { Modal } from "./modal";
import { Button, Field, Input, Textarea } from "./ui";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button variant="primary" disabled={pending}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
      {pending ? "Reading the posting…" : "Add job"}
    </Button>
  );
}

/** Header action: opens the add-job form in a modal. The action redirects to the new job on success. */
export function AddJob() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" /> Add job
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Add a job" size="md" closeButton>
        <form action={createJobAction} className="space-y-3">
          <Field label="Job description">
            <Textarea name="description" rows={9} className="max-h-[50vh]" placeholder="Paste the full job description" required autoFocus />
          </Field>
          <Field label="Posting URL">
            <Input name="url" placeholder="https:// (optional)" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Company"><Input name="company" /></Field>
            <Field label="Title"><Input name="title" /></Field>
          </div>
          <p className="text-xs leading-5 text-ink-3">Leave company and title blank and AI fills them in from the description.</p>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <SubmitButton />
          </div>
        </form>
      </Modal>
    </>
  );
}
