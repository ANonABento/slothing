import { z } from "zod";

import { newId } from "./ids";
import { generateJSON } from "./llm";
import { Profile, type Bullet } from "./types";

// Models often send null for missing fields; treat it as empty.
const str = z.preprocess((v) => v ?? "", z.string());
const list = <T extends z.ZodTypeAny>(item: T) => z.preprocess((v) => v ?? [], z.array(item));

/** What we ask the model for: the profile shape minus ids, bullets as plain strings. */
const Imported = z.object({
  contact: z
    .object({
      name: str,
      email: str,
      phone: str,
      location: str,
      links: list(z.string()),
    })
    .default({ name: "", email: "", phone: "", location: "", links: [] }),
  summary: str,
  experience: z
    .array(
      z.object({
        company: str,
        title: str,
        location: str,
        start: str,
        end: str,
        bullets: list(z.string()),
      }),
    )
    .default([]),
  education: z
    .array(
      z.object({
        school: str,
        degree: str,
        location: str,
        start: str,
        end: str,
        details: str,
      }),
    )
    .default([]),
  projects: z
    .array(z.object({ name: str, url: str, bullets: list(z.string()) }))
    .default([]),
  skills: z.array(z.object({ category: str, items: list(z.string()) })).default([]),
});

export async function extractText(file: File): Promise<string> {
  const buf = Buffer.from(await file.arrayBuffer());
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf")) {
    const { extractText, getDocumentProxy } = await import("unpdf");
    const pdf = await getDocumentProxy(new Uint8Array(buf));
    const { text } = await extractText(pdf, { mergePages: true });
    // Hyperlinks live in annotations, not the text layer ("Portfolio" → its URL), so collect them too.
    const urls = new Set<string>();
    for (let i = 1; i <= pdf.numPages; i++) {
      const annotations = (await (await pdf.getPage(i)).getAnnotations()) as { url?: string }[];
      for (const a of annotations) if (a.url && !a.url.startsWith("mailto:")) urls.add(a.url);
    }
    return urls.size ? `${text}\n\nHyperlinks in the document:\n${[...urls].join("\n")}` : text;
  }
  if (name.endsWith(".docx")) {
    const mammoth = await import("mammoth");
    const { value } = await mammoth.extractRawText({ buffer: buf });
    return value;
  }
  return buf.toString("utf8");
}

const SYSTEM = `You convert resume text into structured JSON. Copy facts exactly as written:
never invent, embellish, merge, or summarise. Keep every bullet point as its own string,
verbatim (fix only broken line-wraps). Dates stay in the resume's own format ("Jan 2023",
"2021", "Present"). If a field is absent, use an empty string.
contact.links must be URLs (e.g. "github.com/name", "https://name.dev"). When the text only has a
label like "Portfolio" or "LinkedIn", use the matching URL from the hyperlinks list if one is given.

JSON shape:
{
  "contact": { "name", "email", "phone", "location", "links": [string] },
  "summary": string,
  "experience": [{ "company", "title", "location", "start", "end", "bullets": [string] }],
  "education": [{ "school", "degree", "location", "start", "end", "details" }],
  "projects": [{ "name", "url", "bullets": [string] }],
  "skills": [{ "category", "items": [string] }]
}`;

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();

/**
 * Keep ids stable across a re-import: tailored resumes reference profile ids, so fresh ids would
 * silently orphan every existing tailored resume. Entries match on their identity fields, bullets on text.
 */
export function reuseIds(prev: Profile, next: Profile): Profile {
  const take = <T extends { id: string }>(pool: T[], key: (x: T) => string) => {
    const byKey = new Map(pool.map((x) => [key(x), x]));
    return (x: T) => {
      const match = byKey.get(key(x));
      if (match) byKey.delete(key(x));
      return match;
    };
  };
  // Matched entries and bullets keep their id and their pin/hide rank.
  const bullets = (old: Bullet[] | undefined, fresh: Bullet[]) => {
    const find = take(old ?? [], (b) => norm(b.text));
    return fresh.map((b) => {
      const match = find(b);
      return { ...b, id: match?.id ?? b.id, rank: match?.rank ?? b.rank };
    });
  };
  const exp = take(prev.experience, (e) => norm(`${e.company}|${e.title}`));
  const prj = take(prev.projects, (p) => norm(p.name));
  const edu = take(prev.education, (e) => norm(`${e.school}|${e.degree}`));
  const sk = take(prev.skills, (g) => norm(g.category));
  return {
    ...next,
    experience: next.experience.map((e) => {
      const old = exp(e);
      return { ...e, id: old?.id ?? e.id, rank: old?.rank ?? e.rank, bullets: bullets(old?.bullets, e.bullets) };
    }),
    projects: next.projects.map((p) => {
      const old = prj(p);
      return { ...p, id: old?.id ?? p.id, rank: old?.rank ?? p.rank, bullets: bullets(old?.bullets, p.bullets) };
    }),
    education: next.education.map((e) => {
      const old = edu(e);
      return { ...e, id: old?.id ?? e.id, rank: old?.rank ?? e.rank };
    }),
    skills: next.skills.map((g) => ({ ...g, id: sk(g)?.id ?? g.id })),
  };
}

export async function parseResumeText(text: string): Promise<Profile> {
  const raw = await generateJSON(Imported, SYSTEM, `Resume text:\n\n${text.slice(0, 40000)}`);
  const withIds = (b: string[]) => b.filter((t) => t.trim()).map((text) => ({ id: newId("b"), text: text.trim() }));
  return Profile.parse({
    contact: raw.contact,
    summary: raw.summary,
    experience: raw.experience.map((e) => ({ ...e, id: newId("exp"), bullets: withIds(e.bullets) })),
    education: raw.education.map((e) => ({ ...e, id: newId("edu") })),
    projects: raw.projects.map((p) => ({ ...p, id: newId("prj"), bullets: withIds(p.bullets) })),
    skills: raw.skills.map((s) => ({ ...s, id: newId("sk") })),
  });
}
