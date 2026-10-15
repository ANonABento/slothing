"use client";

import { safe } from "@/lib/safe";
import { settingsHref } from "@/lib/settings-sections";
import { History, SlidersHorizontal, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";

import { saveResumeAction, tailorResumeAction } from "@/app/actions";
import type { Profile, TailoredResume, Warning } from "@/lib/types";
import { CommaInput } from "./comma-input";
import { ListEditor, itemActions } from "./list-editor";
import { useConfirm } from "./confirm";
import { Dropdown } from "./dropdown";
import { EntryCard, count, dates, joinParts } from "./entry-card";
import { RowMenu } from "./row-menu";
import { SaveBar } from "./save-bar";
import { Button, Input, Label, Textarea, Warnings, buttonClass } from "./ui";

type Entry = TailoredResume["experience"][number];

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
function EntryBullets({ entry, sources, onChange }: { entry: Entry; sources: { id: string; text: string }[]; onChange: (e: Entry) => void }) {
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
          return (
            <div className="flex items-start gap-1">
              <div className="min-w-0 flex-1">
                <TailoredBulletField text={b.text} original={original} onChange={(text) => update({ ...b, text })} />
              </div>
              <RowMenu label="Bullet actions" actions={itemActions(ctl)} />
            </div>
          );
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
  label,
  entries,
  sources,
  onChange,
}: {
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
              {entry && <EntryBullets entry={entry} sources={s.bullets} onChange={(n) => onChange(entries.map((x) => (x.sourceId === s.id ? n : x)))} />}
            </EntryCard>
          );
        })}
      </div>
    </div>
  );
}

export function ResumeEditor({
  jobId,
  profile,
  initial,
  initialWarnings,
}: {
  jobId: string;
  profile: Profile;
  initial: TailoredResume | null;
  initialWarnings: Warning[];
}) {
  const [doc, setDoc] = useState<TailoredResume | null>(initial);
  const [saved, setSaved] = useState(initial);
  const [warnings, setWarnings] = useState(initialWarnings);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const { confirm, dialog } = useConfirm();
  const dirty = JSON.stringify(doc) !== JSON.stringify(saved);

  const generate = async (useAI: boolean) => {
    if (
      doc &&
      !(await confirm({
        title: "Replace this resume?",
        body: useAI
          ? "AI will re-tailor from your profile. Your edits to this resume will be lost."
          : "Your best-matching bullets will be picked to fill the page, without AI. Your edits to this resume will be lost.",
        confirmLabel: "Replace",
      }))
    )
      return;
    start(async () => {
      setError("");
      const res = await safe(() => tailorResumeAction(jobId, useAI));
      if (!res.ok) setError(res.error);
      // The server re-renders this page with the new doc; the key on this component resets state.
    });
  };

  const save = () =>
    start(async () => {
      if (!doc) return;
      setError("");
      const res = await safe(() => saveResumeAction(jobId, doc));
      if (res.ok) {
        setSaved(doc);
        setWarnings(res.data ?? []);
      } else setError(res.error);
    });

  const actions = (
    <div className="flex flex-wrap gap-2">
      <Button variant={doc ? "secondary" : "primary"} disabled={pending} onClick={() => generate(true)}>
        <Sparkles className="h-4 w-4" />
        {pending ? "Working…" : doc ? "Re-tailor with AI" : "Tailor with AI"}
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
    // Locked while saving/generating: the editor remounts with server data afterwards, so typing now would be lost.
    <fieldset disabled={pending} className="min-w-0 space-y-4">
      {dialog}
      {actions}
      {error && <p className="text-sm text-warn">{error}</p>}
      <Warnings items={warnings} />

      <div>
        <Label>Summary</Label>
        <Textarea rows={3} aria-label="Summary" value={doc.summary} onChange={(e) => setDoc({ ...doc, summary: e.target.value })} />
      </div>

      <EntryList
        label="Experience"
        entries={doc.experience}
        onChange={(experience) => setDoc({ ...doc, experience })}
        sources={profile.experience.map((e) => ({ id: e.id, heading: e.title || "Untitled role", details: joinParts(e.company, dates(e.start, e.end)), bullets: e.bullets }))}
      />
      <EntryList
        label="Projects"
        entries={doc.projects}
        onChange={(projects) => setDoc({ ...doc, projects })}
        sources={profile.projects.map((p) => ({ id: p.id, heading: p.name || "Untitled project", details: p.tech.join(", "), bullets: p.bullets }))}
      />

      {profile.extras.map((x) => (
        <EntryList
          key={x.id}
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