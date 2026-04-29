import type { BankEntry } from "@/types";
import { bankEntriesToResume } from "@/lib/resume/bank-to-resume";
import { generateResumeHTML } from "@/lib/resume/pdf";

export function generateResumePreviewFallbackHTML(
  entries: BankEntry[],
  templateId: string
): string {
  if (entries.length === 0) return "";

  return generateResumeHTML(bankEntriesToResume(entries), templateId);
}
