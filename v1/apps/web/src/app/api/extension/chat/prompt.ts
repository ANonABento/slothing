interface ProfileLike {
  contact?: { name?: string; email?: string };
  summary?: string;
  experiences?: Array<{
    title: string;
    company: string;
    description?: string;
  }>;
  skills?: Array<{ name: string }>;
}

export function buildProfileSummary(profile: ProfileLike | null): string {
  if (!profile) {
    return "Profile: not connected. Be honest about not having profile data and ask the user to upload a resume.";
  }
  const name = profile.contact?.name ?? "Candidate";
  const summary = profile.summary?.trim() || "(no summary)";
  const experiences = (profile.experiences ?? [])
    .slice(0, 4)
    .map((e) => {
      const desc = e.description?.trim().slice(0, 240) || "";
      return `- ${e.title} at ${e.company}${desc ? `: ${desc}` : ""}`;
    })
    .join("\n");
  const skills =
    (profile.skills ?? [])
      .slice(0, 25)
      .map((s) => s.name)
      .join(", ") || "(no skills listed)";

  return [
    `Name: ${name}`,
    `Summary: ${summary}`,
    `Recent experience:\n${experiences || "(none)"}`,
    `Skills: ${skills}`,
  ].join("\n\n");
}

interface JobContextLike {
  title?: string;
  company?: string;
  location?: string;
  description?: string;
  requirements?: string[];
}

export function buildSystemPrompt(
  profileSummary: string,
  jobContext: JobContextLike | undefined,
): string {
  const job = jobContext ?? {};
  const jobLines = [
    job.title ? `Title: ${job.title}` : null,
    job.company ? `Company: ${job.company}` : null,
    job.location ? `Location: ${job.location}` : null,
    job.description
      ? `Description (truncated):\n${job.description.slice(0, 2400)}`
      : null,
    job.requirements?.length
      ? `Requirements: ${job.requirements.slice(0, 10).join("; ")}`
      : null,
  ]
    .filter(Boolean)
    .join("\n");

  return `You are Slothing's inline job-application assistant. The user is currently viewing a job page in their browser. Use ONLY the profile and job context below — do not invent experience, employers, or credentials.

PROFILE:
${profileSummary}

JOB CONTEXT:
${jobLines || "(no job context provided)"}

Style: warm, specific, and concrete. Keep responses tight (4 sentences for a pitch, one paragraph for a cover-letter opener). Do not use markdown headers or bullet lists unless explicitly asked.`;
}
