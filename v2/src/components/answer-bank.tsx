"use client";

import { Check, Copy, Loader2, MessageSquareText, Pencil, Plus, Search, Sparkles, Trash2 } from "lucide-react";
import { useMemo, useState, useTransition } from "react";

import { deleteAnswerAction, draftAnswerAction, saveAnswerAction } from "@/app/actions";
import { ago, hostOf } from "@/lib/format";
import { safe } from "@/lib/safe";
import type { Answer } from "@/lib/types";
import { useConfirm } from "./confirm";
import { count, joinParts } from "./entry-card";
import { PageBody, PageHeader } from "./page-header";
import { RowMenu } from "./row-menu";
import { useUnsavedGuard } from "./save-bar";
import { Button, Card, EmptyState, Eyebrow, Field, IconButton, Input, Textarea, cx } from "./ui";

/** The card being edited: an existing answer's id, or "new" for one not saved yet. */
type Editing = { id: string; question: string; answer: string } | null;

const words = (s: string) => s.split(/\s+/).filter(Boolean).length;

export function AnswerBank({ answers, suggestions, llm }: { answers: Answer[]; suggestions: string[]; llm: boolean }) {
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Editing>(null);
  const { confirm, dialog } = useConfirm();

  const original = editing && editing.id !== "new" ? answers.find((a) => a.id === editing.id) : null;
  const dirty = Boolean(editing && (editing.id === "new" ? editing.question.trim() || editing.answer.trim() : editing.question !== original?.question || editing.answer !== original?.answer));
  useUnsavedGuard(dirty);

  /** Open a card for editing, asking first if another one has unsaved edits. */
  const edit = async (next: Editing) => {
    if (dirty && !(await confirm({ title: "Discard your edits?", body: "The answer you're editing has unsaved changes.", confirmLabel: "Discard" }))) return;
    setEditing(next);
  };

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? answers.filter((a) => `${a.question}\n${a.answer}`.toLowerCase().includes(q)) : answers;
  }, [answers, query]);
  const used = answers.filter((a) => a.uses > 0).length;

  const add = (question = "") => edit({ id: "new", question, answer: "" });

  return (
    <>
      {dialog}
      <PageHeader
        icon={MessageSquareText}
        title="Answer bank"
        description="Your answers to application questions. The extension fills forms with them."
        actions={
          <Button variant="primary" onClick={() => add()}>
            <Plus className="h-4 w-4" /> Add answer
          </Button>
        }
      />
      <PageBody>
        <div className="mx-auto max-w-4xl space-y-4">
          {answers.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-56 flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search questions and answers" aria-label="Search answers" className="pl-9" />
              </div>
              <p className="text-sm text-ink-2">{joinParts(count(answers.length, "answer"), used > 0 && `${used} used in forms`)}</p>
            </div>
          )}

          {editing?.id === "new" && <AnswerEditor value={editing} onChange={setEditing} onDone={() => setEditing(null)} llm={llm} />}

          {answers.length === 0 && editing?.id !== "new" ? (
            <EmptyState icon={MessageSquareText} title="No saved answers yet" footer={<Suggestions items={suggestions} onPick={add} className="justify-center" />}>
              Answer a question once and the extension fills it on every form that asks it. Or save what you type on a form, from the extension.
            </EmptyState>
          ) : (
            !query && !editing && suggestions.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <Eyebrow className="mr-1">Most forms ask</Eyebrow>
                <Suggestions items={suggestions} onPick={add} />
              </div>
            )
          )}

          {answers.length > 0 && shown.length === 0 && <p className="py-8 text-center text-sm text-ink-3">No answers match “{query}”.</p>}

          <div className="space-y-2">
            {shown.map((a) =>
              editing?.id === a.id ? (
                <AnswerEditor key={a.id} value={editing} onChange={setEditing} onDone={() => setEditing(null)} llm={llm} />
              ) : (
                <AnswerCard key={a.id} answer={a} onEdit={() => edit({ id: a.id, question: a.question, answer: a.answer })} confirm={confirm} />
              ),
            )}
          </div>
        </div>
      </PageBody>
    </>
  );
}

function Suggestions({ items, onPick, className }: { items: string[]; onPick: (q: string) => void; className?: string }) {
  return (
    <div className={cx("flex flex-wrap gap-2", className)}>
      {items.map((q) => (
        <button
          key={q}
          type="button"
          onClick={() => onPick(q)}
          className="inline-flex h-8 items-center gap-1.5 rounded-chip border border-rule bg-paper px-2.5 text-xs text-ink-2 transition-colors hover:border-rule-strong hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <Plus className="h-3 w-3 text-ink-3" />
          {q}
        </button>
      ))}
    </div>
  );
}

function AnswerCard({ answer: a, onEdit, confirm }: { answer: Answer; onEdit: () => void; confirm: ReturnType<typeof useConfirm>["confirm"] }) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(a.answer);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("Couldn't copy. Select the text instead.");
    }
  };
  const remove = async () => {
    if (!(await confirm({ title: "Delete this answer?", body: `“${a.question}” and its answer will be deleted.`, confirmLabel: "Delete", destructive: true }))) return;
    start(async () => {
      const res = await safe(() => deleteAnswerAction(a.id));
      if (!res.ok) setError(res.error);
    });
  };
  const source = hostOf(a.sourceUrl);
  return (
    <Card className={cx("group flex gap-2 py-3 pl-5 pr-3 transition-shadow hover:shadow-paper-elevated", pending && "opacity-50")}>
      <button type="button" onClick={onEdit} className="min-w-0 flex-1 rounded-control py-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
        <div className="font-medium">{a.question}</div>
        {a.answer ? (
          <p className="mt-1 line-clamp-4 whitespace-pre-line text-sm leading-relaxed text-ink-2">{a.answer}</p>
        ) : (
          <p className="mt-1 text-sm italic text-ink-3">No answer yet. Forms that ask this are left for you.</p>
        )}
        <p className="mt-2 text-xs text-ink-3">
          {joinParts(a.uses > 0 && `Filled ${a.uses === 1 ? "once" : `${a.uses} times`}`, source && `Saved from ${source}`, `Updated ${ago(a.updatedAt).toLowerCase()}`)}
        </p>
        {error && <p className="mt-1 text-xs text-warn">{error}</p>}
      </button>
      <div className="flex shrink-0 items-start gap-0.5">
        {a.answer && (
          <IconButton size="sm" label={copied ? "Copied" : "Copy answer"} onClick={copy}>
            {copied ? <Check className="h-4 w-4 text-ok" /> : <Copy className="h-4 w-4" />}
          </IconButton>
        )}
        <RowMenu
          label="Answer actions"
          actions={[
            { label: "Edit", icon: Pencil, onSelect: onEdit },
            { label: "Delete", icon: Trash2, onSelect: remove, danger: true },
          ]}
        />
      </div>
    </Card>
  );
}

function AnswerEditor({ value, onChange, onDone, llm }: { value: NonNullable<Editing>; onChange: (v: Editing) => void; onDone: () => void; llm: boolean }) {
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [saving, startSave] = useTransition();
  const [drafting, startDraft] = useTransition();
  const busy = saving || drafting;

  const save = () =>
    startSave(async () => {
      setError("");
      const res = await safe(() => saveAnswerAction({ id: value.id === "new" ? undefined : value.id, question: value.question, answer: value.answer }));
      if (res.ok) onDone();
      else setError(res.error);
    });

  const draft = () =>
    startDraft(async () => {
      setError("");
      setWarning("");
      const res = await safe(() => draftAnswerAction(value.question));
      if (!res.ok) return setError(res.error);
      onChange({ ...value, answer: res.data!.text });
      setWarning(res.data!.warning ?? "");
    });

  return (
    <Card className="space-y-3 border-brand p-5">
      <div
        className="space-y-3"
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            if (!busy && value.question.trim()) save();
          }
        }}
      >
        <Field label="Question">
          <Input value={value.question} onChange={(e) => onChange({ ...value, question: e.target.value })} placeholder="As forms usually ask it" autoFocus={!value.question} readOnly={busy} />
        </Field>
        <Field label={<>Answer <span className="font-normal text-ink-3">· {count(words(value.answer), "word")}</span></>}>
          <Textarea
            rows={4}
            className="max-h-[50vh]"
            value={value.answer}
            onChange={(e) => onChange({ ...value, answer: e.target.value })}
            placeholder="Yes / No answers work for dropdowns too: the extension picks the option that starts with your answer."
            autoFocus={Boolean(value.question)}
            readOnly={busy}
          />
        </Field>
      </div>
      {warning && <p className="rounded-control border border-warn bg-warn-soft px-3 py-2 text-xs text-ink-2"><span className="font-semibold text-warn">Check: </span>{warning}</p>}
      {error && <p className="text-sm text-warn">{error}</p>}
      <div className="flex flex-wrap items-center gap-2">
        {llm && (
          <Button size="sm" variant="ghost" onClick={draft} disabled={busy || !value.question.trim()} title="A first draft from your profile, in the tone of your other answers">
            {drafting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            {drafting ? "Drafting…" : value.answer.trim() ? "Redraft from profile" : "Draft from profile"}
          </Button>
        )}
        <span className="ml-auto hidden text-xs text-ink-3 sm:inline">⌘↵ to save</span>
        <Button size="sm" variant="ghost" onClick={onDone} disabled={saving}>Cancel</Button>
        <Button size="sm" variant="primary" onClick={save} disabled={busy || !value.question.trim()}>
          {saving ? "Saving…" : "Save answer"}
        </Button>
      </div>
    </Card>
  );
}
