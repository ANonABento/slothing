// First-person pronoun detector.
//
// Industry consensus is that resumes should be written in implied first-
// person without pronouns. "Led team of 5" not "I led a team of 5".
// Recruiters flag I/my/me bullets as amateurish.

const FIRST_PERSON_PATTERN = /\b(?:i|i'm|i've|i'll|i'd|my|me|mine|myself)\b/i;

export interface FirstPersonHit {
  bullet: string;
  location: string;
  pronoun: string;
}

export interface FirstPersonReport {
  hits: FirstPersonHit[];
  hitCount: number;
}

export interface FirstPersonBullet {
  text: string;
  location: string;
}

export function analyzeFirstPerson(
  bullets: FirstPersonBullet[],
): FirstPersonReport {
  const hits: FirstPersonHit[] = [];

  for (const bullet of bullets) {
    const match = bullet.text.match(FIRST_PERSON_PATTERN);
    if (match) {
      hits.push({
        bullet: bullet.text,
        location: bullet.location,
        pronoun: match[0].toLowerCase(),
      });
    }
  }

  return { hits, hitCount: hits.length };
}
