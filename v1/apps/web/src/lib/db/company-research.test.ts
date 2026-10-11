import { describe, it, expect, vi, beforeEach } from "vitest";

const dbMocks = vi.hoisted(() => ({
  execute: vi.fn(),
}));

vi.mock("./client", () => ({
  getClient: () => dbMocks,
}));

vi.mock("@/lib/utils", () => ({
  generateId: () => "research-id",
}));

import {
  deleteCompanyResearch,
  getCompanyEnrichment,
  getCompanyGithubSlug,
  getCompanyResearch,
  isEnrichmentStale,
  saveCompanyEnrichment,
  saveCompanyResearch,
  setCompanyGithubSlug,
} from "./company-research";

function result(rows: unknown[] = [], rowsAffected = 0) {
  return { rows, rowsAffected };
}

const companyRow = {
  id: "research-id",
  user_id: "user-123",
  company_name: "acme",
  summary: "Summary",
  key_facts_json: '["Fact"]',
  interview_questions_json: '["Question"]',
  culture_notes: null,
  recent_news: null,
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-02T00:00:00.000Z",
};

describe("Company Research DB Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbMocks.execute.mockImplementation(
      (statement: string | { sql: string }) => {
        const sql = typeof statement === "string" ? statement : statement.sql;
        if (sql.startsWith("PRAGMA table_info")) {
          return Promise.resolve(
            result([
              { name: "enrichment_json" },
              { name: "enriched_at" },
              { name: "github_slug" },
            ]),
          );
        }
        if (
          sql ===
          "SELECT * FROM company_research WHERE user_id = ? AND LOWER(company_name) = ?"
        ) {
          return Promise.resolve(result([companyRow]));
        }
        return Promise.resolve(result([], 1));
      },
    );
  });

  it("should fetch company research for a specific user", async () => {
    const research = await getCompanyResearch(" Acme ", "user-123");

    expect(dbMocks.execute).toHaveBeenCalledWith({
      sql: "SELECT * FROM company_research WHERE user_id = ? AND LOWER(company_name) = ?",
      args: ["user-123", "acme"],
    });
    expect(research?.id).toBe("research-id");
    expect(research?.keyFacts).toEqual(["Fact"]);
  });

  it("should save company research with user ownership", async () => {
    await saveCompanyResearch(
      {
        companyName: "Acme",
        summary: "Summary",
        keyFacts: [],
        interviewQuestions: [],
      },
      "user-123",
    );

    expect(dbMocks.execute).toHaveBeenCalledWith({
      sql: expect.stringContaining("INSERT INTO company_research"),
      args: [
        "research-id",
        "user-123",
        "acme",
        "Summary",
        "[]",
        "[]",
        null,
        null,
        expect.any(String),
        expect.any(String),
      ],
    });
  });

  it("should delete company research by id and user", async () => {
    await deleteCompanyResearch("research-id", "user-123");

    expect(dbMocks.execute).toHaveBeenCalledWith({
      sql: "DELETE FROM company_research WHERE id = ? AND user_id = ?",
      args: ["research-id", "user-123"],
    });
  });

  it("should save and fetch company enrichment", async () => {
    const snapshot = {
      version: 1 as const,
      github: null,
      news: { ok: true as const, data: { headlines: [] } },
      levels: null,
      blog: null,
      hn: null,
      enrichedAt: "2026-05-01T00:00:00.000Z",
    };
    dbMocks.execute.mockImplementation(
      (statement: string | { sql: string }) => {
        const sql = typeof statement === "string" ? statement : statement.sql;
        if (sql.startsWith("PRAGMA table_info")) {
          return Promise.resolve(
            result([
              { name: "enrichment_json" },
              { name: "enriched_at" },
              { name: "github_slug" },
            ]),
          );
        }
        if (sql.includes("SELECT enrichment_json")) {
          return Promise.resolve(
            result([
              {
                enrichment_json: JSON.stringify(snapshot),
                enriched_at: snapshot.enrichedAt,
              },
            ]),
          );
        }
        return Promise.resolve(result([], 1));
      },
    );

    const saved = await saveCompanyEnrichment("user-123", "Acme", snapshot);
    const fetched = await getCompanyEnrichment("Acme", "user-123");

    expect(saved).toEqual({ snapshot, enrichedAt: snapshot.enrichedAt });
    expect(dbMocks.execute).toHaveBeenCalledWith({
      sql: expect.stringContaining("INSERT INTO company_research"),
      args: [
        "research-id",
        "user-123",
        "acme",
        "[]",
        "[]",
        JSON.stringify(snapshot),
        snapshot.enrichedAt,
        null,
        expect.any(String),
        expect.any(String),
      ],
    });
    expect(fetched).toEqual({ snapshot, enrichedAt: snapshot.enrichedAt });
  });

  it("should save and fetch GitHub slug overrides", async () => {
    dbMocks.execute.mockImplementation(
      (statement: string | { sql: string }) => {
        const sql = typeof statement === "string" ? statement : statement.sql;
        if (sql.startsWith("PRAGMA table_info")) {
          return Promise.resolve(
            result([
              { name: "enrichment_json" },
              { name: "enriched_at" },
              { name: "github_slug" },
            ]),
          );
        }
        if (sql.includes("SELECT github_slug")) {
          return Promise.resolve(result([{ github_slug: "anthropics" }]));
        }
        return Promise.resolve(result([], 1));
      },
    );

    const saved = await setCompanyGithubSlug(
      "user-123",
      "Anthropic",
      " Anthropics ",
    );
    const fetched = await getCompanyGithubSlug("Anthropic", "user-123");

    expect(saved).toBe("anthropics");
    expect(dbMocks.execute).toHaveBeenCalledWith({
      sql: expect.stringContaining("INSERT INTO company_research"),
      args: [
        "research-id",
        "user-123",
        "anthropic",
        "[]",
        "[]",
        "anthropics",
        expect.any(String),
        expect.any(String),
      ],
    });
    expect(fetched).toBe("anthropics");
  });

  it("detects stale enrichment timestamps", () => {
    expect(isEnrichmentStale("not-a-date")).toBe(true);
    expect(isEnrichmentStale("2020-01-01T00:00:00.000Z")).toBe(true);
  });
});
