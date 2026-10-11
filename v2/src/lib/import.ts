import { z } from "zod";

import { newId } from "./ids";
import { generateJSON } from "./llm";
import { Profile } from "./types";

/** What we ask the model for: the profile shape minus ids, bullets as plain strings. */
const Imported = z.object({
  contact: z
    .object({
      name: z.string().default(""),
      email: z.string().default(""),
      phone: z.string().default(""),
      location: z.string().default(""),
      links: z.array(z.string()).default([]),
    })
    .default({ name: "", email: "", phone: "", location: "", links: [] }),
  summary: z.string().default(""),
  experience: z
    .array(
      z.object({
        company: z.string().default(""),
        title: z.string().default(""),
        location: z.string().default(""),
        start: z.string().default(""),
        end: z.string().default(""),
        bullets: z.array(z.string()).default([]),
      }),
    )
    .default([]),
  education: z
    .array(
      z.object({
        school: z.string().default(""),
        degree: z.string().default(""),
        location: z.string().default(""),
        start: z.string().default(""),
        end: z.string().default(""),
        details: z.string().default(""),
      }),
    )
    .default([]),
  projects: z
    .array(z.object({ name: z.string().default(""), url: z.string().default(""), bullets: z.array(z.string()).default([]) }))
    .default([]),
  skills: z.array(z.object({ category: z.string().default("Skills"), items: z.array(z.string()).default([]) })).default([]),
});

export async function extractText(file: File): Promise<string> {
  const buf = Buffer.from(await file.arrayBuffer());
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf")) {
    const { extractText, getDocumentProxy } = await import("unpdf");
    const pdf = await getDocumentProxy(new Uint8Array(buf));
    const { text } = await extractText(pdf, { mergePages: true });
    return text;
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

JSON shape:
{
  "contact": { "name", "email", "phone", "location", "links": [string] },
  "summary": string,
  "experience": [{ "company", "title", "location", "start", "end", "bullets": [string] }],
  "education": [{ "school", "degree", "location", "start", "end", "details" }],
  "projects": [{ "name", "url", "bullets": [string] }],
  "skills": [{ "category", "items": [string] }]
}`;

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
