import Database from "libsql";

export function localDatabasePath(
  env: Record<string, string | undefined> = process.env,
): string {
  const url = env.TURSO_DATABASE_URL?.trim() || "file:./.local.db";

  if (url === ":memory:") {
    return url;
  }

  if (url.startsWith("file:")) {
    return url.slice("file:".length) || ".local.db";
  }

  throw new Error(
    "Legacy synchronous DB helpers only support local file: libSQL URLs",
  );
}

const db = new Database(localDatabasePath(), { timeout: 5000 });

try {
  db.pragma("busy_timeout = 5000");
  db.pragma("journal_mode = WAL");
} catch (error) {
  if ((error as NodeJS.ErrnoException).code !== "SQLITE_BUSY") {
    throw error;
  }
  console.warn(
    "[db] Database was busy while configuring SQLite pragmas; continuing",
  );
}

export default db;
