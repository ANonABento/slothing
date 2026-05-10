import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getJob: vi.fn(),
  getContactsForOpportunity: vi.fn(),
  deleteOpportunityContact: vi.fn(),
}));

vi.mock("@/lib/auth", () =>
  globalThis.__contractRouteMocks!.createAuthModuleMock(),
);

vi.mock("@/lib/db/jobs", () => ({
  getJob: mocks.getJob,
}));

vi.mock("@/lib/db/opportunity-contacts", () => ({
  getContactsForOpportunity: mocks.getContactsForOpportunity,
  deleteOpportunityContact: mocks.deleteOpportunityContact,
}));

import { DELETE } from "./route";
import {
  getRequest,
  invokeRouteHandler,
  resetContractMocks,
  routeContext,
  setAuthFailure,
} from "@/test/contract";

describe("/api/opportunities/[id]/contacts/[contactId] route contract", () => {
  beforeEach(() => {
    resetContractMocks();
    mocks.getJob.mockReturnValue({ id: "opp-1" });
    mocks.getContactsForOpportunity.mockReturnValue([{ id: "contact-1" }]);
    mocks.deleteOpportunityContact.mockReturnValue(true);
  });

  it("deletes an existing contact", async () => {
    const response = await invokeRouteHandler(
      DELETE,
      getRequest("http://localhost/api/opportunities/opp-1/contacts/contact-1"),
      routeContext({ id: "opp-1", contactId: "contact-1" }),
    );

    expect(response.status).toBe(204);
  });

  it("returns 404 when the contact is not on the opportunity", async () => {
    mocks.getContactsForOpportunity.mockReturnValue([]);

    const response = await invokeRouteHandler(
      DELETE,
      getRequest("http://localhost/api/opportunities/opp-1/contacts/missing"),
      routeContext({ id: "opp-1", contactId: "missing" }),
    );

    expect(response.status).toBe(404);
  });

  it("returns the shared auth failure contract", async () => {
    setAuthFailure();

    const response = await invokeRouteHandler(
      DELETE,
      getRequest("http://localhost/api/opportunities/opp-1/contacts/contact-1"),
      routeContext({ id: "opp-1", contactId: "contact-1" }),
    );

    expect(response.status).toBe(401);
  });
});
