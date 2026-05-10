import { describe, expect, it } from "vitest";

import { GET, PUT, PATCH, DELETE } from "./route";
import {
  getRequest,
  invokeRouteHandler,
  jsonRequest,
  routeContext,
} from "@/test/contract";

describe("/api/jobs/[id] deprecated route contract", () => {
  it("returns the deprecated jobs API contract for GET", async () => {
    const response = await invokeRouteHandler(
      GET,
      getRequest("http://localhost/api/jobs/item-1"),
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

  it("returns the deprecated jobs API contract for PUT", async () => {
    const response = await invokeRouteHandler(
      PUT,
      jsonRequest("http://localhost/api/jobs/item-1", {}, "PUT"),
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

  it("returns the deprecated jobs API contract for PATCH", async () => {
    const response = await invokeRouteHandler(
      PATCH,
      jsonRequest("http://localhost/api/jobs/item-1", {}, "PATCH"),
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

  it("returns the deprecated jobs API contract for DELETE", async () => {
    const response = await invokeRouteHandler(
      DELETE,
      jsonRequest("http://localhost/api/jobs/item-1", {}, "DELETE"),
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
