import {
  buildEvidenceFirstSelfCheckInstructions,
  EVIDENCE_FIRST_PROMPT_RULES,
} from "@/lib/ai/prompt-quality";

export interface OpportunityPromptInput {
  profileSummary: string;
  job: {
    title: string;
    company: string;
    location?: string | null;
    description: string;
    keywords?: string[];
  };
}

export function buildOpportunityCoverLetterJsonPrompt({
  profileSummary,
  job,
}: OpportunityPromptInput): string {
  return `${buildOpportunityCoverLetterBasePrompt({ profileSummary, job })}

Return a JSON object with:
{
  "coverLetter": "The full cover letter text with proper formatting and paragraphs",
  "highlights": ["Key point 1 that makes this candidate stand out", "Key point 2", "Key point 3"],
  "selfCheck": {
    "evidencePoint": "The exact candidate evidence point used",
    "matchedRequirement": "The exact job/company requirement it connects to",
    "unsupportedCompanyFacts": [],
    "genericPhrases": [],
    "hasClearCTA": true
  }
}

${buildEvidenceFirstSelfCheckInstructions()}`;
}

export function buildOpportunityCoverLetterStreamPrompt({
  profileSummary,
  job,
}: OpportunityPromptInput): string {
  return `${buildOpportunityCoverLetterBasePrompt({ profileSummary, job })}

Output only the cover letter text. Start directly with "Dear Hiring Manager," - no preamble.`;
}

function buildOpportunityCoverLetterBasePrompt({
  profileSummary,
  job,
}: OpportunityPromptInput): string {
  return `Generate a professional cover letter for this job application.

CANDIDATE PROFILE:
${profileSummary}

JOB DETAILS:
Position: ${job.title} at ${job.company}
${job.location ? `Location: ${job.location}` : ""}
Description: ${job.description}

Key Requirements: ${(job.keywords ?? []).join(", ")}

Guidelines:
- Keep it professional but personable
- 3-4 concise paragraphs max
- Highlight relevant experience and skills only when supplied in the candidate profile
- Lead with one concrete candidate evidence point and connect it to one job/company requirement
- Include a clear call to action in the close
- Do not use generic phrases or unsupported enthusiasm
${EVIDENCE_FIRST_PROMPT_RULES}`;
}
