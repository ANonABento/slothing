import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";

vi.mock("./legacy", () => ({
  default: {
    exec: vi.fn(),
    prepare: vi.fn(),
  },
}));

vi.mock("@/lib/utils", () => ({
  generateId: () => "contact-id",
}));

import db from "./legacy";
import {
  addContactToOpportunity,
  deleteOpportunityContact,
  getContactsForOpportunity,
} from "./opportunity-contacts";

describe("Opportunity contacts database functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists contacts scoped to user and opportunity", () => {
    const mockAll = vi.fn().mockReturnValue([]);
    (db.prepare as Mock).mockReturnValue({ all: mockAll });

    expect(getContactsForOpportunity("opp-1", "user-1")).toEqual([]);

    expect(db.prepare).toHaveBeenCalledWith(
      expect.stringContaining("WHERE user_id = ? AND opportunity_id = ?"),
    );
    expect(mockAll).toHaveBeenCalledWith("user-1", "opp-1");
  });

  it("creates a Google contact row", () => {
    const mockRun = vi.fn();
    const mockGet = vi.fn().mockReturnValue({
      id: "contact-id",
      user_id: "user-1",
      opportunity_id: "opp-1",
      name: "Avery Recruiter",
      email: "avery@example.com",
      phone: null,
      company: "Acme",
      title: "Recruiter",
      source: "google",
      google_resource_name: "people/c123",
      created_at: "2026-05-10T00:00:00.000Z",
    });
    (db.prepare as Mock)
      .mockReturnValueOnce({ run: mockRun })
      .mockReturnValueOnce({ get: mockGet });

    const contact = addContactToOpportunity(
      {
        opportunityId: "opp-1",
        name: "Avery Recruiter",
        email: "avery@example.com",
        company: "Acme",
        title: "Recruiter",
        googleResourceName: "people/c123",
      },
      "user-1",
    );

    expect(contact.googleResourceName).toBe("people/c123");
    expect(mockRun).toHaveBeenCalledWith(
      "contact-id",
      "user-1",
      "opp-1",
      "Avery Recruiter",
      "avery@example.com",
      null,
      "Acme",
      "Recruiter",
      "google",
      "people/c123",
    );
  });

  it("returns the existing Google contact when duplicate insert conflicts", () => {
    const mockRun = vi.fn(() => {
      throw new Error("SQLITE_CONSTRAINT_UNIQUE");
    });
    const existingRow = {
      id: "existing-id",
      user_id: "user-1",
      opportunity_id: "opp-1",
      name: "Avery Recruiter",
      email: null,
      phone: null,
      company: null,
      title: null,
      source: "google",
      google_resource_name: "people/c123",
      created_at: "2026-05-10T00:00:00.000Z",
    };
    (db.prepare as Mock)
      .mockReturnValueOnce({ run: mockRun })
      .mockReturnValueOnce({ get: vi.fn().mockReturnValue(existingRow) });

    expect(
      addContactToOpportunity(
        {
          opportunityId: "opp-1",
          name: "Avery Recruiter",
          googleResourceName: "people/c123",
        },
        "user-1",
      ).id,
    ).toBe("existing-id");
  });

  it("deletes only contacts owned by the user", () => {
    const mockRun = vi.fn().mockReturnValue({ changes: 1 });
    (db.prepare as Mock).mockReturnValue({ run: mockRun });

    expect(deleteOpportunityContact("contact-1", "user-1")).toBe(true);
    expect(mockRun).toHaveBeenCalledWith("contact-1", "user-1");
  });

  it("supports manual contacts without a Google resource", () => {
    const mockRun = vi.fn();
    const mockGet = vi.fn().mockReturnValue({
      id: "contact-id",
      user_id: "user-1",
      opportunity_id: "opp-1",
      name: "Manual Person",
      email: null,
      phone: null,
      company: null,
      title: null,
      source: "manual",
      google_resource_name: null,
      created_at: "2026-05-10T00:00:00.000Z",
    });
    (db.prepare as Mock)
      .mockReturnValueOnce({ run: mockRun })
      .mockReturnValueOnce({ get: mockGet });

    const contact = addContactToOpportunity(
      { opportunityId: "opp-1", name: "Manual Person", source: "manual" },
      "user-1",
    );

    expect(contact.source).toBe("manual");
    expect(mockRun).toHaveBeenCalledWith(
      "contact-id",
      "user-1",
      "opp-1",
      "Manual Person",
      null,
      null,
      null,
      null,
      "manual",
      null,
    );
  });
});
