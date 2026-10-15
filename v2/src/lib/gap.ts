import { resolveResume } from "./resolve";
import { terms } from "./score";
import { ENTRY_KINDS, entriesOf, type EntryKind, type Job, type Profile, type TailoredResume } from "./types";

/* ─── Keyword gap, no AI ───
 * The job's key terms, and for each one whether it's on this resume, elsewhere in your profile, or
 * nowhere. Uses the same `terms()` as the fitter's scorer, so "on the resume" means what the scorer
 * would count. A term only in the posting can't be added (grounding), only noticed.
 */

// Words most postings use that say nothing about the work: benefits, legal boilerplate, recruiting talk.
const NOISE = new Set(
  (
    "job role position candidate applicant application apply company employer employee opportunity equal status law " +
    "gender race religion color sex sexual orientation identity national origin age disability veteran protected " +
    "benefit salary pay compensation bonus equity range base insurance medical dental vision health 401k pto paid leave " +
    "office remote hybrid onsite location day week month hour time full part-time full-time contract " +
    "looking join help make best great world people mission life value culture career growth future ideal " +
    "requirement qualification responsibility preferred required minimum knowledge understanding familiarity excellent good " +
    "proven ability skill demonstrated successful success level related field equivalent must should plus bonus " +
    "please information email note accommodation submit resume privacy policy statement " +
    "ll re ve our yourself ourselves everyone every us global based meet member support including like within " +
    "senior junior intern principal staff associate ii iii iv " +
    "complex multiple single individual develop manage supporting assigned drive deliver ensure provide build improve etc " +
    "eligible eligibility recruiter recruiting hiring interview"
  ).split(" "),
);

const WORD = /[a-z0-9][a-z0-9+#.]*[a-z0-9+#]|[a-z0-9]/gi;

/** Words in order with their normalized term (null for stop words), keeping the original spelling for labels. */
export function tokens(text: string): { raw: string; term: string | null }[] {
  return (text.match(WORD) ?? []).map((raw) => ({ raw, term: terms(raw)[0] ?? null }));
}

export interface KeyTerm {
  /** Normalized, as `terms()` produces it; two words for a phrase. */
  term: string;
  /** As the posting writes it ("Power BI", "SQL"). */
  label: string;
}

const MAX_TERMS = 20;
// A word needs this many uses to count, a phrase two: postings repeat filler words twice easily.
const WORD_USES = 3;
const PHRASE_USES = 2;

/**
 * The posting's key terms, most important first: every word of the title, then words and two-word
 * phrases the description uses often. A phrase replaces its words when they mostly occur together
 * ("machine learning", not "machine" and "learning"). One of your skills counts if the posting names it
 * once: postings list tools once ("SQL, Python, Tableau") but pad with filler words. The company's own
 * name doesn't count.
 */
export function keyTerms(job: Pick<Job, "title" | "description" | "company">, skills: string[] = []): KeyTerm[] {
  const own = new Set(terms(job.company));
  const title = new Set(terms(job.title));
  // A title word always counts ("Benefits Analyst"), even one that's usually noise.
  const usable = (t: string | null): t is string => t !== null && t.length > 1 && !own.has(t) && (title.has(t) || !NOISE.has(t));
  const count = new Map<string, { n: number; spellings: Map<string, number> }>();
  const add = (term: string, raw: string, n = 1) => {
    const c = count.get(term) ?? { n: 0, spellings: new Map() };
    c.n += n;
    c.spellings.set(raw, (c.spellings.get(raw) ?? 0) + 1);
    count.set(term, c);
  };
  for (const t of tokens(job.title)) if (usable(t.term)) add(t.term, t.raw, 0);
  const toks = tokens(job.description);
  toks.forEach((t, i) => {
    if (!usable(t.term)) return;
    add(t.term, t.raw);
    const next = toks[i + 1];
    if (next && usable(next.term)) add(`${t.term} ${next.term}`, `${t.raw} ${next.raw}`);
  });

  // Skills of one or two words ("Python (pandas)" is Python), normalized like the posting's terms.
  const skill = new Set(skills.map((x) => terms(x.replace(/\(.*?\)/g, "")).join(" ")).filter((t) => t && t.split(" ").length <= 2));
  const isPhrase = (t: string) => t.includes(" ");
  // A phrase around a title word is common by nature ("benefits plan", "benefits events"), so it needs one more use.
  const phraseOk = (t: string, n: number) => n >= PHRASE_USES + (t.split(" ").some((w) => title.has(w)) ? 1 : 0);
  const inPhrase = new Map<string, number>();
  for (const [t, c] of count) if (isPhrase(t) && phraseOk(t, c.n)) for (const w of t.split(" ")) inPhrase.set(w, Math.max(inPhrase.get(w) ?? 0, c.n));

  return [...count]
    .filter(([t, c]) => {
      if (skill.has(t) && c.n > 0) return true;
      // A phrase of title words only ("Benefits Analyst") repeats chips that are already there.
      if (isPhrase(t)) return phraseOk(t, c.n) && !t.split(" ").every((w) => title.has(w));
      if (title.has(t)) return true;
      // "machine" when it's almost always "machine learning": the phrase says it better.
      return c.n - (inPhrase.get(t) ?? 0) >= WORD_USES;
    })
    .map(([term, c]) => ({ term, label: commonest(c.spellings), score: title.has(term) ? 100 + c.n : Math.min(c.n, 8) * (isPhrase(term) ? 1.5 : 1) + (skill.has(term) ? 4 : 0) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_TERMS)
    .map(({ term, label }) => ({ term, label }));
}

/** The spelling the posting uses most, so "forecasting" beats the "Forecasting" that starts a sentence. */
const commonest = (spellings: Map<string, number>) => [...spellings].reduce((a, b) => (b[1] > a[1] ? b : a))[0];

/** Whether `text` contains the term, by the same rules the scorer uses. */
export function hasTerm(text: string, term: string): boolean {
  const ts = terms(text);
  const words = term.split(" ");
  if (words.length === 1) return ts.includes(term);
  return ts.some((t, i) => t === words[0] && ts[i + 1] === words[1]);
}

/** A profile bullet or skill that has a term and isn't on the resume yet. */
export type GapSource =
  | { type: "bullet"; kind: EntryKind; entryId: string; entry: string; bulletId: string; text: string }
  | { type: "skill"; category: string; skill: string };

export type TermStatus =
  | { kind: "on" }
  /** In the profile; `sources` are the bullets and skills that could add it (may be empty: a role title, a school). */
  | { kind: "profile"; sources: GapSource[] }
  | { kind: "missing" };

/** Every word on the page: the same text an applicant tracking system would read. */
function resumeText(profile: Profile, doc: TailoredResume): string {
  const r = resolveResume(profile, doc);
  return [
    r.summary,
    ...r.experience.flatMap((e) => [e.title, e.company, ...e.bullets]),
    ...r.projects.flatMap((p) => [p.name, ...p.tech, ...p.bullets]),
    ...r.extras.flatMap((s) => s.entries.flatMap((e) => [e.title, e.org, ...e.bullets])),
    ...r.education.flatMap((e) => [e.school, e.degree, e.details]),
    ...r.skills.flatMap((g) => g.items),
  ].join("\n");
}

function profileText(p: Profile): string {
  return [
    p.summary,
    ...p.experience.flatMap((e) => [e.title, e.company, ...e.bullets.map((b) => b.text)]),
    ...p.projects.flatMap((x) => [x.name, ...x.tech, ...x.bullets.map((b) => b.text)]),
    ...p.extras.flatMap((s) => s.entries.flatMap((e) => [e.title, e.org, ...e.bullets.map((b) => b.text)])),
    ...p.education.flatMap((e) => [e.school, e.degree, e.details]),
    ...p.skills.flatMap((g) => g.items),
  ].join("\n");
}

const entryName = (e: ReturnType<typeof entriesOf>[number]) =>
  "company" in e ? [e.title, e.company].filter(Boolean).join(" · ") : "name" in e ? e.name : [e.title, e.org].filter(Boolean).join(" · ");

/**
 * Each key term of the job, and where it stands for this resume. Hidden profile items count: you can
 * still add them by hand, tailoring just never picks them.
 */
export function keywordGap(profile: Profile, job: Pick<Job, "title" | "description" | "company">, doc: TailoredResume): { term: KeyTerm; status: TermStatus }[] {
  const onPage = resumeText(profile, doc);
  const inProfile = profileText(profile);
  const used = new Set(ENTRY_KINDS.flatMap((k) => doc[k].flatMap((e) => e.bullets.flatMap((b) => b.sourceIds))));
  const skillsOn = new Set(doc.skills.flatMap((g) => g.items.map((s) => s.toLowerCase())));
  return keyTerms(job, profile.skills.flatMap((g) => g.items)).map((term) => {
    if (hasTerm(onPage, term.term)) return { term, status: { kind: "on" } };
    if (!hasTerm(inProfile, term.term)) return { term, status: { kind: "missing" } };
    const sources: GapSource[] = [
      ...ENTRY_KINDS.flatMap((kind) =>
        entriesOf(profile, kind).flatMap((e) =>
          e.bullets
            .filter((b) => !used.has(b.id) && hasTerm(b.text, term.term))
            .map((b): GapSource => ({ type: "bullet", kind, entryId: e.id, entry: entryName(e), bulletId: b.id, text: b.text })),
        ),
      ),
      ...profile.skills.flatMap((g) =>
        g.items.filter((s) => !skillsOn.has(s.toLowerCase()) && hasTerm(s, term.term)).map((s): GapSource => ({ type: "skill", category: g.category, skill: s })),
      ),
    ];
    return { term, status: { kind: "profile", sources } };
  });
}

/** The resume with one gap source added: a bullet to its entry (adding the entry if needed), a skill to its group. */
export function addSource(doc: TailoredResume, src: GapSource): TailoredResume {
  if (src.type === "skill") {
    const group = doc.skills.find((g) => g.category.toLowerCase() === src.category.toLowerCase());
    return {
      ...doc,
      skills: group
        ? doc.skills.map((g) => (g === group ? { ...g, items: [...g.items, src.skill] } : g))
        : [...doc.skills, { category: src.category, items: [src.skill] }],
    };
  }
  const bullet = { text: src.text, sourceIds: [src.bulletId] };
  const list = doc[src.kind];
  const entry = list.find((e) => e.sourceId === src.entryId);
  return {
    ...doc,
    [src.kind]: entry
      ? list.map((e) => (e === entry ? { ...e, bullets: [...e.bullets, bullet] } : e))
      : [...list, { sourceId: src.entryId, bullets: [bullet] }],
  };
}
