import { describe, expect, it } from "vitest";

import { GET, POST } from "./route";
import {
  getRequest,
  invokeRouteHandler,
  jsonRequest,
  routeContext,
} from "@/test/contract";

describe("/api/applications compatibility route", () => {
  it("redirects GET requests to filtered opportunities", async () => {
    const response = await invokeRouteHandler(
      GET,
      getRequest("http://localhost/api/applications?limit=25"),
      routeContext(),
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost/api/opportunities?limit=25&status=applied%2Cinterviewing%2Coffered",
    );
  });

  it("preserves explicit status filters on POST requests", async () => {
    const response = await invokeRouteHandler(
      POST,
      jsonRequest(
        "http://localhost/api/applications?status=applied",
        {},
        "POST",
      ),
      routeContext(),
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost/api/opportunities?status=applied",
    );
  });
});
