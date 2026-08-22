"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";

/**
 * "Draft with AI" (AI Bank Authoring spec §4.2 — Articulate). The user types their own raw
 * material; the AI turns it into grounded bullets that land as UNVERIFIED drafts to confirm.
 * AI never originates facts — it only phrases what the user wrote, so a fabricated number or
 * unsupported claim is dropped server-side (which can yield a 422 "add more detail").
 */
export interface ArticulateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called after drafts are created so the caller can refetch the bank. */
  onCreated?: () => void;
}

export function ArticulateDialog({
  open,
  onOpenChange,
  onCreated,
}: ArticulateDialogProps) {
  const { addToast } = useToast();
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit() {
    if (notes.trim().length < 10) {
      addToast({
        type: "warning",
        title: "Add a little more detail",
        description: "A sentence or two about what you did works best.",
      });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/bank/ai/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "articulate", rawText: notes }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        bullets?: string[];
      };
      if (!res.ok) {
        throw new Error(
          data?.error ?? "Couldn't draft from your notes — add more detail.",
        );
      }
      const count = data.bullets?.length ?? 0;
      addToast({
        type: "success",
        title: `Drafted ${count} bullet${count === 1 ? "" : "s"}`,
        description: "Review the unverified drafts, then Confirm to keep them.",
      });
      setNotes("");
      onOpenChange(false);
      onCreated?.();
    } catch (err) {
      addToast({
        type: "error",
        title: "Draft failed",
        description: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setNotes("");
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Draft bullets with AI</DialogTitle>
          <DialogDescription>
            Tell us what you did in your own words — the AI turns it into strong
            resume bullets using only the facts you provide. Drafts are saved
            unverified; confirm the ones you want to keep.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="articulate-notes" className="text-xs">
            Your notes
          </Label>
          <Textarea
            id="articulate-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. set up the kubernetes cluster and cut our nightly build from 22 minutes to 7, onboarded 3 new hires"
            className="min-h-[140px] resize-none"
          />
          <p className="text-xs text-ink-3">
            The AI won&apos;t invent numbers, tools, or employers — only what
            you write here.
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={busy}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={busy}>
            {busy ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Draft with AI
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
