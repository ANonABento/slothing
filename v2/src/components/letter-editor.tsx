"use client";

import { safe } from "@/lib/safe";
import { Sparkles } from "lucide-react";
import { useState, useTransition } from "react";

import { saveLetterAction, writeLetterAction } from "@/app/actions";
import type { CoverLetter, Warning } from "@/lib/types";
import { ListEditor } from "./list-editor";
import { useConfirm } from "./confirm";
import { SaveBar } from "./save-bar";
import { Button, Input, Label, Textarea, Warnings, cx } from "./ui";

export function LetterEditor({
  jobId,
  initial,
  initialWarnings,
  targetWords,
}: {
  jobId: string;
  initial: CoverLetter | null;
  initialWarnings: Warning[];
  targetWords: number;
}) {
  const [doc, setDoc] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const { confirm, dialog } = useConfirm();
  const dirty = JSON.stringify(doc) !== JSON.stringify(saved);

  const generate = async () => {
    if (doc && !(await confirm({ title: "Rewrite this cover letter?", body: "AI will write a new draft. Your edits to this letter will be lost.", confirmLabel: "Rewrite" }))) return;
    start(async () => {
      setError("");
      const res = await safe(() => writeLetterAction(jobId));
      if (!res.ok) setError(res.error);
    });
  };

  const blank = () =>
    start(async () => {
      const empty: CoverLetter = { greeting: "Dear Hiring Manager,", paragraphs: [""], closing: "Sincerely," };
      const res = await safe(() => saveLetterAction(jobId, empty));
      if (!res.ok) setError(res.error);
    });

  const save = () =>
    start(async () => {
      if (!doc) return;
      const res = await safe(() => saveLetterAction(jobId, doc));
      if (res.ok) {
        setSaved(doc);
      } else setError(res.error);
    });

  if (!doc) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-ink-2">No cover letter yet.</p>
        <div className="flex gap-2">
          <Button variant="primary" disabled={pending} onClick={generate}><Sparkles className="h-4 w-4" />{pending ? "Writing…" : "Write with AI"}</Button>
          <Button variant="ghost" disabled={pending} onClick={blank}>Start blank</Button>
        </div>
        {error && <p className="text-sm text-warn">{error}</p>}
      </div>
    );
  }

  return (
    // Locked while saving/generating: the editor remounts with server data afterwards, so typing now would be lost.
    <fieldset disabled={pending} className="min-w-0 space-y-4">
      {dialog}
      <div>
        <Button variant="secondary" disabled={pending} onClick={generate}><Sparkles className="h-4 w-4" />{pending ? "Writing…" : "Rewrite with AI"}</Button>
      </div>
      {error && <p className="text-sm text-warn">{error}</p>}
      {!dirty && <Warnings items={initialWarnings} />}
      <div>
        <Label>Greeting</Label>
        <Input aria-label="Greeting" value={doc.greeting} onChange={(e) => setDoc({ ...doc, greeting: e.target.value })} />
      </div>
      <div>
        <div className="flex items-baseline justify-between">
          <Label>Paragraphs</Label>
          <WordCount words={doc.paragraphs.join(" ").split(/\s+/).filter(Boolean).length} target={targetWords} />
        </div>
        <ListEditor
          items={doc.paragraphs}
          onChange={(paragraphs) => setDoc({ ...doc, paragraphs })}
          addLabel="Paragraph"
          onAdd={() => ""}
          itemLabel="paragraph"
          render={(p, update) => <Textarea rows={5} aria-label="Paragraph" value={p} onChange={(e) => update(e.target.value)} />}
        />
      </div>
      <div>
        <Label>Closing</Label>
        <Input aria-label="Closing" value={doc.closing} onChange={(e) => setDoc({ ...doc, closing: e.target.value })} />
      </div>
      <SaveBar dirty={dirty} pending={pending} onSave={save} onDiscard={() => setDoc(saved)} />
    </fieldset>
  );
}
function WordCount({ words, target }: { words: number; target: number }) {
  return (
    <span className={cx("font-mono text-xs", words > target * 1.1 ? "text-warn" : "text-ink-3")} title="Word target is set in Settings">
      {words} / {target} words
    </span>
  );
}
