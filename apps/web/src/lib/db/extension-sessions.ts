import db from "./legacy";

export const EXTENSION_TOKEN_TTL_RUNTIME_MS = 30 * 24 * 60 * 60 * 1000;
export const EXTENSION_TOKEN_TTL_LOCALSTORAGE_MS = 5 * 60 * 1000;

export function ensureExtensionSessionsColumns(): void {
  try {
    const columns = db
      .prepare("PRAGMA table_info(extension_sessions)")
      .all() as Array<{ name: string }>;
    const columnNames = new Set(columns.map((column) => column.name));

    if (!columnNames.has("device_user_agent")) {
      db.prepare(
        "ALTER TABLE extension_sessions ADD COLUMN device_user_agent text",
      ).run();
    }
  } catch {
    // Tests and first-boot environments may not have the table available yet.
  }
}
