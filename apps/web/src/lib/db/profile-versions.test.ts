import { beforeEach, describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  execute: vi.fn(),
}));

vi.mock("./client", () => ({
  getClient: () => dbMocks,
}));

vi.mock("@/lib/utils", () => ({
  generateId: () => "test-version-id",
}));

import {
  createProfileSnapshot,
  listProfileVersions,
  getProfileVersion,
  pruneVersions,
} from "./profile-versions";

const mockProfile = {
  id: "default",
  contact: { name: "John Doe", email: "john@example.com" },
  summary: "Experienced developer",
  experiences: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
};

function result(rows: unknown[] = [], rowsAffected = 0) {
  return { rows, rowsAffected };
}

describe("Profile Versions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbMocks.execute.mockResolvedValue(result([], 1));
  });

  describe("createProfileSnapshot", () => {
    it("should create a snapshot with auto-incremented version", async () => {
      dbMocks.execute
        .mockResolvedValueOnce(result([{ max_version: 2 }]))
        .mockResolvedValueOnce(result([], 1))
        .mockResolvedValueOnce(result([{ count: 3 }]));

      const snapshotJson = JSON.stringify(mockProfile);
      const created = await createProfileSnapshot("default", snapshotJson);

      expect(created.version).toBe(3);
      expect(created.profileId).toBe("default");
      expect(created.id).toBe("test-version-id");
      expect(created.snapshotJson).toBe(snapshotJson);
      expect(dbMocks.execute).toHaveBeenNthCalledWith(2, {
        sql: expect.stringContaining("INSERT INTO profile_versions"),
        args: ["test-version-id", "default", "default", 3, snapshotJson],
      });
    });

    it("should start at version 1 when no versions exist", async () => {
      dbMocks.execute
        .mockResolvedValueOnce(result([{ max_version: null }]))
        .mockResolvedValueOnce(result([], 1))
        .mockResolvedValueOnce(result([{ count: 1 }]));

      const created = await createProfileSnapshot(
        "default",
        JSON.stringify(mockProfile),
      );

      expect(created.version).toBe(1);
    });
  });

  describe("listProfileVersions", () => {
    it("should return all versions sorted by version desc", async () => {
      dbMocks.execute.mockResolvedValueOnce(
        result([
          { id: "v2", version: 2, created_at: "2024-01-15T00:00:00.000Z" },
          { id: "v1", version: 1, created_at: "2024-01-01T00:00:00.000Z" },
        ]),
      );

      const rows = await listProfileVersions("default");

      expect(rows).toEqual([
        { id: "v2", version: 2, createdAt: "2024-01-15T00:00:00.000Z" },
        { id: "v1", version: 1, createdAt: "2024-01-01T00:00:00.000Z" },
      ]);
    });

    it("should return empty array when no versions exist", async () => {
      await expect(listProfileVersions("default")).resolves.toEqual([]);
    });
  });

  describe("getProfileVersion", () => {
    it("should return a specific version by ID", async () => {
      const snapshotJson = JSON.stringify(mockProfile);
      dbMocks.execute.mockResolvedValueOnce(
        result([
          {
            id: "v1",
            profile_id: "default",
            version: 1,
            snapshot_json: snapshotJson,
            created_at: "2024-01-01T00:00:00.000Z",
          },
        ]),
      );

      await expect(getProfileVersion("v1", "default")).resolves.toEqual({
        id: "v1",
        profileId: "default",
        version: 1,
        snapshotJson,
        createdAt: "2024-01-01T00:00:00.000Z",
      });
    });

    it("should return null for non-existent version", async () => {
      await expect(
        getProfileVersion("nonexistent", "default"),
      ).resolves.toBeNull();
    });

    it("should require the user id when fetching by version id", async () => {
      await getProfileVersion("v1", "user-123");

      expect(dbMocks.execute).toHaveBeenCalledWith({
        sql: "SELECT * FROM profile_versions WHERE id = ? AND user_id = ?",
        args: ["v1", "user-123"],
      });
    });
  });

  describe("pruneVersions", () => {
    it("should not prune when under the limit", async () => {
      dbMocks.execute.mockResolvedValueOnce(result([{ count: 15 }]));

      await expect(pruneVersions("default")).resolves.toBe(0);
    });

    it("should prune excess versions beyond 20", async () => {
      dbMocks.execute
        .mockResolvedValueOnce(result([{ count: 23 }]))
        .mockResolvedValueOnce(result([], 3));

      await expect(pruneVersions("default")).resolves.toBe(3);
      expect(dbMocks.execute).toHaveBeenNthCalledWith(2, {
        sql: expect.stringContaining("DELETE FROM profile_versions"),
        args: ["default", 3],
      });
    });

    it("should not prune when exactly at the limit", async () => {
      dbMocks.execute.mockResolvedValueOnce(result([{ count: 20 }]));

      await expect(pruneVersions("default")).resolves.toBe(0);
    });
  });
});
