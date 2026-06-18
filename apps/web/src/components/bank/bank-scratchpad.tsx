"use client";

import { useState } from "react";
import { Loader2, Sparkles, X } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetBody,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { aiErrorMessage } from "./ai-error";

/**
 * Bank scratchpad (AI Bank Authoring spec §4.4) — iterative, pair-writing project authoring from a
 * URL. The AI drafts a project grounded ONLY in the fetched source; the user edits inline, revises
 * each bullet with one-click presets (each revision re-grounded against the same source), and
 * commits a verified project + child bullets. Nothing persists until "Add to bank".
 */
export interface BankScratchpadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}

/** A bullet's grounding state, surfaced as a badge. */
type BulletState = "grounded" | "edited" | "flagged";
interface ScratchBullet {
  text: string;
  state: BulletState;
}

const REVISE_PRESETS: { key: string; label: string }[] = [
  { key: "shorter", label: "Shorter" },
  { key: "impact", label: "More impact" },
  { key: "metric", label: "Add metric" },
  { key: "rephrase", label: "Rephrase" },
];

const SOFT_CAP = 240;

const STATE_BADGE: Record<
  BulletState,
  { variant: "success" | "outline" | "warning"; label: string }
> = {
  grounded: { variant: "success", label: "Grounded" },
  edited: { variant: "outline", label: "Edited" },
  flagged: { variant: "warning", label: "Unverified" },
};

export function BankScratchpad({
  open,
  onOpenChange,
  onCreated,
}: BankScratchpadProps) {
  const { addToast } = useToast();
  const [url, setUrl] = useState("");
  const [fetching, setFetching] = useState(false);
  const [committing, setCommitting] = useState(false);
  const [revisingIndex, setRevisingIndex] = useState<number | null>(null);

  const [evidence, setEvidence] = useState("");
  const [sourceTitle, setSourceTitle] = useState("");
  const [drafted, setDrafted] = useState(false);
  const [name, setName] = useState("");
  const [techInput, setTechInput] = useState("");
  const [bullets, setBullets] = useState<ScratchBullet[]>([]);

  function reset() {
    setUrl("");
    setEvidence("");
    setSourceTitle("");
    setDrafted(false);
    setName("");
    setTechInput("");
    setBullets([]);
    setRevisingIndex(null);
  }

  const busy = fetching || committing || revisingIndex !== null;

  async function handleDraft() {
    const trimmed = url.trim();
    if (!trimmed) {
      addToast({ type: "warning", title: "Paste a link first" });
      return;
    }
    setFetching(true);
    try {
      const res = await fetch("/api/bank/ai/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        code?: string;
        source?: { title?: string; text?: string };
        draft?: { name: string; technologies: string[]; bullets: string[] };
      };
      if (!res.ok || !data.draft) {
        throw new Error(aiErrorMessage(data, "Couldn't draft from that link."));
      }
      setName(data.draft.name);
      setTechInput((data.draft.technologies ?? []).join(", "));
      setBullets(
        data.draft.bullets.map((text) => ({ text, state: "grounded" })),
      );
      setEvidence(data.source?.text ?? "");
      setSourceTitle(data.source?.title ?? "");
      setDrafted(true);
    } catch (err) {
      addToast({
        type: "error",
        title: "Couldn't draft from that link",
        description: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setFetching(false);
    }
  }

  function editBullet(index: number, text: string) {
    setBullets((prev) =>
      prev.map((b, i) => (i === index ? { text, state: "edited" } : b)),
    );
  }

  function removeBullet(index: number) {
    setBullets((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleRevise(index: number, preset: string) {
    if (!evidence) {
      addToast({
        type: "warning",
        title: "No source to revise against",
        description: "Revisions stay grounded in the fetched source text.",
      });
      return;
    }
    setRevisingIndex(index);
    try {
      const res = await fetch("/api/bank/ai/revise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bullet: bullets[index].text,
          evidence,
          preset,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        code?: string;
        bullet?: string;
        applied?: boolean;
      };
      if (!res.ok || typeof data.bullet !== "string") {
        throw new Error(aiErrorMessage(data, "Couldn't revise that bullet."));
      }
      const applied = data.applied === true;
      setBullets((prev) =>
        prev.map((b, i) =>
          i === index
            ? {
                text: data.bullet as string,
                state: applied ? "grounded" : "flagged",
              }
            : b,
        ),
      );
      if (!applied) {
        addToast({
          type: "warning",
          title: "Kept your bullet",
          description: "The revision added detail not supported by the source.",
        });
      }
    } catch (err) {
      addToast({
        type: "error",
        title: "Revise failed",
        description: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setRevisingIndex(null);
    }
  }

  async function handleCommit() {
    const cleanBullets = bullets.map((b) => b.text.trim()).filter(Boolean);
    const trimmedName = name.trim();
    if (!trimmedName || cleanBullets.length === 0) {
      addToast({
        type: "warning",
        title: "Need a name and at least one bullet",
      });
      return;
    }
    const technologies = techInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    setCommitting(true);
    try {
      const res = await fetch("/api/bank/from-source", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: url.trim() || undefined,
          name: trimmedName,
          technologies,
          bullets: cleanBullets,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        code?: string;
      };
      if (!res.ok) {
        throw new Error(aiErrorMessage(data, "Couldn't save to your bank."));
      }
      addToast({
        type: "success",
        title: `Added “${trimmedName}”`,
        description: `${cleanBullets.length} bullet${
          cleanBullets.length === 1 ? "" : "s"
        } saved to your bank.`,
      });
      reset();
      onOpenChange(false);
      onCreated?.();
    } catch (err) {
      addToast({
        type: "error",
        title: "Couldn't add the project",
        description: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setCommitting(false);
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 sm:max-w-2xl"
      >
        <SheetHeader>
          <SheetTitle>Project scratchpad</SheetTitle>
          <SheetDescription>
            Paste a GitHub repo or project page. The AI drafts grounded bullets
            from its contents — edit, revise, then save. Bullets can only assert
            what the source supports.
          </SheetDescription>
        </SheetHeader>

        <SheetBody className="flex-1 space-y-5 overflow-y-auto">
          <div className="space-y-2">
            <Label htmlFor="scratch-url" className="text-xs">
              Project URL
            </Label>
            <div className="flex gap-2">
              <Input
                id="scratch-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://github.com/you/project"
                disabled={busy}
              />
              <Button onClick={handleDraft} disabled={busy}>
                {fetching ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Draft
              </Button>
            </div>
            {sourceTitle && (
              <p className="text-xs text-ink-3">Source: {sourceTitle}</p>
            )}
          </div>

          {drafted && (
            <>
              <div className="space-y-2">
                <Label htmlFor="scratch-name" className="text-xs">
                  Project name
                </Label>
                <Input
                  id="scratch-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={busy}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scratch-tech" className="text-xs">
                  Technologies (comma-separated)
                </Label>
                <Input
                  id="scratch-tech"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  disabled={busy}
                />
              </div>

              <div className="space-y-3">
                <Label className="text-xs">Bullets</Label>
                {bullets.map((bullet, index) => {
                  const over = bullet.text.length > SOFT_CAP;
                  const badge = STATE_BADGE[bullet.state];
                  const reviseBusy = revisingIndex === index;
                  return (
                    <div
                      key={index}
                      className="space-y-2 rounded-md border border-rule bg-paper p-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant={badge.variant}>{badge.label}</Badge>
                        <div className="flex items-center gap-2">
                          <span
                            className={
                              over
                                ? "font-mono text-xs text-warning"
                                : "font-mono text-xs text-ink-3"
                            }
                          >
                            {bullet.text.length}/{SOFT_CAP}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeBullet(index)}
                            disabled={busy}
                            aria-label="Remove bullet"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Textarea
                        value={bullet.text}
                        onChange={(e) => editBullet(index, e.target.value)}
                        className="min-h-[64px] resize-none"
                        disabled={busy}
                      />
                      <div className="flex flex-wrap items-center gap-1.5">
                        {reviseBusy ? (
                          <span className="flex items-center text-xs text-ink-3">
                            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                            Revising…
                          </span>
                        ) : (
                          REVISE_PRESETS.map((preset) => (
                            <Button
                              key={preset.key}
                              variant="outline"
                              size="sm"
                              onClick={() => handleRevise(index, preset.key)}
                              disabled={busy}
                            >
                              {preset.label}
                            </Button>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
                <p className="text-xs text-ink-3">
                  Revisions stay grounded in the source — one that adds an
                  unsupported fact is rejected and your bullet is kept.
                </p>
              </div>
            </>
          )}
        </SheetBody>

        <SheetFooter>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={busy}
          >
            Cancel
          </Button>
          {drafted && (
            <Button onClick={handleCommit} disabled={busy}>
              {committing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Add to bank
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
