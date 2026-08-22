"use client";

/**
 * "New document" — one dialog that answers both questions the old two-button bar left
 * unanswered: what kind of document is this, and where does its content come from.
 *
 * The old bar offered exactly one path ("New resume from my bank"), which failed outright
 * on an empty bank and could not produce a CV or a cover letter at all.
 */
import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { TexDocumentKind } from "@/lib/db/tex-documents";
import { cn } from "@/lib/utils";

import { KIND_OPTIONS } from "./types";

export type NewDocumentSource = "starter" | "bank";

export interface NewDocumentDialogProps {
  open: boolean;
  busy: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (input: {
    kind: TexDocumentKind;
    source: NewDocumentSource;
    title: string;
  }) => void;
}

export function NewDocumentDialog({
  open,
  busy,
  onOpenChange,
  onCreate,
}: NewDocumentDialogProps) {
  const [kind, setKind] = useState<TexDocumentKind>("resume");
  const [source, setSource] = useState<NewDocumentSource>("bank");
  const [title, setTitle] = useState("");

  // A cover letter is prose about one specific job; the bank holds resume content, so
  // there is nothing to assemble one from. Rather than offer a path that always fails,
  // the choice collapses.
  const bankAvailable = kind !== "cover_letter";
  const effectiveSource: NewDocumentSource = bankAvailable ? source : "starter";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New document</DialogTitle>
          <DialogDescription>
            You can change any of this later.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <fieldset>
            <legend className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">
              Type
            </legend>
            <div className="grid gap-2 sm:grid-cols-3">
              {KIND_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={kind === option.value}
                  onClick={() => setKind(option.value)}
                  className={cn(
                    "rounded-md border p-3 text-left transition-colors",
                    kind === option.value
                      ? "border-brand bg-brand-soft"
                      : "border-rule hover:border-brand",
                  )}
                >
                  <span className="block text-[13px] font-semibold text-ink">
                    {option.label}
                  </span>
                  <span className="mt-0.5 block text-[11.5px] leading-snug text-ink-3">
                    {option.hint}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">
              Start from
            </legend>
            <div className="grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                disabled={!bankAvailable}
                aria-pressed={effectiveSource === "bank"}
                onClick={() => setSource("bank")}
                className={cn(
                  "rounded-md border p-3 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                  effectiveSource === "bank"
                    ? "border-brand bg-brand-soft"
                    : "border-rule hover:border-brand disabled:hover:border-rule",
                )}
              >
                <span className="block text-[13px] font-semibold text-ink">
                  My knowledge bank
                </span>
                <span className="mt-0.5 block text-[11.5px] leading-snug text-ink-3">
                  {bankAvailable
                    ? "Fills in the experience you have already saved."
                    : "Not available for a cover letter."}
                </span>
              </button>
              <button
                type="button"
                aria-pressed={effectiveSource === "starter"}
                onClick={() => setSource("starter")}
                className={cn(
                  "rounded-md border p-3 text-left transition-colors",
                  effectiveSource === "starter"
                    ? "border-brand bg-brand-soft"
                    : "border-rule hover:border-brand",
                )}
              >
                <span className="block text-[13px] font-semibold text-ink">
                  A blank starter
                </span>
                <span className="mt-0.5 block text-[11.5px] leading-snug text-ink-3">
                  Headings and placeholders you overwrite.
                </span>
              </button>
            </div>
          </fieldset>

          <label className="block">
            <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">
              Name (optional)
            </span>
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Untitled"
              maxLength={200}
            />
          </label>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={busy}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={busy}
            onClick={() =>
              onCreate({ kind, source: effectiveSource, title: title.trim() })
            }
          >
            {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
