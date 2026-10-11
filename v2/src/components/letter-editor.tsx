"use client";

import { useState, useTransition } from "react";

import { saveLetterAction, writeLetterAction } from "@/app/actions";
import type { CoverLetter, Warning } from "@/lib/types";
import { ListEditor } from "./list-editor";
import { Button, Input, Label, Textarea, Warnings } from "./ui";

export function LetterEditor({
  jobId,
  initial,
  initialWarnings,
  onSaved,
}: {
  jobId: string;
  initial: CoverLetter | null;
  initialWarnings: Warning[];
  onSaved: () => void;
}) {
  const [doc, setDoc] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const dirty = JSON.stringify(doc) !== JSON.stringify(saved);

  const generate = () => {
    if (doc && !window.confirm("Replace the current cover letter?")) return;
    start(async () => {
      setError("");
      const res = await writeLetterAction(jobId);
      if (!res.ok) setError(res.error);
    });
  };

  const blank = () =>
    start(async () => {
      const empty: CoverLetter = { greeting: "Dear Hiring Manager,", paragraphs: [""], closing: "Sincerely," };
      const res = await saveLetterAction(jobId, empty);
      if (!res.ok) setError(res.error);
    });

  const save = () =>
    start(async () => {
      if (!doc) return;
      const res = await saveLetterAction(jobId, doc);
      if (res.ok) {
        setSaved(doc);
        onSaved();
      } else setError(res.error);
    });

  if (!doc) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-ink-2">No cover letter yet.</p>
        <div className="flex gap-2">
          <Button variant="primary" disabled={pending} onClick={generate}>{pending ? "Writing…" : "Write with AI"}</Button>
          <Button variant="ghost" disabled={pending} onClick={blank}>Start blank</Button>
        </div>
        {error && <p className="text-sm text-warn">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button variant="secondary" disabled={pending} onClick={generate}>{pending ? "Writing…" : "Rewrite with AI"}</Button>
        <div className="flex items-center gap-2">
          {dirty && <span className="text-xs text-ink-3">Unsaved</span>}
          <Button variant="primary" disabled={!dirty || pending} onClick={save}>Save</Button>
        </div>
      </div>
      {error && <p className="text-sm text-warn">{error}</p>}
      {!dirty && <Warnings items={initialWarnings} />}
      <div>
        <Label>Greeting</Label>
        <Input value={doc.greeting} onChange={(e) => setDoc({ ...doc, greeting: e.target.value })} />
      </div>
      <div>
        <Label>Paragraphs</Label>
        <ListEditor
          items={doc.paragraphs}
          onChange={(paragraphs) => setDoc({ ...doc, paragraphs })}
          addLabel="Paragraph"
          onAdd={() => ""}
          render={(p, update) => <Textarea rows={5} value={p} onChange={(e) => update(e.target.value)} />}
        />
      </div>
      <div>
        <Label>Closing</Label>
        <Input value={doc.closing} onChange={(e) => setDoc({ ...doc, closing: e.target.value })} />
      </div>
    </div>
  );
}
