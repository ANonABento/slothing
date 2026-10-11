"use client";

import { useState } from "react";

import type { CoverLetter, Profile, StoredDoc, TailoredResume } from "@/lib/types";
import { LetterEditor } from "./letter-editor";
import { PdfPreview } from "./pdf-preview";
import { ResumeEditor } from "./resume-editor";
import { Card } from "./ui";

export function JobDocuments({
  jobId,
  profile,
  resume,
  letter,
}: {
  jobId: string;
  profile: Profile;
  resume: StoredDoc<TailoredResume> | null;
  letter: StoredDoc<CoverLetter> | null;
}) {
  const [tab, setTab] = useState<"resume" | "letter">("resume");
  const [bump, setBump] = useState(0);
  const current = tab === "resume" ? resume : letter;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <Card className="self-start p-4">
        <div className="mb-4 flex gap-4 border-b border-rule">
          {(["resume", "letter"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`-mb-px border-b-2 pb-2 font-display text-base font-semibold tracking-tight ${tab === t ? "border-brand text-ink" : "border-transparent text-ink-3 hover:text-ink"}`}
            >
              {t === "resume" ? "Resume" : "Cover letter"}
            </button>
          ))}
        </div>
        {tab === "resume" ? (
          <ResumeEditor
            key={resume?.updatedAt ?? "none"}
            jobId={jobId}
            profile={profile}
            initial={resume?.data ?? null}
            initialWarnings={resume?.warnings ?? []}
            onSaved={() => setBump((b) => b + 1)}
          />
        ) : (
          <LetterEditor
            key={letter?.updatedAt ?? "none"}
            jobId={jobId}
            initial={letter?.data ?? null}
            initialWarnings={letter?.warnings ?? []}
            onSaved={() => setBump((b) => b + 1)}
          />
        )}
      </Card>
      <div className="xl:sticky xl:top-6 xl:h-[calc(100vh-3rem)]">
        {current ? (
          <PdfPreview query={`job=${jobId}&kind=${tab}`} version={`${current.updatedAt}-${bump}`} />
        ) : (
          <Card className="p-6 text-sm text-ink-2">The PDF preview appears here once there&apos;s a {tab === "resume" ? "resume" : "cover letter"}.</Card>
        )}
      </div>
    </div>
  );
}
