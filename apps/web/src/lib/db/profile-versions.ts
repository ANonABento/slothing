import { getClient } from "./client";
import { generateId } from "@/lib/utils";

import { nowIso } from "@/lib/format/time";
const MAX_VERSIONS = 20;

export interface ProfileVersion {
  id: string;
  profileId: string;
  version: number;
  snapshotJson: string;
  createdAt: string;
}

export interface ProfileVersionSummary {
  id: string;
  version: number;
  createdAt: string;
}

/**
 * Save a profile snapshot into profile_versions.
 * Auto-prunes to keep only the last MAX_VERSIONS entries.
 */
interface ProfileVersionRow {
  id: string;
  profile_id: string;
  version: number;
  snapshot_json: string;
  created_at: string;
}

function rowToProfileVersion(row: ProfileVersionRow): ProfileVersion {
  return {
    id: row.id,
    profileId: row.profile_id,
    version: row.version,
    snapshotJson: row.snapshot_json,
    createdAt: row.created_at,
  };
}

export async function createProfileSnapshot(
  userId: string,
  snapshotJson: string,
): Promise<ProfileVersion> {
  const lastVersionResult = await getClient().execute({
    sql: "SELECT MAX(version) as max_version FROM profile_versions WHERE user_id = ?",
    args: [userId],
  });
  const lastVersion = lastVersionResult.rows[0] as unknown as
    | { max_version: number | null }
    | undefined;

  const nextVersion = (lastVersion?.max_version ?? 0) + 1;
  const id = generateId();

  await getClient().execute({
    sql: `
    INSERT INTO profile_versions (id, user_id, profile_id, version, snapshot_json, created_at)
    VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `,
    args: [id, userId, userId, nextVersion, snapshotJson],
  });

  await pruneVersions(userId);

  return {
    id,
    profileId: userId,
    version: nextVersion,
    snapshotJson,
    createdAt: nowIso(),
  };
}

/**
 * List all profile versions (most recent first).
 */
export async function listProfileVersions(
  userId: string,
): Promise<ProfileVersionSummary[]> {
  const result = await getClient().execute({
    sql: "SELECT id, version, created_at FROM profile_versions WHERE user_id = ? ORDER BY version DESC",
    args: [userId],
  });
  const rows = result.rows as unknown as Array<{
    id: string;
    version: number;
    created_at: string;
  }>;

  return rows.map((row) => ({
    id: row.id,
    version: row.version,
    createdAt: row.created_at,
  }));
}

/**
 * Get a specific version by ID.
 */
export async function getProfileVersion(
  versionId: string,
  userId: string,
): Promise<ProfileVersion | null> {
  const result = await getClient().execute({
    sql: "SELECT * FROM profile_versions WHERE id = ? AND user_id = ?",
    args: [versionId, userId],
  });
  const row = result.rows[0] as unknown as ProfileVersionRow | undefined;

  if (!row) return null;

  return rowToProfileVersion(row);
}

/**
 * Remove oldest versions beyond MAX_VERSIONS limit.
 */
export async function pruneVersions(userId: string): Promise<number> {
  const countResult = await getClient().execute({
    sql: "SELECT COUNT(*) as count FROM profile_versions WHERE user_id = ?",
    args: [userId],
  });
  const countRow = countResult.rows[0] as unknown as { count: number };

  if (countRow.count <= MAX_VERSIONS) return 0;

  const excess = countRow.count - MAX_VERSIONS;

  const result = await getClient().execute({
    sql: `
    DELETE FROM profile_versions WHERE id IN (
      SELECT id FROM profile_versions
      WHERE user_id = ?
      ORDER BY version ASC
      LIMIT ?
    )
  `,
    args: [userId, excess],
  });

  return result.rowsAffected;
}
