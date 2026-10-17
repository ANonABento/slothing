"use client";

import { safe } from "@/lib/safe";
import { settingsHref } from "@/lib/settings-sections";
import { Check, FileUp, Plus, Sparkles, UserRound } from "lucide-react";
import { useRef, useState, useTransition } from "react";

import { importResumeAction, saveProfileAction } from "@/app/actions";
import type { Bullet, ContactLink, ExtraEntry, ExtraSection, Profile } from "@/lib/types";
import { ListEditor, itemActions, type ItemControls } from "./list-editor";
import { RankBadge, RankNote, rankActions } from "./rank-toggle";
import { RowMenu } from "./row-menu";
import { PageBody, PageHeader } from "./page-header";
import { PdfPreview, PreviewEmpty, PreviewPane } from "./pdf-preview";
import { SaveBar } from "./save-bar";
import { CommaInput } from "./comma-input";
import { EntryCard, count, dates, joinParts } from "./entry-card";
import { Button, Card, CardTitle, Eyebrow, Field as FieldShell, Input, Textarea, cx } from "./ui";

// getRandomValues works on plain-http LAN addresses too, unlike randomUUID.
const cid = (p: string) => `${p}_${Array.from(crypto.getRandomValues(new Uint8Array(6)), (b) => b.toString(16).padStart(2, "0")).join("")}`;

function Section({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <CardTitle>{title}</CardTitle>
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
      itemLabel="bullet"
      getKey={(b) => b.id}
      controls="menu"
      onAdd={() => ({ id: cid("b"), text: "", rank: "normal" as const })}
      render={(b, update, ctl) => (
        <div className="flex items-start gap-1">
          <Textarea
            rows={2}
            aria-label="Bullet"
            value={b.text}
            onChange={(e) => update({ ...b, text: e.target.value })}
            placeholder="What you did, and what came of it"
            className={cx("flex-1", b.rank === "hidden" && "opacity-50", b.rank === "pinned" && "border-brand")}
          />
          <div className="flex w-8 flex-col items-center gap-1">
            <RowMenu label="Bullet actions" actions={[...rankActions(b.rank, (rank) => update({ ...b, rank })), ...itemActions(ctl)]} />
            <RankBadge rank={b.rank} />
          </div>
        </div>
      )}
    />
  );
}

const SECTION_IDEAS = ["Certifications", "Awards", "Leadership", "Volunteering", "Publications"];

/** One section you name yourself, with role-shaped entries (a certification needs only a title and issuer). */
function ExtraSectionEditor({ section, onChange, controls }: { section: ExtraSection; onChange: (s: ExtraSection) => void; controls: ItemControls }) {
  return (
    <div className="space-y-2 rounded-control border border-rule p-3">
      <div className="flex items-center gap-1">
        <Input aria-label="Section name" value={section.title} onChange={(e) => onChange({ ...section, title: e.target.value })} placeholder="Section name, e.g. Certifications" className="flex-1 font-semibold" />
        <RowMenu label="Section actions" actions={itemActions(controls)} />
      </div>
      <ListEditor
        items={section.entries}
        onChange={(entries) => onChange({ ...section, entries })}
        addLabel="Entry"
        itemLabel="entry"
        controls="menu"
        getKey={(x) => x.id}
        onAdd={(): ExtraEntry => ({ id: cid("ext"), title: "", org: "", location: "", start: "", end: "", url: "", bullets: [], rank: "normal" })}
        render={(e, update, ctl) => (
          <EntryCard
            title={e.title || "New entry"}
            subtitle={joinParts(e.org, dates(e.start, e.end), e.bullets.length > 0 && count(e.bullets.length, "bullet"))}
            badge={<RankBadge rank={e.rank} />}
            aside={<RowMenu label="Entry actions" actions={[...rankActions(e.rank, (rank) => update({ ...e, rank })), ...itemActions(ctl)]} />}
            defaultOpen={!e.title}
            dim={e.rank === "hidden"}
          >
            <RankNote rank={e.rank} />
            <div className="grid gap-2 sm:grid-cols-2">
              <Field label="Title" value={e.title} onChange={(v) => update({ ...e, title: v })} placeholder="AWS Solutions Architect" />
              <Field label="Issuer or organisation" value={e.org} onChange={(v) => update({ ...e, org: v })} />
              <Field label="Start" value={e.start} onChange={(v) => update({ ...e, start: v })} />
              <Field label="End or date" value={e.end} onChange={(v) => update({ ...e, end: v })} placeholder="2025" />
              <Field label="Location" value={e.location} onChange={(v) => update({ ...e, location: v })} />
              <Field label="Link" value={e.url} onChange={(v) => update({ ...e, url: v })} />
            </div>
            <div className="pt-1 text-xs font-semibold text-ink-2">Bullets (optional)</div>
            <Bullets bullets={e.bullets} onChange={(b) => update({ ...e, bullets: b })} />
          </EntryCard>
        )}
      />
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <FieldShell label={label}>
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </FieldShell>
  );
}

function ImportPanel({ hasData, onImported }: { hasData: boolean; onImported: (p: Profile) => void }) {
  const [open, setOpen] = useState(!hasData);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const [text, setText] = useState("");

  if (!open) {
    return (
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        <FileUp className="h-3.5 w-3.5" /> Re-import from a resume
      </Button>
    );
  }
  return (
    <Card className="border-brand p-5">
      <Eyebrow className="mb-1">Import</Eyebrow>
      <CardTitle className="mb-2">Start from your current resume</CardTitle>
      <p className="mb-3 text-sm text-ink-2">
        Upload your current resume (PDF, DOCX, or text) or paste it. It&apos;s parsed into the editor below, and nothing is saved
        until you review it and click Save.{hasData && " Importing replaces what's in the editor."}
      </p>
      <form
        ref={formRef}
        // onSubmit (not action) so a failed parse keeps the chosen file and pasted text.
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          start(async () => {
            setError("");
            const res = await safe(() => importResumeAction(fd));
            if (res.ok && res.data) {
              onImported(res.data);
              setOpen(false);
              setText("");
              formRef.current?.reset();
            } else if (!res.ok) setError(res.error);
          });
        }}
        className="space-y-3"
      >
        <input type="file" name="file" aria-label="Resume file" accept=".pdf,.docx,.txt,.md" className="block text-sm text-ink-2 file:mr-3 file:h-9 file:rounded-control file:border file:border-ink file:bg-transparent file:px-3 file:text-sm file:font-medium file:text-ink" />
        <Textarea name="text" rows={4} className="max-h-[40vh]" value={text} onChange={(e) => setText(e.target.value)} aria-label="Resume text" placeholder="…or paste resume text here" />
        {error && <p className="text-sm text-warn">{error}</p>}
        <div className="flex gap-2">
          <Button variant="primary" disabled={pending}><Sparkles className="h-4 w-4" />{pending ? "Parsing…" : "Parse resume"}</Button>
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
      const res = await safe(() => saveProfileAction(p));
      if (res.ok) {
        setSaved(p);
        setVersion((v) => v + 1);
      } else setError(res.error);
    });

  return (
    <>
      <PageHeader
        icon={UserRound}
        title="Profile"
        description="Everything you've done, written once. Tailored resumes only pick and rephrase from here. They never add to it."
        actions={
          <>
            {dirty ? <span className="text-xs text-ink-3">Unsaved changes</span> : hasData && <span className="inline-flex items-center gap-1 text-xs text-ok"><Check className="h-3.5 w-3.5" />Saved</span>}
            <Button variant="primary" onClick={save} disabled={pending || !dirty}>{pending ? "Saving…" : "Save profile"}</Button>
          </>
        }
      />
      <PageBody>
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="min-w-0 space-y-4">
        {error && <p className="text-sm text-warn">{error}</p>}

        <ImportPanel hasData={hasData} onImported={setP} />

        <Section title="Contact">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Name" value={p.contact.name} onChange={(v) => setContact("name", v)} />
            <Field label="Email" value={p.contact.email} onChange={(v) => setContact("email", v)} />
            <Field label="Phone" value={p.contact.phone} onChange={(v) => setContact("phone", v)} />
            <Field label="Location" value={p.contact.location} onChange={(v) => setContact("location", v)} />
          </div>
          <div className="mt-4">
            <div className="mb-1 text-xs font-semibold text-ink-2">Links and other header items</div>
            <p className="mb-2 text-xs text-ink-3">A label shows instead of the URL (&ldquo;Portfolio&rdquo;). Leave the URL empty for plain text, like &ldquo;Open to relocation&rdquo;.</p>
            <ListEditor
              items={p.contact.links}
              onChange={(links) => set("contact", { ...p.contact, links })}
              addLabel="Link"
              itemLabel="link"
              controls="menu"
              onAdd={(): ContactLink => ({ label: "", url: "" })}
              render={(l, update, ctl) => (
                <div className="flex items-center gap-1">
                  <div className="grid flex-1 gap-2 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                    <Input aria-label="Label" value={l.label} onChange={(e) => update({ ...l, label: e.target.value })} placeholder="Label (optional)" />
                    <Input aria-label="URL" value={l.url} onChange={(e) => update({ ...l, url: e.target.value })} placeholder="linkedin.com/in/you" />
                  </div>
                  <RowMenu label="Link actions" actions={itemActions(ctl)} />
                </div>
              )}
            />
          </div>
        </Section>

        <Section title="Summary">
          <Textarea rows={3} aria-label="Summary" value={p.summary} onChange={(e) => set("summary", e.target.value)} placeholder="Optional. Two or three sentences about you." />
        </Section>

        <Section title="Experience">
          <ListEditor
            items={p.experience}
            onChange={(v) => set("experience", v)}
            addLabel="Role"
            controls="menu"
            itemLabel="role"
            confirmRemove={(e) => (e.company || e.title || e.bullets.length ? `${e.title || "This role"}${e.company ? ` at ${e.company}` : ""} and its ${e.bullets.length} bullets will be removed from your profile when you save.` : null)}
            getKey={(x) => x.id}
            onAdd={() => ({ id: cid("exp"), company: "", title: "", url: "", location: "", start: "", end: "", bullets: [], rank: "normal" as const })}
            render={(e, update, ctl) => (
              <EntryCard
                title={e.title || "New role"}
                subtitle={joinParts(e.company, dates(e.start, e.end), count(e.bullets.length, "bullet"))}
                badge={<RankBadge rank={e.rank} />}
                aside={<RowMenu label="Role actions" actions={[...rankActions(e.rank, (rank) => update({ ...e, rank })), ...itemActions(ctl)]} />}
                defaultOpen={!e.title && !e.company}
                dim={e.rank === "hidden"}
              >
                <RankNote rank={e.rank} />
                <div className="grid gap-2 sm:grid-cols-2">
                  <Field label="Title" value={e.title} onChange={(v) => update({ ...e, title: v })} />
                  <Field label="Company" value={e.company} onChange={(v) => update({ ...e, company: v })} />
                  <Field label="Start" value={e.start} onChange={(v) => update({ ...e, start: v })} placeholder="Jan 2022" />
                  <Field label="End" value={e.end} onChange={(v) => update({ ...e, end: v })} placeholder="Present" />
                  <Field label="Location" value={e.location} onChange={(v) => update({ ...e, location: v })} />
                  <Field label="Link" value={e.url} onChange={(v) => update({ ...e, url: v })} placeholder="company.com" />
                </div>
                <div className="pt-1 text-xs font-semibold text-ink-2">Bullets</div>
                <Bullets bullets={e.bullets} onChange={(b) => update({ ...e, bullets: b })} />
              </EntryCard>
            )}
          />
        </Section>

        <Section title="Projects">
          <ListEditor
            items={p.projects}
            onChange={(v) => set("projects", v)}
            addLabel="Project"
            controls="menu"
            itemLabel="project"
            confirmRemove={(x) => (x.name || x.bullets.length ? `${x.name || "This project"} and its bullets will be removed from your profile when you save.` : null)}
            getKey={(x) => x.id}
            onAdd={() => ({ id: cid("prj"), name: "", tech: [], url: "", bullets: [], rank: "normal" as const })}
            render={(pr, update, ctl) => (
              <EntryCard
                title={pr.name || "New project"}
                subtitle={joinParts(pr.tech.join(", "), count(pr.bullets.length, "bullet"))}
                badge={<RankBadge rank={pr.rank} />}
                aside={<RowMenu label="Project actions" actions={[...rankActions(pr.rank, (rank) => update({ ...pr, rank })), ...itemActions(ctl)]} />}
                defaultOpen={!pr.name}
                dim={pr.rank === "hidden"}
              >
                <RankNote rank={pr.rank} />
                <div className="grid gap-2 sm:grid-cols-2">
                  <Field label="Name" value={pr.name} onChange={(v) => update({ ...pr, name: v })} />
                  <Field label="Link" value={pr.url} onChange={(v) => update({ ...pr, url: v })} placeholder="github.com/you/project" />
                  <FieldShell label="Tools" className="sm:col-span-2">
                    <CommaInput aria-label="Tools, comma-separated" value={pr.tech} onChange={(tech) => update({ ...pr, tech })} placeholder="Python, React, PostgreSQL" />
                  </FieldShell>
                </div>
                <div className="pt-1 text-xs font-semibold text-ink-2">Bullets</div>
                <Bullets bullets={pr.bullets} onChange={(b) => update({ ...pr, bullets: b })} />
              </EntryCard>
            )}
          />
        </Section>

        <Section title="Education">
          <ListEditor
            items={p.education}
            onChange={(v) => set("education", v)}
            addLabel="School"
            controls="menu"
            itemLabel="school"
            confirmRemove={(e) => (e.school ? `${e.school} will be removed from your profile when you save.` : null)}
            getKey={(x) => x.id}
            onAdd={() => ({ id: cid("edu"), school: "", degree: "", location: "", start: "", end: "", details: "", rank: "normal" as const })}
            render={(e, update, ctl) => (
              <EntryCard
                title={e.school || "New school"}
                subtitle={joinParts(e.degree, dates(e.start, e.end))}
                badge={<RankBadge rank={e.rank} />}
                aside={<RowMenu label="School actions" actions={[...rankActions(e.rank, (rank) => update({ ...e, rank })), ...itemActions(ctl)]} />}
                defaultOpen={!e.school}
                dim={e.rank === "hidden"}
              >
                <RankNote rank={e.rank} />
                <div className="grid gap-2 sm:grid-cols-2">
                  <Field label="School" value={e.school} onChange={(v) => update({ ...e, school: v })} />
                  <Field label="Degree" value={e.degree} onChange={(v) => update({ ...e, degree: v })} />
                  <Field label="Start" value={e.start} onChange={(v) => update({ ...e, start: v })} />
                  <Field label="End" value={e.end} onChange={(v) => update({ ...e, end: v })} />
                  <Field label="Location" value={e.location} onChange={(v) => update({ ...e, location: v })} />
                  <Field label="Details" value={e.details} onChange={(v) => update({ ...e, details: v })} placeholder="GPA, honours, coursework" />
                </div>
              </EntryCard>
            )}
          />
        </Section>

        <Section title="Skills">
          <ListEditor
            items={p.skills}
            onChange={(v) => set("skills", v)}
            addLabel="Skill group"
            itemLabel="skill group"
            controls="menu"
            getKey={(x) => x.id}
            onAdd={() => ({ id: cid("sk"), category: "", items: [] })}
            render={(s, update, ctl) => (
              <div className="flex items-start gap-1">
                <div className="grid flex-1 gap-2 sm:grid-cols-[10rem_1fr]">
                  <Input aria-label="Skill group name" value={s.category} onChange={(e) => update({ ...s, category: e.target.value })} placeholder="Languages" />
                  <CommaInput aria-label={`${s.category || "Skills"}, comma-separated`} value={s.items} onChange={(items) => update({ ...s, items })} placeholder="TypeScript, Python, SQL" />
                </div>
                <RowMenu label="Skill group actions" actions={itemActions(ctl)} />
              </div>
            )}
          />
        </Section>
        <Section title="Other sections">
          <p className="-mt-2 mb-3 text-sm text-ink-2">Certifications, awards, leadership, volunteering: anything with its own heading on your resume.</p>
          <ListEditor
            items={p.extras}
            onChange={(v) => set("extras", v)}
            itemLabel="section"
            controls="menu"
            confirmRemove={(x) => (x.entries.length ? `${x.title || "This section"} and its ${x.entries.length} entries will be removed from your profile when you save.` : null)}
            getKey={(x) => x.id}
            render={(x, update, ctl) => <ExtraSectionEditor section={x} onChange={update} controls={ctl} />}
          />
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-ink-3">Add a section:</span>
            {[...SECTION_IDEAS.filter((t) => !p.extras.some((x) => x.title.toLowerCase() === t.toLowerCase())), "Other…"].map((t) => (
              <Button
                key={t}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => set("extras", [...p.extras, { id: cid("sec"), title: t === "Other…" ? "" : t, entries: [] }])}
              >
                <Plus className="h-3.5 w-3.5" /> {t}
              </Button>
            ))}
          </div>
        </Section>
        <SaveBar dirty={dirty} pending={pending} onSave={save} onDiscard={() => setP(saved)} label="Save profile" />
      </div>

      <PreviewPane>
        <Eyebrow className="mb-2">Base resume · everything except hidden</Eyebrow>
        {hasData ? (
          <PdfPreview query="kind=resume" version={version} settings={{ href: settingsHref("layout", "/profile"), label: "Design" }} />
        ) : (
          <PreviewEmpty>Import or fill in your profile, save, and a preview appears here.</PreviewEmpty>
        )}
      </PreviewPane>
    </div>
      </PageBody>
    </>
  );
}
