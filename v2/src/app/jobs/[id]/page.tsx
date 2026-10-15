import { ExternalLink, FileText } from "lucide-react";
import { notFound } from "next/navigation";

import { JobDocuments } from "@/components/job-documents";
import { JobPanel, StatusSelect } from "@/components/job-panel";
import { PageBody, PageHeader } from "@/components/page-header";
import { getDoc, getJob, getProfile, getSettings } from "@/lib/db";
import { pageLimit } from "@/lib/fit";
import { LETTER_LENGTHS } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function JobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = getJob(id);
  if (!job) notFound();

  return (
    <>
      <PageHeader
        icon={FileText}
        back={{ href: "/", label: "Jobs" }}
        title={job.title || "Untitled role"}
        description={
          <span className="inline-flex items-center gap-x-2">
            {job.company || "Unknown company"}
            {job.location && <span className="text-ink-3">· {job.location}</span>}
            {job.url && (
              <a href={job.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-brand hover:underline">
                Posting <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </span>
        }
        actions={<StatusSelect job={job} />}
      />
      <PageBody>
        <div className="space-y-6">
          <JobPanel job={job} />
          <JobDocuments jobId={job.id} profile={getProfile()} resume={getDoc(job.id, "resume")} letter={getDoc(job.id, "cover_letter")}
            letterWords={LETTER_LENGTHS[getSettings().letter.length]}
            resumePages={pageLimit(getSettings().resume.pages)}
          />
        </div>
      </PageBody>
    </>
  );
}
