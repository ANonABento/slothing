import { describe, expect, it } from "vitest";

import { GET, POST } from "./route";
import {
  getRequest,
  invokeRouteHandler,
  jsonRequest,
  routeContext,
} from "@/test/contract";

describe("/api/jobs/[id]/generate deprecated route contract", () => {
  it("returns the deprecated jobs API contract for GET", async () => {
    const response = await invokeRouteHandler(
      GET,
      getRequest("http://localhost/api/jobs/item-1/generate"),
      routeContext(),
    );

    expect(response.status).toBe(410);
    expect(response.headers.get("Deprecation")).toBe("true");
    expect(response.headers.get("Link")).toContain('rel="successor-version"');
    await expect(response.json()).resolves.toMatchObject({
      error: "The /api/jobs API has been deprecated.",
      replacement: expect.stringContaining("/api/opportunities"),
    });
  });

  it("returns the deprecated jobs API contract for POST", async () => {
    const response = await invokeRouteHandler(
      POST,
      jsonRequest("http://localhost/api/jobs/item-1/generate", {}, "POST"),
      routeContext(),
    );

    expect(response.status).toBe(410);
    expect(response.headers.get("Deprecation")).toBe("true");
    expect(response.headers.get("Link")).toContain('rel="successor-version"');
    await expect(response.json()).resolves.toMatchObject({
      error: "The /api/jobs API has been deprecated.",
      replacement: expect.stringContaining("/api/opportunities"),
    });
  });
});
