export const FILLER_PHRASES = [
  "you know",
  "sort of",
  "kind of",
  "i mean",
  "um",
  "uh",
  "like",
  "basically",
  "actually",
  "literally",
  "just",
  "so",
] as const;

export interface FillerWordMatch {
  phrase: string;
  count: number;
}

export interface FillerWordCount {
  total: number;
  matches: FillerWordMatch[];
}

export function countFillerWords(transcript: string): FillerWordCount {
  const normalized = transcript.toLowerCase();
  const matches = FILLER_PHRASES.map((phrase) => {
    const escapedPhrase = phrase.split(/\s+/).map(escapeRegExp).join("\\s+");
    const pattern = new RegExp(`\\b${escapedPhrase}\\b`, "gi");
    const count = normalized.match(pattern)?.length ?? 0;

    return { phrase, count };
  }).filter((match) => match.count > 0);

  return {
    total: matches.reduce((sum, match) => sum + match.count, 0),
    matches,
  };
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
