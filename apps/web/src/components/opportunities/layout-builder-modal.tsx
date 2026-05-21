"use client";

/**
 * `<LayoutBuilderModal>` — nearly full-screen `<Dialog>` wrapping the
 * layout builder, used from the review-queue toolbar. Persists changes
 * via PATCH /api/preferences/opportunities with a 300ms debounce.
 *
 * v2 (2026-05-20) drops the Customize/Preview toggle. The canvas
 * already renders real chunks against LAYOUT_PREVIEW_OPPORTUNITY — it
 * IS the preview. A separate Preview mode was redundant. Modal grows
 * to ~98vw × 96vh so the bento example has room to breathe.
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

import { BentoLayoutBuilder } from "./bento-layout-builder";

const DEBOUNCE_MS = 300;

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
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync external value into draft when the modal (re)opens, so a fresh
  // open always starts from the persisted state.
  useEffect(() => {
    if (open) {
      setDraft(getEffectiveBentoLayout(value ?? DEFAULT_BENTO_LAYOUT));
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* v2 sizing: near-full-screen so the bento example has room to
          breathe and users feel they're in a real editor, not a small
          dialog. Flex column so the canvas scroll region can flex. */}
      <DialogContent className="!flex !h-[min(96vh,1000px)] !w-[min(98vw,1700px)] !max-w-none flex-col">
        <DialogHeader>
          <DialogTitle>Customise layout card</DialogTitle>
          <DialogDescription>
            Edit the card directly — the example below shows how it will render
            on the review queue. Drag cells to move, drag edges to resize, drop
            chunks between cells.
          </DialogDescription>
        </DialogHeader>
        {/* Single scroll region for the editor body. Flex-1 so it fills
            the remaining modal height after the header. */}
        <div className="min-w-0 flex-1 overflow-y-auto pr-3">
          <BentoLayoutBuilder value={draft} onChange={handleChange} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
