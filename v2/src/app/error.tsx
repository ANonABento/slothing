"use client";

import { AlertTriangle } from "lucide-react";

import { Button, Card } from "@/components/ui";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="grid min-h-[70vh] place-items-center p-6">
      <Card className="max-w-md space-y-3 p-6">
        <div className="inline-flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
          <AlertTriangle className="h-5 w-5 text-warn" /> Something went wrong
        </div>
        <p className="text-sm text-ink-2">Your saved data is fine. This page hit an error while loading.</p>
        <pre className="max-h-40 overflow-auto whitespace-pre-wrap rounded-control bg-page p-3 font-mono text-xs text-ink-3">{error.message}</pre>
        <Button variant="primary" onClick={reset}>Try again</Button>
      </Card>
    </div>
  );
}
