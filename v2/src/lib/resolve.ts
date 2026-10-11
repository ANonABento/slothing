import type { CoverLetter, Job, Profile, ResolvedLetter, ResolvedResume, TailoredResume } from "./types";

/** The profile as-is, rendered as a resume. Also the starting point for manual tailoring. */
export function profileAsTailored(profile: Profile): TailoredResume {
  const cite = (bullets: { id: string; text: string }[]) => bullets.map((b) => ({ text: b.text, sourceIds: [b.id] }));
  return {
    summary: profile.summary,
    experience: profile.experience.map((e) => ({ sourceId: e.id, bullets: cite(e.bullets) })),
    projects: profile.projects.map((p) => ({ sourceId: p.id, bullets: cite(p.bullets) })),
    educationIds: profile.education.map((e) => e.id),
    skills: profile.skills.map(({ category, items }) => ({ category, items })),
  };
}

/** Join a tailored resume back onto the profile. Identity fields always come from the profile. */
export function resolveResume(profile: Profile, doc: TailoredResume): ResolvedResume {
  const byId = <T extends { id: string }>(list: T[]) => new Map(list.map((x) => [x.id, x]));
  const exps = byId(profile.experience);
  const prjs = byId(profile.projects);
  const edus = byId(profile.education);
  return {
    contact: profile.contact,
    summary: doc.summary,
    experience: doc.experience.flatMap(({ sourceId, bullets }) => {
      const e = exps.get(sourceId);
      if (!e) return [];
      const { company, title, location, start, end } = e;
      return [{ company, title, location, start, end, bullets: bullets.map((b) => b.text).filter(Boolean) }];
    }),
    projects: doc.projects.flatMap(({ sourceId, bullets }) => {
      const p = prjs.get(sourceId);
      return p ? [{ name: p.name, url: p.url, bullets: bullets.map((b) => b.text).filter(Boolean) }] : [];
    }),
    education: doc.educationIds.flatMap((id) => {
      const e = edus.get(id);
      if (!e) return [];
      const { id: _id, ...rest } = e;
      return [rest];
    }),
    skills: doc.skills.filter((s) => s.items.length),
  };
}

export function resolveLetter(profile: Profile, job: Pick<Job, "company" | "title">, letter: CoverLetter): ResolvedLetter {
  return {
    contact: profile.contact,
    date: new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(new Date()),
    recipient: { company: job.company, title: job.title },
    greeting: letter.greeting,
    paragraphs: letter.paragraphs.filter((p) => p.trim()),
    closing: letter.closing,
  };
}
