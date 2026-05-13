"use client";

import { Building2 } from "lucide-react";
import type { PlatformInfo } from "@/lib/ats/platform-detection";
import { cn } from "@/lib/utils";

interface PlatformCardProps {
  info: PlatformInfo;
  className?: string;
}

/**
 * Surfaces the detected ATS platform plus platform-specific recommendations
 * once the user has supplied a JD URL. Distinguishes Slothing from generic
 * scanners that ignore the destination platform.
 */
export function PlatformCard({ info, className }: PlatformCardProps) {
  return (
    <section
      className={cn(
        "rounded-lg border border-primary/30 bg-primary/5 p-4",
        className,
      )}
      aria-labelledby="platform-card-heading"
    >
      <div className="flex items-start gap-3">
        <Building2 className="h-5 w-5 mt-0.5 text-primary shrink-0" />
        <div className="min-w-0 flex-1">
          <h3
            id="platform-card-heading"
            className="text-sm font-semibold leading-tight"
          >
            Detected ATS: {info.label}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            {info.brief}
          </p>
          <ul className="mt-3 space-y-1.5 list-disc list-outside ml-5 text-xs leading-relaxed text-foreground/85">
            {info.recommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
