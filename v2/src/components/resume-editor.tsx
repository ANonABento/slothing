"use client";

import { useState, useTransition } from "react";

import { saveResumeAction, tailorResumeAction } from "@/app/actions";
import type { Profile, TailoredResume, Warning } from "@/lib/types";
import { ListEditor } from "./list-editor";
import { Button, Input, Label, Select, Textarea, Warnings } from "./ui";

type Entry = TailoredResume["experience"][number];

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
        render={(b, update) => {
          const original = b.sourceIds.map((id) => srcText.get(id)).filter(Boolean).join(" / ");
          return (
            <div>
              <Textarea rows={2} value={b.text} onChange={(e) => update({ ...b, text: e.target.value })} />
              {original && original !== b.text && <p className="mt-0.5 text-xs text-ink-3">Source: {original}</p>}
            </div>
          );
        }}
      />
      {unused.length > 0 && (
        <Select
          value=""
          className="w-full text-xs"
          onChange={(e) => {
            const s = sources.find((x) => x.id === e.target.value);
            if (s) onChange({ ...entry, bullets: [...entry.bullets, { text: s.text, sourceIds: [s.id] }] });
          }}
        >
          <option value="">+ Add a bullet from your profile…</option>
          {unused.map((s) => (
            <option key={s.id} value={s.id}>{s.text.slice(0, 110)}</option>
          ))}
        </Select>
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
  sources: { id: string; heading: string; bullets: { id: string; text: string }[] }[];
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
            <div key={s.id} className="rounded-md border border-rule p-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                <input type="checkbox" checked={Boolean(entry)} onChange={(e) => toggle(s.id, e.target.checked)} className="accent-[var(--brand)]" />
                {s.heading}
              </label>
              {entry && (
                <div className="mt-2">
                  <EntryBullets entry={entry} sources={s.bullets} onChange={(n) => onChange(entries.map((x) => (x.sourceId === s.id ? n : x)))} />
                </div>
              )}
            </div>
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
  onSaved,
}: {
  jobId: string;
  profile: Profile;
  initial: TailoredResume | null;
  initialWarnings: Warning[];
  onSaved: () => void;
}) {
  const [doc, setDoc] = useState<TailoredResume | null>(initial);
  const [saved, setSaved] = useState(initial);
  const [warnings, setWarnings] = useState(initialWarnings);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const dirty = JSON.stringify(doc) !== JSON.stringify(saved);

  const generate = (useAI: boolean) => {
    if (doc && !window.confirm("Replace the current resume for this job?")) return;
    start(async () => {
      setError("");
      const res = await tailorResumeAction(jobId, useAI);
      if (!res.ok) setError(res.error);
      // The server re-renders this page with the new doc; the key on this component resets state.
    });
  };

  const save = () =>
    start(async () => {
      if (!doc) return;
      setError("");
      const res = await saveResumeAction(jobId, doc);
      if (res.ok) {
        setSaved(doc);
        setWarnings(res.data ?? []);
        onSaved();
      } else setError(res.error);
    });

  const actions = (
    <div className="flex flex-wrap gap-2">
      <Button variant={doc ? "secondary" : "primary"} disabled={pending} onClick={() => generate(true)}>
        {pending ? "Working…" : doc ? "Re-tailor with AI" : "Tailor with AI"}
      </Button>
      <Button variant="ghost" disabled={pending} onClick={() => generate(false)}>Start from full profile</Button>
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
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {actions}
        <div className="flex items-center gap-2">
          {dirty && <span className="text-xs text-ink-3">Unsaved</span>}
          <Button variant="primary" disabled={!dirty || pending} onClick={save}>Save</Button>
        </div>
      </div>
      {error && <p className="text-sm text-warn">{error}</p>}
      <Warnings items={warnings} />

      <div>
        <Label>Summary</Label>
        <Textarea rows={3} value={doc.summary} onChange={(e) => setDoc({ ...doc, summary: e.target.value })} />
      </div>

      <EntryList
        label="Experience"
        entries={doc.experience}
        onChange={(experience) => setDoc({ ...doc, experience })}
        sources={profile.experience.map((e) => ({ id: e.id, heading: `${e.title} · ${e.company}`, bullets: e.bullets }))}
      />
      <EntryList
        label="Projects"
        entries={doc.projects}
        onChange={(projects) => setDoc({ ...doc, projects })}
        sources={profile.projects.map((p) => ({ id: p.id, heading: p.name, bullets: p.bullets }))}
      />

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
          render={(s, update) => (
            <div className="grid gap-2 sm:grid-cols-[10rem_1fr]">
              <Input value={s.category} onChange={(e) => update({ ...s, category: e.target.value })} />
              <Input
                value={s.items.join(", ")}
                onChange={(e) => update({ ...s, items: e.target.value.split(",").map((x) => x.trimStart()) })}
                onBlur={() => update({ ...s, items: s.items.map((x) => x.trim()).filter(Boolean) })}
              />
            </div>
          )}
        />
      </div>
    </div>
  );
}
