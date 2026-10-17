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
    "complex multiple single individual develop manage supporting assigned drive deliver ensure provide build improve etc " +
    "eligible eligibility recruiter recruiting hiring interview current upon hire maintain package applicable employment " +
    // Filler that real postings repeat often enough to pass the count (checked against Greenhouse postings).
    "through feature product service software flow solution excited limit clear learn keep just point way show bring idea " +
    "shape grow real live high own existing specific important need one list case guidance creating stage core group term " +
    // Capitalized like tools but never one: currencies, regions, legal, social links.
    "usd gbp eur cad aud inr sgd jpy chf eeo eeoc gdp emea amer apac latam kpi okr faq linkedin youtube instagram twitter facebook tiktok glassdoor"
  ).split(" "),
);

// Seniority can't be acted on, so it's never a key term, not even in the title.
const SENIORITY = new Set("senior sr junior jr intern principal staff associate ii iii iv".split(" "));

// Sentences every posting carries that aren't about the work: EEO, accommodations, scam warnings. A legal
// footnote (trademarks) goes as a whole paragraph, since only one of its sentences says so.
const BOILERPLATE = /equal (employment )?opportunit|affirmative action|e-verify|accommodation|privacy (policy|notice)|background check|scam|fraud|never ask/i;
const LEGAL = /trademark|®|™/i;

/** The posting without its boilerplate. */
function substance(text: string): string {
  return text
    .split("\n")
    .filter((line) => !LEGAL.test(line))
    .map((line) => line.split(/(?<=[.!?])\s+/).filter((s) => !BOILERPLATE.test(s)).join(" "))
    .join("\n");
}

const WORD = /[a-z0-9][a-z0-9+#.]*[a-z0-9+#]|[a-z0-9]/gi;

/** Words in order with their normalized term (null for stop words), keeping the original spelling for labels. */
export function tokens(text: string): { raw: string; term: string | null }[] {
  return (text.match(WORD) ?? []).map((raw) => ({ raw, term: terms(raw)[0] ?? null }));
}

// Two words form a phrase only inside one clause: not across "CI. We" or a list's "SQL, Python".
const CLAUSE = /[,;:()[\]|/\n•·]+|[.!?](?=\s|$)/;

// Spelled like a product, not a word: ClickHouse, PostgreSQL, Node.js, C++, C#, AWS.
const TOOLISH = /^(?:[A-Za-z]*[a-z][A-Z][A-Za-z0-9]*|[A-Za-z]+(?:\+\+|#|\.js)|[A-Z]{3,5}s?)$/;
const BULLET = /^\s*(?:[-*•·▪◦]|\d+[.)])\s+/;

/**
 * Tools the posting names, even once: anything spelled like a product (ClickHouse, AWS), and capitalized
 * names in a list that has one ("Kafka, Flink or Spark", a "- Terraform" bullet). Lists are a line's
 * comma-separated items, or consecutive one-item bullets.
 */
function namedTools(text: string, isSkill: (term: string) => boolean): Map<string, string> {
  const out = new Map<string, string>();
  const words = (item: string) => item.split(/\s+/).filter(Boolean);
  const named = (w: string) => /^[A-Z]/.test(w) && terms(w).length === 1 && !NOISE.has(terms(w)[0]) && !SENIORITY.has(terms(w)[0]);
  const anchor = (item: string) => (TOOLISH.test(item) && !NOISE.has(terms(item)[0] ?? "")) || isSkill(terms(item).join(" "));
  // A run of short items is a list; it counts when one of them is clearly a tool.
  const take = (items: string[]) => {
    let run: string[] = [];
    const flush = () => {
      if (run.length >= 2 && run.some(anchor)) for (const i of run) if (words(i).length <= 2 && words(i).every(named)) out.set(terms(i).join(" "), i);
      run = [];
    };
    for (const i of items) {
      if (words(i).length <= 3) run.push(i);
      else flush();
    }
    flush();
  };
  let bullets: string[] = [];
  for (const line of text.split("\n")) {
    const short = BULLET.test(line) ? line.replace(BULLET, "").trim() : null;
    if (short !== null && words(short).length <= 3 && !/[,;]/.test(short)) {
      bullets.push(short);
      continue;
    }
    take(bullets);
    bullets = [];
    take(line.replace(BULLET, "").split(/[,;/()]|\band\b|\bor\b/).map((s) => s.trim().replace(/[.:]$/, "")).filter(Boolean));
  }
  take(bullets);
  for (const { raw, term } of tokens(text)) if (term && TOOLISH.test(raw) && !NOISE.has(term)) out.set(term, raw);
  return out;
}

export interface KeyTerm {
  /** Normalized, as `terms()` produces it; two words for a phrase. */
  term: string;
  /** As the posting writes it ("Power BI", "SQL"). */
  label: string;
}

const MAX_TERMS = 20;
// Terms not in your profile at all are the noisiest (boilerplate, place names) and can't be acted on.
const MAX_MISSING = 8;
// A word needs this many uses to count, a phrase two: postings repeat filler words twice easily.
const WORD_USES = 3;
const PHRASE_USES = 2;

/**
 * The posting's key terms, most important first: every word of the title, the tools it names, then words
 * and two-word phrases the description uses often. A phrase replaces its words when they mostly occur
 * together ("machine learning", not "machine" and "learning"). A tool or one of your skills counts if the
 * posting names it once: postings list tools once ("SQL, Python, Tableau") but pad with filler words.
 * The company's own name, seniority and boilerplate sentences don't count.
 */
export function keyTerms(job: Pick<Job, "title" | "description" | "company">, skills: string[] = [], max = MAX_TERMS): KeyTerm[] {
  const own = new Set(terms(job.company));
  const title = new Set(terms(job.title));
  // A short skill that's also a word ("Go", "Rust", "React") only counts where the posting capitalizes it,
  // so "you'll go beyond" isn't Go.
  const cased = new Set(skills.filter((s) => /^[A-Z][A-Za-z]{0,4}$/.test(s.trim())).map((s) => terms(s)[0]).filter(Boolean));
  // A title word always counts ("Benefits Analyst"), even one that's usually noise.
  const usable = (t: string | null): t is string => t !== null && t.length > 1 && !own.has(t) && !SENIORITY.has(t) && (title.has(t) || !NOISE.has(t));
  const count = new Map<string, { n: number; spellings: Map<string, number> }>();
  const add = (term: string, raw: string, n = 1) => {
    const c = count.get(term) ?? { n: 0, spellings: new Map() };
    c.n += n;
    c.spellings.set(raw, (c.spellings.get(raw) ?? 0) + 1);
    count.set(term, c);
  };
  for (const t of tokens(job.title)) if (usable(t.term)) add(t.term, t.raw, 0);
  const description = substance(job.description);
  for (const clause of description.split(CLAUSE)) {
    const toks = tokens(clause).map((t) => (t.term && cased.has(t.term) && t.raw === t.raw.toLowerCase() ? { ...t, term: null } : t));
    toks.forEach((t, i) => {
      if (!usable(t.term)) return;
      add(t.term, t.raw);
      const next = toks[i + 1];
      if (next && usable(next.term)) add(`${t.term} ${next.term}`, `${t.raw} ${next.raw}`);
    });
  }

  // Skills of one or two words ("Python (pandas)" is Python), normalized like the posting's terms.
  const skill = new Set(skills.map((x) => terms(x.replace(/\(.*?\)/g, "")).join(" ")).filter((t) => t && t.split(" ").length <= 2));
  const tools = new Map([...namedTools(description, (t) => skill.has(t))].filter(([t]) => t && usable(t.split(" ")[0]) && !t.split(" ").some((w) => own.has(w))));
  for (const [t, label] of tools) if (!count.has(t)) add(t, label);
  const isPhrase = (t: string) => t.includes(" ");
  // A phrase around a title word is common by nature ("benefits plan", "benefits events"), so it needs one more use.
  const phraseOk = (t: string, n: number) => n >= PHRASE_USES + (t.split(" ").some((w) => title.has(w)) ? 1 : 0);
  const inPhrase = new Map<string, number>();
  for (const [t, c] of count) if (isPhrase(t) && phraseOk(t, c.n)) for (const w of t.split(" ")) inPhrase.set(w, Math.max(inPhrase.get(w) ?? 0, c.n));

  return [...count]
    .filter(([t, c]) => {
      if ((skill.has(t) || tools.has(t)) && c.n > 0) return true;
      // A phrase of title words only ("Benefits Analyst") repeats chips that are already there.
      if (isPhrase(t)) return phraseOk(t, c.n) && !t.split(" ").every((w) => title.has(w));
      if (title.has(t)) return true;
      // "machine" when it's almost always "machine learning": the phrase says it better.
      return c.n - (inPhrase.get(t) ?? 0) >= WORD_USES;
    })
    .map(([term, c]) => ({
      term,
      label: tools.get(term) ?? commonest(c.spellings),
      score: title.has(term) ? 100 + c.n : Math.min(c.n, 8) * (isPhrase(term) ? 1.5 : 1) + (skill.has(term) || tools.has(term) ? 4 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
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
  /**
   * In the profile; `sources` are the bullets and skills that could add it (may be empty: a role title, a
   * school). `as` when the profile only has it spelled differently ("Registered Nurse" for "RN").
   */
  | { kind: "profile"; sources: GapSource[]; as?: string }
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

const MINOR = new Set(["of", "and", "&", "for", "the", "in"]);
const initials = (words: string[]) => words.filter((w) => !MINOR.has(w.toLowerCase())).map((w) => w[0]).join("").toUpperCase();

/**
 * The term as the profile spells it, when one is the other's acronym: the posting's "RN" and your
 * "Registered Nurse", or its "Search Engine Optimization" and your "SEO".
 */
export function spelledAs(text: string, term: KeyTerm): string | null {
  const raw: string[] = text.match(/[A-Za-z][A-Za-z&]*/g) ?? [];
  if (/^[A-Z]{2,5}$/.test(term.label)) {
    const n = term.label.length;
    for (let i = 0; i < raw.length; i++) {
      // Up to n words plus any "of"/"and" between them, each starting with a capital.
      for (let len = n; len <= n + 2 && i + len <= raw.length; len++) {
        const words = raw.slice(i, i + len);
        if (!/^[A-Z]/.test(words[0]) || !words.every((w) => /^[A-Z]/.test(w) || MINOR.has(w.toLowerCase()))) break;
        if (initials(words) === term.label) return words.join(" ");
      }
    }
    return null;
  }
  const words = term.label.split(/\s+/);
  if (words.length < 2) return null;
  const acronym = initials(words);
  return acronym.length >= 2 && raw.includes(acronym) ? acronym : null;
}

const entryName = (e: ReturnType<typeof entriesOf>[number]) =>
  "company" in e ? [e.title, e.company].filter(Boolean).join(" · ") : "name" in e ? e.name : [e.title, e.org].filter(Boolean).join(" · ");

/**
 * Each key term of the job, and where it stands for this resume. Hidden profile items count: you can
 * still add them by hand, tailoring just never picks them. At most a few terms you don't have are shown,
 * so the ones you can act on aren't crowded out.
 */
export function keywordGap(profile: Profile, job: Pick<Job, "title" | "description" | "company">, doc: TailoredResume): { term: KeyTerm; status: TermStatus }[] {
  const onPage = resumeText(profile, doc);
  const inProfile = profileText(profile);
  const used = new Set(ENTRY_KINDS.flatMap((k) => doc[k].flatMap((e) => e.bullets.flatMap((b) => b.sourceIds))));
  const skillsOn = new Set(doc.skills.flatMap((g) => g.items.map((s) => s.toLowerCase())));
  const all = keyTerms(job, profile.skills.flatMap((g) => g.items), MAX_TERMS * 2).map((term): { term: KeyTerm; status: TermStatus } => {
    if (hasTerm(onPage, term.term)) return { term, status: { kind: "on" } };
    if (!hasTerm(inProfile, term.term)) {
      const as = spelledAs(inProfile, term);
      return { term, status: as ? { kind: "profile", sources: [], as } : { kind: "missing" } };
    }
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
  let missing = 0;
  return all.filter((g) => g.status.kind !== "missing" || ++missing <= MAX_MISSING).slice(0, MAX_TERMS);
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
