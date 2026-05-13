// Buzzword / cliché detector.
//
// Recruiters and hiring managers consistently rate these as immediate signals
// of a generic resume. They take up space without conveying evidence and
// recruiters often skip past them on first scan. Sources: Indeed recruiter
// surveys, Ask a Manager, r/recruiting.

const BUZZWORDS = [
  "team player",
  "results-driven",
  "results driven",
  "self-starter",
  "self starter",
  "go-getter",
  "go getter",
  "hard worker",
  "hard-working",
  "detail-oriented",
  "detail oriented",
  "thinks outside the box",
  "think outside the box",
  "synergy",
  "synergies",
  "synergize",
  "synergized",
  "value add",
  "value-add",
  "value-added",
  "best of breed",
  "best-of-breed",
  "rockstar",
  "ninja",
  "guru",
  "wizard",
  "thought leader",
  "thought leadership",
  "leverage",
  "leveraged",
  "leveraging",
  "passionate about",
  "passion for",
  "dynamic individual",
  "highly motivated",
  "track record of success",
  "proven track record",
  "go above and beyond",
  "above and beyond",
  "world-class",
  "world class",
  "cutting-edge",
  "cutting edge",
  "next-generation",
  "next generation",
  "mission-critical",
  "mission critical",
  "best practices",
  "win-win",
  "low-hanging fruit",
  "move the needle",
  "boil the ocean",
  "circle back",
  "deep dive",
  "deep-dive",
  "pivot",
  "pivoted",
] as const;

export interface BuzzwordHit {
  phrase: string;
  bullet: string;
  location: string;
}

export interface BuzzwordReport {
  hits: BuzzwordHit[];
  uniquePhrases: string[];
}

export interface BuzzwordSegment {
  text: string;
  location: string;
}

export function analyzeBuzzwords(segments: BuzzwordSegment[]): BuzzwordReport {
  const hits: BuzzwordHit[] = [];
  const unique = new Set<string>();

  for (const segment of segments) {
    const lower = segment.text.toLowerCase();
    for (const phrase of BUZZWORDS) {
      if (lower.includes(phrase)) {
        hits.push({ phrase, bullet: segment.text, location: segment.location });
        unique.add(phrase);
      }
    }
  }

  return { hits, uniquePhrases: Array.from(unique) };
}
