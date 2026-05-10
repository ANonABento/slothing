export interface TransactionalEmailInput {
  to: string;
  subject: string;
  html: string;
  text?: string;
  tags?: Array<{ name: string; value: string }>;
}

export type TransactionalEmailResult =
  | { ok: true; skipped?: false; status: number }
  | { ok: true; skipped: true }
  | { ok: false; status: number; error: string };

export function isTransactionalEmailConfigured(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  return Boolean(env.RESEND_API_KEY && env.EMAIL_FROM);
}

export async function sendTransactionalEmail({
  to,
  subject,
  html,
  text,
  tags,
}: TransactionalEmailInput): Promise<TransactionalEmailResult> {
  if (!isTransactionalEmailConfigured()) {
    return { ok: true, skipped: true };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
      text,
      tags,
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
