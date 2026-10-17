import { Briefcase, ChevronRight } from "lucide-react";
import Link from "next/link";

import { AddJob } from "@/components/add-job";
import { PageBody, PageHeader } from "@/components/page-header";
import { Card, EmptyState, Eyebrow, StatusPill, cx } from "@/components/ui";
import { SegmentedLinks } from "@/components/segmented-links";
import { getProfile, listJobs } from "@/lib/db";
import { ago } from "@/lib/format";
import { llmConfigured } from "@/lib/llm";
import { settingsHref } from "@/lib/settings-sections";
import { JOB_STATUSES, type Job } from "@/lib/types";

export const dynamic = "force-dynamic";

const VIEWS = [
  { value: "active", label: "Active" },
  { value: "seen", label: "Seen" },
  { value: "closed", label: "Closed" },
  { value: "all", label: "All" },
] as const;
type View = (typeof VIEWS)[number]["value"];

const isClosed = (j: Job) => j.status === "rejected" || j.status === "archived";
const inView = (j: Job, view: View) =>
  view === "all" ? true : view === "seen" ? j.status === "seen" : view === "closed" ? isClosed(j) : j.status !== "seen" && !isClosed(j);

export default async function JobsPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const requested = (await searchParams).view;
  const view: View = VIEWS.find((v) => v.value === requested)?.value ?? "active";
  const jobs = listJobs();
  // Seen: postings you opened, most recent first, so it reads like browser history.
  const shown = jobs.filter((j) => inView(j, view));
  if (view === "seen") shown.sort((a, b) => (b.lastSeenAt ?? b.createdAt).localeCompare(a.lastSeenAt ?? a.createdAt));
  const profile = getProfile();
  const profileEmpty = !profile.experience.length && !profile.projects.length;
  const counts = JOB_STATUSES.map((s) => [s, jobs.filter((j) => j.status === s).length] as const).filter(([, n]) => n);

  return (
    <>
      <PageHeader
        icon={Briefcase}
        title="Jobs"
        description="Every role you're considering, with a tailored resume and cover letter for each."
        actions={<AddJob />}
      />
      <PageBody>
        <div className="space-y-4">
          {(profileEmpty || !llmConfigured()) && <SetupCard profileEmpty={profileEmpty} llm={llmConfigured()} />}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <SegmentedLinks value={view} options={VIEWS.map((v) => ({ ...v, href: v.value === "active" ? "/" : `/?view=${v.value}` }))} />
            {counts.length > 0 && <p className="text-sm text-ink-2">{counts.map(([s, n]) => `${n} ${s}`).join(" · ")}</p>}
          </div>

          {shown.length === 0 ? (
            <EmptyState icon={Briefcase} title={jobs.length ? "Nothing here" : "No jobs yet"}>
              {view === "seen"
                ? "Postings you open in the browser show up here, with the extension connected. Save one to move it to your jobs."
                : jobs.length
                  ? "No jobs match this view."
                  : "Use “Add job” to paste a posting's link or its description, or save one from the browser extension."}
            </EmptyState>
          ) : (
            <div className="space-y-2">
              {shown.map((j) => (
                <Link key={j.id} href={`/jobs/${j.id}`} className="group block rounded-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
                  <Card className="flex items-center gap-4 px-5 py-4 transition-shadow group-hover:shadow-paper-elevated">
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-display text-lg font-semibold tracking-tight">{j.title || "Untitled role"}</div>
                      <div className="truncate text-sm text-ink-2">
                        {j.company || "Unknown company"}
                        {j.location && <span className="text-ink-3"> · {j.location}</span>}
                      </div>
                    </div>
                    <StatusPill status={j.status} />
                    <div className="hidden w-24 text-right text-xs text-ink-3 sm:block">{j.status === "seen" && j.lastSeenAt ? ago(j.lastSeenAt) : ago(j.updatedAt)}</div>
                    <ChevronRight className="h-4 w-4 text-ink-3 transition-transform group-hover:translate-x-0.5" />
                  </Card>
                </Link>
              ))}
            </div>
          )}
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
          <Link href={settingsHref("ai")} className="font-medium text-brand underline-offset-2 hover:underline">Connect AI</Link>: paste an Anthropic, Nebius or OpenAI API key in Settings. Manual editing and PDFs work without it.
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
            <span className={cx("grid h-6 w-6 shrink-0 place-items-center rounded-chip font-mono text-xs", s.done ? "bg-ok-soft text-ok" : "bg-page-2 text-ink")}>{s.done ? "✓" : i + 1}</span>
            <span className="pt-0.5">{s.body}</span>
          </li>
        ))}
      </ol>
    </Card>
  );
}
