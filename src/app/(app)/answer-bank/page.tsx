"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  ClipboardList,
  Copy,
  Edit3,
  Loader2,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import { TimeAgo } from "@/components/format/time-ago";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ErrorState, getErrorMessage } from "@/components/ui/error-state";
import {
  AppPage,
  PageContent,
  PageHeader,
  StandardEmptyState,
} from "@/components/ui/page-layout";
import { SkeletonCard } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { useErrorToast } from "@/hooks/use-error-toast";
import {
  getAnswerSourceLabel,
  type AnswerBankEntry,
} from "@/lib/answers/learned-answers";
import {
  ANSWER_COMPONENT_LABELS,
  ANSWER_COMPONENT_TYPES,
  classifyAnswerComponent,
  type AnswerComponentType,
} from "@/lib/answers/answer-components";
import {
  THEME_CONTROL_CLASSES,
  THEME_INTERACTIVE_SURFACE_CLASSES,
} from "@/lib/theme/component-classes";
import { cn } from "@/lib/utils";

interface AnswerFormState {
  question: string;
  answer: string;
  sourceCompany: string;
  sourceUrl: string;
}

const EMPTY_FORM: AnswerFormState = {
  question: "",
  answer: "",
  sourceCompany: "",
  sourceUrl: "",
};

function entryToForm(entry: AnswerBankEntry): AnswerFormState {
  return {
    question: entry.question,
    answer: entry.answer,
    sourceCompany: entry.sourceCompany || "",
    sourceUrl: entry.sourceUrl || "",
  };
}

export default function AnswerBankPage() {
  const [answers, setAnswers] = useState<AnswerBankEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState<AnswerComponentType | "all">(
    "all",
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<AnswerBankEntry | null>(
    null,
  );
  const [form, setForm] = useState<AnswerFormState>(EMPTY_FORM);
  const { addToast } = useToast();
  const showErrorToast = useErrorToast();

  const fetchAnswers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/answer-bank");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch answers");
      setAnswers(data.answers || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnswers();
  }, [fetchAnswers]);

  const filteredAnswers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const typeFiltered =
      activeType === "all"
        ? answers
        : answers.filter(
            (entry) => classifyAnswerComponent(entry) === activeType,
          );
    if (!normalized) return typeFiltered;

    return typeFiltered.filter((entry) =>
      [entry.question, entry.answer, entry.sourceCompany, entry.sourceUrl]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalized)),
    );
  }, [activeType, answers, query]);

  const stats = useMemo(() => {
    const totalUses = answers.reduce((sum, entry) => sum + entry.timesUsed, 0);
    const sourceCount = new Set(
      answers
        .map((entry) => entry.sourceCompany || entry.sourceUrl)
        .filter(Boolean),
    ).size;
    return { totalUses, sourceCount };
  }, [answers]);

  const typeCounts = useMemo(() => {
    const counts: Record<AnswerComponentType, number> = {
      repeated_question: 0,
      work_authorization: 0,
      logistics: 0,
      compensation: 0,
      links: 0,
      personal_fact: 0,
    };
    for (const entry of answers) {
      counts[classifyAnswerComponent(entry)] += 1;
    }
    return counts;
  }, [answers]);

  function openCreateDialog() {
    setEditingEntry(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  }

  function openEditDialog(entry: AnswerBankEntry) {
    setEditingEntry(entry);
    setForm(entryToForm(entry));
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditingEntry(null);
    setForm(EMPTY_FORM);
  }

  function updateForm(key: keyof AnswerFormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function saveAnswer() {
    if (!form.question.trim() || !form.answer.trim()) {
      addToast({
        type: "warning",
        title: "Question and answer are required",
      });
      return;
    }

    setSaving(true);
    try {
      const method = editingEntry ? "PATCH" : "POST";
      const url = editingEntry
        ? `/api/answer-bank/${editingEntry.id}`
        : "/api/answer-bank";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save answer");

      if (editingEntry) {
        setAnswers((prev) =>
          prev.map((entry) => (entry.id === editingEntry.id ? data : entry)),
        );
      } else {
        setAnswers((prev) => {
          const withoutDuplicate = prev.filter((entry) => entry.id !== data.id);
          return [data, ...withoutDuplicate];
        });
      }

      addToast({
        type: "success",
        title: editingEntry ? "Answer updated" : "Answer saved",
      });
      closeDialog();
    } catch (err) {
      showErrorToast(err, {
        title: "Could not save answer",
        fallbackDescription: "Please try saving it again.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function deleteAnswer(entry: AnswerBankEntry) {
    try {
      const res = await fetch(`/api/answer-bank/${entry.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete answer");

      setAnswers((prev) => prev.filter((item) => item.id !== entry.id));
      addToast({ type: "success", title: "Answer deleted" });
    } catch (err) {
      showErrorToast(err, {
        title: "Could not delete answer",
        fallbackDescription: "Please try deleting it again.",
      });
    }
  }

  async function copyAnswer(entry: AnswerBankEntry) {
    await navigator.clipboard.writeText(entry.answer);
    addToast({ type: "success", title: "Answer copied" });
  }

  return (
    <AppPage>
      <PageHeader
        icon={ClipboardList}
        title="Answer Bank"
        description="Manage reusable answers for repeated application questions, extension autofill, and future personal fact workflows."
        actions={
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Answer
          </Button>
        }
      />

      <PageContent className="space-y-6">
        <section className="grid gap-3 md:grid-cols-3">
          <AnswerStat label="Saved answers" value={answers.length} />
          <AnswerStat label="Known sources" value={stats.sourceCount} />
          <AnswerStat label="Autofill uses" value={stats.totalUses} />
        </section>

        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-xl flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search questions, answers, or sources"
                className={cn(THEME_CONTROL_CLASSES, "w-full pl-9")}
              />
            </div>
            <span className="text-sm text-muted-foreground">
              {filteredAnswers.length} shown
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <AnswerTypeButton
              active={activeType === "all"}
              count={answers.length}
              onClick={() => setActiveType("all")}
            >
              All
            </AnswerTypeButton>
            {ANSWER_COMPONENT_TYPES.map((type) => (
              <AnswerTypeButton
                key={type}
                active={activeType === type}
                count={typeCounts[type]}
                onClick={() => setActiveType(type)}
              >
                {ANSWER_COMPONENT_LABELS[type]}
              </AnswerTypeButton>
            ))}
          </div>

          {loading ? (
            <div className="grid gap-3 lg:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : error ? (
            <ErrorState
              title="Failed to load answers"
              message={error}
              onRetry={fetchAnswers}
              variant="card"
            />
          ) : filteredAnswers.length === 0 ? (
            <StandardEmptyState
              icon={ClipboardList}
              title={query ? "No matching answers" : "Start your answer bank"}
              description={
                query
                  ? "Try a different search term."
                  : "Save common responses like work authorization, sponsorship, relocation, portfolio links, and repeated application questions."
              }
              action={
                !query ? (
                  <Button onClick={openCreateDialog}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Answer
                  </Button>
                ) : null
              }
            />
          ) : (
            <div className="grid gap-3 lg:grid-cols-2">
              {filteredAnswers.map((entry) => (
                <AnswerCard
                  key={entry.id}
                  entry={entry}
                  onCopy={copyAnswer}
                  onEdit={openEditDialog}
                  onDelete={deleteAnswer}
                />
              ))}
            </div>
          )}
        </section>
      </PageContent>

      <AnswerDialog
        open={dialogOpen}
        editing={!!editingEntry}
        form={form}
        saving={saving}
        onOpenChange={(open) => {
          if (!open) closeDialog();
          else setDialogOpen(true);
        }}
        onFormChange={updateForm}
        onSave={saveAnswer}
      />
    </AppPage>
  );
}

function AnswerStat({ label, value }: { label: string; value: number }) {
  return (
    <div className={cn(THEME_INTERACTIVE_SURFACE_CLASSES, "p-4")}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function AnswerTypeButton({
  active,
  count,
  onClick,
  children,
}: {
  active: boolean;
  count: number;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={count === 0 && !active}
      className={cn(
        "min-h-10 rounded-[var(--radius)] px-3 text-sm font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
        count === 0 && !active && "cursor-not-allowed opacity-60",
      )}
    >
      {children}
      <span
        className={cn(
          "ml-2 inline-flex min-w-5 justify-center rounded-[var(--radius)] px-1 text-xs",
          active ? "bg-primary-foreground/20" : "bg-background",
        )}
      >
        {count}
      </span>
    </button>
  );
}

function AnswerCard({
  entry,
  onCopy,
  onEdit,
  onDelete,
}: {
  entry: AnswerBankEntry;
  onCopy: (entry: AnswerBankEntry) => void;
  onEdit: (entry: AnswerBankEntry) => void;
  onDelete: (entry: AnswerBankEntry) => void;
}) {
  return (
    <article className={cn(THEME_INTERACTIVE_SURFACE_CLASSES, "p-4")}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{getAnswerSourceLabel(entry)}</Badge>
            <Badge variant="outline">
              {ANSWER_COMPONENT_LABELS[classifyAnswerComponent(entry)]}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Used {entry.timesUsed}x
            </span>
            {entry.updatedAt ? (
              <span className="text-xs text-muted-foreground">
                Updated <TimeAgo date={entry.updatedAt} />
              </span>
            ) : null}
          </div>
          <h2 className="text-base font-semibold leading-6">
            {entry.question}
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => void onCopy(entry)}
            aria-label="Copy answer"
            title="Copy answer"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(entry)}
            aria-label="Edit answer"
            title="Edit answer"
          >
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => void onDelete(entry)}
            aria-label="Delete answer"
            title="Delete answer"
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
        {entry.answer}
      </p>
    </article>
  );
}

function AnswerDialog({
  open,
  editing,
  form,
  saving,
  onOpenChange,
  onFormChange,
  onSave,
}: {
  open: boolean;
  editing: boolean;
  form: AnswerFormState;
  saving: boolean;
  onOpenChange: (open: boolean) => void;
  onFormChange: (key: keyof AnswerFormState, value: string) => void;
  onSave: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit answer" : "Add answer"}</DialogTitle>
          <DialogDescription>
            Save a reusable response for repeated application prompts.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <label className="block space-y-1">
            <span className="text-sm font-medium">Question</span>
            <input
              value={form.question}
              onChange={(event) => onFormChange("question", event.target.value)}
              className={cn(THEME_CONTROL_CLASSES, "w-full")}
              placeholder="Example: Will you now or in the future require sponsorship?"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium">Answer</span>
            <textarea
              value={form.answer}
              onChange={(event) => onFormChange("answer", event.target.value)}
              className={cn(THEME_CONTROL_CLASSES, "min-h-36 w-full resize-y")}
              placeholder="Write the answer you want reused by autofill."
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block space-y-1">
              <span className="text-sm font-medium">Source company</span>
              <input
                value={form.sourceCompany}
                onChange={(event) =>
                  onFormChange("sourceCompany", event.target.value)
                }
                className={cn(THEME_CONTROL_CLASSES, "w-full")}
                placeholder="Optional"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium">Source URL</span>
              <input
                value={form.sourceUrl}
                onChange={(event) =>
                  onFormChange("sourceUrl", event.target.value)
                }
                className={cn(THEME_CONTROL_CLASSES, "w-full")}
                placeholder="Optional"
              />
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            {editing ? "Save Changes" : "Save Answer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
