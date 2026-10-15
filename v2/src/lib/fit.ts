import { measureResume } from "./render";
import { resolveResume, withoutHidden } from "./resolve";
import { relevance, skillsByRelevance } from "./score";
import type { Job, Profile, ResumeLayout, TailoredResume } from "./types";

/* ─── Fit to the page ───
 * One fitter for both paths. It takes a draft (the AI's, or your whole profile for "without AI"),
 * ranks every bullet, and keeps the largest set that fits the page limit, measured with Typst's real
 * layout. Pinned items always go first. With room left over, bullets the draft didn't use (from your
 * profile, verbatim) are tried as filler. It only chooses and orders; it never writes text.
 */

type Kind = "experience" | "projects";
type TailoredBullet = TailoredResume["experience"][number]["bullets"][number];

interface Candidate {
  kind: Kind;
  entryId: string;
  /** null: an entry that has no bullets at all, included on its own. */
  bullet: TailoredBullet | null;
  /** Position within its entry on the page (draft order, then filler in profile order). */
  order: number;
  pinned: boolean;
  /** 0 = pinned, 1 = from the draft, 2 = filler from the profile. Lower goes first. */
  tier: 0 | 1 | 2;
  priority: number;
}

export type Measure = (doc: TailoredResume) => Promise<{ pages: number; fill: number }>;

export interface FitResult {
  doc: TailoredResume;
  pages: number;
  fill: number;
  /** Pinned items alone run past the limit. */
  overflow: boolean;
}

/** Pages allowed by the setting; null means no limit. */
export const pageLimit = (pages: ResumeLayout["pages"]) => (pages === "one" ? 1 : pages === "two" ? 2 : null);

// How much each further bullet of the same entry is worth: the 1st counts fully, the 2nd 0.62, the 3rd 0.45…
const decay = (rank: number) => 1 / (1 + 0.6 * rank);
// Gives zero-match bullets a floor, so they still order by rank and recency instead of tying.
const FLOOR = 0.5;
// After the largest fitting prefix, how many later candidates to try squeezing in.
const SQUEEZE_TRIES = 8;

export async function fitResume(
  full: Profile,
  job: Pick<Job, "title" | "description">,
  draft: TailoredResume,
  layout: ResumeLayout,
  measure: Measure = (doc) => measureResume(resolveResume(full, doc, layout)),
): Promise<FitResult> {
  const profile = withoutHidden(full);
  const jobText = `${job.title}\n${job.description}`;
  const limit = pageLimit(layout.pages);
  const kinds: Kind[] = layout.hide.includes("projects") ? ["experience"] : ["experience", "projects"];

  const corpus = [...kinds.flatMap((k) => profile[k].flatMap((e) => e.bullets.map((b) => b.text))), ...kinds.flatMap((k) => draft[k].flatMap((e) => e.bullets.map((b) => b.text)))];
  const score = relevance(jobText, corpus);

  // Recent roles (top of the profile) get up to +30%; projects rank a little below roles.
  const entryWeight = (kind: Kind, id: string) => {
    const list = profile[kind];
    const i = list.findIndex((e) => e.id === id);
    const recency = list.length > 1 ? 1 - i / (list.length - 1) : 1;
    return (kind === "projects" ? 0.9 : 1) * (1 + 0.3 * recency);
  };
  const pinnedBullet = new Set(kinds.flatMap((k) => profile[k].flatMap((e) => e.bullets.filter((b) => b.rank === "pinned").map((b) => b.id))));

  const candidates: Candidate[] = [];
  for (const kind of kinds) {
    for (const entry of profile[kind]) {
      const weight = entryWeight(kind, entry.id);
      const drafted = draft[kind].find((e) => e.sourceId === entry.id);
      const used = new Set(drafted?.bullets.flatMap((b) => b.sourceIds) ?? []);
      const mine: Candidate[] = [];
      // The draft's bullets keep its order on the page; filler goes after, in profile order.
      const draftBullets = (drafted?.bullets ?? []).map((b, i) => ({ bullet: b, order: i, filler: false }));
      const fillerBullets = entry.bullets
        .filter((b) => !used.has(b.id))
        .map((b) => ({ bullet: { text: b.text, sourceIds: [b.id] }, order: 1000 + entry.bullets.indexOf(b), filler: true }));
      // Within an entry, the falloff follows relevance, not page order: the best bullet counts fully.
      const ranked = (xs: typeof draftBullets, offset: number) =>
        xs
          .map((x) => ({ ...x, raw: score(x.bullet.text) + FLOOR }))
          .sort((a, b) => b.raw - a.raw)
          .map((x, rank) => ({ ...x, priority: x.raw * weight * decay(offset + rank) }));
      for (const x of [...ranked(draftBullets, 0), ...ranked(fillerBullets, draftBullets.length)]) {
        const pinned = x.bullet.sourceIds.some((id) => pinnedBullet.has(id));
        mine.push({ kind, entryId: entry.id, bullet: x.bullet, order: x.order, pinned, tier: pinned ? 0 : x.filler ? 2 : 1, priority: x.priority });
      }
      if (!entry.bullets.length && (drafted || entry.rank === "pinned")) {
        mine.push({ kind, entryId: entry.id, bullet: null, order: 0, pinned: entry.rank === "pinned", tier: entry.rank === "pinned" ? 0 : drafted ? 1 : 2, priority: FLOOR * weight });
      }
      // A pinned entry is always on the page, with at least its best bullet.
      if (entry.rank === "pinned" && mine.length && !mine.some((c) => c.pinned)) {
        const best = mine.reduce((a, b) => (b.priority > a.priority ? b : a));
        best.pinned = true;
        best.tier = 0;
      }
      candidates.push(...mine);
    }
  }
  candidates.sort((a, b) => a.tier - b.tier || b.priority - a.priority);

  const skills = draft.skills.map((g) => ({ ...g, items: skillsByRelevance(g.items, jobText) }));
  const build = (chosen: Set<number>): TailoredResume => {
    const section = (kind: Kind) => {
      if (!kinds.includes(kind)) return draft[kind]; // hidden by layout: not on the page, so not fitted
      return profile[kind].flatMap((entry) => {
        const picked = candidates.filter((c, i) => chosen.has(i) && c.kind === kind && c.entryId === entry.id);
        if (!picked.length) return [];
        const bullets = picked
          .sort((a, b) => a.order - b.order)
          .flatMap((c) => (c.bullet ? [c.bullet] : []));
        return [{ sourceId: entry.id, bullets }];
      });
    };
    return { summary: draft.summary, educationIds: draft.educationIds, skills, experience: section("experience"), projects: section("projects") };
  };
  const prefix = (k: number) => new Set(Array.from({ length: k }, (_, i) => i));

  const all = prefix(candidates.length);
  if (limit === null) return { doc: build(all), pages: 0, fill: 0, overflow: false };

  const fits = async (chosen: Set<number>) => {
    const m = await measure(build(chosen));
    return { ok: m.pages <= limit, ...m };
  };

  const full_ = await fits(all);
  if (full_.ok) return { doc: build(all), pages: full_.pages, fill: full_.fill, overflow: false };

  const pinnedCount = candidates.filter((c) => c.tier === 0).length;
  const base = await fits(prefix(pinnedCount));
  if (!base.ok) return { doc: build(prefix(pinnedCount)), pages: base.pages, fill: base.fill, overflow: true };

  // Largest prefix that fits: lo always fits, hi never does.
  let lo = pinnedCount;
  let hi = candidates.length;
  let best = base;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    const m = await fits(prefix(mid));
    if (m.ok) [lo, best] = [mid, m];
    else hi = mid;
  }

  // Squeeze: a later, shorter bullet may still fit in the gap the next one couldn't.
  const chosen = prefix(lo);
  for (let i = hi, tries = 0; i < candidates.length && tries < SQUEEZE_TRIES; i++, tries++) {
    const next = new Set(chosen).add(i);
    const m = await fits(next);
    if (m.ok) {
      chosen.add(i);
      best = m;
    }
  }
  return { doc: build(chosen), pages: best.pages, fill: best.fill, overflow: false };
}
