import Link from "next/link";
import { notFound } from "next/navigation";

import { getDoc, getJob, getProfile } from "@/lib/db";
import { JobDocuments } from "@/components/job-documents";
import { JobPanel, StatusSelect } from "@/components/job-panel";
import { Eyebrow } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function JobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = getJob(id);
  if (!job) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link href="/" className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3 hover:text-ink">← Jobs</Link>
          <h1 className="font-display text-3xl font-semibold tracking-tight">{job.title || "Untitled role"}</h1>
          <p className="text-ink-2">
            {job.company || "Unknown company"}
            {job.url && (
              <> · <a href={job.url} target="_blank" rel="noreferrer" className="text-brand hover:underline">posting ↗</a></>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Eyebrow>Status</Eyebrow>
          <StatusSelect job={job} />
        </div>
      </div>

      <details className="group">
        <summary className="cursor-pointer list-none text-sm text-ink-2 hover:text-ink">
          <span className="group-open:hidden">▸ Job details, notes &amp; description</span>
          <span className="hidden group-open:inline">▾ Job details, notes &amp; description</span>
        </summary>
        <div className="mt-3"><JobPanel job={job} /></div>
      </details>

      <JobDocuments jobId={job.id} profile={getProfile()} resume={getDoc(job.id, "resume")} letter={getDoc(job.id, "cover_letter")} />
    </div>
  );
}
