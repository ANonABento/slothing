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
      links: list(z.object({ label: str, url: str })),
    })
    .default({ name: "", email: "", phone: "", location: "", links: [] }),
  summary: str,
  experience: z
    .array(
      z.object({
        company: str,
        title: str,
        url: str,
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
    .array(z.object({ name: str, tech: list(z.string()), url: str, bullets: list(z.string()) }))
    .default([]),
  skills: z.array(z.object({ category: str, items: list(z.string()) })).default([]),
  extras: z
    .array(
      z.object({
        title: str,
        entries: list(z.object({ title: str, org: str, location: str, start: str, end: str, url: str, bullets: list(z.string()) })),
      }),
    )
    .default([]),
});

type Pdf = Awaited<ReturnType<typeof import("unpdf").getDocumentProxy>>;

/**
 * Hyperlinks live in annotations, not the text layer, so a role line or "Portfolio" loses its URL in the
 * extracted text. Pair each link with the words under its rectangle, so the model can put it back on
 * the right role, project or contact item.
 */
async function pdfLinks(pdf: Pdf): Promise<string[]> {
  const out: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const annotations = (await page.getAnnotations()) as { url?: string; rect?: number[] }[];
    if (!annotations.some((a) => a.url)) continue;
    const items = (await page.getTextContent()).items.flatMap((t) =>
      "str" in t && t.str.trim() ? [{ str: t.str, x: t.transform[4], y: t.transform[5], w: t.width, h: t.height || Math.abs(t.transform[3]) }] : [],
    );
    for (const a of annotations) {
      if (!a.url || a.url.startsWith("mailto:") || !a.rect) continue;
      const [x1, y1, x2, y2] = a.rect;
      // Words whose middle falls inside the link's box.
      const under = items.filter((t) => t.x + t.w / 2 >= x1 && t.x + t.w / 2 <= x2 && t.y + t.h / 2 >= y1 - 1 && t.y + t.h / 2 <= y2 + 1);
      const label = under.map((t) => t.str).join(" ").replace(/\s+/g, " ").trim();
      out.push(`${label || "(icon)"} → ${a.url}`);
    }
  }
  return [...new Set(out)];
}

export async function extractText(file: File): Promise<string> {
  const buf = Buffer.from(await file.arrayBuffer());
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf")) {
    const { extractText, getDocumentProxy } = await import("unpdf");
    const pdf = await getDocumentProxy(new Uint8Array(buf));
    const { text } = await extractText(pdf, { mergePages: true });
    const links = await pdfLinks(pdf);
    return links.length ? `${text}\n\nHyperlinks in the document (the text they sit on → URL):\n${links.join("\n")}` : text;
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

Links: when a hyperlinks list is given, each line is "text the link sits on → URL". Use it to fill
contact.links, experience url and project url: a link on a role's line is that role's url, a link on
a project's line (or its icon right after it) is that project's url.
contact.links: one per header item, label copied exactly as written. A labelled link is
{ "label": "<its text>", "url": "https://…" }; a
bare URL is { "label": "", "url": "github.com/name" }; a header item that is not a link (e.g. a
citizenship or availability note) is { "label": "the text", "url": "" }. Email, phone and location
go in their own fields, not in links.
Projects: a heading like "FlowTO | Python | FastAPI" is name "FlowTO" with tech ["Python", "FastAPI"].
The name never contains the tools.
Every other section (Certifications, Awards, Leadership, Volunteering, Publications, Activities…)
goes in "extras" under its own heading as written, one entry per item: title (the certification,
award or role), org (issuer or organisation), dates, and any bullets. Plain lists such as
Languages or Interests go in skills as their own group. Never drop a section.

JSON shape:
{
  "contact": { "name", "email", "phone", "location", "links": [{ "label", "url" }] },
  "summary": string,
  "experience": [{ "company", "title", "url", "location", "start", "end", "bullets": [string] }],
  "education": [{ "school", "degree", "location", "start", "end", "details" }],
  "projects": [{ "name", "tech": [string], "url", "bullets": [string] }],
  "skills": [{ "category", "items": [string] }],
  "extras": [{ "title", "entries": [{ "title", "org", "location", "start", "end", "url", "bullets": [string] }] }]
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
  // Older imports kept the tools in the name ("FlowTO | Python"), so match on the part before "|".
  const prj = take(prev.projects, (p) => norm(p.name.split("|")[0]));
  const edu = take(prev.education, (e) => norm(`${e.school}|${e.degree}`));
  const sk = take(prev.skills, (g) => norm(g.category));
  const sec = take(prev.extras, (x) => norm(x.title));
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
    extras: next.extras.map((x) => {
      const old = sec(x);
      const ent = take(old?.entries ?? [], (e) => norm(`${e.title}|${e.org}`));
      return {
        ...x,
        id: old?.id ?? x.id,
        entries: x.entries.map((e) => {
          const o = ent(e);
          return { ...e, id: o?.id ?? e.id, rank: o?.rank ?? e.rank, bullets: bullets(o?.bullets, e.bullets) };
        }),
      };
    }),
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
    extras: raw.extras
      .filter((x) => x.entries.length)
      .map((x) => ({ id: newId("sec"), title: x.title, entries: x.entries.map((e) => ({ ...e, id: newId("ext"), bullets: withIds(e.bullets) })) })),
  });
}
