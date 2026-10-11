import { beforeEach, describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({ execute: vi.fn() }));

vi.mock("./client", () => ({ getClient: () => dbMocks }));
vi.mock("@/lib/utils", () => ({ generateId: () => "tex-doc-1" }));
vi.mock("@/lib/format/time", () => ({
  nowIso: () => "2026-08-21T00:00:00.000Z",
}));

import {
  createTexDocument,
  deleteTexDocument,
  getTexDocument,
  isTexDocumentKind,
  listTexDocuments,
  updateTexDocumentSource,
} from "./tex-documents";

function result(rows: unknown[] = []) {
  return { rows, rowsAffected: rows.length };
}

const ROW = {
  id: "tex-doc-1",
  user_id: "user-a",
  kind: "resume",
  title: "My Resume",
  source: "\\documentclass{article}",
  contract_version: 1,
  template_id: null,
  opportunity_id: null,
  created_at: "2026-08-21T00:00:00.000Z",
  updated_at: "2026-08-21T00:00:00.000Z",
};

beforeEach(() => {
  dbMocks.execute.mockReset();
  dbMocks.execute.mockResolvedValue(result());
});

/** Every executed statement, flattened to SQL strings. */
function sqlStatements(): string[] {
  return dbMocks.execute.mock.calls.map((call) =>
    typeof call[0] === "string" ? call[0] : String(call[0].sql),
  );
}

describe("schema bootstrap", () => {
  // The bootstrap is memoised per module load, so all of its assertions live in one test
  // — a second test would observe an already-ensured schema and see no DDL at all.
  it("creates both tables, each user-scoped and indexed", async () => {
    await createTexDocument({
      userId: "user-a",
      kind: "resume",
      title: "My Resume",
      source: "x",
    });

    const statements = sqlStatements();
    const sql = statements.join("\n");
    expect(sql).toContain("CREATE TABLE IF NOT EXISTS tex_documents");
    expect(sql).toContain("CREATE TABLE IF NOT EXISTS tex_document_versions");
    expect(sql).toContain("idx_tex_documents_user_id");
    expect(sql).toContain("idx_tex_document_versions_user_id");

    const creates = statements.filter((s) => s.includes("CREATE TABLE"));
    expect(creates).toHaveLength(2);
    for (const statement of creates) {
      expect(statement).toContain("user_id TEXT NOT NULL DEFAULT");
    }
  });
});

describe("user scoping", () => {
  it("scopes a fetch by user_id, so an id alone is not authority", async () => {
    dbMocks.execute.mockResolvedValue(result([ROW]));
    await getTexDocument("tex-doc-1", "user-a");

    const select = dbMocks.execute.mock.calls
      .map((c) => c[0])
      .find((c) => typeof c === "object" && String(c.sql).includes("SELECT"));
    expect(String(select.sql)).toContain("WHERE id = ? AND user_id = ?");
    expect(select.args).toEqual(["tex-doc-1", "user-a"]);
  });

  it("scopes a list by user_id", async () => {
    dbMocks.execute.mockResolvedValue(result([ROW]));
    await listTexDocuments("user-a");

    const select = dbMocks.execute.mock.calls
      .map((c) => c[0])
      .find((c) => typeof c === "object" && String(c.sql).includes("SELECT"));
    expect(String(select.sql)).toContain("WHERE user_id = ?");
  });

  it("returns null for another user's document", async () => {
    dbMocks.execute.mockResolvedValue(result([]));
    expect(await getTexDocument("tex-doc-1", "user-b")).toBeNull();
  });

  it("refuses to delete a document that is not the user's", async () => {
    dbMocks.execute.mockResolvedValue(result([]));
    expect(await deleteTexDocument("tex-doc-1", "user-b")).toBe(false);
  });
});

describe("versioning", () => {
  it("snapshots the PREVIOUS source before overwriting it", async () => {
    dbMocks.execute.mockResolvedValue(result([ROW]));
    await updateTexDocumentSource("tex-doc-1", "user-a", "new source");

    const insert = dbMocks.execute.mock.calls
      .map((c) => c[0])
      .find(
        (c) =>
          typeof c === "object" &&
          String(c.sql).includes("INSERT INTO tex_document_versions"),
      );
    expect(insert).toBeDefined();
    // The version row carries the OLD source, not the new one.
    expect(insert.args).toContain(ROW.source);
  });

  it("does not snapshot when the source is unchanged", async () => {
    dbMocks.execute.mockResolvedValue(result([ROW]));
    await updateTexDocumentSource("tex-doc-1", "user-a", ROW.source);

    const inserted = sqlStatements().some((s) =>
      s.includes("INSERT INTO tex_document_versions"),
    );
    expect(inserted).toBe(false);
  });
});

describe("isTexDocumentKind", () => {
  it("accepts the three document kinds and nothing else", () => {
    expect(isTexDocumentKind("resume")).toBe(true);
    expect(isTexDocumentKind("cv")).toBe(true);
    expect(isTexDocumentKind("cover_letter")).toBe(true);
    expect(isTexDocumentKind("letter")).toBe(false);
    expect(isTexDocumentKind(undefined)).toBe(false);
  });
});
