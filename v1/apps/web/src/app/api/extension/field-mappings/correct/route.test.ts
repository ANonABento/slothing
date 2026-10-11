import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireExtensionAuth: vi.fn(),
  execute: vi.fn(),
  ensureFieldMappingsCorrectionColumnsAsync: vi.fn(),
  nowIso: vi.fn(),
}));

vi.mock("@/lib/extension-auth", () => ({
  requireExtensionAuth: mocks.requireExtensionAuth,
}));

vi.mock("@/lib/db/client", () => ({
  getClient: () => ({ execute: mocks.execute }),
}));

vi.mock("@/lib/db/field-mappings-schema", () => ({
  ensureFieldMappingsCorrectionColumnsAsync:
    mocks.ensureFieldMappingsCorrectionColumnsAsync,
}));

vi.mock("@/lib/format/time", () => ({
  nowIso: mocks.nowIso,
}));

import { POST } from "./route";

function jsonReq(body: unknown, headers: HeadersInit = {}) {
  return new NextRequest(
    "http://localhost/api/extension/field-mappings/correct",
    {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "content-type": "application/json",
        "x-extension-token": "tok-1",
        ...headers,
      },
    },
  );
}

const sampleBody = {
  domain: "Greenhouse.io",
  fieldSignature: "t:email|n:email|i:email-input|l:work email",
  fieldType: "email",
  originalSuggestion: "kevin@gmail.com",
  userValue: "kevin@hamming.ai",
  confidence: 0.78,
};

describe("POST /api/extension/field-mappings/correct", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireExtensionAuth.mockReturnValue({
      success: true,
      userId: "user-1",
    });
    mocks.nowIso.mockReturnValue("2026-05-12T12:00:00.000Z");
  });

  it("inserts a new field mapping on first correction (happy path)", async () => {
    mocks.execute
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rowsAffected: 1 });

    const response = await POST(jsonReq(sampleBody));
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({ saved: true, hitCount: 1 });

    expect(mocks.ensureFieldMappingsCorrectionColumnsAsync).toHaveBeenCalled();

    const args = mocks.execute.mock.calls[1][0].args as unknown[];
    // Domain should be normalized (lowercased, www stripped) before write.
    expect(args).toContain("greenhouse.io");
    // The userId from auth makes it through.
    expect(args).toContain("user-1");
  });

  it("bumps hit_count on an existing (user_id, domain, field_signature) row", async () => {
    mocks.execute
      .mockResolvedValueOnce({ rows: [{ id: "row-1", hit_count: 3 }] })
      .mockResolvedValueOnce({ rowsAffected: 1 });

    const response = await POST(jsonReq(sampleBody));
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({ saved: true, hitCount: 4 });

    const args = mocks.execute.mock.calls[1][0].args as unknown[];
    // hit_count is the third bound parameter in the UPDATE call (after
    // observed_value and field_type). Use a loose assertion that 4 appears.
    expect(args).toContain(4);
    expect(args).toContain("row-1");
    expect(args).toContain("user-1");
  });

  it("returns 401 when the extension token check fails", async () => {
    const failResponse = new Response(
      JSON.stringify({ error: "Invalid token" }),
      {
        status: 401,
        headers: { "content-type": "application/json" },
      },
    );
    mocks.requireExtensionAuth.mockReturnValue({
      success: false,
      response: failResponse,
    });

    const response = await POST(jsonReq(sampleBody));
    expect(response.status).toBe(401);
    expect(mocks.execute).not.toHaveBeenCalled();
  });

  it("rejects payloads missing required fields with 400", async () => {
    const response = await POST(
      jsonReq({ domain: "example.com", fieldSignature: "sig" }),
    );
    expect(response.status).toBe(400);
    expect(mocks.execute).not.toHaveBeenCalled();
  });

  it("returns 400 on invalid JSON bodies", async () => {
    const request = new NextRequest(
      "http://localhost/api/extension/field-mappings/correct",
      {
        method: "POST",
        body: "{",
        headers: {
          "content-type": "application/json",
          "x-extension-token": "tok-1",
        },
      },
    );
    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
