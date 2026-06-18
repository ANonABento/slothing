"use client";

import { useState } from "react";
import { Loader2, Sparkles, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { aiErrorMessage } from "./ai-error";

/**
 * "Add a project from a link" (AI Bank Authoring spec §4.3). Paste a GitHub repo or project page;
 * the AI drafts a project (name + tech + bullets) grounded ONLY in the fetched source text. The
 * user reviews/edits the preview, then commits a verified project + child bullets to the bank.
 * Nothing is persisted until "Add to bank" — the draft step never writes.
 */
export interface ResearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called after the project is committed so the caller can refetch the bank. */
  onCreated?: () => void;
}

interface ProjectDraft {
  name: string;
  technologies: string[];
  bullets: string[];
}

export function ResearchDialog({
  open,
  onOpenChange,
  onCreated,
}: ResearchDialogProps) {
  const { addToast } = useToast();
  const [url, setUrl] = useState("");
  const [fetching, setFetching] = useState(false);
  const [committing, setCommitting] = useState(false);
  const [draft, setDraft] = useState<ProjectDraft | null>(null);
  const [techInput, setTechInput] = useState("");
  const [sourceTitle, setSourceTitle] = useState("");

  function reset() {
    setUrl("");
    setDraft(null);
    setTechInput("");
    setSourceTitle("");
  }

  async function handleFetch() {
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
        source?: { title?: string };
        draft?: ProjectDraft;
      };
      if (!res.ok || !data.draft) {
        throw new Error(aiErrorMessage(data, "Couldn't draft from that link."));
      }
      setDraft(data.draft);
      setTechInput((data.draft.technologies ?? []).join(", "));
      setSourceTitle(data.source?.title ?? "");
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

  function updateBullet(index: number, value: string) {
    setDraft((prev) =>
      prev
        ? {
            ...prev,
            bullets: prev.bullets.map((b, i) => (i === index ? value : b)),
          }
        : prev,
    );
  }

  function removeBullet(index: number) {
    setDraft((prev) =>
      prev
        ? { ...prev, bullets: prev.bullets.filter((_, i) => i !== index) }
        : prev,
    );
  }

  async function handleCommit() {
    if (!draft) return;
    const bullets = draft.bullets.map((b) => b.trim()).filter(Boolean);
    const name = draft.name.trim();
    if (!name || bullets.length === 0) {
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
          name,
          technologies,
          bullets,
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
        title: `Added “${name}”`,
        description: `${bullets.length} bullet${
          bullets.length === 1 ? "" : "s"
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

  const busy = fetching || committing;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add a project from a link</DialogTitle>
          <DialogDescription>
            Paste a GitHub repo or project page. The AI drafts a project from
            its README/contents using only facts found at the link — review and
            edit before saving.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="research-url" className="text-xs">
            Project URL
          </Label>
          <div className="flex gap-2">
            <Input
              id="research-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://github.com/you/project"
              disabled={busy}
            />
            <Button onClick={handleFetch} disabled={busy}>
              {fetching ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Draft
            </Button>
          </div>
        </div>

        {draft && (
          <div className="space-y-4 border-t border-rule pt-4">
            {sourceTitle && (
              <p className="text-xs text-ink-3">Source: {sourceTitle}</p>
            )}
            <div className="space-y-2">
              <Label htmlFor="research-name" className="text-xs">
                Project name
              </Label>
              <Input
                id="research-name"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                disabled={busy}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="research-tech" className="text-xs">
                Technologies (comma-separated)
              </Label>
              <Input
                id="research-tech"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                disabled={busy}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Bullets</Label>
              {draft.bullets.map((bullet, index) => (
                <div key={index} className="flex gap-2">
                  <Textarea
                    value={bullet}
                    onChange={(e) => updateBullet(index, e.target.value)}
                    className="min-h-[60px] resize-none"
                    disabled={busy}
                  />
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
              ))}
              <p className="text-xs text-ink-3">
                Only facts found at the link were used. Edit freely before
                saving.
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={busy}
          >
            Cancel
          </Button>
          {draft && (
            <Button onClick={handleCommit} disabled={busy}>
              {committing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Add to bank
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
