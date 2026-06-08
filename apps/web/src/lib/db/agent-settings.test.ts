import { describe, it, expect, vi, beforeEach } from "vitest";

const dbMocks = vi.hoisted(() => ({
  execute: vi.fn(),
}));

vi.mock("./client", () => ({ getClient: () => dbMocks }));
vi.mock("@/lib/utils", () => ({ generateId: () => "agent-settings-id" }));
vi.mock("@/lib/format/time", () => ({
  nowIso: () => "2026-06-08T00:00:00.000Z",
}));

import { getAgentSettings, saveAgentSettings } from "./agent-settings";
import { DEFAULT_AGENT_POLICY } from "@/lib/agent/policy";

function result(rows: unknown[] = [], rowsAffected = 0) {
  return { rows, rowsAffected };
}

const ALL_COLUMNS = [
  { name: "id" },
  { name: "user_id" },
  { name: "autonomy" },
  { name: "match_threshold" },
  { name: "salary_floor" },
  { name: "company_blocklist_json" },
  { name: "daily_submit_cap" },
  { name: "dry_run" },
  { name: "schedule_cron" },
  { name: "created_at" },
  { name: "updated_at" },
];

function mockDb(selectRows: unknown[]) {
  dbMocks.execute.mockImplementation((statement: string | { sql: string }) => {
    const sql = typeof statement === "string" ? statement : statement.sql;
    if (sql.startsWith("PRAGMA table_info")) {
      return Promise.resolve(result(ALL_COLUMNS));
    }
    if (sql.startsWith("SELECT")) {
      return Promise.resolve(result(selectRows));
    }
    return Promise.resolve(result([], 1));
  });
}

describe("agent-settings DB", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates the table on first ensure (additive bootstrap)", async () => {
    mockDb([]);
    await getAgentSettings("user-1");
    const ddl = dbMocks.execute.mock.calls
      .map((c) => (typeof c[0] === "string" ? c[0] : c[0].sql))
      .join("\n");
    expect(ddl).toContain("CREATE TABLE IF NOT EXISTS agent_settings");
    expect(ddl).toContain("idx_agent_settings_user_id");
  });

  it("returns defaults when the user has no row", async () => {
    mockDb([]);
    const policy = await getAgentSettings("user-1");
    expect(policy).toEqual(DEFAULT_AGENT_POLICY);
  });

  it("maps a stored row into a policy", async () => {
    mockDb([
      {
        autonomy: "submit_approval",
        match_threshold: 0.4,
        salary_floor: 120000,
        company_blocklist_json: '["acme","globex"]',
        daily_submit_cap: 3,
        dry_run: 0,
        schedule_cron: "0 2 * * *",
        updated_at: "2026-06-01T00:00:00.000Z",
      },
    ]);
    const policy = await getAgentSettings("user-1");
    expect(policy).toEqual({
      autonomy: "submit_approval",
      matchThreshold: 0.4,
      salaryFloor: 120000,
      companyBlocklist: ["acme", "globex"],
      dailySubmitCap: 3,
      dryRun: false,
      scheduleCron: "0 2 * * *",
      updatedAt: "2026-06-01T00:00:00.000Z",
    });
  });

  it("upserts on save and stamps updatedAt", async () => {
    mockDb([]); // getAgentSettings inside save sees no existing row → defaults
    const saved = await saveAgentSettings("user-1", {
      autonomy: "draft",
      matchThreshold: 5, // clamped to 1
      companyBlocklist: ["Acme", "acme"],
    });

    expect(saved.autonomy).toBe("draft");
    expect(saved.matchThreshold).toBe(1);
    expect(saved.companyBlocklist).toEqual(["acme"]);
    expect(saved.updatedAt).toBe("2026-06-08T00:00:00.000Z");

    const upsert = dbMocks.execute.mock.calls.find((c) => {
      const sql = typeof c[0] === "string" ? c[0] : c[0].sql;
      return sql.includes("INSERT INTO agent_settings");
    });
    expect(upsert).toBeTruthy();
    const args = (upsert![0] as { args: unknown[] }).args;
    // id, user_id, autonomy, match_threshold, ...
    expect(args[1]).toBe("user-1");
    expect(args[2]).toBe("draft");
    expect(args[3]).toBe(1);
  });
});
