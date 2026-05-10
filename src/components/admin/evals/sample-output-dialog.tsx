"use client";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { EvalCaseRow } from "@/lib/admin/evals/types";

function OutputBlock({
  title,
  output,
  error,
}: {
  title: string;
  output: string;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">{title}</h3>
        {error ? <Badge variant="destructive">Error</Badge> : null}
      </div>
      <pre className="max-h-56 overflow-auto rounded-lg border bg-muted/40 p-3 text-xs leading-5 text-foreground">
        {error ?? output}
      </pre>
    </div>
  );
}

export function SampleOutputDialog({
  row,
  open,
  onOpenChange,
}: {
  row: EvalCaseRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>{row?.testCaseLabel ?? "Sample output"}</DialogTitle>
          <DialogDescription>
            Generator samples and judge rationale for this eval case.
          </DialogDescription>
        </DialogHeader>
        {row ? (
          <div className="grid gap-4 lg:grid-cols-2">
            <OutputBlock
              title="GPT-5.5 output"
              output={row.gpt55.output}
              error={row.gpt55.error}
            />
            <OutputBlock
              title="Claude output"
              output={row.claude.output}
              error={row.claude.error}
            />
            <div className="space-y-2 rounded-lg border bg-card p-4">
              <h3 className="text-sm font-semibold">GPT-5.5 judge notes</h3>
              <p className="text-sm leading-6 text-muted-foreground">
                {row.gpt55.reasoning}
              </p>
              <p className="text-xs text-muted-foreground">
                Strengths: {row.gpt55.strengths.join(", ")}
              </p>
              <p className="text-xs text-muted-foreground">
                Weaknesses: {row.gpt55.weaknesses.join(", ")}
              </p>
            </div>
            <div className="space-y-2 rounded-lg border bg-card p-4">
              <h3 className="text-sm font-semibold">Claude judge notes</h3>
              <p className="text-sm leading-6 text-muted-foreground">
                {row.claude.reasoning}
              </p>
              <p className="text-xs text-muted-foreground">
                Strengths: {row.claude.strengths.join(", ")}
              </p>
              <p className="text-xs text-muted-foreground">
                Weaknesses: {row.claude.weaknesses.join(", ")}
              </p>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
