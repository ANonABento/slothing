"use client";

/**
 * Confirming an upload before it becomes a document.
 *
 * Import used to create everything as a resume, silently. It now reads the file in the
 * browser, guesses what it is, and SHOWS the guess with its reasoning — so a cover letter
 * arrives labelled as one, and a wrong guess costs one click to correct rather than a trip
 * back through the list afterwards.
 */
import { Loader2, Upload } from "lucide-react";

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
import type { KindGuess } from "@/lib/latex/detect-kind";

import { KindSelect } from "./kind-select";

export interface PendingImport {
  file: File;
  source: string;
  guess: KindGuess;
  kind: TexDocumentKind;
  title: string;
}

export function ImportDialog({
  pending,
  busy,
  onChange,
  onCancel,
  onConfirm,
}: {
  pending: PendingImport | null;
  busy: boolean;
  onChange: (next: PendingImport) => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog
      open={pending !== null}
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add this file</DialogTitle>
          <DialogDescription>
            It will render exactly as it does today — nothing is restyled or
            rewritten.
          </DialogDescription>
        </DialogHeader>

        {pending ? (
          <div className="space-y-4">
            <p className="truncate rounded-md border border-rule bg-page-2 px-3 py-2 font-mono text-[12px] text-ink-2">
              {pending.file.name}
            </p>

            <label className="block">
              <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">
                Name
              </span>
              <Input
                value={pending.title}
                maxLength={200}
                onChange={(event) =>
                  onChange({ ...pending, title: event.target.value })
                }
              />
            </label>

            <div className="space-y-1.5">
              <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">
                Type
              </span>
              <KindSelect
                value={pending.kind}
                onChange={(kind) => onChange({ ...pending, kind })}
                className="w-full"
              />
              <p className="text-[11.5px] leading-snug text-ink-3">
                {pending.kind === pending.guess.kind
                  ? pending.guess.reason
                  : "Set by you."}
              </p>
            </div>
          </div>
        ) : null}

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={busy}
          >
            Cancel
          </Button>
          <Button type="button" onClick={onConfirm} disabled={busy}>
            {busy ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Add document
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
