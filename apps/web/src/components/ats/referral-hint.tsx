"use client";

import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface ReferralHintProps {
  className?: string;
}

/**
 * Post-scan callout: the most documented finding in the entire ATS research
 * space is that referrals convert at ~30% vs cold applications at 0.1–2%.
 * This is a gentle, dismissible-by-scroll nudge — not a popup, not a paywall.
 */
export function ReferralHint({ className }: ReferralHintProps) {
  return (
    <aside
      className={cn(
        "rounded-2xl border border-border bg-paper/60 p-5 flex gap-4 items-start",
        className,
      )}
      aria-label="Job search insight"
    >
      <div className="shrink-0 mt-0.5">
        <Sparkles className="h-5 w-5 text-primary" />
      </div>
      <div className="text-sm">
        <p className="font-semibold leading-tight text-foreground">
          One more thing — referrals convert ~30× better than cold apps.
        </p>
        <p className="mt-1 text-muted-foreground leading-relaxed">
          Once your resume is in good shape, the biggest lever in your job
          search is a warm intro. Cold online applications land an offer{" "}
          <strong>0.1–2%</strong> of the time. Referrals land at{" "}
          <strong>~30%</strong>. Spend an hour finding one human at the company
          before you spend another hour tailoring this resume.
        </p>
      </div>
    </aside>
  );
}
