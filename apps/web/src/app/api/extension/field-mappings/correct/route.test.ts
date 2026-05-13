import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireExtensionAuth: vi.fn(),
  prepare: vi.fn(),
  ensureFieldMappingsCorrectionColumns: vi.fn(),
  nowIso: vi.fn(),
}));

vi.mock("@/lib/extension-auth", () => ({
  requireExtensionAuth: mocks.requireExtensionAuth,
}));

vi.mock("@/lib/db/legacy", () => ({
  default: {
    prepare: mocks.prepare,
  },
}));

vi.mock("@/lib/db/field-mappings-schema", () => ({
  ensureFieldMappingsCorrectionColumns:
    mocks.ensureFieldMappingsCorrectionColumns,
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
  const runInsert = vi.fn();
  const runUpdate = vi.fn();
  const getExisting = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    runInsert.mockReset();
    runUpdate.mockReset();
    getExisting.mockReset();
    mocks.requireExtensionAuth.mockReturnValue({
      success: true,
      userId: "user-1",
    });
    mocks.nowIso.mockReturnValue("2026-05-12T12:00:00.000Z");

    // Route prepares three different statements (SELECT existing, UPDATE,
    // INSERT). Distinguish by inspecting the SQL passed in.
    mocks.prepare.mockImplementation((sql: string) => {
      if (/^SELECT/i.test(sql)) {
        return { get: getExisting };
      }
      if (/^UPDATE/i.test(sql)) {
        return { run: runUpdate };
      }
      return { run: runInsert };
    });
  });

  it("inserts a new field mapping on first correction (happy path)", async () => {
    getExisting.mockReturnValue(undefined);

    const response = await POST(jsonReq(sampleBody));
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({ saved: true, hitCount: 1 });

    expect(mocks.ensureFieldMappingsCorrectionColumns).toHaveBeenCalled();
    expect(runInsert).toHaveBeenCalledTimes(1);
    expect(runUpdate).not.toHaveBeenCalled();

    const args = runInsert.mock.calls[0];
    // Domain should be normalized (lowercased, www stripped) before write.
    expect(args).toContain("greenhouse.io");
    // The userId from auth makes it through.
    expect(args).toContain("user-1");
  });

  it("bumps hit_count on an existing (user_id, domain, field_signature) row", async () => {
    getExisting.mockReturnValue({ id: "row-1", hit_count: 3 });

    const response = await POST(jsonReq(sampleBody));
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({ saved: true, hitCount: 4 });

    expect(runInsert).not.toHaveBeenCalled();
    expect(runUpdate).toHaveBeenCalledTimes(1);

    const args = runUpdate.mock.calls[0];
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
    expect(runInsert).not.toHaveBeenCalled();
    expect(runUpdate).not.toHaveBeenCalled();
  });

  it("rejects payloads missing required fields with 400", async () => {
    const response = await POST(
      jsonReq({ domain: "example.com", fieldSignature: "sig" }),
    );
    expect(response.status).toBe(400);
    expect(runInsert).not.toHaveBeenCalled();
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
