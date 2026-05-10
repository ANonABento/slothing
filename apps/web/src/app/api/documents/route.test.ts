import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuth: vi.fn(),
  isAuthError: vi.fn(),
  listDocumentsPaginated: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  requireAuth: mocks.requireAuth,
  isAuthError: mocks.isAuthError,
}));

vi.mock("@/lib/db", () => ({
  listDocumentsPaginated: mocks.listDocumentsPaginated,
}));

import { GET } from "./route";

function documentsRequest(path = "/api/documents") {
  return new NextRequest(`http://localhost${path}`);
}

describe("documents route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAuth.mockResolvedValue({ userId: "user-1" });
    mocks.isAuthError.mockReturnValue(false);
    mocks.listDocumentsPaginated.mockReturnValue([]);
  });

  it("lists all documents for the authenticated user when no type is provided", async () => {
    mocks.listDocumentsPaginated.mockReturnValueOnce([
      {
        id: "doc-1",
        filename: "resume.pdf",
        type: "resume",
        mimeType: "application/pdf",
        size: 1024,
        path: "/uploads/resume.pdf",
        uploadedAt: "2026-04-01T10:00:00.000Z",
      },
    ]);

    const response = await GET(documentsRequest());

    expect(mocks.listDocumentsPaginated).toHaveBeenCalledWith({
      userId: "user-1",
      type: undefined,
      cursor: null,
      limit: 50,
    });
    await expect(response.json()).resolves.toEqual({
      documents: [
        {
          id: "doc-1",
          filename: "resume.pdf",
          type: "resume",
          mimeType: "application/pdf",
          size: 1024,
          path: "/uploads/resume.pdf",
          uploadedAt: "2026-04-01T10:00:00.000Z",
        },
      ],
      items: [
        {
          id: "doc-1",
          filename: "resume.pdf",
          type: "resume",
          mimeType: "application/pdf",
          size: 1024,
          path: "/uploads/resume.pdf",
          uploadedAt: "2026-04-01T10:00:00.000Z",
        },
      ],
      nextCursor: null,
      hasMore: false,
    });
  });

  it("lists only documents matching the requested type for the authenticated user", async () => {
    mocks.listDocumentsPaginated.mockReturnValueOnce([
      {
        id: "doc-2",
        filename: "cover-letter.pdf",
        type: "cover_letter",
        mimeType: "application/pdf",
        size: 2048,
        path: "/uploads/cover-letter.pdf",
        uploadedAt: "2026-04-02T10:00:00.000Z",
      },
    ]);

    const response = await GET(
      documentsRequest("/api/documents?type=cover_letter"),
    );

    expect(mocks.listDocumentsPaginated).toHaveBeenCalledWith({
      userId: "user-1",
      type: "cover_letter",
      cursor: null,
      limit: 50,
    });
    await expect(response.json()).resolves.toEqual({
      documents: [
        {
          id: "doc-2",
          filename: "cover-letter.pdf",
          type: "cover_letter",
          mimeType: "application/pdf",
          size: 2048,
          path: "/uploads/cover-letter.pdf",
          uploadedAt: "2026-04-02T10:00:00.000Z",
        },
      ],
      items: [
        {
          id: "doc-2",
          filename: "cover-letter.pdf",
          type: "cover_letter",
          mimeType: "application/pdf",
          size: 2048,
          path: "/uploads/cover-letter.pdf",
          uploadedAt: "2026-04-02T10:00:00.000Z",
        },
      ],
      nextCursor: null,
      hasMore: false,
    });
  });

  it("accepts every supported document type in the type filter", async () => {
    const response = await GET(
      documentsRequest("/api/documents?type=reference_letter"),
    );

    expect(response.status).toBe(200);
    expect(mocks.listDocumentsPaginated).toHaveBeenCalledWith({
      userId: "user-1",
      type: "reference_letter",
      cursor: null,
      limit: 50,
    });
  });

  it("rejects unsupported document type filters", async () => {
    const response = await GET(documentsRequest("/api/documents?type=invoice"));

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("Validation failed");
    expect(mocks.listDocumentsPaginated).not.toHaveBeenCalled();
  });
});
