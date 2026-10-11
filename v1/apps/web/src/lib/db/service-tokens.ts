/**
 * Service tokens (docs/agent-overnight-apply-spec.md, P5) — longer-lived tokens
 * for always-on headless agents and the hosted runner.
 *
 * A service token is an `extension_sessions` row with `kind = 'service'`, so it
 * authenticates across every `/api/extension/*` route via the existing
 * `requireExtensionAuth` path — no second auth model. The only differences are a
 * much longer TTL, a user-facing `label`, and a revoke/audit UI.
 */
import { getClient } from "./client";
import { generateId } from "@/lib/utils";
import { randomUUID } from "crypto";
import { addDays, nowDate, toIso } from "@/lib/format/time";

/** Service tokens last 180 days (vs the 30-day runtime extension token). */
export const SERVICE_TOKEN_TTL_DAYS = 180;
export const SERVICE_TOKEN_TTL_MS =
  SERVICE_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000;

let columnsEnsured = false;

export async function ensureServiceTokenColumns(): Promise<void> {
  if (columnsEnsured) return;
  try {
    const result = await getClient().execute(
      "PRAGMA table_info(extension_sessions)",
    );
    const names = new Set(result.rows.map((c) => String(c.name)));
    if (!names.has("kind")) {
      await getClient().execute(
        "ALTER TABLE extension_sessions ADD COLUMN kind text DEFAULT 'extension'",
      );
    }
    if (!names.has("label")) {
      await getClient().execute(
        "ALTER TABLE extension_sessions ADD COLUMN label text",
      );
    }
    if (!names.has("created_at")) {
      await getClient().execute(
        "ALTER TABLE extension_sessions ADD COLUMN created_at text",
      );
    }
    columnsEnsured = true;
  } catch {
    // First-boot / test environments may lack the table.
  }
}

export interface ServiceTokenSummary {
  id: string;
  label: string | null;
  /** Last 4 chars of the token — enough to recognize it, not to use it. */
  tokenSuffix: string;
  createdAt: string | null;
  lastUsedAt: string | null;
  expiresAt: string;
}

export interface CreatedServiceToken extends ServiceTokenSummary {
  /** The full token — returned ONCE at creation and never again. */
  token: string;
}

interface ServiceTokenRow {
  id: string;
  token: string;
  label: string | null;
  created_at: string | null;
  last_used_at: string | null;
  expires_at: string;
}

function rowToSummary(row: ServiceTokenRow): ServiceTokenSummary {
  return {
    id: row.id,
    label: row.label,
    tokenSuffix: row.token.slice(-4),
    createdAt: row.created_at,
    lastUsedAt: row.last_used_at,
    expiresAt: row.expires_at,
  };
}

export async function createServiceToken(
  userId: string,
  label: string,
): Promise<CreatedServiceToken> {
  await ensureServiceTokenColumns();
  const id = generateId();
  const token = `svc-${randomUUID()}-${randomUUID()}`;
  const createdDate = nowDate();
  const now = toIso(createdDate);
  const expiresAt = toIso(addDays(createdDate, SERVICE_TOKEN_TTL_DAYS));

  await getClient().execute({
    sql: "INSERT INTO extension_sessions (id, user_id, token, kind, label, created_at, expires_at) VALUES (?, ?, ?, 'service', ?, ?, ?)",
    args: [id, userId, token, label || null, now, expiresAt],
  });

  return {
    id,
    token,
    label: label || null,
    tokenSuffix: token.slice(-4),
    createdAt: now,
    lastUsedAt: null,
    expiresAt,
  };
}

export async function listServiceTokens(
  userId: string,
): Promise<ServiceTokenSummary[]> {
  await ensureServiceTokenColumns();
  try {
    const result = await getClient().execute({
      sql: "SELECT id, token, label, created_at, last_used_at, expires_at FROM extension_sessions WHERE user_id = ? AND kind = 'service' ORDER BY created_at DESC",
      args: [userId],
    });
    return (result.rows as unknown as ServiceTokenRow[]).map(rowToSummary);
  } catch {
    return [];
  }
}

export async function deleteServiceToken(
  id: string,
  userId: string,
): Promise<boolean> {
  await ensureServiceTokenColumns();
  const result = await getClient().execute({
    sql: "DELETE FROM extension_sessions WHERE id = ? AND user_id = ? AND kind = 'service'",
    args: [id, userId],
  });
  return (result.rowsAffected ?? 0) > 0;
}
