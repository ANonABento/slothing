import { getClient } from "./client";

export const EXTENSION_TOKEN_TTL_RUNTIME_MS = 30 * 24 * 60 * 60 * 1000;
export const EXTENSION_TOKEN_TTL_LOCALSTORAGE_MS = 5 * 60 * 1000;

export interface ExtensionSessionRow {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  last_used_at: string | null;
}

export async function ensureExtensionSessionsColumnsAsync(): Promise<void> {
  try {
    const result = await getClient().execute(
      "PRAGMA table_info(extension_sessions)",
    );
    const columnNames = new Set(
      result.rows.map((column) => String(column.name)),
    );

    if (!columnNames.has("device_user_agent")) {
      await getClient().execute(
        "ALTER TABLE extension_sessions ADD COLUMN device_user_agent text",
      );
    }
  } catch {
    // Tests and first-boot environments may not have the table available yet.
  }
}

export async function createExtensionSession({
  id,
  userId,
  token,
  deviceInfo,
  userAgent,
  expiresAt,
}: {
  id: string;
  userId: string;
  token: string;
  deviceInfo?: string | null;
  userAgent?: string | null;
  expiresAt: string;
}): Promise<void> {
  await getClient().execute({
    sql: `
      INSERT INTO extension_sessions (id, user_id, token, device_info, device_user_agent, expires_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    args: [id, userId, token, deviceInfo || null, userAgent || null, expiresAt],
  });
}

export async function getExtensionSessionByToken(
  token: string,
): Promise<ExtensionSessionRow | null> {
  const result = await getClient().execute({
    sql: "SELECT * FROM extension_sessions WHERE token = ?",
    args: [token],
  });
  return (result.rows[0] as unknown as ExtensionSessionRow | undefined) ?? null;
}

export async function touchExtensionSession(
  id: string,
  userId: string,
  lastUsedAt: string,
): Promise<void> {
  await getClient().execute({
    sql: "UPDATE extension_sessions SET last_used_at = ? WHERE id = ? AND user_id = ?",
    args: [lastUsedAt, id, userId],
  });
}

export async function deleteExtensionSession(
  id: string,
  userId: string,
): Promise<void> {
  await getClient().execute({
    sql: "DELETE FROM extension_sessions WHERE id = ? AND user_id = ?",
    args: [id, userId],
  });
}

export async function deleteExtensionSessionByToken(
  token: string,
  userId: string,
): Promise<void> {
  await getClient().execute({
    sql: "DELETE FROM extension_sessions WHERE token = ? AND user_id = ?",
    args: [token, userId],
  });
}

export async function deleteExtensionSessionsForUser(
  userId: string,
): Promise<void> {
  await getClient().execute({
    sql: "DELETE FROM extension_sessions WHERE user_id = ?",
    args: [userId],
  });
}
