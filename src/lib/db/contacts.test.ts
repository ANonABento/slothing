import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";

vi.mock("./schema", () => {
  const mockDb = {
    prepare: vi.fn(),
  };
  return { default: mockDb };
});

vi.mock("@/lib/utils", () => ({
  generateId: () => "contact-id-123",
}));

import db from "./schema";
import {
  createContact,
  deleteContact,
  getContact,
  getContacts,
  normalizeContactListOptions,
  updateContact,
} from "./contacts";

describe("Contact Database Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("normalizes pagination and search options", () => {
    expect(
      normalizeContactListOptions({
        page: -2,
        pageSize: 200,
        query: "  recruiter  ",
        followUpFilter: "due",
      })
    ).toEqual({
      page: 1,
      pageSize: 50,
      query: "recruiter",
      followUpFilter: "due",
    });
  });

  it("returns paginated contacts for a user", () => {
    const mockGet = vi.fn().mockReturnValue({ count: 1 });
    const mockAll = vi.fn().mockReturnValue([
      {
        id: "contact-1",
        user_id: "user-1",
        name: "Avery Lee",
        role: "Recruiter",
        company: "Tech Co",
        email: "avery@example.com",
        linkedin: null,
        last_contacted: "2026-04-01",
        next_followup: "2026-05-01",
        notes: "Met at event",
        created_at: "2026-04-01T00:00:00.000Z",
        updated_at: "2026-04-02T00:00:00.000Z",
      },
    ]);

    (db.prepare as Mock)
      .mockReturnValueOnce({ get: mockGet })
      .mockReturnValueOnce({ all: mockAll });

    const result = getContacts(
      { page: 2, pageSize: 5, query: "Avery", followUpFilter: "upcoming" },
      "user-1"
    );

    expect(mockGet).toHaveBeenCalledWith(
      "user-1",
      "%avery%",
      "%avery%",
      "%avery%",
      "%avery%",
      "%avery%",
      "%avery%"
    );
    expect(mockAll).toHaveBeenCalledWith(
      "user-1",
      "%avery%",
      "%avery%",
      "%avery%",
      "%avery%",
      "%avery%",
      "%avery%",
      5,
      5
    );
    expect(result).toEqual({
      contacts: [
        {
          id: "contact-1",
          userId: "user-1",
          name: "Avery Lee",
          role: "Recruiter",
          company: "Tech Co",
          email: "avery@example.com",
          linkedin: undefined,
          lastContacted: "2026-04-01",
          nextFollowup: "2026-05-01",
          notes: "Met at event",
          createdAt: "2026-04-01T00:00:00.000Z",
          updatedAt: "2026-04-02T00:00:00.000Z",
        },
      ],
      total: 1,
      page: 2,
      pageSize: 5,
      totalPages: 1,
    });
  });

  it("gets a contact by id and user", () => {
    const mockGet = vi.fn().mockReturnValue({
      id: "contact-1",
      user_id: "user-1",
      name: "Avery Lee",
    });
    (db.prepare as Mock).mockReturnValue({ get: mockGet });

    const result = getContact("contact-1", "user-1");

    expect(db.prepare).toHaveBeenCalledWith(
      "SELECT * FROM contacts WHERE id = ? AND user_id = ?"
    );
    expect(mockGet).toHaveBeenCalledWith("contact-1", "user-1");
    expect(result?.name).toBe("Avery Lee");
  });

  it("creates a contact and stores blank optional fields as null", () => {
    const mockRun = vi.fn();
    const mockGet = vi.fn().mockReturnValue({
      id: "contact-id-123",
      user_id: "user-1",
      name: "Avery Lee",
      company: "Tech Co",
    });

    (db.prepare as Mock).mockImplementation((sql: string) => {
      if (sql.includes("INSERT INTO contacts")) return { run: mockRun };
      return { get: mockGet };
    });

    const result = createContact(
      {
        name: " Avery Lee ",
        role: "",
        company: " Tech Co ",
        email: "",
        linkedin: "",
        lastContacted: "",
        nextFollowup: "2026-05-01",
        notes: "  Follow up after launch  ",
      },
      "user-1"
    );

    expect(mockRun).toHaveBeenCalledWith(
      "contact-id-123",
      "user-1",
      "Avery Lee",
      null,
      "Tech Co",
      null,
      null,
      null,
      "2026-05-01",
      "Follow up after launch"
    );
    expect(result.id).toBe("contact-id-123");
  });

  it("updates an existing contact", () => {
    const existing = {
      id: "contact-1",
      user_id: "user-1",
      name: "Avery Lee",
      role: "Recruiter",
      company: "Tech Co",
      email: null,
      linkedin: null,
      last_contacted: null,
      next_followup: null,
      notes: null,
    };
    const updated = { ...existing, role: "Hiring Manager" };
    const mockRun = vi.fn();
    const mockGet = vi.fn().mockReturnValueOnce(existing).mockReturnValueOnce(updated);

    (db.prepare as Mock).mockImplementation((sql: string) => {
      if (sql.includes("UPDATE contacts")) return { run: mockRun };
      return { get: mockGet };
    });

    const result = updateContact("contact-1", { role: "Hiring Manager" }, "user-1");

    expect(mockRun).toHaveBeenCalledWith(
      "Avery Lee",
      "Hiring Manager",
      "Tech Co",
      null,
      null,
      null,
      null,
      null,
      "contact-1",
      "user-1"
    );
    expect(result?.role).toBe("Hiring Manager");
  });

  it("returns false when deleting a missing contact", () => {
    const mockRun = vi.fn().mockReturnValue({ changes: 0 });
    (db.prepare as Mock).mockReturnValue({ run: mockRun });

    expect(deleteContact("missing", "user-1")).toBe(false);
    expect(mockRun).toHaveBeenCalledWith("missing", "user-1");
  });
});
