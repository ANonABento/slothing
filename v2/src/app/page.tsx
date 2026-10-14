import { Briefcase, ChevronRight, Plus } from "lucide-react";
import Link from "next/link";

import { createJobAction } from "./actions";
import { PageBody, PageHeader } from "@/components/page-header";
import { Button, Card, CardTitle, Eyebrow, Input, StatusPill, Textarea, cx } from "@/components/ui";
import { getProfile, listJobs } from "@/lib/db";
import { llmConfigured } from "@/lib/llm";
import { JOB_STATUSES, type Job } from "@/lib/types";

export const dynamic = "force-dynamic";

const VIEWS = [
  { value: "active", label: "Active" },
  { value: "closed", label: "Closed" },
  { value: "all", label: "All" },
] as const;
type View = (typeof VIEWS)[number]["value"];

const isClosed = (j: Job) => j.status === "rejected" || j.status === "archived";

function ago(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  return days <= 0 ? "Today" : days === 1 ? "Yesterday" : `${days} days ago`;
}

export default async function JobsPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const requested = (await searchParams).view;
  const view: View = VIEWS.find((v) => v.value === requested)?.value ?? "active";
  const jobs = listJobs();
  const shown = jobs.filter((j) => (view === "all" ? true : view === "closed" ? isClosed(j) : !isClosed(j)));
  const profile = getProfile();
  const profileEmpty = !profile.experience.length && !profile.projects.length;
  const counts = JOB_STATUSES.map((s) => [s, jobs.filter((j) => j.status === s).length] as const).filter(([, n]) => n);

  return (
    <>
      <PageHeader
        icon={Briefcase}
        title="Jobs"
        description="Every role you're considering, with a tailored resume and cover letter for each."
      />
      <PageBody>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="min-w-0 space-y-4">
            {(profileEmpty || !llmConfigured()) && <SetupCard profileEmpty={profileEmpty} llm={llmConfigured()} />}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex rounded-lg border border-rule bg-paper p-1 shadow-paper">
                {VIEWS.map((v) => (
                  <Link
                    key={v.value}
                    href={v.value === "active" ? "/" : `/?view=${v.value}`}
                    className={cx("flex h-9 items-center rounded-md px-4 text-sm font-medium", view === v.value ? "bg-ink text-paper" : "text-ink-2 hover:text-ink")}
                  >
                    {v.label}
                  </Link>
                ))}
              </div>
              {counts.length > 0 && (
                <p className="text-sm text-ink-2">{counts.map(([s, n]) => `${n} ${s}`).join(" · ")}</p>
              )}
            </div>

            {shown.length === 0 ? (
              <Card className="flex flex-col items-center gap-2 px-6 py-12 text-center">
                <div className="grid h-11 w-11 place-items-center rounded-lg border border-rule bg-page-2">
                  <Briefcase className="h-5 w-5" />
                </div>
                <CardTitle>{jobs.length ? "Nothing here" : "No jobs yet"}</CardTitle>
                <p className="max-w-sm text-sm text-ink-2">
                  {jobs.length ? "No jobs match this view." : "Paste a job description into “Add a job” to start your first application."}
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {shown.map((j) => (
                  <Link key={j.id} href={`/jobs/${j.id}`} className="group block">
                    <Card className="flex items-center gap-4 px-5 py-4 transition-shadow group-hover:shadow-paper-elevated">
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-display text-[17px] font-semibold tracking-tight">{j.title || "Untitled role"}</div>
                        <div className="truncate text-sm text-ink-2">
                          {j.company || "Unknown company"}
                          {j.location && <span className="text-ink-3"> · {j.location}</span>}
                        </div>
                      </div>
                      <StatusPill status={j.status} />
                      <div className="hidden w-24 text-right text-xs text-ink-3 sm:block">{ago(j.updatedAt)}</div>
                      <ChevronRight className="h-4 w-4 text-ink-3 transition-transform group-hover:translate-x-0.5" />
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Card className="h-fit p-5 xl:sticky xl:top-6">
            <Eyebrow className="mb-1">New</Eyebrow>
            <CardTitle className="mb-4">Add a job</CardTitle>
            <form action={createJobAction} className="space-y-3">
              <Textarea name="description" rows={9} placeholder="Paste the full job description" required />
              <Input name="url" placeholder="Posting URL (optional)" />
              <div className="grid grid-cols-2 gap-2">
                <Input name="company" placeholder="Company" />
                <Input name="title" placeholder="Title" />
              </div>
              <p className="text-xs leading-5 text-ink-3">Leave company and title blank and AI fills them in from the description.</p>
              <Button variant="primary" className="w-full">
                <Plus className="h-4 w-4" /> Add job
              </Button>
            </form>
          </Card>
        </div>
      </PageBody>
    </>
  );
}

function SetupCard({ profileEmpty, llm }: { profileEmpty: boolean; llm: boolean }) {
  const steps = [
    { done: !profileEmpty, body: <><Link href="/profile" className="font-medium text-brand underline-offset-2 hover:underline">Add your experience</Link>. Import your current resume to start.</> },
    {
      done: llm,
      body: (
        <>
          Connect AI: set <code className="font-mono text-xs">NEBIUS_API_KEY</code>, <code className="font-mono text-xs">ANTHROPIC_API_KEY</code> or{" "}
          <code className="font-mono text-xs">OPENAI_API_KEY</code> in <code className="font-mono text-xs">v2/.env.local</code>. Manual editing and PDFs work without it.
        </>
      ),
    },
  ];
  return (
    <Card className="p-5">
      <Eyebrow className="mb-3">Get set up</Eyebrow>
      <ol className="space-y-2.5 text-sm">
        {steps.map((s, i) => (
          <li key={i} className={cx("flex gap-3", s.done && "text-ink-3 line-through decoration-rule-strong")}>
            <span className={cx("grid h-6 w-6 shrink-0 place-items-center rounded-md font-mono text-xs", s.done ? "bg-ok-soft text-ok" : "bg-page-2 text-ink")}>{s.done ? "✓" : i + 1}</span>
            <span className="pt-0.5">{s.body}</span>
          </li>
        ))}
      </ol>
    </Card>
  );
}
