"use client";

import { FileText, Mail } from "lucide-react";
import { useState } from "react";

import { settingsHref } from "@/lib/settings-sections";
import type { CoverLetter, DocMeta, Profile, StoredDoc, TailoredResume } from "@/lib/types";
import { LetterEditor } from "./letter-editor";
import { PdfPreview, PreviewEmpty, PreviewPane } from "./pdf-preview";
import { ResumeEditor } from "./resume-editor";
import { Card, Segmented } from "./ui";

export function JobDocuments({
  jobId,
  profile,
  resume,
  letter,
  letterWords,
}: {
  jobId: string;
  /** The cover letter word target from Settings. */
  letterWords: number;
  profile: Profile;
  resume: StoredDoc<TailoredResume> | null;
  letter: StoredDoc<CoverLetter> | null;
}) {
  const [tab, setTab] = useState<"resume" | "letter">("resume");
  const current = tab === "resume" ? resume : letter;

  return (
    <div className="space-y-4">
      <Segmented
        value={tab}
        onChange={setTab}
        options={[
          { value: "resume", label: <span className="inline-flex items-center gap-1.5"><FileText className="h-4 w-4" />Resume</span> },
          { value: "letter", label: <span className="inline-flex items-center gap-1.5"><Mail className="h-4 w-4" />Cover letter</span> },
        ]}
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card className="self-start p-5">
          {current && <DocOrigin meta={current.meta} />}
          {/* Both stay mounted so switching tabs never drops unsaved edits. */}
          <div hidden={tab !== "resume"}>
            <ResumeEditor
              key={resume?.updatedAt ?? "none"}
              jobId={jobId}
              profile={profile}
              initial={resume?.data ?? null}
              initialWarnings={resume?.warnings ?? []}
            />
          </div>
          <div hidden={tab !== "letter"}>
            <LetterEditor key={letter?.updatedAt ?? "none"} jobId={jobId} initial={letter?.data ?? null} initialWarnings={letter?.warnings ?? []} targetWords={letterWords} />
          </div>
        </Card>
        <PreviewPane>
          {current ? (
            <PdfPreview
              query={`job=${jobId}&kind=${tab}`}
              version={current.updatedAt}
              settings={
                tab === "resume"
                  ? { href: settingsHref("layout", `/jobs/${jobId}`), label: "Layout" }
                  : { href: settingsHref("letter", `/jobs/${jobId}`), label: "Letter settings" }
              }
            />
          ) : (
            <PreviewEmpty>The PDF preview appears here once there&apos;s a {tab === "resume" ? "resume" : "cover letter"}.</PreviewEmpty>
          )}
        </PreviewPane>
      </div>
    </div>
  );
}

const LATITUDE_LABEL = { select: "select only", rephrase: "light rephrase", rewrite: "rewrite" } as const;

/** One line saying what produced this document, so models and levels can be compared. */
function DocOrigin({ meta }: { meta: DocMeta }) {
  const parts =
    meta.source === "ai"
      ? [`AI · ${[meta.provider, meta.model].filter(Boolean).join(" · ")}`, meta.latitude && LATITUDE_LABEL[meta.latitude]]
      : meta.source === "profile"
        ? ["From your full profile"]
        : meta.edited
          ? ["Written by hand"]
          : [];
  if (!parts.length) return null;
  if (meta.source && meta.edited) parts.push("edited since");
  return <p className="mb-4 font-mono text-xs text-ink-3">{parts.filter(Boolean).join(" · ")}</p>;
}
