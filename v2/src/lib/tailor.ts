import { z } from "zod";

import { GAP_TERMS, hasTerm, keyTerms, spelledAs } from "./gap";
import { generateJSON } from "./llm";
import { withoutHidden } from "./resolve";
import { CoverLetter, LETTER_LENGTHS, type Answer, Settings, TailoredResume, entriesOf, type EntryKind, type Job, type Latitude, type LetterLength, type LetterSettings, type Profile, type TailoringSettings, type Warning } from "./types";

/* ─── Grounding ───
 * The model only ever chooses and rephrases. Everything it returns is checked against the
 * profile: unknown entries are dropped, bullets must cite real source bullets from the same
 * entry, skills must already exist, and any number not present in the cited sources is flagged.
 */

// A number plus an optional unit that is clearly part of it: "40%", "3x", "5k", "$2M", "100+".
// Single-letter units need a word boundary so "5 key accounts" isn't read as "5k".
const NUM = /(\d+(?:[.,]\d+)*)\s*(%|\s?percent\b|x\b|[kmb]\b|\+)?/gi;

// Spelled-out numbers are numbers too ("ten engineers"). "One" isn't: it's mostly "one of", "one-on-one".
const UNITS = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const SMALL: Record<string, number> = {
  ...Object.fromEntries(UNITS.slice(2).map((w, i) => [w, i + 2])),
  ...Object.fromEntries("ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split(" ").map((w, i) => [w, i + 10])),
};
const TENS: Record<string, number> = Object.fromEntries("twenty thirty forty fifty sixty seventy eighty ninety".split(" ").map((w, i) => [w, (i + 2) * 10]));
const NUMBER_WORD = new RegExp(`\\b(?:(${Object.keys(TENS).join("|")})(?:[- ](${UNITS.slice(1).join("|")}))?|(${Object.keys(SMALL).join("|")}))\\b`, "gi");

/** "ten" → "10", "twenty-five" → "25", so a spelled-out figure is checked like a written one. */
export const digitsFor = (s: string) =>
  s.replace(NUMBER_WORD, (_, tens?: string, unit?: string, small?: string) =>
    String(small ? SMALL[small.toLowerCase()] : TENS[tens!.toLowerCase()] + (unit ? UNITS.indexOf(unit.toLowerCase()) : 0)),
  );

function numbersIn(s: string): Set<string> {
  const out = new Set<string>();
  for (const [, raw, unit = ""] of digitsFor(s).matchAll(NUM)) {
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

/** "Mentions 12, 70%, which aren't in …": the numbers or terms, and the verb that agrees with them. */
export const notIn = (items: string[], where: string) => `${items.join(", ")}, which ${items.length > 1 ? "aren't" : "isn't"} in ${where}`;

/**
 * Key terms of the posting that `text` uses and the profile never does: wording a draft lifted from the
 * job ad ("hemodynamic monitoring"). Title words don't count ("Senior Analyst" may say "analyst"), and
 * neither does a term the profile has spelled out or abbreviated.
 */
export function borrowedTerms(profile: Profile, text: string, job: Pick<Job, "title" | "description" | "company">, facts = profileFacts(profile)): string[] {
  // Every term the keyword gap might show: one it ticks on the resume must be checked here too.
  return keyTerms(job, profile.skills.flatMap((g) => g.items), GAP_TERMS)
    .filter((t) => hasTerm(text, t.term) && !hasTerm(facts, t.term) && !hasTerm(job.title, t.term) && !spelledAs(facts, t))
    .map((t) => `“${t.label}”`)
    .slice(0, 3);
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

/**
 * With the job, wording lifted from the posting is flagged too: in the summary when the profile never
 * says it, and in a bullet when its cited sources don't.
 */
export function groundResume(profile: Profile, draft: TailoredResume, job?: Pick<Job, "title" | "description" | "company">): { doc: TailoredResume; warnings: Warning[] } {
  const warnings: Warning[] = [];
  const facts = profileFacts(profile);

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
          const cited = sourceIds.map((id) => srcBullets.get(id)).join(" ");
          const nums = unsupportedNumbers(b.text, cited);
          if (nums.length) {
            warnings.push({ where: label(e.sourceId), message: `"${b.text}" mentions ${notIn(nums, "the source bullet")}.`, kind: "number" });
          }
          const borrowed = job ? borrowedTerms(profile, b.text, job, cited) : [];
          if (borrowed.length) {
            warnings.push({ where: label(e.sourceId), message: `"${b.text}" uses ${notIn(borrowed, "the source bullet")}. It's the posting's wording.`, kind: "posting" });
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

  const summaryNums = unsupportedNumbers(draft.summary, facts);
  if (summaryNums.length) warnings.push({ where: "summary", message: `Summary mentions ${notIn(summaryNums, "your profile")}.`, kind: "number" });
  const summaryBorrowed = job ? borrowedTerms(profile, draft.summary, job, facts) : [];
  if (summaryBorrowed.length) warnings.push({ where: "summary", message: `Summary uses ${notIn(summaryBorrowed, "your profile")}. It's from the posting.`, kind: "posting" });

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
  return groundResume(full, withPinned(profile, draft), job);
}

/* ─── Reword one bullet ───
 * Alternatives for a single bullet on a job's resume, grounded like a tailored resume: they cite the
 * same profile bullets as the one they replace, and any number those bullets don't state is flagged.
 * Profile bullets are never reworded: they're what the AI is grounded against.
 */

export interface Rewording {
  text: string;
  /** Set when the text has a number the cited bullets don't. */
  warning?: string;
}

const REWORDINGS = z.object({ alternatives: z.preprocess((v) => v ?? [], z.array(z.preprocess((v) => v ?? "", z.string()))) });

export const rewordSystem = (instructions: string) => `You reword ONE resume bullet for a specific job, using ONLY what its source bullets say.

Hard rules:
- Do not add facts: no new numbers, metrics, tools, employers, scope or outcomes. Every claim must be
  stated by the source bullets. You may drop detail.
- Keep it one bullet: a single sentence, no leading bullet character, no trailing period required.
- Where the source genuinely supports it, use the job description's vocabulary.
- Give 3 alternatives that differ in structure or emphasis, not just synonyms. Follow the hint if one is given.

JSON shape: { "alternatives": [string, string, string] }${preferences(instructions)}`;

/** The profile bullets a tailored bullet cites, from one entry (the same rule grounding applies). */
export function citedSources(profile: Profile, sourceIds: string[]): { heading: string; bullets: string[] } | null {
  for (const kind of ["experience", "projects", "extras"] as const) {
    for (const e of entriesOf(profile, kind)) {
      const bullets = e.bullets.filter((b) => sourceIds.includes(b.id)).map((b) => b.text);
      if (!bullets.length) continue;
      const heading = "company" in e ? `${e.title} at ${e.company}` : "name" in e ? `Project: ${e.name}` : [e.title, e.org].filter(Boolean).join(", ");
      return { heading, bullets };
    }
  }
  return null;
}

export async function rewordBullet(
  profile: Profile,
  job: Pick<Job, "title" | "company" | "description">,
  bullet: { text: string; sourceIds: string[] },
  hint: string,
  t: TailoringSettings = Settings.parse({}).tailoring,
): Promise<Rewording[]> {
  const src = citedSources(profile, bullet.sourceIds);
  if (!src) throw new Error("This bullet doesn't cite a bullet in your profile, so there's nothing to reword it from.");
  const { alternatives } = await generateJSON(
    REWORDINGS,
    rewordSystem(t.instructions),
    [
      `Target role: ${job.title || "(unknown title)"} at ${job.company || "(unknown company)"}`,
      `Job description (excerpt):\n${job.description.slice(0, 6000)}`,
      `The bullet is under: ${src.heading}`,
      `Source bullet${src.bullets.length > 1 ? "s" : ""} (the only facts you may use):\n${src.bullets.map((b) => `- ${b}`).join("\n")}`,
      `Current wording on the resume:\n${bullet.text}`,
      hint.trim() ? `Hint: ${hint.trim().slice(0, 200)}` : "",
    ]
      .filter(Boolean)
      .join("\n\n"),
  );
  const sources = src.bullets.join(" ");
  const seen = new Set([bullet.text.trim().toLowerCase()]);
  return alternatives
    .map((a) => a.trim().replace(/^[-•*]\s*/, ""))
    .filter((a) => a && !seen.has(a.toLowerCase()) && seen.add(a.toLowerCase()))
    .slice(0, 3)
    .map((text) => {
      const nums = unsupportedNumbers(text, sources);
      if (nums.length) return { text, warning: `Mentions ${notIn(nums, "the source bullet")}.` };
      const borrowed = borrowedTerms(profile, text, job, sources);
      return borrowed.length ? { text, warning: `Uses ${notIn(borrowed, "the source bullet")}. It's the posting's wording.` } : { text };
    });
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

// A sentence about wanting to learn something isn't a claim to have it ("eager to apply my backend
// fundamentals to Ruby", "interested in applying that to ThoughtSpot", "new to GraphQL"). "Excited to bring my Ruby experience" still is.
const LEARNING =
  /\b(eager|excited|keen|looking forward|hoping|hope|want|would (love|like))\s+to\s+(learn|apply|grow|develop|deepen|build on|pick up|get better|ramp up)\b|\b(interested in|keen on|looking forward to|excited about)\s+(learning|applying|growing|picking up|getting better|ramping up)\b|\b(learning|new to|not yet|haven't (yet )?(used|worked)|have not (yet )?(used|worked)|ramp(ing)? up on)\b/i;

/**
 * Numbers in a letter must come from the profile. The posting only vouches for years ("Winter 2027 term"):
 * a "5+ years" in the requirements isn't the candidate's. A number the letter quotes from the posting is
 * said so, since it's often about the job ("5 billion events a day"). Posting wording is flagged only in
 * sentences about you ("I have…", "my…") that aren't about them ("your team").
 */
export function letterWarnings(profile: Profile, doc: CoverLetter, job?: Pick<Job, "title" | "description" | "company">, length?: LetterLength): Warning[] {
  const postingYears = job ? (`${job.title} ${job.description}`.match(/\b(19|20)\d{2}\b/g) ?? []) : [];
  const facts = `${profileFacts(profile)}\n${postingYears.join(" ")}`;
  const company = job?.company.trim().toLowerCase();
  const aboutMe = (sentence: string) =>
    /\b(I|I'm|I've|I'd|my|me)\b/.test(sentence) && !/\b(you|your|you're)\b/i.test(sentence) && !(company && sentence.toLowerCase().includes(company)) && !LEARNING.test(sentence);
  const warnings: Warning[] = doc.paragraphs.flatMap((p, i) => {
    const where = `Paragraph ${i + 1}`;
    const out: Warning[] = [];
    const nums = unsupportedNumbers(p, facts);
    const fromPosting = job ? nums.filter((n) => !unsupportedNumbers(n, job.description).length) : [];
    const mine = nums.filter((n) => !fromPosting.includes(n));
    if (mine.length) out.push({ where, message: `Mentions ${notIn(mine, "your profile")}.` });
    if (fromPosting.length) out.push({ where, message: `Mentions ${fromPosting.join(", ")} from the posting. Fine if it's about the job, not a claim about you.` });
    if (job) {
      const claims = p.split(/(?<=[.!?])\s+/).filter(aboutMe).join(" ");
      const borrowed = claims ? borrowedTerms(profile, claims, job, facts) : [];
      if (borrowed.length) out.push({ where, message: `Says you have ${notIn(borrowed, "your profile")}. It's from the posting.` });
    }
    return out;
  });
  // A little slack, so a letter a few words over its target doesn't raise a warning every time.
  const words = wordCount(doc.paragraphs);
  if (length && words > LETTER_LENGTHS[length] * 1.1) {
    warnings.push({ where: "Length", message: `${words} words, over the ${LETTER_LENGTHS[length]}-word target in Settings.` });
  }
  return warnings;
}


export const wordCount = (paragraphs: string[]) => paragraphs.join(" ").split(/\s+/).filter(Boolean).length;

/* ─── Application answers ───
 * Drafts for questions on an application form (the extension) or in the answer bank, from the profile
 * only. A question the profile can't answer (salary, start date, visa status) comes back blank, so you
 * write it. Prose can't cite bullets, so drafts are checked like letters: numbers, and key terms of the
 * posting that the profile never uses, since they're the posting's claim, not yours.
 */

export interface DraftQuestion {
  id: string;
  question: string;
  /** A one-line input (short answer) or a text area (a paragraph). */
  long: boolean;
}

export interface DraftAnswer {
  id: string;
  text: string;
  warning?: string;
}

const DRAFTS = z.object({
  answers: z.preprocess((v) => v ?? [], z.array(z.object({ id: z.string(), text: z.preprocess((v) => v ?? "", z.string()) }))),
});

export const answersSystem = (instructions: string) => `You draft the candidate's answers to questions on a job application, using ONLY facts from their profile.

Hard rules:
- Do not invent experience, employers, numbers, tools, credentials or outcomes. The job description tells
  you what to emphasise; it is never evidence about the candidate.
- If the profile can't answer a question (salary, start date, work authorization, visa, relocation,
  demographics, personal preferences, references), return "" for it. Never guess those.
- First person, plain and specific. No clichés ("I am excited to apply", "passionate").
- A short-answer question gets one line. A paragraph question gets 60–150 words unless it asks for a length.
- Match the tone of the candidate's saved answers when examples are given.

JSON shape: { "answers": [{ "id": string, "text": string }] }${preferences(instructions)}`;

/** A number the profile doesn't state, or a key term of the posting the profile never uses. */
export function answerWarning(profile: Profile, text: string, job?: Pick<Job, "title" | "description" | "company">): string | undefined {
  const facts = profileFacts(profile);
  const nums = unsupportedNumbers(text, facts);
  if (nums.length) return `Mentions ${notIn(nums, "your profile")}.`;
  if (!job?.description) return undefined;
  const borrowed = borrowedTerms(profile, text, job, facts);
  return borrowed.length ? `Uses ${borrowed.join(", ")} from the posting, which your profile doesn't mention.` : undefined;
}

export async function draftAnswers(
  full: Profile,
  questions: DraftQuestion[],
  context: { job?: Pick<Job, "title" | "description" | "company">; examples?: Pick<Answer, "question" | "answer">[] } = {},
  t: TailoringSettings = Settings.parse({}).tailoring,
): Promise<DraftAnswer[]> {
  if (!questions.length) return [];
  const profile = withoutHidden(full);
  const { job, examples = [] } = context;
  const { answers } = await generateJSON(
    DRAFTS,
    answersSystem(t.instructions),
    [
      job ? `Applying for: ${job.title || "(unknown title)"} at ${job.company || "(unknown company)"}\n\nJob description (excerpt):\n${job.description.slice(0, 8000)}` : "",
      examples.length ? `The candidate's saved answers, for tone:\n${examples.slice(0, 5).map((e) => `Q: ${e.question}\nA: ${e.answer.slice(0, 600)}`).join("\n\n")}` : "",
      `Candidate profile (JSON):\n${JSON.stringify(profile)}`,
      `Questions:\n${JSON.stringify(questions.map((q) => ({ id: q.id, question: q.question.slice(0, 500), length: q.long ? "paragraph" : "short answer" })))}`,
    ]
      .filter(Boolean)
      .join("\n\n"),
  );
  const byId = new Map(answers.map((a) => [a.id, a.text.trim()]));
  return questions.map((q) => {
    const text = byId.get(q.id) ?? "";
    const warning = text ? answerWarning(full, text, job) : undefined;
    return warning ? { id: q.id, text, warning } : { id: q.id, text };
  });
}
