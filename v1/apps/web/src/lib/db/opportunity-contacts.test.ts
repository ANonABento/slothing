import { beforeEach, describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  execute: vi.fn(),
  batch: vi.fn(),
}));

vi.mock("./client", () => ({
  getClient: () => dbMocks,
}));

vi.mock("@/lib/utils", () => ({
  generateId: () => "contact-id",
}));

import {
  addContactToOpportunity,
  deleteOpportunityContact,
  getContactsForOpportunity,
} from "./opportunity-contacts";

const contactRow = {
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
};

function result(rows: unknown[] = [], rowsAffected = 0) {
  return { rows, rowsAffected };
}

describe("Opportunity contacts database functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbMocks.batch.mockResolvedValue([]);
    dbMocks.execute.mockImplementation((statement: { sql: string }) => {
      if (statement.sql.includes("SELECT id, user_id")) {
        return Promise.resolve(result([contactRow]));
      }
      return Promise.resolve(result([], 1));
    });
  });

  it("lists contacts scoped to user and opportunity", async () => {
    await expect(
      getContactsForOpportunity("opp-1", "user-1"),
    ).resolves.toHaveLength(1);

    expect(dbMocks.execute).toHaveBeenCalledWith({
      sql: expect.stringContaining("WHERE user_id = ? AND opportunity_id = ?"),
      args: ["user-1", "opp-1"],
    });
  });

  it("creates a Google contact row", async () => {
    const contact = await addContactToOpportunity(
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
    expect(dbMocks.execute).toHaveBeenCalledWith({
      sql: expect.stringContaining("INSERT INTO opportunity_contacts"),
      args: [
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
      ],
    });
  });

  it("returns the existing Google contact when duplicate insert conflicts", async () => {
    dbMocks.execute.mockImplementationOnce(() =>
      Promise.reject(new Error("SQLITE_CONSTRAINT_UNIQUE")),
    );

    await expect(
      addContactToOpportunity(
        {
          opportunityId: "opp-1",
          name: "Avery Recruiter",
          googleResourceName: "people/c123",
        },
        "user-1",
      ).then((contact) => contact.id),
    ).resolves.toBe("contact-id");
  });

  it("deletes only contacts owned by the user", async () => {
    await expect(deleteOpportunityContact("contact-1", "user-1")).resolves.toBe(
      true,
    );
    expect(dbMocks.execute).toHaveBeenCalledWith({
      sql: expect.stringContaining("DELETE FROM opportunity_contacts"),
      args: ["contact-1", "user-1"],
    });
  });

  it("supports manual contacts without a Google resource", async () => {
    dbMocks.execute.mockImplementation((statement: { sql: string }) => {
      if (statement.sql.includes("SELECT id, user_id")) {
        return Promise.resolve(
          result([
            {
              ...contactRow,
              name: "Manual Person",
              email: null,
              company: null,
              title: null,
              source: "manual",
              google_resource_name: null,
            },
          ]),
        );
      }
      return Promise.resolve(result([], 1));
    });

    const contact = await addContactToOpportunity(
      { opportunityId: "opp-1", name: "Manual Person", source: "manual" },
      "user-1",
    );

    expect(contact.source).toBe("manual");
    expect(dbMocks.execute).toHaveBeenCalledWith({
      sql: expect.stringContaining("INSERT INTO opportunity_contacts"),
      args: [
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
      ],
    });
  });
});
