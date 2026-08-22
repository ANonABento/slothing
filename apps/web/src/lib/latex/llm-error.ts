/**
 * Turning a provider exception into something the user can act on.
 *
 * The generic "could not do that" this replaced was the same message for a missing API key
 * and for a model returning nonsense — one of which the user can fix in thirty seconds,
 * and the other of which they cannot. Saying which is the whole value.
 *
 * Its own module because a Next route file may export ONLY route handlers.
 */

export function explainLlmFailure(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  if (/api[ _-]?key|unauthorized|401|403|invalid[ _-]?token/i.test(message)) {
    return "No working AI provider is set up. Add a provider key in Settings, then try again.";
  }
  if (/timeout|ETIMEDOUT|ECONNREFUSED|fetch failed|ENOTFOUND/i.test(message)) {
    return "The AI provider could not be reached. Check your connection or provider settings, then try again.";
  }
  // Naming the document as untouched is the point: the fear on any AI error is that it
  // half-rewrote the thing.
  return "The AI could not work out this document's sections and bullets. Your document is unchanged.";
}
