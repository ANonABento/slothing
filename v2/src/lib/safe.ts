/**
 * Server actions can still reject on the client (network drop, dev-server restart, body too large).
 * Fold that into the same { ok: false, error } shape the actions return, so callers handle one path.
 */
export async function safe<T extends { ok: boolean }>(fn: () => Promise<T>): Promise<T | { ok: false; error: string }> {
  try {
    return await fn();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, error: /body exceeded|too large/i.test(msg) ? "That file is too large (max 10 MB)." : `Couldn't reach the app server: ${msg.slice(0, 200)}` };
  }
}
