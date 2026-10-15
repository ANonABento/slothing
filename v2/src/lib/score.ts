/* ─── Relevance scoring, no AI ───
 * A bullet scores by the job-description terms it shares, weighted by how often the job uses them
 * and how rare they are across your profile (a word on every bullet says nothing about fit).
 * Two-word phrases count extra, so "machine learning" beats "machine" + "learning" scattered apart.
 */

const STOP = new Set(
  (
    "a an and are as at be been being but by can could did do does for from had has have he her his how i if in into is it its " +
    "may me more most my no not of on or our out over she so some such than that the their them then there these they this " +
    "those to too under up us very was we were what when where which while who will with would you your yours about across " +
    "also all any each etc using used use via within work working role team teams strong ability experience experienced " +
    "years year plus including include includes new well across both other per"
  ).split(" "),
);

/** Lowercased words, keeping tech spellings like c++, c#, node.js; plural "s" stripped. */
export function terms(text: string): string[] {
  return (text.toLowerCase().match(/[a-z0-9][a-z0-9+#.]*[a-z0-9+#]|[a-z0-9]/g) ?? [])
    // Plurals only on plain words, so "node.js" and "aws" survive.
    .map((w) => (/^[a-z]{4,}$/.test(w) && w.endsWith("s") && !w.endsWith("ss") ? w.slice(0, -1) : w))
    .filter((w) => !STOP.has(w) && !/^\d+$/.test(w));
}

const grams = (ts: string[]) => {
  const out = new Set(ts);
  for (let i = 0; i + 1 < ts.length; i++) out.add(`${ts[i]} ${ts[i + 1]}`);
  return out;
};

/** Builds a scorer for one job, given every bullet it might score (for rarity). */
export function relevance(jobText: string, corpus: string[]) {
  const jobTerms = terms(jobText);
  const tf = new Map<string, number>();
  for (const g of [...jobTerms, ...[...grams(jobTerms)].filter((g) => g.includes(" "))]) tf.set(g, (tf.get(g) ?? 0) + 1);

  const df = new Map<string, number>();
  for (const doc of corpus) for (const g of grams(terms(doc))) df.set(g, (df.get(g) ?? 0) + 1);
  const n = Math.max(1, corpus.length);

  const weight = (g: string) => {
    const f = tf.get(g);
    if (!f) return 0;
    const idf = Math.log(1 + n / (1 + (df.get(g) ?? 0)));
    return Math.min(f, 3) * idf * (g.includes(" ") ? 1.5 : 1);
  };

  /** Relevance of one bullet; long bullets are damped a little so they don't win on length alone. */
  return (text: string) => {
    const ts = terms(text);
    let s = 0;
    for (const g of grams(ts)) s += weight(g);
    return s / Math.sqrt(Math.max(8, ts.length) / 8);
  };
}

/** Skill items the job mentions, first; the rest keep their order. */
export function skillsByRelevance(items: string[], jobText: string): string[] {
  const job = ` ${terms(jobText).join(" ")} `;
  const hit = (s: string) => {
    const t = terms(s).join(" ");
    return t !== "" && job.includes(` ${t} `);
  };
  return [...items.filter(hit), ...items.filter((s) => !hit(s))];
}
