import { generateJSON } from "./llm";
import { withoutHidden } from "./resolve";
import { CoverLetter, LETTER_LENGTHS, Settings, TailoredResume, entriesOf, type EntryKind, type Job, type Latitude, type LetterLength, type LetterSettings, type Profile, type TailoringSettings, type Warning } from "./types";

/* ─── Grounding ───
 * The model only ever chooses and rephrases. Everything it returns is checked against the
 * profile: unknown entries are dropped, bullets must cite real source bullets from the same
 * entry, skills must already exist, and any number not present in the cited sources is flagged.
 */

// A number plus an optional unit that is clearly part of it: "40%", "3x", "5k", "$2M", "100+".
// Single-letter units need a word boundary so "5 key accounts" isn't read as "5k".
const NUM = /(\d+(?:[.,]\d+)*)\s*(%|\s?percent\b|x\b|[kmb]\b|\+)?/gi;

function numbersIn(s: string): Set<string> {
  const out = new Set<string>();
  for (const [, raw, unit = ""] of s.matchAll(NUM)) {
    const n = raw.replace(/,/g, "").replace(/\.0+$/, "").replace(/\.$/, "");
    const u = unit.trim().toLowerCase().replace("percent", "%");
    out.add(n + u);
  }
  return out;
}

/** Numbers in `text` that don't appear (with the same unit, or bare) anywhere in `sources`. */
export function unsupportedNumbers(text: string, sources: string): string[] {
  const known = numbersIn(sources);
  const bare = new Set([...known].map((k) => k.replace(/[^\d.]/g, "")));
  return [...numbersIn(text)].filter((n) => {
    if (known.has(n)) return false;
    const digits = n.replace(/[^\d.]/g, "");
    // "3" written where the source says "3+" or "3x" is fine; a bare number never vouches for a unit.
    return !(n === digits && bare.has(digits));
  });
}

/** The candidate's own words: what may vouch for a number. Excludes ids, contact details and the job posting. */
export function profileFacts(p: Profile): string {
  return [
    p.summary,
    ...p.experience.flatMap((e) => [e.title, e.company, e.start, e.end, ...e.bullets.map((b) => b.text)]),
    ...p.projects.flatMap((x) => [x.name, ...x.bullets.map((b) => b.text)]),
    ...p.education.flatMap((e) => [e.school, e.degree, e.start, e.end, e.details]),
    ...p.extras.flatMap((s) => s.entries.flatMap((e) => [e.title, e.org, e.start, e.end, ...e.bullets.map((b) => b.text)])),
    ...p.skills.flatMap((g) => g.items),
  ].join("\n");
}

export function groundResume(profile: Profile, draft: TailoredResume): { doc: TailoredResume; warnings: Warning[] } {
  const warnings: Warning[] = [];

  const groundEntries = (kind: EntryKind, entries: TailoredResume["experience"], label: (id: string) => string) => {
    const list = entriesOf(profile, kind);
    const source = new Map(list.map((e) => [e.id, e]));
    const order = new Map(list.map((e, i) => [e.id, i]));
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
            warnings.push({ where: label(e.sourceId), message: `"${b.text}" mentions ${nums.join(", ")}, which isn't in the source bullet.`, kind: "number" });
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
  const extraLabel = (id: string) => {
    const e = entriesOf(profile, "extras").find((x) => x.id === id);
    return e && "org" in e ? [e.title, e.org].filter(Boolean).join(" @ ") || id : id;
  };

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

  const summaryNums = unsupportedNumbers(draft.summary, profileFacts(profile));
  if (summaryNums.length) warnings.push({ where: "summary", message: `Summary mentions ${summaryNums.join(", ")}, which isn't in your profile.`, kind: "number" });

  const eduIds = draft.educationIds.filter((id) => profile.education.some((e) => e.id === id));

  return {
    doc: {
      summary: draft.summary.trim(),
      experience: groundEntries("experience", draft.experience, expLabel),
      projects: groundEntries("projects", draft.projects, prjLabel),
      extras: groundEntries("extras", draft.extras, extraLabel),
      educationIds: eduIds,
      skills,
    },
    warnings,
  };
}

const jobBlock = (job: Job) =>
  `Target role: ${job.title || "(unknown title)"} at ${job.company || "(unknown company)"}\n\nJob description:\n${job.description.slice(0, 20000)}`;

const LATITUDE_RULES: Record<Latitude, string> = {
  select: `- Do NOT reword anything. Choose which bullets to keep and in what order; each bullet's
  "text" must be copied exactly from the single profile bullet it cites (one id in "sourceIds").
- Set "summary" to the profile's summary exactly, or "" if it has none.`,
  rephrase: `- You may select, reorder, and lightly rephrase bullets to mirror the job description's
  vocabulary where the source genuinely supports it. Keep each bullet close to its source.
- Write a 2-3 sentence summary from the profile (may be empty).`,
  rewrite: `- You may rewrite bullets freely for impact and clarity: restructure sentences, lead with
  outcomes, and merge closely related bullets from the same entry into one (citing all of them).
- Write a 2-3 sentence summary from the profile (may be empty).`,
};

/** Free-text preferences, framed so they can't override the hard rules. */
const preferences = (instructions: string) =>
  instructions.trim()
    ? `\n\nThe candidate's style preferences. Follow them unless they conflict with the rules above:\n${instructions.trim().slice(0, 2000)}`
    : "";

export function resumeSystem(t: TailoringSettings): string {
  return `You tailor a resume to a job description using ONLY the candidate's profile.

Hard rules — violating any of them makes the resume unusable:
- You may NOT add facts: no new employers, titles, dates, metrics, numbers, tools,
  responsibilities, or outcomes that the cited source bullets do not state.
- Every bullet must list "sourceIds": the ids of the profile bullets it is based on, all
  from the same entry (a role, project, or an entry in one of the "extras" sections).
- Reference entries by their "id" as "sourceId". Never restate company, title, or dates.
- Skills must be copied verbatim from the profile's skills. Regroup or omit freely.
- Entries and bullets with "rank": "pinned" must be included. Order bullets within an entry
  as the profile does unless the job clearly calls for a different emphasis.
- Prefer 3–5 strong bullets for recent relevant roles, fewer for older ones. Drop irrelevant
  projects. Keep the whole resume to roughly one page.
- "extras" holds entries from the profile's extra sections (certifications, awards, leadership…),
  referenced by entry id. Include the ones relevant to the job; an entry with no bullets is
  included with "bullets": [].

How much you may change the wording:
${LATITUDE_RULES[t.latitude]}

JSON shape:
{
  "summary": string,
  "experience": [{ "sourceId": string, "bullets": [{ "text": string, "sourceIds": [string] }] }],
  "projects":   [{ "sourceId": string, "bullets": [{ "text": string, "sourceIds": [string] }] }],
  "extras":     [{ "sourceId": string, "bullets": [{ "text": string, "sourceIds": [string] }] }],
  "educationIds": [string],
  "skills": [{ "category": string, "items": [string] }]
}${preferences(t.instructions)}`;
}

/**
 * "Select only", enforced in code rather than trusted to the prompt: every bullet becomes the exact
 * text of the profile bullet(s) it cites (a bullet citing two becomes two), and the summary is the profile's.
 */
export function verbatim(profile: Profile, draft: TailoredResume): TailoredResume {
  const copy = (kind: EntryKind) =>
    draft[kind].map((e) => {
      const src = new Map((entriesOf(profile, kind).find((x) => x.id === e.sourceId)?.bullets ?? []).map((b) => [b.id, b.text]));
      const seen = new Set<string>();
      const bullets = e.bullets.flatMap((b) =>
        b.sourceIds.flatMap((id) => {
          if (seen.has(id)) return [];
          seen.add(id);
          // Unknown ids pass through unchanged so grounding drops them with a warning.
          return [{ text: src.get(id) ?? b.text, sourceIds: [id] }];
        }),
      );
      return { ...e, bullets };
    });
  return { ...draft, summary: profile.summary, experience: copy("experience"), projects: copy("projects"), extras: copy("extras") };
}

/**
 * Pinned items, enforced in code: a pinned entry, or an entry with a pinned bullet, is always present,
 * and every pinned bullet is in it (verbatim when the model left it out). A pinned entry the model
 * skipped gets its bullets in profile order.
 */
export function withPinned(profile: Profile, draft: TailoredResume): TailoredResume {
  const pin = (kind: EntryKind) => {
    const out = draft[kind].map((e) => ({ ...e, bullets: [...e.bullets] }));
    for (const src of entriesOf(profile, kind)) {
      const pinnedBullets = src.bullets.filter((b) => b.rank === "pinned");
      if (src.rank !== "pinned" && !pinnedBullets.length) continue;
      let entry = out.find((e) => e.sourceId === src.id);
      if (!entry) {
        const bullets = (src.rank === "pinned" ? src.bullets : pinnedBullets).filter((b) => b.rank !== "hidden");
        out.push({ sourceId: src.id, bullets: bullets.map((b) => ({ text: b.text, sourceIds: [b.id] })) });
        continue;
      }
      const cited = new Set(entry.bullets.flatMap((b) => b.sourceIds));
      for (const b of pinnedBullets) if (!cited.has(b.id)) entry.bullets.push({ text: b.text, sourceIds: [b.id] });
    }
    return out;
  };
  const pinnedEdu = profile.education.filter((e) => e.rank === "pinned").map((e) => e.id);
  return {
    ...draft,
    experience: pin("experience"),
    projects: pin("projects"),
    extras: pin("extras"),
    educationIds: [...new Set([...draft.educationIds, ...pinnedEdu])],
  };
}

export async function tailorResume(full: Profile, job: Job, t: TailoringSettings = Settings.parse({}).tailoring) {
  // The model never sees hidden items, so it can't pick them.
  const profile = withoutHidden(full);
  let draft = await generateJSON(
    TailoredResume,
    resumeSystem(t),
    `${jobBlock(job)}\n\nCandidate profile (JSON):\n${JSON.stringify(profile)}`,
  );
  // The model sometimes forgets education; default to all of it for an AI draft (hand edits may remove it).
  if (!draft.educationIds.length) draft.educationIds = profile.education.map((e) => e.id);
  if (t.latitude === "select") draft = verbatim(profile, draft);
  return groundResume(full, withPinned(profile, draft));
}

export const letterSystem = (length: LetterLength) => `You write a concise cover letter (${length === "short" ? "2–3" : "3–4"} short paragraphs, under ${LETTER_LENGTHS[length]} words)
for the candidate, using ONLY facts from their profile. Do not invent metrics, employers,
projects, or experiences. Be specific to the job description, warm but plain — no clichés
like "I am writing to express my interest". Do not include the date, addresses, or signature
name; those are added separately.

JSON shape: { "greeting": string, "paragraphs": [string], "closing": string }`;

export async function writeCoverLetter(
  profile: Profile,
  job: Job,
  t: TailoringSettings = Settings.parse({}).tailoring,
  letter: LetterSettings = Settings.parse({}).letter,
): Promise<{ doc: CoverLetter; warnings: Warning[] }> {
  const doc = await generateJSON(
    CoverLetter,
    letterSystem(letter.length) + preferences(t.instructions),
    `${jobBlock(job)}\n\nCandidate profile (JSON):\n${JSON.stringify(profile)}`,
  );
  return { doc, warnings: letterWarnings(profile, doc, job, letter.length) };
}

/**
 * Numbers in a letter must come from the profile. The posting only vouches for years ("Winter 2027 term"):
 * a "5+ years" in the requirements isn't the candidate's.
 */
export function letterWarnings(profile: Profile, doc: CoverLetter, job?: Pick<Job, "title" | "description">, length?: LetterLength): Warning[] {
  const postingYears = job ? (`${job.title} ${job.description}`.match(/\b(19|20)\d{2}\b/g) ?? []) : [];
  const facts = `${profileFacts(profile)}\n${postingYears.join(" ")}`;
  const warnings: Warning[] = doc.paragraphs.flatMap((p, i) => {
    const nums = unsupportedNumbers(p, facts);
    return nums.length ? [{ where: `Paragraph ${i + 1}`, message: `Mentions ${nums.join(", ")}, which isn't in your profile.` }] : [];
  });
  // A little slack, so a letter a few words over its target doesn't raise a warning every time.
  const words = wordCount(doc.paragraphs);
  if (length && words > LETTER_LENGTHS[length] * 1.1) {
    warnings.push({ where: "Length", message: `${words} words, over the ${LETTER_LENGTHS[length]}-word target in Settings.` });
  }
  return warnings;
}


export const wordCount = (paragraphs: string[]) => paragraphs.join(" ").split(/\s+/).filter(Boolean).length;
