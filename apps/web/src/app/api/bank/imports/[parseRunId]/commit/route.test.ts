import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuth: vi.fn(),
  isAuthError: vi.fn(),
  getDocumentParseRunById: vi.fn(),
  getDocumentArtifact: vi.fn(),
  getProfile: vi.fn(),
  deleteBankEntriesBySource: vi.fn(),
  insertBankEntries: vi.fn(),
  updateProfile: vi.fn(),
  buildParseRunBankEntries: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  requireAuth: mocks.requireAuth,
  isAuthError: mocks.isAuthError,
}));

vi.mock("@/lib/db", () => ({
  getDocumentParseRunById: mocks.getDocumentParseRunById,
  getDocumentArtifact: mocks.getDocumentArtifact,
  getProfile: mocks.getProfile,
  deleteBankEntriesBySource: mocks.deleteBankEntriesBySource,
  insertBankEntries: mocks.insertBankEntries,
  updateProfile: mocks.updateProfile,
}));

vi.mock("@/lib/ingest/parse-run-bank-import", () => ({
  buildParseRunBankEntries: mocks.buildParseRunBankEntries,
}));

import { POST } from "./route";
import { invokeRouteHandler, jsonRequest, routeContext } from "@/test/contract";

function postCommit(body?: unknown) {
  if (body === undefined) {
    return new NextRequest("http://localhost/api/bank/imports/run-1/commit", {
      method: "POST",
    });
  }
  return jsonRequest("http://localhost/api/bank/imports/run-1/commit", body);
}

const parseRun = {
  id: "run-1",
  documentId: "doc-1",
  artifactId: "artifact-1",
  userId: "user-1",
  status: "ready",
  structured: { profile: { experiences: [] } },
};

const parsedResumeRun = {
  ...parseRun,
  structured: {
    profile: {
      contact: {
        name: "Jake Gutierrez",
        email: "jake@example.com",
        confidence: 0.9,
        sourceSpanIds: ["p1-l1"],
        sourceQuality: "exact",
      },
      summary: {
        text: "Software engineer",
        sourceSpanIds: ["p1-l2"],
        sourceQuality: "exact",
      },
      experiences: [
        {
          id: "exp-1",
          company: "Hamming AI",
          title: "Software Engineer",
          startDate: "2024",
          current: true,
          description: "",
          highlights: [
            {
              text: "Built parser-v2",
              sourceSpanIds: ["p1-l3"],
              sourceQuality: "exact",
            },
          ],
          skills: ["TypeScript"],
          sourceSpanIds: ["p1-l3"],
          sourceQuality: "exact",
        },
      ],
      education: [],
      skills: [],
      projects: [],
      rawText: "Jake Gutierrez",
    },
    sectionsDetected: ["contact", "experience"],
    confidence: 0.9,
    rawText: "Jake Gutierrez",
    warnings: [],
  },
};

const artifact = {
  id: "artifact-1",
  documentId: "doc-1",
  sourceMap: { pages: [], lines: [], rawText: "" },
};

describe("/api/bank/imports/[parseRunId]/commit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAuth.mockResolvedValue({ userId: "user-1" });
    mocks.isAuthError.mockReturnValue(false);
    mocks.getDocumentParseRunById.mockReturnValue(parseRun);
    mocks.getDocumentArtifact.mockReturnValue(artifact);
    mocks.buildParseRunBankEntries.mockReturnValue([
      { category: "education", content: { institution: "Southwestern" } },
    ]);
    mocks.insertBankEntries.mockReturnValue(["entry-1"]);
    mocks.getProfile.mockReturnValue(null);
  });

  it("commits parser-v2 entries for the authenticated user", async () => {
    const response = await invokeRouteHandler(
      POST,
      postCommit({
        acceptedComponentIds: ["edu-1"],
        edits: { "edu-1": { institution: "Southwestern University" } },
      }),
      routeContext({ parseRunId: "run-1" }),
    );

    expect(mocks.getDocumentParseRunById).toHaveBeenCalledWith(
      "run-1",
      "user-1",
    );
    expect(mocks.getDocumentArtifact).toHaveBeenCalledWith(
      "artifact-1",
      "user-1",
    );
    expect(mocks.buildParseRunBankEntries).toHaveBeenCalledWith({
      parseRun,
      sourceMap: artifact.sourceMap,
      acceptedComponentIds: ["edu-1"],
      edits: { "edu-1": { institution: "Southwestern University" } },
    });
    expect(mocks.deleteBankEntriesBySource).toHaveBeenCalledWith(
      "doc-1",
      "user-1",
    );
    expect(mocks.insertBankEntries).toHaveBeenCalledWith(
      [{ category: "education", content: { institution: "Southwestern" } }],
      "user-1",
    );
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      success: true,
      parseRunId: "run-1",
      documentId: "doc-1",
      inserted: 1,
      entryIds: ["entry-1"],
      profilePromoted: false,
    });
  });

  it("treats an empty body as commit all components", async () => {
    const response = await invokeRouteHandler(
      POST,
      postCommit(),
      routeContext({ parseRunId: "run-1" }),
    );

    expect(response.status).toBe(200);
    expect(mocks.buildParseRunBankEntries).toHaveBeenCalledWith(
      expect.objectContaining({
        acceptedComponentIds: undefined,
        edits: undefined,
      }),
    );
  });

  it("returns 404 when the parse run is missing", async () => {
    mocks.getDocumentParseRunById.mockReturnValue(null);

    const response = await invokeRouteHandler(
      POST,
      postCommit({}),
      routeContext({ parseRunId: "run-1" }),
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: "Parse run not found",
    });
    expect(mocks.insertBankEntries).not.toHaveBeenCalled();
  });

  it("rejects failed parse runs", async () => {
    mocks.getDocumentParseRunById.mockReturnValue({
      ...parseRun,
      status: "failed",
    });

    const response = await invokeRouteHandler(
      POST,
      postCommit({}),
      routeContext({ parseRunId: "run-1" }),
    );

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({
      error: "Parse run is not ready to commit",
    });
  });

  it("returns 404 when the artifact is missing or mismatched", async () => {
    mocks.getDocumentArtifact.mockReturnValue({
      ...artifact,
      documentId: "other",
    });

    const response = await invokeRouteHandler(
      POST,
      postCommit({}),
      routeContext({ parseRunId: "run-1" }),
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: "Document artifact not found",
    });
  });

  it("does not delete existing source entries when no components are accepted", async () => {
    mocks.buildParseRunBankEntries.mockReturnValue([]);

    const response = await invokeRouteHandler(
      POST,
      postCommit({ acceptedComponentIds: [] }),
      routeContext({ parseRunId: "run-1" }),
    );

    expect(response.status).toBe(200);
    expect(mocks.deleteBankEntriesBySource).not.toHaveBeenCalled();
    expect(mocks.insertBankEntries).not.toHaveBeenCalled();
    await expect(response.json()).resolves.toMatchObject({
      inserted: 0,
      entryIds: [],
    });
  });

  it("auto-promotes parser-v2 profile data after commit when requested", async () => {
    mocks.getDocumentParseRunById.mockReturnValue(parsedResumeRun);
    const response = await invokeRouteHandler(
      POST,
      postCommit({ autoPromoteProfile: true }),
      routeContext({ parseRunId: "run-1" }),
    );

    expect(response.status).toBe(200);
    expect(mocks.updateProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        contact: expect.objectContaining({
          name: "Jake Gutierrez",
          email: "jake@example.com",
        }),
        summary: "Software engineer",
        experiences: [
          expect.objectContaining({
            id: "exp-1",
            highlights: ["Built parser-v2"],
          }),
        ],
      }),
      "user-1",
    );
    await expect(response.json()).resolves.toMatchObject({
      profilePromoted: true,
    });
  });
});
