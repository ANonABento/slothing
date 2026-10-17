import type { Job } from "./types";

const day = (iso: string) => new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric" }).format(new Date(iso));

/**
 * A short follow-up note for a job you applied to, no AI: it says only what Slothing knows (the role,
 * the company, when you applied), so there's nothing to ground. Edit it before sending.
 */
export function followUpNote(job: Pick<Job, "title" | "company" | "appliedAt">, name: string): string {
  const position = job.title ? `the ${job.title} position` : "the open position";
  const at = job.company ? ` at ${job.company}` : "";
  const when = job.appliedAt ? ` on ${day(job.appliedAt)}` : "";
  return [
    `Subject: Following up on my application${job.title ? ` for ${job.title}` : ""}`,
    "",
    "Hi,",
    "",
    `I applied for ${position}${at}${when} and wanted to follow up. I'm still very interested in the role and happy to share anything else that would help.`,
    "",
    "Thank you for your time,",
    name || "",
  ]
    .join("\n")
    .trimEnd();
}
