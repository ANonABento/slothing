"use client";

/**
 * `<LayoutBuilderModal>` — centered `<Dialog>` wrapper around the
 * layout builder, used from the review-queue toolbar. Persists changes
 * via PATCH /api/preferences/opportunities with a 300ms debounce.
 *
 * P1 of docs/bento-builder-modal-redesign-spec.md collapses the old
 * two-pane editor/preview split into a single surface with a
 * `Customize | Preview` toggle in the header. Customize renders the
 * builder; Preview renders <BentoGrid> against the live draft so users
 * see exactly what ships. The builder also receives `mode` so internal
 * affordances can react in later phases (P2/P3).
 */
import { useCallback, useEffect, useRef, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useErrorToast } from "@/hooks/use-error-toast";
import { readJsonResponse } from "@/lib/http";
import {
  DEFAULT_BENTO_LAYOUT,
  getEffectiveBentoLayout,
} from "@/lib/opportunities/default-bento";
import type { BentoLayoutPreference } from "@/lib/opportunities/bento-layout";
import { cn } from "@/lib/utils";

import { BentoLayoutBuilder } from "./bento-layout-builder";
import { BentoGrid } from "./bento-grid";
import { LAYOUT_PREVIEW_OPPORTUNITY } from "@/lib/opportunities/layout-preview-fixture";

const DEBOUNCE_MS = 300;

export type BuilderMode = "customize" | "preview";

const MODES: { id: BuilderMode; label: string }[] = [
  { id: "customize", label: "Customize" },
  { id: "preview", label: "Preview" },
];

interface LayoutBuilderModalProps {
  open: boolean;
  onOpenChange(open: boolean): void;
  /**
   * Current stored layout (raw — could be bento, legacy F.1, or null).
   * `getEffectiveBentoLayout` normalises it before the builder mounts.
   */
  value: unknown;
  /** Called on every successful persist so the page can re-render the live card. */
  onPersisted(next: BentoLayoutPreference): void;
}

export function LayoutBuilderModal({
  open,
  onOpenChange,
  value,
  onPersisted,
}: LayoutBuilderModalProps) {
  const showErrorToast = useErrorToast();
  // Local draft so dragging doesn't fire a PATCH per move. The debounce
  // below flushes after the user stops interacting.
  const [draft, setDraft] = useState<BentoLayoutPreference>(() =>
    getEffectiveBentoLayout(value ?? DEFAULT_BENTO_LAYOUT),
  );
  const [mode, setMode] = useState<BuilderMode>("customize");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync external value into draft when the modal (re)opens, so a fresh
  // open always starts from the persisted state. Also reset mode so the
  // next open lands on Customize (the editing default).
  useEffect(() => {
    if (open) {
      setDraft(getEffectiveBentoLayout(value ?? DEFAULT_BENTO_LAYOUT));
      setMode("customize");
    }
  }, [open, value]);

  const persist = useCallback(
    async (next: BentoLayoutPreference) => {
      try {
        const response = await fetch("/api/preferences/opportunities", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ layoutPreference: next }),
        });
        await readJsonResponse(response, "Failed to save layout");
        onPersisted(next);
      } catch (error) {
        showErrorToast(error, {
          title: "Couldn't save card layout",
          fallbackDescription: "Your changes will retry on the next edit.",
        });
      }
    },
    [onPersisted, showErrorToast],
  );

  const handleChange = (next: BentoLayoutPreference) => {
    setDraft(next);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      void persist(next);
    }, DEBOUNCE_MS);
  };

  // Flush any pending save when the modal closes — the user expects
  // their last edit to stick even if they close mid-debounce.
  useEffect(() => {
    if (open) return;
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
      void persist(draft);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Static preview context so BentoGrid can render the fixture without
  // wiring real callbacks. Mirrors what was previously in the right-
  // side aside.
  const previewContext = {
    preview:
      LAYOUT_PREVIEW_OPPORTUNITY.summary.slice(0, 260) +
      (LAYOUT_PREVIEW_OPPORTUNITY.summary.length > 260 ? "…" : ""),
    expanded: false,
    setExpanded: () => undefined,
    tags: LAYOUT_PREVIEW_OPPORTUNITY.tags ?? [],
    payDisplayUnit: "annual" as const,
    payDisplayCurrency: "USD",
    onAction: () => undefined,
    actionDisabled: false,
    canApply: true,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[min(95vw,1200px)] !max-w-none">
        <DialogHeader>
          <DialogTitle>Customise layout card</DialogTitle>
          <DialogDescription>
            {mode === "customize"
              ? "Rearrange cells, drag chunks between them, set tones. Hit Preview to see the result clean."
              : "How the review card will render. Click Customize to edit."}
          </DialogDescription>
        </DialogHeader>
        {/* Mode toggle — the spec's one-surface frame. Customize default;
            Preview swaps the canvas for <BentoGrid> so users see exactly
            what ships. Toggle uses the same aria-pressed pattern as the
            builder's Desktop/Mobile tabs for keyboard parity. */}
        <div className="flex items-center justify-between gap-3 border-b pb-3">
          <div
            role="group"
            aria-label="Builder mode"
            className="inline-flex rounded-md border bg-card p-0.5"
          >
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id)}
                className={cn(
                  "rounded px-3 py-1 text-xs font-medium transition-colors",
                  mode === m.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted",
                )}
                aria-pressed={mode === m.id}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
        {/* Single column. Customize → editor. Preview → BentoGrid against
            the same draft, framed like the shipped review card so the
            user's "what does this look like?" question has one answer. */}
        <div className="min-w-0 max-h-[78vh] overflow-y-auto pr-3">
          {mode === "customize" ? (
            <BentoLayoutBuilder
              value={draft}
              onChange={handleChange}
              mode={mode}
            />
          ) : (
            <div
              data-testid="layout-builder-preview"
              className="rounded-lg border bg-card p-4 shadow-sm"
            >
              <BentoGrid
                layout={draft.desktop}
                mobileExpandedCount={draft.mobile.expandedCount}
                device="desktop"
                opportunity={LAYOUT_PREVIEW_OPPORTUNITY}
                context={previewContext}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
