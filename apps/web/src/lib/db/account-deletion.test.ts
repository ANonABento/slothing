import { beforeEach, describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  execute: vi.fn(),
  batch: vi.fn(),
}));

const cleanupMocks = vi.hoisted(() => ({
  deleteStoredDocumentFiles: vi.fn(),
}));

vi.mock("./client", () => ({
  getClient: () => dbMocks,
}));

vi.mock("@/lib/ingest/document-file-cleanup", () => ({
  deleteStoredDocumentFiles: cleanupMocks.deleteStoredDocumentFiles,
}));

import { deleteAccountData } from "./account-deletion";

function result(rows: unknown[] = [], rowsAffected = 0) {
  return { rows, rowsAffected };
}

describe("account deletion repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbMocks.execute.mockResolvedValue(result([{ id: "table" }]));
    dbMocks.execute.mockResolvedValueOnce(
      result([{ id: "doc-1", path: "/tmp/resume.pdf" }]),
    );
    dbMocks.batch.mockImplementation((statements: unknown[]) =>
      Promise.resolve(
        statements.map((_, index) => result([], index === 0 ? 2 : 0)),
      ),
    );
    cleanupMocks.deleteStoredDocumentFiles.mockResolvedValue({
      deleted: [{ id: "doc-1", path: "/tmp/resume.pdf" }],
      failed: [],
    });
  });

  it("deletes user-scoped rows atomically and cleans up stored document files", async () => {
    const deleted = await deleteAccountData("user-1");

    expect(dbMocks.execute).toHaveBeenCalledWith({
      sql: "SELECT id, path FROM documents WHERE user_id = ?",
      args: ["user-1"],
    });
    expect(dbMocks.batch).toHaveBeenCalledWith(
      expect.arrayContaining([
        { sql: "DELETE FROM jobs WHERE user_id = ?", args: ["user-1"] },
        { sql: "DELETE FROM `user` WHERE id = ?", args: ["user-1"] },
      ]),
      "write",
    );
    expect(cleanupMocks.deleteStoredDocumentFiles).toHaveBeenCalledWith([
      { id: "doc-1", path: "/tmp/resume.pdf" },
    ]);
    expect(deleted.userId).toBe("user-1");
    expect(deleted.totalDeletedRows).toBe(2);
  });

  it("skips optional tables that are not present", async () => {
    dbMocks.execute.mockReset();
    dbMocks.execute.mockResolvedValue(result([]));
    dbMocks.execute.mockResolvedValueOnce(result([]));
    dbMocks.batch.mockResolvedValue([]);
    cleanupMocks.deleteStoredDocumentFiles.mockResolvedValue({
      deleted: [],
      failed: [],
    });

    await deleteAccountData("user-1");

    const statements = dbMocks.batch.mock.calls[0][0] as Array<{
      sql: string;
    }>;
    expect(statements).not.toContainEqual({
      sql: "DELETE FROM product_events WHERE user_id = ?",
      args: ["user-1"],
    });
  });
});
