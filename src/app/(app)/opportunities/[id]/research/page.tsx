"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Briefcase, Loader2 } from "lucide-react";
import { CompanyResearchCard } from "@/components/research/company-research-card";
import { Button } from "@/components/ui/button";
import {
  AppPage,
  PageContent,
  PageHeader,
  PageLoadingState,
  StandardEmptyState,
} from "@/components/ui/page-layout";
import type { JobDescription } from "@/types";

export default function CompanyResearchPage() {
  const params = useParams();
  const jobId = params.id as string;
  const [job, setJob] = useState<JobDescription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJob() {
      try {
        const res = await fetch(`/api/opportunities/${jobId}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch job");
        }
        setJob(data.job);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load job");
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [jobId]);

  if (loading) {
    return <PageLoadingState icon={Loader2} label="Loading research..." />;
  }

  if (error || !job) {
    return (
      <AppPage>
        <PageContent width="narrow">
          <StandardEmptyState
            icon={Briefcase}
            title={error || "Opportunity not found"}
            action={
              <Button asChild variant="outline">
                <Link href="/opportunities">Open Opportunities</Link>
              </Button>
            }
          />
        </PageContent>
      </AppPage>
    );
  }

  return (
    <AppPage>
      <PageHeader
        width="narrow"
        icon={Briefcase}
        eyebrow="Company Research"
        title={job.company}
        description={job.title}
      />

      <PageContent width="narrow">
        <CompanyResearchCard companyName={job.company} jobId={jobId} />
      </PageContent>
    </AppPage>
  );
}
