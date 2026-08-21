"use client";

/**
 * The field editor.
 *
 * A `plain` field edits as plain text and is re-escaped on write. A `rich` field — one
 * whose stored LaTeX does NOT round-trip through the escaper — is never shown as its lossy
 * plain projection, because editing that projection and writing it back would silently
 * destroy the formatting. Rich fields edit as LaTeX, validated against the inline subset,
 * or can be deliberately flattened behind a confirmation.
 */
import { useEffect, useState } from "react";
import { AlertTriangle, Code2, Eraser } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useConfirmDialog } from "@/components/ui/confirm-dialog";
import type { FieldDescriptor } from "@/lib/latex/document-model";
import { flattenToPlain } from "@/lib/latex/field-edit";
import { latexToPlainText, type InlineViolation } from "@/lib/latex/inline";
import type { FieldWrite } from "@/lib/latex/field-edit";
import { cn } from "@/lib/utils";

export interface FieldEditorProps {
  spanId: string;
  field: FieldDescriptor;
  violations: InlineViolation[];
  onChange: (write: FieldWrite) => boolean;
  onCommit: () => void;
  autoFocus?: boolean;
}

function describeViolation(violation: InlineViolation): string {
  switch (violation.kind) {
    case "disallowed-macro":
      return `\\${violation.macro} is not allowed here.`;
    case "unbalanced-braces":
      return "Braces are unbalanced.";
    case "unsafe-url":
      return `Links must be http(s) or mailto — got "${violation.url}".`;
    default:
      return "That value is not valid.";
  }
}

export function FieldEditor({
  spanId,
  field,
  violations,
  onChange,
  onCommit,
  autoFocus,
}: FieldEditorProps) {
  const [draft, setDraft] = useState(field.display);
  const [rawMode, setRawMode] = useState(false);
  const { confirm, dialog } = useConfirmDialog();

  // Re-sync when the selection moves or the value changes underneath us.
  useEffect(() => {
    setDraft(field.display);
    setRawMode(false);
  }, [spanId, field.index, field.display]);

  const isRich = field.mode === "rich";
  const editingLatex = isRich && rawMode;
  const inputId = `field-${spanId}-${field.index}`;

  const commitDraft = (value: string) => {
    onChange(
      editingLatex || isRich
        ? { kind: "latex", latex: value }
        : { kind: "plain", text: value },
    );
  };

  const handleFlatten = async () => {
    const preview = latexToPlainText(field.raw);
    const confirmed = await confirm({
      title: "Remove formatting from this field?",
      description: `Bold, italic, and link formatting will be removed.\n\nBefore: ${field.raw}\nAfter: ${preview}`,
      confirmLabel: "Remove formatting",
    });
    if (!confirmed) return;
    onChange({ kind: "latex", latex: flattenToPlain(field.raw) });
    onCommit();
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label
          htmlFor={inputId}
          className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3"
        >
          {field.label}
        </label>
        {isRich ? (
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand">
            Contains formatting
          </span>
        ) : null}
      </div>

      <textarea
        id={inputId}
        value={draft}
        autoFocus={autoFocus}
        rows={isRich ? 4 : 3}
        spellCheck={!isRich}
        readOnly={isRich && !rawMode}
        onChange={(event) => {
          setDraft(event.target.value);
          if (!isRich || rawMode) commitDraft(event.target.value);
        }}
        onBlur={onCommit}
        className={cn(
          "w-full rounded-md border border-rule bg-paper px-3 py-2 text-[13.5px] leading-relaxed text-ink",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
          isRich && !rawMode && "cursor-default text-ink-2",
          editingLatex && "font-mono text-[12.5px]",
          violations.length > 0 && "border-destructive",
        )}
      />

      {violations.length > 0 ? (
        <ul className="space-y-1" role="alert">
          {violations.map((violation, index) => (
            <li
              key={index}
              className="flex items-start gap-1.5 text-[12px] text-destructive"
            >
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {describeViolation(violation)}
            </li>
          ))}
        </ul>
      ) : null}

      {isRich ? (
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setRawMode((current) => !current)}
          >
            <Code2 className="mr-1.5 h-3.5 w-3.5" />
            {rawMode ? "Done editing LaTeX" : "Edit as LaTeX"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => void handleFlatten()}
          >
            <Eraser className="mr-1.5 h-3.5 w-3.5" />
            Remove formatting
          </Button>
        </div>
      ) : null}

      {dialog}
    </div>
  );
}
