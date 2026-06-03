import { beforeEach, describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  execute: vi.fn(),
  batch: vi.fn(),
}));

vi.mock("./client", () => ({
  getClient: () => dbMocks,
}));

vi.mock("@/lib/utils", () => ({
  generateId: vi.fn(() => "parse-run-generated"),
}));

import {
  deleteDocumentParseRunsByDocumentIds,
  getDocumentParseRun,
  getDocumentParseRunById,
  listDocumentParseRuns,
  saveDocumentParseRun,
} from "./document-parse-runs";
import type { ParsedResumeV2Result } from "@/lib/ingest/types";

const structured: ParsedResumeV2Result = {
  profile: {
    contact: {
      name: "Jake Ryan",
      confidence: 1,
      sourceSpanIds: ["p1-l001"],
      sourceQuality: "exact",
    },
    experiences: [],
    education: [],
    skills: [],
    projects: [],
    rawText: "Jake Ryan",
  },
  sectionsDetected: [],
  confidence: 0.25,
  rawText: "Jake Ryan",
  warnings: ["No education detected"],
};

function result(rows: unknown[] = [], rowsAffected = 0) {
  return { rows, rowsAffected };
}

function parseRunRow(overrides: Record<string, unknown> = {}) {
  return {
    id: "run-1",
    document_id: "doc-1",
    artifact_id: "artifact-1",
    user_id: "user-1",
    mode: "basic",
    parser_version: "resume-v2-basic-v1",
    status: "ready",
    failure_reason: null,
    confidence: 0.25,
    warnings_json: JSON.stringify([
      {
        code: "low_confidence",
        message: "Low confidence",
        severity: "warning",
      },
    ]),
    structured_json: JSON.stringify(structured),
    created_at: "2026-05-18T10:00:00.000Z",
    ...overrides,
  };
}

describe("document parse run db helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbMocks.batch.mockResolvedValue([]);
    dbMocks.execute.mockResolvedValue(result([], 1));
  });

  it("persists a parser run", async () => {
    const parseRun = await saveDocumentParseRun({
      documentId: "doc-1",
      artifactId: "artifact-1",
      userId: "user-1",
      confidence: structured.confidence,
      warnings: [
        {
          code: "low_confidence",
          message: "Low confidence",
          severity: "warning",
        },
      ],
      structured,
      createdAt: "2026-05-18T10:00:00.000Z",
    });

    expect(parseRun).toMatchObject({
      id: "parse-run-generated",
      documentId: "doc-1",
      artifactId: "artifact-1",
      userId: "user-1",
      mode: "basic",
      parserVersion: "resume-v2-basic-v1",
      status: "ready",
      confidence: 0.25,
      structured,
    });
    expect(dbMocks.execute).toHaveBeenCalledWith({
      sql: expect.stringContaining("INSERT INTO document_parse_runs"),
      args: [
        "parse-run-generated",
        "doc-1",
        "artifact-1",
        "user-1",
        "basic",
        "resume-v2-basic-v1",
        "ready",
        null,
        0.25,
        JSON.stringify([
          {
            code: "low_confidence",
            message: "Low confidence",
            severity: "warning",
          },
        ]),
        JSON.stringify(structured),
        "2026-05-18T10:00:00.000Z",
      ],
    });
  });

  it("loads a parse run scoped to document and user", async () => {
    dbMocks.execute.mockResolvedValueOnce(result([parseRunRow()]));

    await expect(
      getDocumentParseRun("run-1", "doc-1", "user-1"),
    ).resolves.toMatchObject({
      id: "run-1",
      documentId: "doc-1",
      artifactId: "artifact-1",
      structured,
    });
  });

  it("loads a parse run by id scoped to user", async () => {
    dbMocks.execute.mockResolvedValueOnce(result([parseRunRow()]));

    await expect(
      getDocumentParseRunById("run-1", "user-1"),
    ).resolves.toMatchObject({
      id: "run-1",
      documentId: "doc-1",
      artifactId: "artifact-1",
    });
  });

  it("lists parse runs newest first", async () => {
    dbMocks.execute.mockResolvedValueOnce(
      result([parseRunRow({ id: "run-2" }), parseRunRow()]),
    );

    await expect(
      listDocumentParseRuns("doc-1", "user-1").then((rows) =>
        rows.map((row) => row.id),
      ),
    ).resolves.toEqual(["run-2", "run-1"]);
  });

  it("deletes unique document ids in an atomic batch", async () => {
    dbMocks.batch.mockResolvedValueOnce([result([], 1), result([], 2)]);

    await expect(
      deleteDocumentParseRunsByDocumentIds(
        ["doc-1", "doc-1", "doc-2"],
        "user-1",
      ),
    ).resolves.toBe(3);
    expect(dbMocks.batch).toHaveBeenLastCalledWith(
      [
        {
          sql: "DELETE FROM document_parse_runs WHERE document_id = ? AND user_id = ?",
          args: ["doc-1", "user-1"],
        },
        {
          sql: "DELETE FROM document_parse_runs WHERE document_id = ? AND user_id = ?",
          args: ["doc-2", "user-1"],
        },
      ],
      "write",
    );
  });
});
