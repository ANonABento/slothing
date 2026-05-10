import type { EmailTemplateType } from "@/lib/constants";
import type { EmailContext } from "@/lib/email/templates";
import type { JobDescription, Profile } from "@/types";

export interface EmailGenerationPromptInput {
  templateInfo: { title: string };
  profile?: Profile;
  job?: JobDescription;
  contextParams: Omit<EmailContext, "profile" | "job">;
  type: EmailTemplateType;
}

export function getTemplateGuidelines(
  type: string,
  recruiterStance?: "interested" | "not_a_fit",
): string {
  switch (type) {
    case "cold_outreach":
      return "- For cold outreach, lead with a specific hook, stay humble, and do not sound salesy";
    case "recruiter_reply":
      return recruiterStance === "not_a_fit"
        ? "- For recruiter replies, politely decline while leaving the door open for better-fit future roles"
        : "- For recruiter replies, express interest and ask for role scope, compensation range, timeline, and next steps";
    case "reference_request":
      return "- For reference requests, make the ask clear, brief, appreciative, and low-pressure";
    default:
      return "- Match the selected email template's expected purpose and tone";
  }
}

export function buildEmailGenerationPrompt({
  templateInfo,
  profile,
  job,
  contextParams,
  type,
}: EmailGenerationPromptInput): string {
  const profileSummary = profile
    ? `
Name: ${profile.contact.name}
Email: ${profile.contact.email || "N/A"}
Phone: ${profile.contact.phone || "N/A"}
Current Role: ${profile.experiences[0]?.title || "N/A"} at ${profile.experiences[0]?.company || "N/A"}
Skills: ${profile.skills
        .slice(0, 10)
        .map((s) => s.name)
        .join(", ")}
          `.trim()
    : "No profile data available";

  const jobSummary = job
    ? `
Position: ${job.title}
Company: ${job.company}
Applied: ${job.appliedAt || "Not yet applied"}
Status: ${job.status || "saved"}
          `.trim()
    : "No job selected";

  return `Generate a professional ${templateInfo.title.toLowerCase()} for a job seeker.

CANDIDATE PROFILE:
${profileSummary}

JOB DETAILS:
${jobSummary}

ADDITIONAL CONTEXT:
${contextParams.interviewerName ? `Interviewer: ${contextParams.interviewerName}` : ""}
${contextParams.interviewDate ? `Interview Date: ${contextParams.interviewDate}` : ""}
${contextParams.targetCompany ? `Target Company: ${contextParams.targetCompany}` : ""}
${contextParams.connectionName ? `Connection: ${contextParams.connectionName}` : ""}
${contextParams.hookNote ? `Cold Outreach Hook: ${contextParams.hookNote}` : ""}
${contextParams.recruiterName ? `Recruiter: ${contextParams.recruiterName}` : ""}
${contextParams.recruiterCompany ? `Recruiter Company: ${contextParams.recruiterCompany}` : ""}
${contextParams.recruiterStance ? `Recruiter Reply Stance: ${contextParams.recruiterStance}` : ""}
${contextParams.referenceName ? `Reference Name: ${contextParams.referenceName}` : ""}
${contextParams.applyingRole ? `Applying Role: ${contextParams.applyingRole}` : ""}
${contextParams.interviewStage ? `Interview Stage: ${contextParams.interviewStage}` : ""}
${contextParams.customNote ? `Custom Note: ${contextParams.customNote}` : ""}

Return a JSON object with:
{
  "subject": "Email subject line",
  "body": "Full email body with proper formatting and paragraphs"
}

Guidelines:
- Keep it professional but warm
- Be concise (under 200 words for the body)
- Use specific details from the context provided
- Include a clear call-to-action
- Sign off with the candidate's name
${getTemplateGuidelines(type, contextParams.recruiterStance)}`;
}
