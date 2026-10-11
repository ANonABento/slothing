import { formatDateAbsolute } from "@/lib/format/time";

export interface ReminderEmailInput {
  to: string;
  reminderTitle: string;
  jobTitle?: string | null;
  jobCompany?: string | null;
  jobId: string;
  dueDate: string;
}

export type ReminderEmailResult =
  | { ok: true; skipped?: false; status: number }
  | { ok: true; skipped: true }
  | { ok: false; status: number; error: string };

export function isReminderEmailConfigured(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  return Boolean(env.RESEND_API_KEY && env.EMAIL_FROM);
}

export async function sendReminderEmail({
  to,
  reminderTitle,
  jobTitle,
  jobCompany,
  jobId,
  dueDate,
}: ReminderEmailInput): Promise<ReminderEmailResult> {
  if (!isReminderEmailConfigured()) {
    return { ok: true, skipped: true };
  }

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const opportunityUrl = new URL(`/opportunities?id=${jobId}`, baseUrl);
  const companySuffix = jobCompany ? ` - ${jobCompany}` : "";
  const due = formatDateAbsolute(dueDate);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      to,
      subject: `Reminder: ${reminderTitle}${companySuffix}`,
      html: `
        <div>
          <p>Your reminder is due: <strong>${escapeHtml(reminderTitle)}</strong></p>
          <p>${escapeHtml(jobTitle || "Your application")}</p>
          <p>Due: ${escapeHtml(due)}</p>
          <p><a href="${opportunityUrl.toString()}">Open opportunity</a></p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      error: await response.text().catch(() => response.statusText),
    };
  }

  return { ok: true, status: response.status };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
