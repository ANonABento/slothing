import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";

vi.mock("./legacy", () => {
  const mockDb = {
    prepare: vi.fn(),
  };
  return { default: mockDb };
});

import db from "./legacy";
import {
  createShare,
  deleteShare,
  DEFAULT_SHARE_TTL_MS,
  generateShareToken,
  getShareByToken,
  incrementViewCount,
  listSharesForUser,
  MAX_SHARE_HTML_BYTES,
} from "./shared-resumes";

interface Statement {
  run: Mock;
  get: Mock;
  all: Mock;
}

function makeStmt(overrides: Partial<Statement> = {}): Statement {
  return {
    run: vi.fn().mockReturnValue({ changes: 0 }),
    get: vi.fn().mockReturnValue(undefined),
    all: vi.fn().mockReturnValue([]),
    ...overrides,
  };
}

function setupSchemaStubs(): void {
  // The schema bootstrap fires three `prepare(...).run()` calls (CREATE TABLE
  // + two CREATE INDEX). Then the test path issues its own statement.
  (db.prepare as Mock).mockImplementation((sql: string) => {
    if (sql.includes("CREATE TABLE") || sql.includes("CREATE INDEX")) {
      return makeStmt();
    }
    throw new Error(`Unexpected SQL in test scaffold: ${sql}`);
  });
}

describe("shared-resumes db helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupSchemaStubs();
  });

  describe("generateShareToken", () => {
    it("produces URL-safe base64 (no +, /, or = padding)", () => {
      const token = generateShareToken();
      expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
      // 16 bytes -> 22 chars, 24 bytes -> 32 chars, etc.
      expect(token.length).toBeGreaterThanOrEqual(20);
      expect(token).not.toContain("+");
      expect(token).not.toContain("/");
      expect(token).not.toContain("=");
    });

    it("generates distinct tokens across calls", () => {
      const tokens = new Set(
        Array.from({ length: 10 }, () => generateShareToken()),
      );
      expect(tokens.size).toBe(10);
    });
  });

  describe("createShare", () => {
    it("inserts a row with a generated token, snapshotted html, and a 7-day expiry", () => {
      const insertStmt = makeStmt();
      (db.prepare as Mock).mockImplementation((sql: string) => {
        if (sql.includes("INSERT INTO shared_resumes")) return insertStmt;
        // schema bootstrap
        return makeStmt();
      });

      const now = 1_700_000_000_000;
      const result = createShare({
        userId: "user-1",
        html: "<h1>Resume</h1>",
        title: "Senior Engineer",
        now,
      });

      expect(result.userId).toBe("user-1");
      expect(result.documentHtml).toBe("<h1>Resume</h1>");
      expect(result.documentTitle).toBe("Senior Engineer");
      expect(result.createdAt).toBe(now);
      expect(result.expiresAt).toBe(now + DEFAULT_SHARE_TTL_MS);
      expect(result.viewCount).toBe(0);
      expect(result.id).toMatch(/^[A-Za-z0-9_-]+$/);

      expect(insertStmt.run).toHaveBeenCalledWith(
        result.id,
        "user-1",
        "<h1>Resume</h1>",
        "Senior Engineer",
        now,
        now + DEFAULT_SHARE_TTL_MS,
      );
    });

    it("rejects empty HTML", () => {
      expect(() =>
        createShare({ userId: "user-1", html: "   ", title: "x" }),
      ).toThrow(/empty/i);
    });

    it("rejects HTML beyond the size cap", () => {
      const oversized = "a".repeat(MAX_SHARE_HTML_BYTES + 1);
      expect(() =>
        createShare({ userId: "user-1", html: oversized, title: "x" }),
      ).toThrow(/maximum share size/);
    });

    it("falls back to a sensible default title", () => {
      const insertStmt = makeStmt();
      (db.prepare as Mock).mockImplementation((sql: string) => {
        if (sql.includes("INSERT INTO shared_resumes")) return insertStmt;
        return makeStmt();
      });

      const result = createShare({
        userId: "user-1",
        html: "<p>hi</p>",
        title: "   ",
      });

      expect(result.documentTitle).toBe("Untitled resume");
    });
  });

  describe("getShareByToken", () => {
    it("returns the share when not expired", () => {
      const now = 1_700_000_000_000;
      const row = {
        id: "tok-1",
        user_id: "user-1",
        document_html: "<p>hi</p>",
        document_title: "Resume",
        created_at: now - 1000,
        expires_at: now + 1000,
        view_count: 3,
      };

      (db.prepare as Mock).mockImplementation((sql: string) => {
        if (sql.startsWith("SELECT * FROM shared_resumes")) {
          return makeStmt({ get: vi.fn().mockReturnValue(row) });
        }
        return makeStmt();
      });

      const result = getShareByToken("tok-1", now);
      expect(result).toEqual({
        id: "tok-1",
        userId: "user-1",
        documentHtml: "<p>hi</p>",
        documentTitle: "Resume",
        createdAt: now - 1000,
        expiresAt: now + 1000,
        viewCount: 3,
      });
    });

    it("returns null when the share is expired", () => {
      const now = 1_700_000_000_000;
      const row = {
        id: "tok-1",
        user_id: "user-1",
        document_html: "<p>hi</p>",
        document_title: "Resume",
        created_at: now - 10_000,
        expires_at: now - 1, // expired one ms ago
        view_count: 0,
      };

      (db.prepare as Mock).mockImplementation((sql: string) => {
        if (sql.startsWith("SELECT * FROM shared_resumes")) {
          return makeStmt({ get: vi.fn().mockReturnValue(row) });
        }
        return makeStmt();
      });

      expect(getShareByToken("tok-1", now)).toBeNull();
    });

    it("returns null when the token is unknown", () => {
      (db.prepare as Mock).mockImplementation((sql: string) => {
        if (sql.startsWith("SELECT * FROM shared_resumes")) {
          return makeStmt({ get: vi.fn().mockReturnValue(undefined) });
        }
        return makeStmt();
      });

      expect(getShareByToken("missing")).toBeNull();
    });
  });

  describe("incrementViewCount", () => {
    it("issues an UPDATE keyed on the token and current time", () => {
      const updateStmt = makeStmt({
        run: vi.fn().mockReturnValue({ changes: 1 }),
      });
      (db.prepare as Mock).mockImplementation((sql: string) => {
        if (sql.startsWith("UPDATE shared_resumes")) return updateStmt;
        return makeStmt();
      });

      const now = 1_700_000_000_000;
      const result = incrementViewCount("tok-1", now);
      expect(result).toBe(1);
      expect(updateStmt.run).toHaveBeenCalledWith("tok-1", now);
    });

    it("returns 0 when nothing matched (already deleted or expired)", () => {
      const updateStmt = makeStmt({
        run: vi.fn().mockReturnValue({ changes: 0 }),
      });
      (db.prepare as Mock).mockImplementation((sql: string) => {
        if (sql.startsWith("UPDATE shared_resumes")) return updateStmt;
        return makeStmt();
      });

      expect(incrementViewCount("missing")).toBe(0);
    });
  });

  describe("listSharesForUser", () => {
    it("returns rows for the user, summary shape only (no html payload)", () => {
      const rows = [
        {
          id: "tok-1",
          document_title: "Resume",
          created_at: 1_000,
          expires_at: 2_000,
          view_count: 4,
        },
      ];
      const allStmt = makeStmt({ all: vi.fn().mockReturnValue(rows) });
      (db.prepare as Mock).mockImplementation((sql: string) => {
        if (
          sql.includes("FROM shared_resumes") &&
          sql.includes("WHERE user_id")
        ) {
          return allStmt;
        }
        return makeStmt();
      });

      const result = listSharesForUser("user-1");
      expect(allStmt.all).toHaveBeenCalledWith("user-1");
      expect(result).toEqual([
        {
          id: "tok-1",
          documentTitle: "Resume",
          createdAt: 1_000,
          expiresAt: 2_000,
          viewCount: 4,
        },
      ]);
      // Critical: don't ship the full html on the list endpoint.
      expect(
        (result[0] as unknown as Record<string, unknown>).documentHtml,
      ).toBeUndefined();
    });
  });

  describe("deleteShare", () => {
    it("returns true when a row was removed", () => {
      const deleteStmt = makeStmt({
        run: vi.fn().mockReturnValue({ changes: 1 }),
      });
      (db.prepare as Mock).mockImplementation((sql: string) => {
        if (sql.startsWith("DELETE FROM shared_resumes")) return deleteStmt;
        return makeStmt();
      });

      expect(deleteShare("tok-1", "user-1")).toBe(true);
      expect(deleteStmt.run).toHaveBeenCalledWith("tok-1", "user-1");
    });

    it("returns false when nothing matched (not owner / not found)", () => {
      const deleteStmt = makeStmt({
        run: vi.fn().mockReturnValue({ changes: 0 }),
      });
      (db.prepare as Mock).mockImplementation((sql: string) => {
        if (sql.startsWith("DELETE FROM shared_resumes")) return deleteStmt;
        return makeStmt();
      });

      expect(deleteShare("tok-1", "user-1")).toBe(false);
    });
  });
});
