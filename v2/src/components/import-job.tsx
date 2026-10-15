"use client";

import { Link2, Loader2 } from "lucide-react";
import { useActionState } from "react";

import { importJobAction } from "@/app/actions";
import { Button, Card, Input } from "./ui";

/** Paste a posting's link; the server reads it and opens the new job. */
export function ImportJob() {
  const [state, action, pending] = useActionState(importJobAction, null);
  return (
    <Card className="px-5 py-4">
      <form action={action} className="flex flex-wrap items-center gap-2">
        <Link2 className="h-4 w-4 shrink-0 text-ink-3" />
        <Input name="url" aria-label="Job posting link" placeholder="Paste a job posting link: Greenhouse, Lever, Ashby, LinkedIn, most career sites" className="min-w-0 flex-1" required disabled={pending} />
        <Button variant="primary" disabled={pending}>
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}
          {pending ? "Reading the posting…" : "Import"}
        </Button>
      </form>
      {state && !state.ok && <p className="mt-2 text-sm text-warn">{state.error}</p>}
    </Card>
  );
}
