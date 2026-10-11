"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { AlertTriangle, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useA11yTranslations } from "@/lib/i18n/use-a11y-translations";

export type SourceCardState = "loading" | "has-data" | "no-data" | "error";

interface SourceCardProps {
  title: string;
  icon: LucideIcon;
  state: SourceCardState;
  errorMessage?: string;
  onRetry?: () => void;
  headerAction?: ReactNode;
  children?: ReactNode;
}

export function SourceCard({
  title,
  icon: Icon,
  state,
  errorMessage,
  onRetry,
  headerAction,
  children,
}: SourceCardProps) {
  const StatusIcon = statusIconByState[state];

  return (
    <section className="flex min-h-[16rem] flex-col rounded-lg border bg-card shadow-sm">
      <div className="flex items-start justify-between gap-3 border-b bg-primary/5 p-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="rounded-md bg-primary/10 p-2 text-primary">
            <Icon className="h-4 w-4" />
          </div>
          <h3 className="truncate text-sm font-semibold">{title}</h3>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {headerAction}
          <StatusIcon
            className={cn(
              "h-4 w-4",
              state === "loading" && "animate-spin text-primary",
              state === "has-data" && "text-success",
              state === "no-data" && "text-warning",
              state === "error" && "text-destructive",
            )}
            aria-label={state.replace("-", " ")}
          />
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {state === "loading" ? <LoadingBody /> : state !== "error" && children}
        {state === "no-data" && !children && <EmptyBody />}
        {state === "error" && (
          <div className="space-y-3 text-sm">
            <p className="text-muted-foreground">
              {errorMessage ?? `Couldn't reach ${title}.`}
            </p>
            {onRetry && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onRetry}
              >
                Retry
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function LoadingBody() {
  const a11yT = useA11yTranslations();

  return (
    <div className="space-y-3" aria-label={a11yT("loadingSource")}>
      <div className="h-4 w-3/4 rounded bg-muted" />
      <div className="h-4 w-full rounded bg-muted" />
      <div className="h-4 w-2/3 rounded bg-muted" />
    </div>
  );
}

function EmptyBody() {
  return <p className="text-sm text-muted-foreground">No data found.</p>;
}

const statusIconByState: Record<SourceCardState, LucideIcon> = {
  loading: Loader2,
  "has-data": CheckCircle2,
  "no-data": AlertTriangle,
  error: XCircle,
};
