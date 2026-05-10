import { scoreResume, type ResumeScore } from "@slothing/shared/scoring";
import type { JobDescription } from "@slothing/shared/types";
import type { ExtensionProfile, ScrapedJob } from "@/shared/types";

export function scrapedJobToJobDescription(
  job: ScrapedJob,
  createdAt = new Date().toISOString(),
): JobDescription {
  return {
    id: job.sourceJobId || job.url,
    title: job.title,
    company: job.company,
    location: job.location,
    type: job.type,
    remote: job.remote,
    salary: job.salary,
    description: job.description,
    requirements: job.requirements || [],
    responsibilities: job.responsibilities || [],
    keywords: job.keywords || [],
    url: job.url,
    deadline: job.deadline,
    createdAt,
  };
}

export function computeJobMatchScore(
  profile: ExtensionProfile | null,
  job: ScrapedJob | null,
): ResumeScore | null {
  if (!profile || !job) return null;

  return scoreResume({
    profile,
    rawText: profile.rawText,
    job: scrapedJobToJobDescription(job),
  });
}
