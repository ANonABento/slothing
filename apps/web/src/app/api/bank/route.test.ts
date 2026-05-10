import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuth: vi.fn(),
  isAuthError: vi.fn(),
  listBankEntriesPaginated: vi.fn(),
  insertBankEntry: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  requireAuth: mocks.requireAuth,
  isAuthError: mocks.isAuthError,
}));

vi.mock("@/lib/db/profile-bank", () => ({
  listBankEntriesPaginated: mocks.listBankEntriesPaginated,
  insertBankEntry: mocks.insertBankEntry,
}));

import { GET, POST } from "./route";

function bankRequest(path = "/api/bank") {
  return new NextRequest(`http://localhost${path}`);
}

function createRequest(body: unknown) {
  return new NextRequest("http://localhost/api/bank", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
  });
}

function malformedRequest() {
  return new NextRequest("http://localhost/api/bank", {
    method: "POST",
    body: "{",
    headers: { "content-type": "application/json" },
  });
}

describe("bank route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAuth.mockResolvedValue({ userId: "user-1" });
    mocks.isAuthError.mockReturnValue(false);
    mocks.listBankEntriesPaginated.mockReturnValue([]);
    mocks.insertBankEntry.mockReturnValue("entry-1");
  });

  it("maps type=hackathon to the hackathon category filter", async () => {
    const response = await GET(bankRequest("/api/bank?type=hackathon"));

    expect(response.status).toBe(200);
    expect(mocks.listBankEntriesPaginated).toHaveBeenCalledWith({
      userId: "user-1",
      query: undefined,
      category: "hackathon",
      sourceDocumentId: undefined,
      cursor: null,
      limit: 50,
    });
  });

  it("filters returned entries by source document id", async () => {
    mocks.listBankEntriesPaginated.mockReturnValue([
      { id: "entry-1", sourceDocumentId: "doc-1" },
    ]);

    const response = await GET(bankRequest("/api/bank?sourceDocumentId=doc-1"));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      entries: [{ id: "entry-1", sourceDocumentId: "doc-1" }],
      items: [{ id: "entry-1", sourceDocumentId: "doc-1" }],
      nextCursor: null,
      hasMore: false,
    });
  });

  it("searches within hackathons when q and type=hackathon are provided", async () => {
    await GET(bankRequest("/api/bank?q=ai&type=hackathon"));

    expect(mocks.listBankEntriesPaginated).toHaveBeenCalledWith({
      userId: "user-1",
      query: "ai",
      category: "hackathon",
      sourceDocumentId: undefined,
      cursor: null,
      limit: 50,
    });
  });

  it("rejects unsupported category filters", async () => {
    const response = await GET(bankRequest("/api/bank?category=invoice"));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: "Validation failed",
      details: { fieldErrors: { category: ["Invalid category"] } },
    });
    expect(mocks.listBankEntriesPaginated).not.toHaveBeenCalled();
  });

  it("accepts hackathon entries on create", async () => {
    const response = await POST(
      createRequest({
        category: "hackathon",
        content: { name: "AI Build Weekend", prizes: ["Best AI App"] },
      }),
    );

    expect(response.status).toBe(201);
    expect(mocks.insertBankEntry).toHaveBeenCalledWith(
      {
        category: "hackathon",
        content: { name: "AI Build Weekend", prizes: ["Best AI App"] },
        confidenceScore: 1.0,
      },
      "user-1",
    );
    await expect(response.json()).resolves.toEqual({
      success: true,
      id: "entry-1",
    });
  });

  it("accepts source document and confidence metadata on create", async () => {
    const response = await POST(
      createRequest({
        category: "bullet",
        content: {
          description: "Built a parser",
          parentId: "parent-1",
        },
        sourceDocumentId: "doc-1",
        confidenceScore: 0.82,
      }),
    );

    expect(response.status).toBe(201);
    expect(mocks.insertBankEntry).toHaveBeenCalledWith(
      {
        category: "bullet",
        content: {
          description: "Built a parser",
          parentId: "parent-1",
        },
        sourceDocumentId: "doc-1",
        confidenceScore: 0.82,
      },
      "user-1",
    );
  });

  it("rejects malformed JSON on create", async () => {
    const response = await POST(malformedRequest());

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Invalid JSON body",
    });
    expect(mocks.insertBankEntry).not.toHaveBeenCalled();
  });

  it("rejects missing required content on create", async () => {
    const response = await POST(createRequest({ category: "bullet" }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: "Validation failed",
      errors: [{ field: "content" }],
    });
    expect(mocks.insertBankEntry).not.toHaveBeenCalled();
  });

  it("rejects wrong category types on create", async () => {
    const response = await POST(
      createRequest({
        category: 123,
        content: { description: "Built a parser" },
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: "Validation failed",
      errors: [{ field: "category" }],
    });
    expect(mocks.insertBankEntry).not.toHaveBeenCalled();
  });
});
