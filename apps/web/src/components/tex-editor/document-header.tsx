"use client";

/**
 * The editor's document bar: where you are, what this document is called, what it is,
 * and the way back.
 *
 * The editor previously opened straight into two panes with no chrome at all — no title,
 * no type, and no link back to Studio, so the only way out was the browser's back button
 * and the only way to see which document you had opened was to read the PDF.
 *
 * Metadata is deliberately handled here rather than in `useTexEditor`. Title and kind are
 * not part of the .tex source, so routing them through the source's save loop would
 * snapshot a version row every time someone fixed a typo in a name.
 */
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useErrorToast } from "@/hooks/use-error-toast";
import { Link } from "@/i18n/navigation";
import type { TexDocumentKind } from "@/lib/db/tex-documents";
import { readJsonResponse } from "@/lib/http";

const KINDS: ReadonlyArray<{ value: TexDocumentKind; label: string }> = [
  { value: "resume", label: "Resume" },
  { value: "cv", label: "CV" },
  { value: "cover_letter", label: "Cover letter" },
];

export interface DocumentHeaderProps {
  documentId: string;
  initialTitle: string;
  initialKind: TexDocumentKind;
  /** Source-save state, so one bar reports everything rather than two competing ones. */
  saving: boolean;
  dirty: boolean;
}

export function DocumentHeader({
  documentId,
  initialTitle,
  initialKind,
  saving,
  dirty,
}: DocumentHeaderProps) {
  const [title, setTitle] = useState(initialTitle);
  const [kind, setKind] = useState(initialKind);
  const [pending, setPending] = useState(false);
  const committed = useRef({ title: initialTitle, kind: initialKind });
  const showErrorToast = useErrorToast();

  // Keep the tab title honest — a renamed document should not still say "Untitled".
  useEffect(() => {
    document.title = `${title} · Slothing`;
  }, [title]);

  const patch = async (body: { title?: string; kind?: TexDocumentKind }) => {
    setPending(true);
    try {
      const response = await fetch(`/api/tex-documents/${documentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await readJsonResponse(response, "Could not save that change");
      committed.current = { ...committed.current, ...body };
    } catch (error) {
      // Revert to what the server last confirmed, so the bar never shows a value that
      // was not actually stored.
      setTitle(committed.current.title);
      setKind(committed.current.kind);
      showErrorToast(error, { title: "Could not save that change" });
    } finally {
      setPending(false);
    }
  };

  const commitTitle = () => {
    const next = title.trim();
    if (!next) {
      setTitle(committed.current.title);
      return;
    }
    if (next === committed.current.title) return;
    setTitle(next);
    void patch({ title: next });
  };

  return (
    <header className="flex min-h-12 shrink-0 flex-wrap items-center gap-2 border-b border-rule bg-paper px-3 py-2">
      <Link
        href="/studio"
        aria-label="Back to Studio"
        className="flex shrink-0 items-center gap-1.5 rounded-sm px-1.5 py-1 text-[12.5px] text-ink-3 transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Studio</span>
      </Link>

      <Input
        value={title}
        aria-label="Document name"
        maxLength={200}
        onChange={(event) => setTitle(event.target.value)}
        onBlur={commitTitle}
        onKeyDown={(event) => {
          if (event.key === "Enter") event.currentTarget.blur();
          if (event.key === "Escape") {
            setTitle(committed.current.title);
            event.currentTarget.blur();
          }
        }}
        className="h-8 min-w-0 max-w-xs flex-1 border-transparent bg-transparent px-2 text-[14px] font-semibold hover:border-input focus:border-input"
      />

      <Select
        value={kind}
        onValueChange={(next) => {
          const value = next as TexDocumentKind;
          setKind(value);
          void patch({ kind: value });
        }}
      >
        <SelectTrigger aria-label="Document type" className="h-8 w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {KINDS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <span
        className="ml-auto flex items-center gap-1.5 text-[11.5px] text-ink-3"
        aria-live="polite"
      >
        {saving || pending ? (
          <>
            <Loader2 className="h-3 w-3 animate-spin" />
            Saving
          </>
        ) : dirty ? (
          "Unsaved changes"
        ) : (
          <>
            <Check className="h-3 w-3" />
            Saved
          </>
        )}
      </span>
    </header>
  );
}
