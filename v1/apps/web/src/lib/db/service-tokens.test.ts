import { describe, it, expect, vi, beforeEach } from "vitest";

const dbMocks = vi.hoisted(() => ({ execute: vi.fn() }));

vi.mock("./client", () => ({ getClient: () => dbMocks }));
vi.mock("@/lib/utils", () => ({ generateId: () => "tok-id" }));
vi.mock("crypto", () => ({
  randomUUID: () => "uuid",
  default: { randomUUID: () => "uuid" },
}));
vi.mock("@/lib/format/time", () => ({
  nowDate: () => new Date(1_000_000),
  toIso: (d: Date) => new Date(d).toISOString(),
  addDays: (d: Date, n: number) =>
    new Date(new Date(d).getTime() + n * 86_400_000),
}));

import {
  createServiceToken,
  listServiceTokens,
  deleteServiceToken,
  SERVICE_TOKEN_TTL_MS,
} from "./service-tokens";

function result(rows: unknown[] = [], rowsAffected = 0) {
  return { rows, rowsAffected };
}

const ALL_COLUMNS = [
  "id",
  "user_id",
  "token",
  "kind",
  "label",
  "created_at",
].map((name) => ({ name }));

describe("service-tokens DB", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbMocks.execute.mockResolvedValue(result([], 1));
  });

  it("ensures kind/label columns then inserts a service token with a 180d TTL", async () => {
    dbMocks.execute.mockImplementation((stmt: string | { sql: string }) => {
      const sql = typeof stmt === "string" ? stmt : stmt.sql;
      if (sql.startsWith("PRAGMA")) return Promise.resolve(result(ALL_COLUMNS));
      return Promise.resolve(result([], 1));
    });

    const created = await createServiceToken("user-1", "overnight-agent");

    expect(created.token).toContain("svc-");
    expect(created.label).toBe("overnight-agent");
    expect(created.tokenSuffix).toBe(created.token.slice(-4));

    const insert = dbMocks.execute.mock.calls.find((c) => {
      const sql = typeof c[0] === "string" ? c[0] : c[0].sql;
      return (
        sql.includes("INSERT INTO extension_sessions") &&
        sql.includes("'service'")
      );
    });
    expect(insert).toBeTruthy();
    const args = (insert![0] as { args: unknown[] }).args;
    // created_at then expires_at — expires must be 180d after created.
    const createdAt = Date.parse(args[4] as string);
    const expiresAt = Date.parse(args[5] as string);
    expect(expiresAt - createdAt).toBe(SERVICE_TOKEN_TTL_MS);
  });

  it("lists only service-kind tokens with masked suffix", async () => {
    dbMocks.execute.mockImplementation((stmt: string | { sql: string }) => {
      const sql = typeof stmt === "string" ? stmt : stmt.sql;
      if (sql.startsWith("PRAGMA")) return Promise.resolve(result(ALL_COLUMNS));
      if (sql.includes("SELECT")) {
        return Promise.resolve(
          result([
            {
              id: "t1",
              token: "svc-aaaa-bbbb-cccc-wxyz",
              label: "agent",
              created_at: "2026-06-01T00:00:00.000Z",
              last_used_at: null,
              expires_at: "2026-12-01T00:00:00.000Z",
            },
          ]),
        );
      }
      return Promise.resolve(result([], 1));
    });

    const tokens = await listServiceTokens("user-1");
    expect(tokens).toHaveLength(1);
    expect(tokens[0]?.tokenSuffix).toBe("wxyz");
    // The raw token is never exposed in the summary.
    expect(JSON.stringify(tokens[0])).not.toContain("svc-aaaa");
    const sql = dbMocks.execute.mock.calls
      .map((c) => (typeof c[0] === "string" ? c[0] : c[0].sql))
      .find((s) => s.includes("SELECT"));
    expect(sql).toContain("kind = 'service'");
  });

  it("reports whether a delete removed a row", async () => {
    dbMocks.execute.mockImplementation((stmt: string | { sql: string }) => {
      const sql = typeof stmt === "string" ? stmt : stmt.sql;
      if (sql.startsWith("PRAGMA")) return Promise.resolve(result(ALL_COLUMNS));
      if (sql.startsWith("DELETE")) return Promise.resolve(result([], 1));
      return Promise.resolve(result([], 0));
    });
    expect(await deleteServiceToken("t1", "user-1")).toBe(true);
  });
});
