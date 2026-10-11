import { generateJSON } from "./llm";
import { CoverLetter, TailoredResume, type Job, type Profile, type Warning } from "./types";

/* ─── Grounding ───
 * The model only ever chooses and rephrases. Everything it returns is checked against the
 * profile: unknown entries are dropped, bullets must cite real source bullets from the same
 * entry, skills must already exist, and any number not present in the cited sources is flagged.
 */

const NUM = /\d[\d,.]*\s*(?:%|x|k|m|b|\+)?/gi;
const numbersIn = (s: string) => new Set((s.match(NUM) ?? []).map((n) => n.replace(/[,\s]/g, "").toLowerCase().replace(/\.$/, "")));

function unsupportedNumbers(text: string, sources: string): string[] {
  const known = numbersIn(sources);
  return [...numbersIn(text)].filter((n) => !known.has(n));
}

export function groundResume(profile: Profile, draft: TailoredResume): { doc: TailoredResume; warnings: Warning[] } {
  const warnings: Warning[] = [];

  const groundEntries = (
    kind: "experience" | "projects",
    entries: TailoredResume["experience"],
    label: (id: string) => string,
  ) => {
    const source = new Map(profile[kind].map((e) => [e.id, e]));
    const order = new Map(profile[kind].map((e, i) => [e.id, i]));
    const seen = new Set<string>();
    return entries
      .filter((e) => {
        if (!source.has(e.sourceId)) {
          warnings.push({ where: kind, message: `Dropped an entry that isn't in your profile (${e.sourceId}).` });
          return false;
        }
        if (seen.has(e.sourceId)) return false;
        seen.add(e.sourceId);
        return true;
      })
      .sort((a, b) => order.get(a.sourceId)! - order.get(b.sourceId)!)
      .map((e) => {
        const src = source.get(e.sourceId)!;
        const srcBullets = new Map(src.bullets.map((b) => [b.id, b.text]));
        const bullets = e.bullets.flatMap((b) => {
          const sourceIds = b.sourceIds.filter((id) => srcBullets.has(id));
          if (!sourceIds.length) {
            warnings.push({ where: label(e.sourceId), message: `Dropped a bullet with no source in your profile: "${b.text}"` });
            return [];
          }
          const nums = unsupportedNumbers(b.text, sourceIds.map((id) => srcBullets.get(id)).join(" "));
          if (nums.length) {
            warnings.push({ where: label(e.sourceId), message: `"${b.text}" mentions ${nums.join(", ")}, which isn't in the source bullet.` });
          }
          return [{ text: b.text.trim(), sourceIds }];
        });
        return { sourceId: e.sourceId, bullets };
      });
  };

  const expLabel = (id: string) => {
    const e = profile.experience.find((x) => x.id === id);
    return e ? `${e.title} @ ${e.company}` : id;
  };
  const prjLabel = (id: string) => profile.projects.find((x) => x.id === id)?.name ?? id;

  const known = new Map(profile.skills.flatMap((g) => g.items).map((s) => [s.toLowerCase().trim(), s]));
  const skills = draft.skills
    .map((g) => {
      const items: string[] = [];
      for (const item of g.items) {
        const match = known.get(item.toLowerCase().trim());
        if (match) items.push(match);
        else warnings.push({ where: "skills", message: `Removed "${item}" — not in your profile's skills.` });
      }
      return { category: g.category, items: [...new Set(items)] };
    })
    .filter((g) => g.items.length);

  const profileText = JSON.stringify(profile);
  const summaryNums = unsupportedNumbers(draft.summary, profileText);
  if (summaryNums.length) warnings.push({ where: "summary", message: `Summary mentions ${summaryNums.join(", ")}, which isn't in your profile.` });

  const eduIds = draft.educationIds.filter((id) => profile.education.some((e) => e.id === id));

  return {
    doc: {
      summary: draft.summary.trim(),
      experience: groundEntries("experience", draft.experience, expLabel),
      projects: groundEntries("projects", draft.projects, prjLabel),
      educationIds: eduIds.length ? eduIds : profile.education.map((e) => e.id),
      skills,
    },
    warnings,
  };
}

const jobBlock = (job: Job) =>
  `Target role: ${job.title || "(unknown title)"} at ${job.company || "(unknown company)"}\n\nJob description:\n${job.description.slice(0, 20000)}`;

const RESUME_SYSTEM = `You tailor a resume to a job description using ONLY the candidate's profile.

Hard rules — violating any of them makes the resume unusable:
- You may select, reorder, and rephrase. You may NOT add facts: no new employers, titles,
  dates, metrics, numbers, tools, responsibilities, or outcomes that the cited source bullets
  do not state.
- Every bullet must list "sourceIds": the ids of the profile bullets it is based on, all
  from the same experience/project entry.
- Reference entries by their "id" as "sourceId". Never restate company, title, or dates.
- Skills must be copied verbatim from the profile's skills. Regroup or omit freely.
- Prefer 3–5 strong bullets for recent relevant roles, fewer for older ones. Drop irrelevant
  projects. Keep the whole resume to roughly one page.
- Mirror the job description's vocabulary only where the source genuinely supports it.

JSON shape:
{
  "summary": string (2-3 sentences, may be empty),
  "experience": [{ "sourceId": string, "bullets": [{ "text": string, "sourceIds": [string] }] }],
  "projects":   [{ "sourceId": string, "bullets": [{ "text": string, "sourceIds": [string] }] }],
  "educationIds": [string],
  "skills": [{ "category": string, "items": [string] }]
}`;

export async function tailorResume(profile: Profile, job: Job) {
  const draft = await generateJSON(
    TailoredResume,
    RESUME_SYSTEM,
    `${jobBlock(job)}\n\nCandidate profile (JSON):\n${JSON.stringify(profile)}`,
  );
  return groundResume(profile, draft);
}

const LETTER_SYSTEM = `You write a concise cover letter (3–4 short paragraphs, under 350 words)
for the candidate, using ONLY facts from their profile. Do not invent metrics, employers,
projects, or experiences. Be specific to the job description, warm but plain — no clichés
like "I am writing to express my interest". Do not include the date, addresses, or signature
name; those are added separately.

JSON shape: { "greeting": string, "paragraphs": [string], "closing": string }`;

export async function writeCoverLetter(profile: Profile, job: Job): Promise<{ doc: CoverLetter; warnings: Warning[] }> {
  const doc = await generateJSON(
    CoverLetter,
    LETTER_SYSTEM,
    `${jobBlock(job)}\n\nCandidate profile (JSON):\n${JSON.stringify(profile)}`,
  );
  const profileText = JSON.stringify(profile) + job.description;
  const warnings: Warning[] = doc.paragraphs.flatMap((p, i) => {
    const nums = unsupportedNumbers(p, profileText);
    return nums.length ? [{ where: `paragraph ${i + 1}`, message: `Mentions ${nums.join(", ")}, which isn't in your profile.` }] : [];
  });
  return { doc, warnings };
}

export { unsupportedNumbers };
