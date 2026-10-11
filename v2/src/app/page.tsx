import Link from "next/link";

import { createJobAction } from "./actions";
import { getProfile, listJobs } from "@/lib/db";
import { llmConfigured } from "@/lib/llm";
import { JOB_STATUSES, type Job } from "@/lib/types";
import { Button, Card, Eyebrow, Input, Textarea } from "@/components/ui";

export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<Job["status"], string> = {
  saved: "text-ink-3",
  applied: "text-ink",
  interviewing: "text-brand",
  offer: "text-brand font-semibold",
  rejected: "text-ink-3",
  archived: "text-ink-3",
};

function ago(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  return days <= 0 ? "today" : days === 1 ? "yesterday" : `${days} days ago`;
}

export default function JobsPage() {
  const jobs = listJobs();
  const profile = getProfile();
  const profileEmpty = !profile.experience.length && !profile.projects.length;
  const active = jobs.filter((j) => j.status !== "archived" && j.status !== "rejected");
  const closed = jobs.filter((j) => !active.includes(j));
  const counts = JOB_STATUSES.map((s) => [s, jobs.filter((j) => j.status === s).length] as const).filter(([, n]) => n);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
      <div className="space-y-6">
        <div>
          <Eyebrow>Your search</Eyebrow>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Jobs</h1>
          {counts.length > 0 && (
            <p className="mt-1 text-sm text-ink-2">{counts.map(([s, n]) => `${n} ${s}`).join(" · ")}</p>
          )}
        </div>

        {(profileEmpty || !llmConfigured()) && (
          <Card className="space-y-1 p-4 text-sm">
            <Eyebrow className="mb-1">Setup</Eyebrow>
            {profileEmpty && (
              <p>
                1. <Link href="/profile" className="text-brand underline">Add your experience</Link>. Import your current resume to start.
              </p>
            )}
            {!llmConfigured() && (
              <p className="text-ink-2">
                {profileEmpty ? "2. " : ""}Set <code className="font-mono text-xs">ANTHROPIC_API_KEY</code> or{" "}
                <code className="font-mono text-xs">OPENAI_API_KEY</code> in <code className="font-mono text-xs">v2/.env.local</code> for
                import and tailoring. Manual editing and PDFs work without it.
              </p>
            )}
          </Card>
        )}

        {jobs.length === 0 ? (
          <Card className="p-6 text-sm text-ink-2">No jobs yet. Paste a job description on the right to add your first one.</Card>
        ) : (
          <>
            <JobList jobs={active} />
            {closed.length > 0 && (
              <details>
                <summary className="cursor-pointer text-sm text-ink-3">Closed ({closed.length})</summary>
                <div className="mt-3"><JobList jobs={closed} /></div>
              </details>
            )}
          </>
        )}
      </div>

      <Card className="h-fit p-4">
        <h2 className="mb-3 font-display text-base font-semibold tracking-tight">Add a job</h2>
        <form action={createJobAction} className="space-y-2">
          <Textarea name="description" rows={8} placeholder="Paste the job description" required />
          <Input name="url" placeholder="Posting URL (optional)" />
          <div className="grid grid-cols-2 gap-2">
            <Input name="company" placeholder="Company" />
            <Input name="title" placeholder="Title" />
          </div>
          <p className="text-xs text-ink-3">Leave company and title blank and AI will fill them in from the description.</p>
          <Button variant="primary" className="w-full">Add job</Button>
        </form>
      </Card>
    </div>
  );
}

function JobList({ jobs }: { jobs: Job[] }) {
  return (
    <Card className="divide-y divide-[var(--rule)]">
      {jobs.map((j) => (
        <Link key={j.id} href={`/jobs/${j.id}`} className="flex items-center gap-4 px-4 py-3 hover:bg-page">
          <div className="min-w-0 flex-1">
            <div className="truncate font-medium">{j.title || "Untitled role"}</div>
            <div className="truncate text-sm text-ink-2">{j.company || "Unknown company"}{j.location && ` · ${j.location}`}</div>
          </div>
          <div className={`text-sm capitalize ${STATUS_STYLE[j.status]}`}>{j.status}</div>
          <div className="hidden w-24 text-right text-xs text-ink-3 sm:block">{ago(j.updatedAt)}</div>
        </Link>
      ))}
    </Card>
  );
}
