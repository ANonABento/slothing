"use client";

import { FileText, History, Mail, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { restoreVersionAction } from "@/app/actions";
import { safe } from "@/lib/safe";
import { settingsHref } from "@/lib/settings-sections";
import type { CoverLetter, DocMeta, Job, Profile, StoredDoc, TailoredResume } from "@/lib/types";
import { LetterEditor } from "./letter-editor";
import { PdfPreview, PreviewEmpty, PreviewPane } from "./pdf-preview";
import { useConfirm } from "./confirm";
import { ResumeEditor } from "./resume-editor";
import { Button, Card, Segmented, cx } from "./ui";

/** One saved version, as the history list shows it. */
export interface VersionItem {
  id: string;
  meta: DocMeta;
  createdAt: string;
  /** "18 bullets", "312 words". */
  summary: string;
}

export function JobDocuments({
  jobId,
  job,
  profile,
  resume,
  letter,
  letterWords,
  resumePages,
  history,
}: {
  jobId: string;
  /** What the keyword gap reads. */
  job: Pick<Job, "title" | "description" | "company">;
  /** Saved versions of each document, newest first. The newest is the current one. */
  history: { resume: VersionItem[]; letter: VersionItem[] };
  /** The page length from Settings, or null for no limit. */
  resumePages: number | null;
  /** The cover letter word target from Settings. */
  letterWords: number;
  profile: Profile;
  resume: StoredDoc<TailoredResume> | null;
  letter: StoredDoc<CoverLetter> | null;
}) {
  const [tab, setTab] = useState<"resume" | "letter">("resume");
  const current = tab === "resume" ? resume : letter;
  const versions = history[tab];
  const [showHistory, setShowHistory] = useState(false);
  // A version being previewed instead of the current document; null shows the current one.
  const [viewing, setViewing] = useState<VersionItem | null>(null);
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  const { confirm, dialog } = useConfirm();
  const router = useRouter();

  const switchTab = (t: "resume" | "letter") => {
    setTab(t);
    setViewing(null);
  };
  const restore = async (v: VersionItem) => {
    const ok = await confirm({
      title: "Restore this version?",
      body: `It becomes the current ${tab === "resume" ? "resume" : "cover letter"}. The one you have now stays in History, and unsaved edits are lost.`,
      confirmLabel: "Restore",
    });
    if (!ok) return;
    start(async () => {
      setError("");
      const res = await safe(() => restoreVersionAction(jobId, tab === "resume" ? "resume" : "cover_letter", v.id));
      if (!res.ok) return setError(res.error);
      setViewing(null);
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      <Segmented
        value={tab}
        onChange={switchTab}
        options={[
          { value: "resume", label: <span className="inline-flex items-center gap-1.5"><FileText className="h-4 w-4" />Resume</span> },
          { value: "letter", label: <span className="inline-flex items-center gap-1.5"><Mail className="h-4 w-4" />Cover letter</span> },
        ]}
      />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card className="self-start p-5">
          {dialog}
          {current && (originLabel(current.meta) || versions.length > 1) && (
            <div className="mb-4 flex items-center gap-2">
              <p className="min-w-0 flex-1 truncate font-mono text-xs text-ink-3">{originLabel(current.meta)}</p>
              {versions.length > 1 && (
                <Button variant="ghost" size="sm" aria-expanded={showHistory} onClick={() => setShowHistory((o) => !o)}>
                  <History className="h-3.5 w-3.5" /> History · {versions.length}
                </Button>
              )}
            </div>
          )}
          {showHistory && versions.length > 1 && (
            <HistoryList
              versions={versions}
              viewing={viewing}
              onView={(v) => setViewing(v.id === versions[0].id ? null : v)}
              onRestore={restore}
              pending={pending}
            />
          )}
          {error && <p className="mb-3 text-sm text-warn">{error}</p>}
          {/* Both stay mounted so switching tabs never drops unsaved edits. */}
          <div hidden={tab !== "resume"}>
            <ResumeEditor
              jobId={jobId}
              job={job}
              profile={profile}
              initial={resume?.data ?? null}
              initialWarnings={resume?.warnings ?? []}
              version={resume?.updatedAt}
              edited={resume?.meta.edited}
            />
          </div>
          <div hidden={tab !== "letter"}>
            <LetterEditor
              key={letter?.updatedAt ?? "none"}
              jobId={jobId}
              initial={letter?.data ?? null}
              initialWarnings={letter?.warnings ?? []}
              edited={letter?.meta.edited}
              targetWords={letterWords}
            />
          </div>
        </Card>
        <PreviewPane>
          {viewing && (
            <div className="mb-3 flex flex-wrap items-center gap-2 rounded-control border border-brand bg-brand-soft px-3 py-2 text-sm">
              <History className="h-4 w-4 shrink-0 text-brand" />
              <span className="min-w-0 flex-1">
                Viewing the version from <strong>{when(viewing.createdAt)}</strong>
              </span>
              <Button size="sm" variant="primary" disabled={pending} onClick={() => restore(viewing)}>
                <RotateCcw className="h-3.5 w-3.5" /> Restore
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setViewing(null)}>Back to current</Button>
            </div>
          )}
          {current ? (
            <PdfPreview
              query={`job=${jobId}&kind=${tab}${viewing ? `&ver=${viewing.id}` : ""}`}
              version={viewing?.id ?? current.updatedAt}
              maxPages={tab === "resume" ? resumePages : null}
              settings={
                tab === "resume"
                  ? { href: settingsHref("layout", `/jobs/${jobId}`), label: "Design" }
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

/** What produced a document, so models and levels can be compared. */
function originLabel(meta: DocMeta): string {
  const parts =
    meta.source === "ai"
      ? [`AI · ${[meta.provider, meta.model].filter(Boolean).join(" · ")}`, meta.latitude && LATITUDE_LABEL[meta.latitude]]
      : meta.source === "auto"
        ? ["Tailored without AI"]
        : meta.source === "profile"
          ? ["From your full profile"]
          : // Made before origins were recorded: all we know is whether it was edited.
            meta.edited
            ? ["Edited"]
            : [];
  if (meta.source && meta.edited) parts.push("edited since");
  return parts.filter(Boolean).join(" · ");
}

/** "3:12 PM" today, "Oct 12, 3:12 PM" otherwise. */
function when(iso: string): string {
  const d = new Date(iso);
  const today = d.toDateString() === new Date().toDateString();
  return new Intl.DateTimeFormat("en-US", today ? { timeStyle: "short" } : { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(d);
}

function HistoryList({
  versions,
  viewing,
  onView,
  onRestore,
  pending,
}: {
  versions: VersionItem[];
  viewing: VersionItem | null;
  onView: (v: VersionItem) => void;
  onRestore: (v: VersionItem) => void;
  pending: boolean;
}) {
  return (
    <div className="mb-4 rounded-control border border-rule">
      <p className="border-b border-rule px-3 py-2 text-xs text-ink-2">Every save, AI draft and restore is kept. Click one to preview it.</p>
      <ol className="max-h-72 divide-y divide-rule overflow-y-auto">
        {versions.map((v, i) => {
          const selected = viewing ? viewing.id === v.id : i === 0;
          return (
            <li key={v.id} className={cx("flex items-center gap-2 px-3 py-2", selected && "bg-rule-bg")}>
              <button type="button" onClick={() => onView(v)} className="min-w-0 flex-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
                <span className="flex items-center gap-2 text-sm font-medium">
                  {when(v.createdAt)}
                  {i === 0 && <span className="rounded-chip bg-brand-soft px-1.5 font-mono text-[10px] uppercase text-brand">Current</span>}
                </span>
                <span className="block truncate text-xs text-ink-3">{[originLabel(v.meta), v.summary].filter(Boolean).join(" · ")}</span>
              </button>
              {i > 0 && (
                <Button size="sm" variant="ghost" disabled={pending} onClick={() => onRestore(v)} aria-label={`Restore the version from ${when(v.createdAt)}`}>
                  <RotateCcw className="h-3.5 w-3.5" /> Restore
                </Button>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
