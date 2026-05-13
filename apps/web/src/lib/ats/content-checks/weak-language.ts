// Weak / passive language detector.
//
// Recruiters consistently flag these phrases as red flags — they describe
// duties rather than impact and signal a candidate who did not own the work.
// Documented across ResumeWorded, Indeed, and recruiter testimony in
// r/recruiting threads.

const WEAK_PHRASES = [
  "responsible for",
  "duties included",
  "duties were",
  "tasked with",
  "in charge of",
  "worked on",
  "helped with",
  "helped to",
  "assisted with",
  "assisted in",
  "involved in",
  "participated in",
  "contributed to",
  "had the opportunity",
  "exposure to",
  "familiar with",
  "knowledge of",
] as const;

const PASSIVE_PATTERNS: ReadonlyArray<RegExp> = [
  // "was/were <past participle>" passive constructions
  /\b(?:was|were)\s+(?:[a-z]+ly\s+)?[a-z]+(?:ed|en)\b/i,
];

export interface WeakLanguageHit {
  phrase: string;
  bullet: string;
  location: string;
}

export interface WeakLanguageReport {
  hits: WeakLanguageHit[];
  bulletCount: number;
  weakBulletCount: number;
  weakRatio: number;
}

export interface WeakLanguageBullet {
  text: string;
  location: string;
}

export function analyzeWeakLanguage(
  bullets: WeakLanguageBullet[],
): WeakLanguageReport {
  const hits: WeakLanguageHit[] = [];
  const weakBullets = new Set<string>();

  for (const bullet of bullets) {
    const lower = bullet.text.toLowerCase();
    let bulletIsWeak = false;

    for (const phrase of WEAK_PHRASES) {
      if (lower.includes(phrase)) {
        hits.push({ phrase, bullet: bullet.text, location: bullet.location });
        bulletIsWeak = true;
      }
    }

    for (const pattern of PASSIVE_PATTERNS) {
      const match = bullet.text.match(pattern);
      if (match) {
        hits.push({
          phrase: match[0].toLowerCase(),
          bullet: bullet.text,
          location: bullet.location,
        });
        bulletIsWeak = true;
      }
    }

    if (bulletIsWeak) {
      weakBullets.add(`${bullet.location}::${bullet.text}`);
    }
  }

  const bulletCount = bullets.length;
  const weakBulletCount = weakBullets.size;
  const weakRatio = bulletCount === 0 ? 0 : weakBulletCount / bulletCount;

  return { hits, bulletCount, weakBulletCount, weakRatio };
}
