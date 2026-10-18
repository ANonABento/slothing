"use client";

import { BellRing, Check, Copy } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";

import { followUpAction, updateJobAction, type Result } from "@/app/actions";
import { ago } from "@/lib/format";
import { followUpNote } from "@/lib/follow-up";
import { safe } from "@/lib/safe";
import type { Job, JobStatus } from "@/lib/types";
import { Dropdown } from "./dropdown";
import { Button, Card, Eyebrow } from "./ui";

/** Applied jobs that have been quiet a week: copy a follow-up note, then say what happened. */
export function FollowUps({ jobs, name }: { jobs: Job[]; name: string }) {
  if (!jobs.length) return null;
  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center gap-2">
        <BellRing className="h-4 w-4 text-brand" />
        <Eyebrow>Follow up · {jobs.length}</Eyebrow>
      </div>
      <ul className="divide-y divide-rule">
        {jobs.map((j) => (
          <FollowUpRow key={j.id} job={j} name={name} />
        ))}
      </ul>
    </Card>
  );
}

const REPLIES: { value: JobStatus; label: string }[] = [
  { value: "interviewing", label: "Interviewing" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
  { value: "archived", label: "No longer interested" },
];

function FollowUpRow({ job, name }: { job: Job; name: string }) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const run = (fn: () => Promise<Result>) =>
    start(async () => {
      setError("");
      const res = await safe(fn);
      if (!res.ok) setError(res.error);
    });
  const copy = async () => {
    await navigator.clipboard.writeText(followUpNote(job, name));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3 first:pt-0 last:pb-0">
      {/* At least 16rem: below that the buttons wrap under the title instead of truncating it to a few words. */}
      <Link href={`/jobs/${job.id}`} className="min-w-[min(16rem,100%)] flex-1 hover:underline">
        <div className="truncate font-medium">{job.title || "Untitled role"}</div>
        <div className="truncate text-sm text-ink-2">
          {job.company || "Unknown company"}
          {job.appliedAt && <span className="text-ink-3"> · applied {ago(job.appliedAt).toLowerCase()}</span>}
        </div>
      </Link>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="secondary" onClick={copy} title="A short note saying you applied and are still interested. Edit it before sending.">
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} {copied ? "Copied" : "Copy note"}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => run(() => followUpAction(job.id, "sent"))} disabled={pending} title="Remind me again in a week">
          Sent it
        </Button>
        <Button size="sm" variant="ghost" onClick={() => run(() => followUpAction(job.id, "snooze"))} disabled={pending} title="Remind me in 3 days">
          Later
        </Button>
        <Dropdown
          label="What happened"
          value={null}
          placeholder="Heard back…"
          options={REPLIES}
          onChange={(status) => run(() => updateJobAction(job.id, { status }))}
          disabled={pending}
          align="end"
          size="sm"
          className="w-40"
        />
        <Button size="sm" variant="ghost" className="text-ink-3" onClick={() => run(() => followUpAction(job.id, "stop"))} disabled={pending} title="Don't remind me about this job">
          Stop
        </Button>
      </div>
      {error && <p className="w-full text-xs text-warn">{error}</p>}
    </li>
  );
}

/** On the job page: when it's due a follow-up, and a way to stop that. */
export function FollowUpLine({ jobId, at }: { jobId: string; at: string }) {
  const [pending, start] = useTransition();
  const due = new Date(at).getTime() <= Date.now();
  const day = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(at));
  return (
    <span className="ml-auto inline-flex items-center gap-2 text-xs text-ink-3">
      <BellRing className={due ? "h-3.5 w-3.5 text-brand" : "h-3.5 w-3.5"} />
      {due ? "Follow up now" : `Follow up ${day}`}
      <button onClick={() => start(async () => void (await safe(() => followUpAction(jobId, "stop"))))} disabled={pending} className="text-ink-3 underline-offset-2 hover:text-ink hover:underline">
        Stop
      </button>
    </span>
  );
}
