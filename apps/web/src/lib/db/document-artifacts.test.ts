import { beforeEach, describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  execute: vi.fn(),
  batch: vi.fn(),
}));

vi.mock("./client", () => ({
  getClient: () => dbMocks,
}));

vi.mock("@/lib/utils", () => ({
  generateId: vi.fn(() => "artifact-generated"),
}));

import {
  deleteDocumentArtifactsByDocumentIds,
  getLatestDocumentArtifact,
  listDocumentArtifacts,
  saveDocumentArtifact,
} from "./document-artifacts";
import type { DocumentSourceMap } from "@/lib/ingest/types";

const sourceMap: DocumentSourceMap = {
  pages: [{ page: 1, width: 612, height: 792, lineIds: ["p1-l001"] }],
  rawText: "Jake Ryan",
  lines: [
    {
      id: "p1-l001",
      page: 1,
      text: "Jake Ryan",
      tokenIds: ["p1-l001-t001"],
      bbox: { page: 1, x0: 10, y0: 20, x1: 100, y1: 32 },
      tokens: [
        {
          id: "p1-l001-t001",
          page: 1,
          lineId: "p1-l001",
          text: "Jake Ryan",
          bbox: { page: 1, x0: 10, y0: 20, x1: 100, y1: 32 },
        },
      ],
    },
  ],
};

function result(rows: unknown[] = [], rowsAffected = 0) {
  return { rows, rowsAffected };
}

function artifactRow(overrides: Record<string, unknown> = {}) {
  return {
    id: "artifact-1",
    document_id: "doc-1",
    user_id: "user-1",
    extractor_version: "pdf-source-map-v1",
    status: "ready",
    failure_reason: null,
    raw_text: sourceMap.rawText,
    normalized_text: "Jake Ryan",
    pages_json: JSON.stringify([
      { ...sourceMap.pages[0], lines: sourceMap.lines },
    ]),
    links_json: JSON.stringify([{ url: "https://example.com", page: 1 }]),
    ocr_used: 0,
    created_at: "2026-05-18T10:00:00.000Z",
    ...overrides,
  };
}

describe("document artifact db helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbMocks.batch.mockResolvedValue([]);
    dbMocks.execute.mockResolvedValue(result([], 1));
  });

  it("persists a source map artifact with pages and lines", async () => {
    const artifact = await saveDocumentArtifact({
      documentId: "doc-1",
      userId: "user-1",
      sourceMap,
      links: [{ url: "https://example.com", page: 1 }],
      createdAt: "2026-05-18T10:00:00.000Z",
    });

    expect(artifact).toMatchObject({
      id: "artifact-generated",
      documentId: "doc-1",
      userId: "user-1",
      status: "ready",
      rawText: "Jake Ryan",
      normalizedText: "Jake Ryan",
      sourceMap,
    });
    expect(dbMocks.execute).toHaveBeenCalledWith({
      sql: expect.stringContaining("INSERT INTO document_artifacts"),
      args: [
        "artifact-generated",
        "doc-1",
        "user-1",
        "pdf-source-map-v1",
        "ready",
        null,
        "Jake Ryan",
        "Jake Ryan",
        JSON.stringify([{ ...sourceMap.pages[0], lines: sourceMap.lines }]),
        JSON.stringify([{ url: "https://example.com", page: 1 }]),
        0,
        "2026-05-18T10:00:00.000Z",
      ],
    });
  });

  it("loads the latest artifact and reconstructs the source map", async () => {
    dbMocks.execute.mockResolvedValueOnce(result([artifactRow()]));

    await expect(
      getLatestDocumentArtifact("doc-1", "user-1"),
    ).resolves.toMatchObject({
      id: "artifact-1",
      documentId: "doc-1",
      userId: "user-1",
      sourceMap,
      links: [{ url: "https://example.com", page: 1 }],
    });
  });

  it("lists artifacts newest first", async () => {
    dbMocks.execute.mockResolvedValueOnce(
      result([artifactRow({ id: "artifact-2" }), artifactRow()]),
    );

    await expect(
      listDocumentArtifacts("doc-1", "user-1").then((rows) =>
        rows.map((row) => row.id),
      ),
    ).resolves.toEqual(["artifact-2", "artifact-1"]);
  });

  it("deletes unique document ids in an atomic batch", async () => {
    dbMocks.batch.mockResolvedValueOnce([result([], 1), result([], 2)]);

    await expect(
      deleteDocumentArtifactsByDocumentIds(
        ["doc-1", "doc-1", "doc-2"],
        "user-1",
      ),
    ).resolves.toBe(3);
    expect(dbMocks.batch).toHaveBeenLastCalledWith(
      [
        {
          sql: "DELETE FROM document_artifacts WHERE document_id = ? AND user_id = ?",
          args: ["doc-1", "user-1"],
        },
        {
          sql: "DELETE FROM document_artifacts WHERE document_id = ? AND user_id = ?",
          args: ["doc-2", "user-1"],
        },
      ],
      "write",
    );
  });
});
