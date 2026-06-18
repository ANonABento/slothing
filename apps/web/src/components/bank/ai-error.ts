/**
 * Maps the `{ error, code }` envelope returned by the bank AI routes (`/api/bank/ai/*`,
 * `/api/bank/from-source`) to a clear, actionable user-facing message. Falls back to the server's
 * `error` string, then a generic message.
 */
const MESSAGES: Record<string, string> = {
  invalid_url: "That doesn't look like a valid URL.",
  blocked_url: "That URL isn't allowed for security reasons.",
  not_found:
    "Couldn't find that — the repo/page may be private or the URL may be wrong.",
  private_or_forbidden: "That source is private or behind a login.",
  rate_limited: "Rate limited. Wait a moment and try again.",
  unsupported_content:
    "That link isn't a readable page (only repos and HTML/text pages work).",
  empty_content:
    "Couldn't extract enough text to draft from. Paste the details manually instead.",
  fetch_failed: "Couldn't reach that source. Check the link and try again.",
  no_grounded_output:
    "Couldn't ground bullets in that source. Try a richer page or add detail.",
  ai_required: "AI is required for this. Add a provider key or upgrade.",
  llm_failed: "The AI step failed. Please try again.",
  commit_failed: "Couldn't save to your bank. Please try again.",
};

export function aiErrorMessage(
  payload: { error?: unknown; code?: unknown } | null | undefined,
  fallback = "Something went wrong. Please try again.",
): string {
  const code = typeof payload?.code === "string" ? payload.code : "";
  if (code && MESSAGES[code]) return MESSAGES[code];
  if (typeof payload?.error === "string" && payload.error) return payload.error;
  return fallback;
}
