import {
  buildEvidenceFirstSelfCheckInstructions,
  EMAIL_EVIDENCE_FIRST_PROMPT_RULES,
} from "@/lib/ai/prompt-quality";

export interface EmailGenerationPromptInput {
  templateTitle: string;
  profileSummary: string;
  jobSummary: string;
  additionalContext: string;
  templateGuidelines: string;
}

export function buildEmailGenerationPrompt({
  templateTitle,
  profileSummary,
  jobSummary,
  additionalContext,
  templateGuidelines,
}: EmailGenerationPromptInput): string {
  return `Generate a professional ${templateTitle.toLowerCase()} for a job seeker.

CANDIDATE PROFILE:
${profileSummary}

JOB DETAILS:
${jobSummary}

ADDITIONAL CONTEXT:
${additionalContext}

Return a JSON object with:
{
  "subject": "Email subject line",
  "body": "Full email body with proper formatting and paragraphs",
  "selfCheck": {
    "evidencePoint": "The exact candidate/context evidence point or hook note used",
    "matchedReason": "The exact recipient/company/job/relationship reason it connects to",
    "unsupportedFacts": [],
    "genericPhrases": [],
    "hasClearCTA": true
  }
}

Guidelines:
- Keep it professional but warm
- Sign off with the candidate's name
${EMAIL_EVIDENCE_FIRST_PROMPT_RULES}
${buildEvidenceFirstSelfCheckInstructions({
  evidenceKey: "evidencePoint",
  matchedKey: "matchedReason",
  unsupportedKey: "unsupportedFacts",
})}
${templateGuidelines}`;
}
