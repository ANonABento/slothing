"use client";

import { useRef, useState, useTransition } from "react";

import { importResumeAction, saveProfileAction } from "@/app/actions";
import type { Bullet, Profile } from "@/lib/types";
import { ListEditor } from "./list-editor";
import { PdfPreview } from "./pdf-preview";
import { Button, Card, Eyebrow, Input, Label, Textarea } from "./ui";

const cid = (p: string) => `${p}_${crypto.randomUUID().slice(0, 12)}`;

function Section({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-base font-semibold tracking-tight">{title}</h2>
        {action}
      </div>
      {children}
    </Card>
  );
}

function Bullets({ bullets, onChange }: { bullets: Bullet[]; onChange: (b: Bullet[]) => void }) {
  return (
    <ListEditor
      items={bullets}
      onChange={onChange}
      addLabel="Bullet"
      onAdd={() => ({ id: cid("b"), text: "" })}
      render={(b, update) => <Textarea rows={2} value={b.text} onChange={(e) => update({ ...b, text: e.target.value })} placeholder="What you did, and what came of it" />}
    />
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

function ImportPanel({ hasData, onImported }: { hasData: boolean; onImported: (p: Profile) => void }) {
  const [open, setOpen] = useState(!hasData);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  if (!open) {
    return (
      <Button variant="ghost" onClick={() => setOpen(true)}>
        Import from a resume…
      </Button>
    );
  }
  return (
    <Card className="p-4">
      <Eyebrow className="mb-2">Import</Eyebrow>
      <p className="mb-3 text-sm text-ink-2">
        Upload your current resume (PDF, DOCX, or text) or paste it. It&apos;s parsed into the editor below, and nothing is saved
        until you review it and click Save.{hasData && " Importing replaces what's in the editor."}
      </p>
      <form
        ref={formRef}
        action={(fd) =>
          start(async () => {
            setError("");
            const res = await importResumeAction(fd);
            if (res.ok && res.data) {
              onImported(res.data);
              setOpen(false);
              formRef.current?.reset();
            } else if (!res.ok) setError(res.error);
          })
        }
        className="space-y-3"
      >
        <input type="file" name="file" accept=".pdf,.docx,.txt,.md" className="block text-sm text-ink-2 file:mr-3 file:rounded-md file:border file:border-rule-strong file:bg-paper file:px-3 file:py-1 file:text-sm file:text-ink" />
        <Textarea name="text" rows={4} placeholder="…or paste resume text here" />
        {error && <p className="text-sm text-warn">{error}</p>}
        <div className="flex gap-2">
          <Button variant="primary" disabled={pending}>{pending ? "Parsing…" : "Parse resume"}</Button>
          {hasData && <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>}
        </div>
      </form>
    </Card>
  );
}

export function ProfileEditor({ initial }: { initial: Profile }) {
  const [p, setP] = useState<Profile>(initial);
  const [saved, setSaved] = useState<Profile>(initial);
  const [version, setVersion] = useState(0);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const dirty = JSON.stringify(p) !== JSON.stringify(saved);
  const hasData = Boolean(saved.contact.name || saved.experience.length);

  const set = <K extends keyof Profile>(k: K, v: Profile[K]) => setP((prev) => ({ ...prev, [k]: v }));
  const setContact = (k: keyof Profile["contact"], v: string) => set("contact", { ...p.contact, [k]: v });

  const save = () =>
    start(async () => {
      setError("");
      const res = await saveProfileAction(p);
      if (res.ok) {
        setSaved(p);
        setVersion((v) => v + 1);
      } else setError(res.error);
    });

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <Eyebrow>Your experience</Eyebrow>
            <h1 className="font-display text-3xl font-semibold tracking-tight">Profile</h1>
            <p className="mt-1 max-w-prose text-sm text-ink-2">
              Everything you&apos;ve done, written once. Tailored resumes only ever pick and rephrase from here, and never add to it.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {dirty && <span className="text-xs text-ink-3">Unsaved</span>}
            <Button variant="primary" onClick={save} disabled={pending || !dirty}>{pending ? "Saving…" : "Save"}</Button>
          </div>
        </div>
        {error && <p className="text-sm text-warn">{error}</p>}

        <ImportPanel hasData={hasData} onImported={setP} />

        <Section title="Contact">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Name" value={p.contact.name} onChange={(v) => setContact("name", v)} />
            <Field label="Email" value={p.contact.email} onChange={(v) => setContact("email", v)} />
            <Field label="Phone" value={p.contact.phone} onChange={(v) => setContact("phone", v)} />
            <Field label="Location" value={p.contact.location} onChange={(v) => setContact("location", v)} />
          </div>
          <div className="mt-3">
            <Label>Links (one per line)</Label>
            <Textarea
              rows={2}
              value={p.contact.links.join("\n")}
              onChange={(e) => set("contact", { ...p.contact, links: e.target.value.split("\n") })}
              onBlur={() => set("contact", { ...p.contact, links: p.contact.links.map((l) => l.trim()).filter(Boolean) })}
              placeholder="linkedin.com/in/you"
            />
          </div>
        </Section>

        <Section title="Summary">
          <Textarea rows={3} value={p.summary} onChange={(e) => set("summary", e.target.value)} placeholder="Optional. Two or three sentences about you." />
        </Section>

        <Section title="Experience">
          <ListEditor
            items={p.experience}
            onChange={(v) => set("experience", v)}
            addLabel="Role"
            onAdd={() => ({ id: cid("exp"), company: "", title: "", location: "", start: "", end: "", bullets: [] })}
            render={(e, update) => (
              <div className="space-y-2 rounded-md border border-rule p-3">
                <div className="grid gap-2 sm:grid-cols-2">
                  <Field label="Title" value={e.title} onChange={(v) => update({ ...e, title: v })} />
                  <Field label="Company" value={e.company} onChange={(v) => update({ ...e, company: v })} />
                  <Field label="Start" value={e.start} onChange={(v) => update({ ...e, start: v })} placeholder="Jan 2022" />
                  <Field label="End" value={e.end} onChange={(v) => update({ ...e, end: v })} placeholder="Present" />
                  <Field label="Location" value={e.location} onChange={(v) => update({ ...e, location: v })} />
                </div>
                <Label className="pt-1">Bullets</Label>
                <Bullets bullets={e.bullets} onChange={(b) => update({ ...e, bullets: b })} />
              </div>
            )}
          />
        </Section>

        <Section title="Projects">
          <ListEditor
            items={p.projects}
            onChange={(v) => set("projects", v)}
            addLabel="Project"
            onAdd={() => ({ id: cid("prj"), name: "", url: "", bullets: [] })}
            render={(pr, update) => (
              <div className="space-y-2 rounded-md border border-rule p-3">
                <div className="grid gap-2 sm:grid-cols-2">
                  <Field label="Name" value={pr.name} onChange={(v) => update({ ...pr, name: v })} />
                  <Field label="URL" value={pr.url} onChange={(v) => update({ ...pr, url: v })} />
                </div>
                <Label className="pt-1">Bullets</Label>
                <Bullets bullets={pr.bullets} onChange={(b) => update({ ...pr, bullets: b })} />
              </div>
            )}
          />
        </Section>

        <Section title="Education">
          <ListEditor
            items={p.education}
            onChange={(v) => set("education", v)}
            addLabel="School"
            onAdd={() => ({ id: cid("edu"), school: "", degree: "", location: "", start: "", end: "", details: "" })}
            render={(e, update) => (
              <div className="grid gap-2 rounded-md border border-rule p-3 sm:grid-cols-2">
                <Field label="School" value={e.school} onChange={(v) => update({ ...e, school: v })} />
                <Field label="Degree" value={e.degree} onChange={(v) => update({ ...e, degree: v })} />
                <Field label="Start" value={e.start} onChange={(v) => update({ ...e, start: v })} />
                <Field label="End" value={e.end} onChange={(v) => update({ ...e, end: v })} />
                <Field label="Location" value={e.location} onChange={(v) => update({ ...e, location: v })} />
                <Field label="Details" value={e.details} onChange={(v) => update({ ...e, details: v })} placeholder="GPA, honours, coursework" />
              </div>
            )}
          />
        </Section>

        <Section title="Skills">
          <ListEditor
            items={p.skills}
            onChange={(v) => set("skills", v)}
            addLabel="Skill group"
            onAdd={() => ({ id: cid("sk"), category: "", items: [] })}
            render={(s, update) => (
              <div className="grid gap-2 sm:grid-cols-[10rem_1fr]">
                <Input value={s.category} onChange={(e) => update({ ...s, category: e.target.value })} placeholder="Languages" />
                <Input
                  value={s.items.join(", ")}
                  onChange={(e) => update({ ...s, items: e.target.value.split(",").map((x) => x.trimStart()) })}
                  onBlur={() => update({ ...s, items: s.items.map((x) => x.trim()).filter(Boolean) })}
                  placeholder="TypeScript, Python, SQL"
                />
              </div>
            )}
          />
        </Section>
      </div>

      <div className="lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
        <Eyebrow className="mb-2">Base resume · all of it, untailored</Eyebrow>
        {hasData ? (
          <PdfPreview query="kind=resume" version={version} />
        ) : (
          <Card className="p-6 text-sm text-ink-2">Import or fill in your profile, save, and a preview appears here.</Card>
        )}
      </div>
    </div>
  );
}
