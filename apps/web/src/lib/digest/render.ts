import { formatDateAbsolute } from "@/lib/format/time";
import type { JobDescription } from "@/types";
import type { DigestMatch } from "./match";

interface RenderDailyDigestInput {
  user: { userId: string; email: string; name?: string | null };
  picks: DigestMatch[];
  unsubscribeUrl: string;
  baseUrl?: string;
}

export function renderDailyDigest({
  user,
  picks,
  unsubscribeUrl,
  baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000",
}: RenderDailyDigestInput): { subject: string; html: string; text: string } {
  const subject =
    picks.length === 5
      ? "5 new opportunities matching your profile"
      : `Your top ${picks.length} opportunities today`;
  const greeting = user.name ? `Hi ${user.name},` : "Hi,";

  const text = [
    greeting,
    "",
    `Here ${picks.length === 1 ? "is" : "are"} ${picks.length} new ${picks.length === 1 ? "opportunity" : "opportunities"} matching your profile.`,
    "",
    ...picks.flatMap((pick, index) => [
      `${index + 1}. ${pick.job.title} at ${pick.job.company}`,
      `Score: ${pick.score}`,
      pick.job.location ? `Location: ${pick.job.location}` : undefined,
      `Opened: ${formatDateAbsolute(pick.job.createdAt)}`,
      `Link: ${opportunityUrl(baseUrl, pick.job).toString()}`,
      pick.reasons.length ? `Why: ${pick.reasons.join("; ")}` : undefined,
      "",
    ]),
    `Unsubscribe: ${unsubscribeUrl}`,
  ]
    .filter((line): line is string => typeof line === "string")
    .join("\n");

  const rows = picks.map((pick) => renderPickHtml(baseUrl, pick)).join("");

  const html = `<!doctype html>
<html>
  <body>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td>
          <h1>${escapeHtml(subject)}</h1>
          <p>${escapeHtml(greeting)}</p>
          <p>Here ${picks.length === 1 ? "is" : "are"} ${picks.length} new ${picks.length === 1 ? "opportunity" : "opportunities"} matching your profile.</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${rows}
          </table>
          <p><a href="${escapeAttribute(unsubscribeUrl)}">Unsubscribe from daily job digests</a></p>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, html, text };
}

function renderPickHtml(baseUrl: string, pick: DigestMatch): string {
  const jobUrl = opportunityUrl(baseUrl, pick.job).toString();
  const location = pick.job.location ? ` - ${pick.job.location}` : "";
  const reasons = pick.reasons.length
    ? `<p>${escapeHtml(pick.reasons.join("; "))}</p>`
    : "";

  return `
    <tr>
      <td>
        <h2><a href="${escapeAttribute(jobUrl)}">${escapeHtml(pick.job.title)}</a></h2>
        <p>${escapeHtml(pick.job.company)}${escapeHtml(location)}</p>
        <p>Match score: ${pick.score}</p>
        <p>Opened: ${escapeHtml(formatDateAbsolute(pick.job.createdAt))}</p>
        ${reasons}
      </td>
    </tr>`;
}

function opportunityUrl(baseUrl: string, job: JobDescription): URL {
  return new URL(`/opportunities/${job.id}`, baseUrl);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(value: string): string {
  return escapeHtml(value);
}
