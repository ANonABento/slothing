import type { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuth: vi.fn(),
  isAuthError: vi.fn(),
  createParserV2UploadReview: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  requireAuth: mocks.requireAuth,
  isAuthError: mocks.isAuthError,
}));

vi.mock("@/lib/ingest/parser-v2-upload-review", () => ({
  createParserV2UploadReview: mocks.createParserV2UploadReview,
}));

import { DocumentUploadError } from "@/lib/ingest/document-upload";
import { POST } from "./route";

function uploadRequest(url = "http://localhost/api/documents/upload/review") {
  const file = { name: "resume.pdf" } as File;
  const formData = {
    get: vi.fn((key: string) => (key === "file" ? file : null)),
  };
  return {
    nextUrl: new URL(url),
    formData: vi.fn().mockResolvedValue(formData),
  } as unknown as NextRequest;
}

const document = {
  id: "doc-1",
  filename: "resume.pdf",
  type: "resume",
  mimeType: "application/pdf",
  size: 123,
  path: "/uploads/doc-1.pdf",
  uploadedAt: "2026-05-18T10:00:00.000Z",
};

describe("/api/documents/upload/review", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAuth.mockResolvedValue({ userId: "user-1" });
    mocks.isAuthError.mockReturnValue(false);
    mocks.createParserV2UploadReview.mockResolvedValue({
      upload: { document, duplicate: false },
      document,
      artifact: { id: "artifact-1" },
      parseRun: { id: "run-1" },
      entries: [
        {
          id: "exp-1",
          userId: "user-1",
          category: "experience",
          content: { title: "Engineer" },
          createdAt: "2026-05-18T10:00:00.000Z",
        },
      ],
      sourceText: "Resume source",
      sourceRefs: [],
      diagnostic: { lineCount: 1 },
    });
  });

  it("returns parser-v2 review data without requiring legacy bank rows", async () => {
    const response = await POST(uploadRequest());

    expect(mocks.createParserV2UploadReview).toHaveBeenCalledWith({
      file: expect.objectContaining({ name: "resume.pdf" }),
      userId: "user-1",
      documentType: null,
      replaceExisting: false,
    });
    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toMatchObject({
      success: true,
      document: { id: "doc-1" },
      artifact: { id: "artifact-1" },
      parseRun: { id: "run-1" },
      entries: [{ id: "exp-1" }],
      sourceText: "Resume source",
      next: {
        sourceMapUrl: "/api/documents/doc-1/source-map?parseRunId=run-1",
        commitUrl: "/api/bank/imports/run-1/commit",
      },
    });
  });

  it("passes force replacement to the parser-v2 upload review service", async () => {
    const response = await POST(
      uploadRequest("http://localhost/api/documents/upload/review?force=true"),
    );

    expect(response.status).toBe(201);
    expect(mocks.createParserV2UploadReview).toHaveBeenCalledWith(
      expect.objectContaining({ replaceExisting: true }),
    );
  });

  it("returns duplicate uploads as a conflict for review UI replacement", async () => {
    mocks.createParserV2UploadReview.mockResolvedValueOnce({
      upload: { document, duplicate: true },
      document,
      entries: [],
      sourceText: "",
      sourceRefs: [],
      diagnostic: null,
    });

    const response = await POST(uploadRequest());

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toMatchObject({
      error: "Duplicate file upload",
      existing: { id: "doc-1", filename: "resume.pdf" },
    });
  });

  it("maps upload validation errors to public responses", async () => {
    mocks.createParserV2UploadReview.mockRejectedValueOnce(
      new DocumentUploadError("missing_file", "No file provided", 400),
    );

    const response = await POST(uploadRequest());

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "No file provided",
    });
  });
});
