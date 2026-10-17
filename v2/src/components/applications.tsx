import { ChevronRight, FileText, Send } from "lucide-react";

import { hostOf } from "@/lib/format";
import type { Application } from "@/lib/types";
import { FollowUpLine } from "./follow-ups";
import { Card, CardTitle } from "./ui";

const when = (iso: string) => new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(iso));

/** What you sent for this job: recorded when you submit a form the extension filled, or mark it applied. */
export function Applications({ jobId, items, followUpAt }: { jobId: string; items: Application[]; followUpAt: string | null }) {
  if (!items.length && !followUpAt) return null;
  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center gap-2">
        <Send className="h-4 w-4 text-ink-3" />
        <CardTitle>Applied</CardTitle>
        {followUpAt && <FollowUpLine jobId={jobId} at={followUpAt} />}
      </div>
      <ul className="space-y-3">
        {items.map((a) => (
          <li key={a.id} className="rounded-control border border-rule bg-page px-4 py-3">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              <span className="font-medium">{when(a.submittedAt)}</span>
              {a.url && (
                <a href={a.url} target="_blank" rel="noreferrer" className="text-brand hover:underline">
                  {hostOf(a.url)}
                </a>
              )}
              {a.resumeVersion && (
                <a href={`/api/pdf?kind=resume&job=${jobId}&ver=${a.resumeVersion}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-ink-2 hover:text-ink">
                  <FileText className="h-3.5 w-3.5" /> Resume sent
                </a>
              )}
              {a.letterVersion && (
                <a href={`/api/pdf?kind=letter&job=${jobId}&ver=${a.letterVersion}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-ink-2 hover:text-ink">
                  <FileText className="h-3.5 w-3.5" /> Letter sent
                </a>
              )}
            </div>
            {a.answers.length > 0 && (
              <details className="group mt-2">
                <summary className="flex cursor-pointer list-none items-center gap-1 text-xs text-ink-3 hover:text-ink">
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-open:rotate-90" />
                  {a.answers.length} answers on the form
                </summary>
                <dl className="mt-2 space-y-2 pl-5">
                  {a.answers.map((x, i) => (
                    <div key={i}>
                      <dt className="text-xs font-medium text-ink">{x.question}</dt>
                      <dd className="whitespace-pre-line text-sm text-ink-2">{x.answer}</dd>
                    </div>
                  ))}
                </dl>
              </details>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}
