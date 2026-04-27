export type AiActionId =
  | "rewrite"
  | "concise"
  | "metrics"
  | "keywords"
  | "tailor"
  | "generate-bank"
  | "rewrite-section";

interface TextRange {
  start: number;
  end: number;
}

interface InstructionInput {
  action: AiActionId;
  selectedText?: string;
  jobDescription?: string;
  sectionLabel?: string;
}

const ACTION_INSTRUCTIONS: Record<AiActionId, string> = {
  rewrite: "Rewrite the selected text for clarity, impact, and polish.",
  concise:
    "Make the selected text more concise while preserving the strongest details.",
  metrics:
    "Add credible metrics and measurable impact to the selected text where appropriate. Do not invent specifics that conflict with the source.",
  keywords:
    "Match the selected text more closely to the job description keywords while keeping it truthful.",
  tailor:
    "Tailor this document to the job description while preserving the candidate's voice and strongest evidence.",
  "generate-bank":
    "Generate stronger document content from the candidate's knowledge bank and job context.",
  "rewrite-section":
    "Rewrite the selected section for clarity, relevance, and measurable impact.",
};

export function createAiActionInstruction({
  action,
  selectedText,
  jobDescription,
  sectionLabel,
}: InstructionInput): string {
  const parts = [ACTION_INSTRUCTIONS[action]];

  if (sectionLabel) {
    parts.push(`Section: ${sectionLabel}.`);
  }

  if (selectedText?.trim()) {
    parts.push(`Selected text:\n${selectedText.trim()}`);
  }

  if (jobDescription?.trim()) {
    parts.push(`Job description:\n${jobDescription.trim()}`);
  }

  return parts.join("\n\n");
}

export function normalizeTextRange(range: TextRange, contentLength: number) {
  const start = Math.max(0, Math.min(range.start, contentLength));
  const end = Math.max(0, Math.min(range.end, contentLength));

  return start <= end ? { start, end } : { start: end, end: start };
}

export function applyTextReplacement(
  content: string,
  replacement: string,
  range: TextRange
): string {
  const normalized = normalizeTextRange(range, content.length);
  return (
    content.slice(0, normalized.start) +
    replacement +
    content.slice(normalized.end)
  );
}

export function getParagraphRanges(content: string) {
  const ranges: Array<{ label: string; text: string; start: number; end: number }> =
    [];
  const pattern = /\S[\s\S]*?(?=\n\s*\n|$)/g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(content)) !== null) {
    const text = match[0].trim();
    if (!text) continue;

    ranges.push({
      label: `Section ${ranges.length + 1}`,
      text,
      start: match.index,
      end: match.index + match[0].length,
    });
  }

  return ranges;
}
