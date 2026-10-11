// Action-verb strength grader.
//
// The existing scorer treats all action verbs as equal. Recruiter feedback
// (and ResumeWorded's public rubric) actually grades verbs by strength:
// "spearheaded" outranks "led", which outranks "worked on". We tier verbs
// and reward bullets that start with stronger verbs.
//
// We focus on the first word of each bullet — that's what the recruiter eye
// catches on a scan.

export type VerbTier = "strong" | "standard" | "weak";

export const STRONG_VERBS = new Set([
  "spearheaded",
  "architected",
  "pioneered",
  "founded",
  "launched",
  "scaled",
  "transformed",
  "championed",
  "orchestrated",
  "drove",
  "delivered",
  "shipped",
  "owned",
  "led",
  "directed",
  "established",
  "executed",
  "negotiated",
  "secured",
  "tripled",
  "doubled",
  "accelerated",
  "automated",
  "engineered",
  "implemented",
  "deployed",
  "migrated",
  "rebuilt",
  "redesigned",
  "refactored",
  "optimized",
  "streamlined",
  "consolidated",
  "eliminated",
  "reduced",
  "increased",
  "grew",
  "boosted",
  "cut",
  "saved",
  "generated",
  "earned",
  "won",
  "shipped",
  "released",
  "developed",
  "designed",
  "built",
  "created",
  "produced",
  "authored",
  "wrote",
  "published",
  "mentored",
  "coached",
  "trained",
  "hired",
  "recruited",
  "managed",
  "supervised",
  "oversaw",
  "coordinated",
  "facilitated",
  "negotiated",
  "presented",
  "advised",
  "consulted",
  "analyzed",
  "researched",
  "investigated",
  "diagnosed",
  "resolved",
  "fixed",
  "debugged",
  "tested",
  "validated",
  "verified",
  "audited",
  "reviewed",
]);

export const STANDARD_VERBS = new Set([
  "supported",
  "maintained",
  "monitored",
  "tracked",
  "reported",
  "documented",
  "communicated",
  "collaborated",
  "partnered",
  "worked",
  "performed",
  "handled",
  "operated",
  "processed",
  "completed",
  "achieved",
  "improved",
  "enhanced",
  "updated",
  "modified",
  "adapted",
  "adjusted",
  "configured",
  "installed",
  "set up",
]);

export const WEAK_VERBS = new Set([
  "helped",
  "assisted",
  "supported",
  "participated",
  "contributed",
  "involved",
  "had",
  "did",
  "made",
  "got",
  "used",
  "tried",
  "attempted",
  "started",
  "began",
  "worked",
]);

export interface VerbAnalysisBullet {
  text: string;
  location: string;
}

export interface VerbBucket {
  tier: VerbTier;
  verb: string;
  bullet: string;
  location: string;
}

export interface ActionVerbStrengthReport {
  buckets: VerbBucket[];
  strongCount: number;
  standardCount: number;
  weakCount: number;
  noVerbCount: number;
  distinctStrongVerbs: string[];
}

function firstWord(text: string): string {
  const trimmed = text.trim().replace(/^[\-•*\d\.\)\s]+/, "");
  const word = trimmed.split(/\s+/)[0] || "";
  return word.toLowerCase().replace(/[^a-z]/g, "");
}

export function classifyVerb(verb: string): VerbTier | null {
  if (!verb) return null;
  // Weak takes precedence — if a verb is in both (e.g., 'worked'), it's weak.
  if (WEAK_VERBS.has(verb)) return "weak";
  if (STRONG_VERBS.has(verb)) return "strong";
  if (STANDARD_VERBS.has(verb)) return "standard";
  return null;
}

export function analyzeActionVerbStrength(
  bullets: VerbAnalysisBullet[],
): ActionVerbStrengthReport {
  const buckets: VerbBucket[] = [];
  let strongCount = 0;
  let standardCount = 0;
  let weakCount = 0;
  let noVerbCount = 0;
  const distinctStrong = new Set<string>();

  for (const bullet of bullets) {
    const verb = firstWord(bullet.text);
    const tier = classifyVerb(verb);
    if (!tier) {
      noVerbCount += 1;
      continue;
    }
    buckets.push({
      tier,
      verb,
      bullet: bullet.text,
      location: bullet.location,
    });
    if (tier === "strong") {
      strongCount += 1;
      distinctStrong.add(verb);
    } else if (tier === "standard") {
      standardCount += 1;
    } else {
      weakCount += 1;
    }
  }

  return {
    buckets,
    strongCount,
    standardCount,
    weakCount,
    noVerbCount,
    distinctStrongVerbs: Array.from(distinctStrong).sort(),
  };
}
