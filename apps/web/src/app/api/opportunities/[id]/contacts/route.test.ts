import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getJob: vi.fn(),
  getContactsForOpportunity: vi.fn(),
  addContactToOpportunity: vi.fn(),
}));

vi.mock("@/lib/auth", () =>
  globalThis.__contractRouteMocks!.createAuthModuleMock(),
);

vi.mock("@/lib/db/jobs", () => ({
  getJob: mocks.getJob,
}));

vi.mock("@/lib/db/opportunity-contacts", () => ({
  getContactsForOpportunity: mocks.getContactsForOpportunity,
  addContactToOpportunity: mocks.addContactToOpportunity,
}));

import { GET, POST } from "./route";
import {
  expectRouteResponseContract,
  getRequest,
  invalidJsonRequest,
  invokeRouteHandler,
  jsonRequest,
  resetContractMocks,
  routeContext,
  setAuthFailure,
  setAuthSuccess,
} from "@/test/contract";

describe("/api/opportunities/[id]/contacts route contract", () => {
  beforeEach(() => {
    resetContractMocks();
    mocks.getJob.mockReturnValue({ id: "opp-1" });
    mocks.getContactsForOpportunity.mockReturnValue([]);
    mocks.addContactToOpportunity.mockReturnValue({
      id: "contact-1",
      name: "Avery Recruiter",
    });
  });

  it("returns saved contacts for an existing opportunity", async () => {
    const response = await invokeRouteHandler(
      GET,
      getRequest("http://localhost/api/opportunities/opp-1/contacts"),
      routeContext({ id: "opp-1" }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ contacts: [] });
  });

  it("returns 404 when the opportunity is missing", async () => {
    mocks.getJob.mockReturnValue(null);

    const response = await invokeRouteHandler(
      GET,
      getRequest("http://localhost/api/opportunities/missing/contacts"),
      routeContext({ id: "missing" }),
    );

    expect(response.status).toBe(404);
  });

  it("returns the shared auth failure contract", async () => {
    setAuthFailure();

    const response = await invokeRouteHandler(
      GET,
      getRequest("http://localhost/api/opportunities/opp-1/contacts"),
      routeContext({ id: "opp-1" }),
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toMatchObject({
      error: expect.any(String),
    });
  });

  it("creates a contact from valid input", async () => {
    setAuthSuccess();

    const response = await invokeRouteHandler(
      POST,
      jsonRequest(
        "http://localhost/api/opportunities/opp-1/contacts",
        { name: "Avery Recruiter", source: "google" },
        "POST",
      ),
      routeContext({ id: "opp-1" }),
    );

    expect(response.status).toBe(201);
    await expectRouteResponseContract(response);
  });

  it("rejects missing names", async () => {
    const response = await invokeRouteHandler(
      POST,
      jsonRequest(
        "http://localhost/api/opportunities/opp-1/contacts",
        { source: "google" },
        "POST",
      ),
      routeContext({ id: "opp-1" }),
    );

    expect(response.status).toBe(400);
  });

  it("rejects malformed JSON", async () => {
    const response = await invokeRouteHandler(
      POST,
      invalidJsonRequest(
        "http://localhost/api/opportunities/opp-1/contacts",
        "POST",
      ),
      routeContext({ id: "opp-1" }),
    );

    expect(response.status).toBe(400);
  });
});
