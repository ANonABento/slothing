import db from "@/lib/db/legacy";

export interface EligibleDigestUser {
  userId: string;
  email: string;
  name?: string | null;
  digestEnabled: boolean;
}

interface EligibleDigestUserRow {
  id: string;
  email: string | null;
  name: string | null;
  digest_enabled: string | null;
}

export function getEligibleDigestUsers(limit = 1000): EligibleDigestUser[] {
  const rows = db
    .prepare(
      `
        SELECT u.id, u.email, u.name
             , COALESCE(s.value, 'true') AS digest_enabled
        FROM user u
        LEFT JOIN settings s
          ON s.user_id = u.id
         AND s.key = 'digest_enabled'
        WHERE u.email IS NOT NULL
        ORDER BY u.id ASC
        LIMIT ?
      `,
    )
    .all(limit) as EligibleDigestUserRow[];

  return rows
    .filter((row) => row.email)
    .map((row) => ({
      userId: row.id,
      email: row.email!,
      name: row.name,
      digestEnabled: row.digest_enabled !== "false",
    }));
}
