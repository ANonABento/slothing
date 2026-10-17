"use client";

import { safe } from "@/lib/safe";
import { settingsHref } from "@/lib/settings-sections";
import { History, Loader2, SlidersHorizontal, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";

import { rewordBulletAction, saveResumeAction, tailorResumeAction } from "@/app/actions";
import type { Rewording } from "@/lib/tailor";
import type { Job, Profile, TailoredResume, Warning } from "@/lib/types";
import { CommaInput } from "./comma-input";
import { ListEditor, itemActions, type ItemControls } from "./list-editor";
import { useConfirm } from "./confirm";
import { Dropdown } from "./dropdown";
import { useElapsed, working } from "./elapsed";
import { EntryCard, count, dates, joinParts } from "./entry-card";
import { KeywordGap } from "./keyword-gap";
import { RowMenu } from "./row-menu";
import { SaveBar } from "./save-bar";
import { Button, IconButton, Input, Label, Textarea, Warnings, buttonClass } from "./ui";

type Entry = TailoredResume["experience"][number];
type Bullet = Entry["bullets"][number];

const HINTS = ["Shorter", "Lead with the result", "Use the job's wording"];

/**
 * "Reword with AI" for one bullet: a few alternatives citing the same source, shown under it. Picking one
 * only edits the draft; saving grounds it like any other edit. Not on Profile: that's what AI is grounded against.
 */
function Reword({ jobId, bullet, onPick, onClose }: { jobId: string; bullet: Bullet; onPick: (text: string) => void; onClose: () => void }) {
  const [hint, setHint] = useState("");
  const [options, setOptions] = useState<Rewording[] | null>(null);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const run = (h = hint) =>
    start(async () => {
      setError("");
      const res = await safe(() => rewordBulletAction(jobId, bullet, h));
      if (res.ok) setOptions(res.data ?? []);
      else setError(res.error);
    });
  return (
    <div className="mt-2 space-y-2 rounded-control border border-rule bg-paper px-3 py-2.5">
      <div className="flex items-center gap-2">
        <Sparkles className="h-3.5 w-3.5 shrink-0 text-brand" />
        <Input
          aria-label="Hint for the rewording (optional)"
          value={hint}
          onChange={(e) => setHint(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              run();
            }
          }}
          placeholder="Optional hint: shorter, lead with the result…"
          className="h-8 py-1 text-xs"
        />
        <Button type="button" size="sm" variant="primary" disabled={pending} onClick={() => run()}>
          {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : options ? "Again" : "Reword"}
        </Button>
        <IconButton label="Close rewording" size="sm" onClick={onClose}>
          <X className="h-3.5 w-3.5" />
        </IconButton>
      </div>
      {!options && !pending && (
        <div className="flex flex-wrap gap-1.5">
          {HINTS.map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => {
                setHint(h);
                run(h);
              }}
              className="rounded-chip border border-rule px-2 py-0.5 text-xs text-ink-2 hover:border-rule-strong hover:text-ink"
            >
              {h}
            </button>
          ))}
        </div>
      )}
      {pending && <p className="text-xs text-ink-3">Rewording from the source bullet…</p>}
      {error && <p className="text-xs text-warn">{error}</p>}
      {options && !pending && (
        <ul className="space-y-1.5">
          {options.map((o) => (
            <li key={o.text} className="flex items-start gap-2">
              <div className="min-w-0 flex-1 text-sm">
                {o.text}
                {o.warning && <p className="mt-0.5 text-xs text-warn">{o.warning}</p>}
              </div>
              <Button type="button" size="sm" variant="secondary" onClick={() => onPick(o.text)}>Use</Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** One bullet with its menu: reword, move, remove. */
function BulletRow({ jobId, bullet, original, update, ctl }: { jobId: string; bullet: Bullet; original: string; update: (b: Bullet) => void; ctl: ItemControls }) {
  const [reword, setReword] = useState(false);
  return (
    <div className="flex items-start gap-1">
      <div className="min-w-0 flex-1">
        <TailoredBulletField text={bullet.text} original={original} onChange={(text) => update({ ...bullet, text })} />
        {reword && (
          <Reword
            jobId={jobId}
            bullet={bullet}
            onClose={() => setReword(false)}
            onPick={(text) => {
              update({ ...bullet, text });
              setReword(false);
            }}
          />
        )}
      </div>
      <RowMenu label="Bullet actions" actions={[{ label: "Reword with AI", icon: Sparkles, onSelect: () => setReword(true) }, ...itemActions(ctl)]} />
    </div>
  );
}

/** A rewritten bullet, with its profile source one click away instead of always on screen. */
function TailoredBulletField({ text, original, onChange }: { text: string; original: string; onChange: (t: string) => void }) {
  const [show, setShow] = useState(false);
  const changed = Boolean(original) && original.trim() !== text.trim();
  return (
    <div>
      <Textarea aria-label="Bullet" value={text} onChange={(e) => onChange(e.target.value)} />
      {changed && (
        <div className="mt-1 text-xs">
          <button type="button" onClick={() => setShow((s) => !s)} className="inline-flex items-center gap-1 text-ink-3 hover:text-ink">
            <History className="h-3 w-3" /> {show ? "Hide original" : "Reworded · show original"}
          </button>
          {show && (
            <div className="mt-1.5 rounded-control border border-rule bg-paper px-3 py-2 text-ink-2">
              {original}
              <button type="button" onClick={() => onChange(original)} className="ml-2 font-medium text-brand hover:underline">
                Revert
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** Bullets for one included entry. New bullets must start from a profile bullet so they stay grounded. */
function EntryBullets({ jobId, entry, sources, onChange }: { jobId: string; entry: Entry; sources: { id: string; text: string }[]; onChange: (e: Entry) => void }) {
  const srcText = new Map(sources.map((s) => [s.id, s.text]));
  const used = new Set(entry.bullets.flatMap((b) => b.sourceIds));
  const unused = sources.filter((s) => !used.has(s.id));
  return (
    <div className="space-y-2">
      <ListEditor
        items={entry.bullets}
        onChange={(bullets) => onChange({ ...entry, bullets })}
        getKey={(b, i) => b.sourceIds.join("+") || String(i)}
        itemLabel="bullet"
        controls="menu"
        render={(b, update, ctl) => {
          const original = b.sourceIds.map((id) => srcText.get(id)).filter(Boolean).join(" ");
          return <BulletRow jobId={jobId} bullet={b} original={original} update={update} ctl={ctl} />;
        }}
      />
      {unused.length > 0 && (
        <Dropdown
          label="Add a bullet from your profile"
          value={null}
          placeholder="+ Add a bullet from your profile…"
          options={unused.map((s) => ({ value: s.id, label: s.text, text: s.text }))}
          onChange={(id) => {
            const s = sources.find((x) => x.id === id);
            if (s) onChange({ ...entry, bullets: [...entry.bullets, { text: s.text, sourceIds: [s.id] }] });
          }}
        />
      )}
    </div>
  );
}

function EntryList({
  jobId,
  label,
  entries,
  sources,
  onChange,
}: {
  jobId: string;
  label: string;
  entries: Entry[];
  sources: { id: string; heading: string; details: string; bullets: { id: string; text: string }[] }[];
  onChange: (e: Entry[]) => void;
}) {
  if (!sources.length) return null;
  const byId = new Map(entries.map((e) => [e.sourceId, e]));
  const toggle = (id: string, on: boolean) => {
    if (!on) return onChange(entries.filter((e) => e.sourceId !== id));
    const src = sources.find((s) => s.id === id)!;
    onChange([...entries, { sourceId: id, bullets: src.bullets.map((b) => ({ text: b.text, sourceIds: [b.id] })) }]);
  };
  return (
    <div>
      <Label>{label}</Label>
      <div className="space-y-2">
        {sources.map((s) => {
          const entry = byId.get(s.id);
          return (
            <EntryCard
              key={s.id}
              title={s.heading}
              subtitle={joinParts(s.details, entry ? `${entry.bullets.length} of ${count(s.bullets.length, "bullet")}` : "Not on this resume")}
              dim={!entry}
              aside={
                <label className="flex cursor-pointer items-center gap-1.5 px-1 text-xs text-ink-2">
                  <input type="checkbox" checked={Boolean(entry)} onChange={(e) => toggle(s.id, e.target.checked)} className="accent-[var(--brand)]" />
                  On resume
                </label>
              }
            >
              {entry && <EntryBullets jobId={jobId} entry={entry} sources={s.bullets} onChange={(n) => onChange(entries.map((x) => (x.sourceId === s.id ? n : x)))} />}
            </EntryCard>
          );
        })}
      </div>
    </div>
  );
}

export function ResumeEditor({
  jobId,
  job,
  profile,
  initial,
  initialWarnings,
  version,
  edited,
}: {
  jobId: string;
  job: Pick<Job, "title" | "description" | "company">;
  profile: Profile;
  initial: TailoredResume | null;
  initialWarnings: Warning[];
  /** When the stored resume last changed; a new one (save, tailor, restore) replaces the draft. */
  version?: string;
  /** Hand-edited since it was tailored. */
  edited?: boolean;
}) {
  const [doc, setDoc] = useState<TailoredResume | null>(initial);
  const [saved, setSaved] = useState(initial);
  const [warnings, setWarnings] = useState(initialWarnings);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const [tailoring, setTailoring] = useState(false);
  const seconds = useElapsed(pending && tailoring);
  const { confirm, dialog } = useConfirm();
  const dirty = JSON.stringify(doc) !== JSON.stringify(saved);

  // Take a new stored version in place rather than remounting, so the roles you have open stay open.
  const [shown, setShown] = useState(version);
  if (version !== shown) {
    setShown(version);
    setDoc(initial);
    setSaved(initial);
    setWarnings(initialWarnings);
  }

  const generate = async (useAI: boolean) => {
    // Only ask when there's something to lose: unsaved changes, or edits made since it was tailored.
    if (
      doc &&
      (dirty || edited) &&
      !(await confirm({
        title: "Replace this resume?",
        body: useAI
          ? "AI will re-tailor from your profile. Your edits to this resume will be lost."
          : "Your best-matching bullets will be picked to fill the page, without AI. Your edits to this resume will be lost.",
        confirmLabel: "Replace",
      }))
    )
      return;
    setTailoring(useAI);
    start(async () => {
      setError("");
      const res = await safe(() => tailorResumeAction(jobId, useAI));
      if (!res.ok) setError(res.error);
      // The server re-renders this page with the new doc, which arrives as a new `version`.
    });
  };

  const save = () => {
    setTailoring(false);
    start(async () => {
      if (!doc) return;
      setError("");
      const res = await safe(() => saveResumeAction(jobId, doc));
      if (res.ok) {
        setSaved(doc);
        setWarnings(res.data ?? []);
      } else setError(res.error);
    });
  };

  const actions = (
    <div className="flex flex-wrap gap-2">
      <Button variant={doc ? "secondary" : "primary"} disabled={pending} onClick={() => generate(true)}>
        <Sparkles className="h-4 w-4" />
        {pending && tailoring ? working("Tailoring", seconds) : pending ? "Working…" : doc ? "Re-tailor with AI" : "Tailor with AI"}
      </Button>
      <Button variant="ghost" disabled={pending} onClick={() => generate(false)}>Tailor without AI</Button>
      <Link href={settingsHref("tailoring", `/jobs/${jobId}`)} className={buttonClass("ghost", "md", "ml-auto")}>
        <SlidersHorizontal className="h-4 w-4" /> Tailoring settings
      </Link>
    </div>
  );

  if (!doc) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-ink-2">
          No resume for this job yet. AI tailoring picks and rephrases from your profile. Every bullet stays linked to the one it
          came from, and anything it can&apos;t trace back is removed or flagged.
        </p>
        {actions}
        {error && <p className="text-sm text-warn">{error}</p>}
      </div>
    );
  }

  return (
    // Locked while saving/generating: the server's version replaces the draft afterwards, so typing now would be lost.
    <fieldset disabled={pending} className="min-w-0 space-y-4">
      {dialog}
      {actions}
      {error && <p className="text-sm text-warn">{error}</p>}
      <Warnings items={warnings} />
      <KeywordGap job={job} profile={profile} doc={doc} onChange={setDoc} />

      <div>
        <Label>Summary</Label>
        <Textarea rows={3} aria-label="Summary" value={doc.summary} onChange={(e) => setDoc({ ...doc, summary: e.target.value })} />
      </div>

      <EntryList
        jobId={jobId}
        label="Experience"
        entries={doc.experience}
        onChange={(experience) => setDoc({ ...doc, experience })}
        sources={profile.experience.map((e) => ({ id: e.id, heading: e.title || "Untitled role", details: joinParts(e.company, dates(e.start, e.end)), bullets: e.bullets }))}
      />
      <EntryList
        jobId={jobId}
        label="Projects"
        entries={doc.projects}
        onChange={(projects) => setDoc({ ...doc, projects })}
        sources={profile.projects.map((p) => ({ id: p.id, heading: p.name || "Untitled project", details: p.tech.join(", "), bullets: p.bullets }))}
      />

      {profile.extras.map((x) => (
        <EntryList
          key={x.id}
          jobId={jobId}
          label={x.title || "Other"}
          entries={doc.extras}
          onChange={(extras) => setDoc({ ...doc, extras })}
          sources={x.entries.map((e) => ({ id: e.id, heading: e.title || "Untitled", details: joinParts(e.org, dates(e.start, e.end)), bullets: e.bullets }))}
        />
      ))}

      {profile.education.length > 0 && (
        <div>
          <Label>Education</Label>
          <div className="space-y-1">
            {profile.education.map((e) => (
              <label key={e.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="accent-[var(--brand)]"
                  checked={doc.educationIds.includes(e.id)}
                  onChange={(ev) =>
                    setDoc({
                      ...doc,
                      educationIds: ev.target.checked
                        ? profile.education.filter((x) => x.id === e.id || doc.educationIds.includes(x.id)).map((x) => x.id)
                        : doc.educationIds.filter((id) => id !== e.id),
                    })
                  }
                />
                {e.school}{e.degree && ` · ${e.degree}`}
              </label>
            ))}
          </div>
        </div>
      )}

      <div>
        <Label>Skills (only skills already in your profile are kept)</Label>
        <ListEditor
          items={doc.skills}
          onChange={(skills) => setDoc({ ...doc, skills })}
          addLabel="Skill group"
          onAdd={() => ({ category: "", items: [] })}
          itemLabel="skill group"
          controls="menu"
          render={(s, update, ctl) => (
            <div className="flex items-start gap-1">
              <div className="grid flex-1 gap-2 sm:grid-cols-[10rem_1fr]">
                <Input aria-label="Skill group name" value={s.category} onChange={(e) => update({ ...s, category: e.target.value })} />
                <CommaInput aria-label={`${s.category || "Skills"}, comma-separated`} value={s.items} onChange={(items) => update({ ...s, items })} />
              </div>
              <RowMenu label="Skill group actions" actions={itemActions(ctl)} />
            </div>
          )}
        />
      </div>
      <SaveBar dirty={dirty} pending={pending} onSave={save} onDiscard={() => setDoc(saved)} />
    </fieldset>
  );
}