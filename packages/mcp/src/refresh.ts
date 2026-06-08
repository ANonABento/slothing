/**
 * `slothing-mcp refresh` — token health check + re-mint guidance.
 *
 * Extension tokens carry a TTL (`EXTENSION_TOKEN_TTL_RUNTIME_MS`, ~30 days).
 * For a long-running headless agent that is short, and there is currently no
 * server route that lets a *token* mint a fresh token — `POST /api/extension/auth`
 * requires an authenticated browser session by design (a leaked token must not
 * be able to renew itself indefinitely; true sliding/service tokens land with
 * the P5 service-token work + revoke UI).
 *
 * So the honest stopgap is a *doctor*: probe the configured token against a
 * lightweight authenticated endpoint and tell the user, in plain terms, whether
 * it still works and exactly how to re-mint when it doesn't. This keeps the
 * package zero-backend while giving agents a one-command way to fail loudly
 * before an overnight run rather than 401-ing halfway through.
 */
import { createApiClient, ApiError } from "./api-client.js";
import type { ServerConfig } from "./config.js";

export interface TokenStatus {
  /** True when the token authenticated successfully. */
  ok: boolean;
  /** HTTP status from the probe, or null when the host was unreachable. */
  status: number | null;
  /** Human-readable one-liner describing the outcome. */
  message: string;
}

export interface CheckTokenDeps {
  fetchImpl?: typeof fetch;
}

/**
 * Probe the configured token by calling `GET /api/extension/profile` — the
 * cheapest authenticated read in the extension surface. A 2xx means the token
 * is live; 401/403 means expired or revoked; anything else (or a thrown
 * network error) means the host is unreachable or misconfigured.
 */
export async function checkToken(
  config: ServerConfig,
  deps: CheckTokenDeps = {},
): Promise<TokenStatus> {
  const client = createApiClient({
    baseUrl: config.baseUrl,
    token: config.token,
    fetchImpl: deps.fetchImpl,
  });

  try {
    await client.get<unknown>("/api/extension/profile");
    return {
      ok: true,
      status: 200,
      message: "Token is valid — the agent can authenticate to Slothing.",
    };
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401 || error.status === 403) {
        return {
          ok: false,
          status: error.status,
          message: "Token is expired or revoked — re-mint a fresh one.",
        };
      }
      return {
        ok: false,
        status: error.status,
        message: `Slothing responded with ${error.status} — the token may be valid but the request failed.`,
      };
    }
    return {
      ok: false,
      status: null,
      message: `Could not reach Slothing at ${config.baseUrl} — check SLOTHING_API_URL and that the app is running.`,
    };
  }
}

/**
 * Render a token status as a multi-line report for the `refresh` CLI. When the
 * token is not OK, include the exact re-mint steps so the user is never left
 * guessing.
 */
export function formatRefreshReport(
  status: TokenStatus,
  config: ServerConfig,
): string {
  const lines: string[] = [];
  const mark = status.ok ? "OK" : "ACTION NEEDED";
  lines.push(`[slothing-mcp] token check: ${mark}`);
  lines.push(`  api: ${config.baseUrl}`);
  lines.push(`  ${status.message}`);

  if (!status.ok) {
    lines.push("");
    lines.push("  To re-mint a token:");
    lines.push("    1. Sign in to your Slothing instance in a browser.");
    lines.push(
      "    2. Use the extension's connect-account flow (or POST /api/extension/auth",
    );
    lines.push("       with your authenticated session) to mint a new token.");
    lines.push("    3. Update SLOTHING_TOKEN wherever this server is launched.");
    lines.push("");
    lines.push(
      "  Note: tokens cannot self-renew yet — automatic refresh arrives with",
    );
    lines.push("  the service-token work. For now, re-mint roughly monthly.");
  }

  return lines.join("\n");
}
