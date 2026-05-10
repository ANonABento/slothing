import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import { parseJsonBody, parseSearchParams } from "./api-utils";

const schema = z.object({
  name: z.string().min(1),
});

function request(body: string) {
  return new NextRequest("http://localhost/api/example", {
    method: "POST",
    body,
    headers: { "content-type": "application/json" },
  });
}

describe("api-utils body parsing", () => {
  it("returns typed data for valid JSON", async () => {
    const result = await parseJsonBody(request('{"name":"Ada"}'), schema);

    expect(result).toEqual({ ok: true, data: { name: "Ada" } });
  });

  it("returns a 400 response for malformed JSON", async () => {
    const result = await parseJsonBody(request("{"), schema);

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.response.status).toBe(400);
    await expect(result.response.json()).resolves.toEqual({
      error: "Invalid JSON body",
    });
  });

  it("returns validation details for schema failures", async () => {
    const result = await parseJsonBody(request('{"name":123}'), schema);

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.response.status).toBe(400);
    await expect(result.response.json()).resolves.toMatchObject({
      error: "Validation failed",
      errors: [{ field: "name" }],
    });
  });

  it("validates search params with the same error shape", () => {
    const result = parseSearchParams(
      new URLSearchParams("force=maybe"),
      z.object({ force: z.enum(["true", "false"]).optional() }),
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.response.status).toBe(400);
    }
  });
});
