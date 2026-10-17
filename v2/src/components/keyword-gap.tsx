"use client";

import { Check, Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { addSource, fitOf, keywordGap, tokens, type GapSource, type KeyTerm, type TermStatus } from "@/lib/gap";
import type { Job, Profile, TailoredResume } from "@/lib/types";
import { Button, Eyebrow, FitChip, cx } from "./ui";

const ORDER: TermStatus["kind"][] = ["on", "profile", "missing"];

/** The term's words marked in a bullet, so it's clear why the bullet is offered. */
function Highlight({ text, term }: { text: string; term: string }) {
  const words = new Set(term.split(" "));
  const marked = new Set(tokens(text).filter((t) => t.term && words.has(t.term)).map((t) => t.raw));
  const parts = text.split(/([A-Za-z0-9][A-Za-z0-9+#.]*[A-Za-z0-9+#]|[A-Za-z0-9])/);
  return <>{parts.map((p, i) => (marked.has(p) ? <mark key={i} className="rounded-sm bg-brand-soft px-0.5 text-ink">{p}</mark> : p))}</>;
}

/**
 * The job's key terms above the resume editor: on this resume, in your profile (click to see the
 * bullets that have it, and add one), or not in your profile at all (grey: grounding means it can only
 * be noticed, not added).
 */
export function KeywordGap({ job, profile, doc, onChange }: { job: Pick<Job, "title" | "description" | "company">; profile: Profile; doc: TailoredResume; onChange: (d: TailoredResume) => void }) {
  const gap = useMemo(() => keywordGap(profile, job, doc), [profile, job, doc]);
  const fit = useMemo(() => fitOf(profile, job), [profile, job]);
  const [open, setOpen] = useState<string | null>(null);
  if (!gap.length) return null;

  const sorted = [...gap].sort((a, b) => ORDER.indexOf(a.status.kind) - ORDER.indexOf(b.status.kind));
  const n = (k: TermStatus["kind"]) => gap.filter((g) => g.status.kind === k).length;
  const selected = gap.find((g) => g.term.term === open && g.status.kind === "profile");

  return (
    <div className="rounded-control border border-rule bg-page px-4 py-3">
      <div className="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <Eyebrow>Keyword gap</Eyebrow>
        {fit && <FitChip fit={fit} className="self-center" />}
        <p className="text-xs text-ink-3">
          {n("on")} of {gap.length} key terms on this resume
          {n("profile") > 0 && ` · ${n("profile")} more in your profile`}
          {n("missing") > 0 && ` · ${n("missing")} not in your profile`}
        </p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {sorted.map(({ term, status }) => (
          <Chip key={term.term} term={term} status={status} active={open === term.term} onClick={() => setOpen(open === term.term ? null : term.term)} />
        ))}
      </div>
      {selected && selected.status.kind === "profile" && (
        <Sources
          term={selected.term}
          sources={selected.status.sources}
          as={selected.status.as}
          onAdd={(s) => {
            onChange(addSource(doc, s));
            // Close once the term is on the page; keep it open while other sources remain to choose from.
            if (selected.status.kind === "profile" && selected.status.sources.length <= 1) setOpen(null);
          }}
        />
      )}
    </div>
  );
}

function Chip({ term, status, active, onClick }: { term: KeyTerm; status: TermStatus; active: boolean; onClick: () => void }) {
  const base = "inline-flex h-7 items-center gap-1 rounded-chip border px-2 text-xs";
  if (status.kind === "on")
    return (
      <span className={cx(base, "border-rule bg-paper text-ink")} title="On this resume">
        <Check className="h-3 w-3 text-ok" />
        {term.label}
      </span>
    );
  if (status.kind === "missing")
    return (
      <span className={cx(base, "border-dashed border-rule text-ink-3")} title="Not in your profile. Resumes only use what your profile says, so this can't be added here.">
        {term.label}
      </span>
    );
  return (
    <button
      type="button"
      aria-expanded={active}
      onClick={onClick}
      title="In your profile, not on this resume. Click to see where."
      className={cx(base, "border-brand font-medium text-brand transition-colors hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand", active && "bg-brand-soft")}
    >
      <Plus className="h-3 w-3" />
      {term.label}
    </button>
  );
}

function Sources({ term, sources, as, onAdd }: { term: KeyTerm; sources: GapSource[]; as?: string; onAdd: (s: GapSource) => void }) {
  return (
    <div className="mt-3 border-t border-rule pt-3">
      {as ? (
        <p className="text-xs text-ink-2">
          Your profile says &ldquo;{as}&rdquo;, the posting &ldquo;{term.label}&rdquo;. Applicant tracking systems may only match the
          posting&apos;s spelling, so add it to your profile where it fits (&ldquo;{as} ({term.label})&rdquo;).
        </p>
      ) : sources.length === 0 ? (
        <p className="text-xs text-ink-2">
          &ldquo;{term.label}&rdquo; is in your profile, but only in a title, school or summary, not in a bullet or skill you can add here.
        </p>
      ) : (
        <ul className="space-y-2">
          {sources.map((s) => (
            <li key={s.type === "bullet" ? s.bulletId : `${s.category}:${s.skill}`} className="flex items-start gap-3">
              <div className="min-w-0 flex-1 text-sm">
                <div className="truncate text-xs text-ink-3">{s.type === "bullet" ? s.entry : `Skills · ${s.category || "Skills"}`}</div>
                <Highlight text={s.type === "bullet" ? s.text : s.skill} term={term.term} />
              </div>
              <Button size="sm" variant="secondary" onClick={() => onAdd(s)}>
                <Plus className="h-3.5 w-3.5" /> Add
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
