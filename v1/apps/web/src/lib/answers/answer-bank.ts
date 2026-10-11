export interface AnswerBankEntry {
  id: string;
  question: string;
  questionNormalized: string;
  answer: string;
  source: AnswerBankSource;
  sourceUrl: string | null;
  sourceCompany: string | null;
  timesUsed: number;
  lastUsedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export type AnswerBankSource = "manual" | "extension" | "curated";

export function isAnswerBankSource(value: unknown): value is AnswerBankSource {
  return value === "manual" || value === "extension" || value === "curated";
}

export function isExtensionSourced(
  entry: Pick<AnswerBankEntry, "source">,
): boolean {
  return entry.source === "extension";
}

export function isCurated(entry: Pick<AnswerBankEntry, "source">): boolean {
  return entry.source === "curated";
}

export function normalizeQuestion(question: string): string {
  return question
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function calculateQuestionSimilarity(a: string, b: string): number {
  const wordsA = new Set(a.split(" ").filter(Boolean));
  const wordsB = new Set(b.split(" ").filter(Boolean));
  const intersection = Array.from(wordsA).filter((word) =>
    wordsB.has(word),
  ).length;
  const union = new Set([...Array.from(wordsA), ...Array.from(wordsB)]).size;
  return union > 0 ? intersection / union : 0;
}

export function getAnswerSourceLabel(
  answer: Pick<AnswerBankEntry, "sourceCompany" | "sourceUrl">,
): string {
  if (answer.sourceCompany) return answer.sourceCompany;
  if (!answer.sourceUrl) return "Manual";

  try {
    return new URL(answer.sourceUrl).hostname.replace(/^www\./, "");
  } catch {
    return answer.sourceUrl;
  }
}
