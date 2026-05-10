import type { InterviewSession } from "@/types/interview";
import type { Opportunity } from "@/types/opportunity";

import { formatDateOnly, nowIso } from "@/lib/format/time";
export function formatInterviewForDocs(
  session: InterviewSession,
  job?: Pick<Opportunity, "title" | "company">,
): string {
  const lines: string[] = [];
  lines.push(`Interview Preparation Notes`);
  lines.push(`${"=".repeat(30)}`);
  lines.push("");
  if (job) {
    lines.push(`Position: ${job.title}`);
    lines.push(`Company: ${job.company}`);
    lines.push("");
  } else {
    lines.push(
      `Practice: ${session.category?.replace("-", " ") || "Interview"}`,
    );
    lines.push("");
  }
  lines.push(`Date: ${formatDateOnly(nowIso())}`);
  lines.push(`Mode: ${session.mode === "voice" ? "Voice" : "Text"}`);
  lines.push(`Questions: ${session.questions.length}`);
  lines.push("");
  lines.push(`${"=".repeat(30)}`);
  lines.push("");

  session.questions.forEach((q, i) => {
    const skipped = session.skipped?.[i] || session.answers[i] === "[skipped]";
    const answer = skipped
      ? "(Skipped)"
      : session.answers[i]?.trim()
        ? session.answers[i]
        : "(No answer provided)";
    const feedback = session.feedback[i]?.trim();

    lines.push(`Question ${i + 1} (${q.category})`);
    lines.push(`${"-".repeat(20)}`);
    lines.push(q.question);
    lines.push("");
    lines.push(`Your Answer:`);
    lines.push(answer);
    lines.push("");
    if (feedback) {
      lines.push(`AI Feedback:`);
      lines.push(feedback);
    }
    lines.push("");
    lines.push("");
  });

  return lines.join("\n");
}
