import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  batch: vi.fn(),
  execute: vi.fn(),
}));

vi.mock("./client", () => ({
  getClient: () => ({
    batch: mocks.batch,
    execute: mocks.execute,
  }),
}));

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

describe("shared-resumes db helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.batch.mockResolvedValue([]);
  });

  describe("generateShareToken", () => {
    it("produces URL-safe base64 (no +, /, or = padding)", () => {
      const token = generateShareToken();
      expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
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
    it("inserts a row with a generated token, snapshotted html, and a 7-day expiry", async () => {
      mocks.execute.mockResolvedValueOnce({ rows: [], rowsAffected: 1 });

      const now = 1_700_000_000_000;
      const result = await createShare({
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

      expect(mocks.execute).toHaveBeenCalledWith({
        sql: expect.stringContaining("INSERT INTO shared_resumes"),
        args: [
          result.id,
          "user-1",
          "<h1>Resume</h1>",
          "Senior Engineer",
          now,
          now + DEFAULT_SHARE_TTL_MS,
        ],
      });
    });

    it("rejects empty HTML", async () => {
      await expect(
        createShare({ userId: "user-1", html: "   ", title: "x" }),
      ).rejects.toThrow(/empty/i);
    });

    it("rejects HTML beyond the size cap", async () => {
      const oversized = "a".repeat(MAX_SHARE_HTML_BYTES + 1);
      await expect(
        createShare({ userId: "user-1", html: oversized, title: "x" }),
      ).rejects.toThrow(/maximum share size/);
    });

    it("falls back to a sensible default title", async () => {
      mocks.execute.mockResolvedValueOnce({ rows: [], rowsAffected: 1 });

      const result = await createShare({
        userId: "user-1",
        html: "<p>hi</p>",
        title: "   ",
      });

      expect(result.documentTitle).toBe("Untitled resume");
    });
  });

  describe("getShareByToken", () => {
    it("returns the share when not expired", async () => {
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

      mocks.execute.mockResolvedValueOnce({ rows: [row] });

      await expect(getShareByToken("tok-1", now)).resolves.toEqual({
        id: "tok-1",
        userId: "user-1",
        documentHtml: "<p>hi</p>",
        documentTitle: "Resume",
        createdAt: now - 1000,
        expiresAt: now + 1000,
        viewCount: 3,
      });
    });

    it("returns null when the share is expired", async () => {
      const now = 1_700_000_000_000;
      const row = {
        id: "tok-1",
        user_id: "user-1",
        document_html: "<p>hi</p>",
        document_title: "Resume",
        created_at: now - 10_000,
        expires_at: now - 1,
        view_count: 0,
      };

      mocks.execute.mockResolvedValueOnce({ rows: [row] });

      await expect(getShareByToken("tok-1", now)).resolves.toBeNull();
    });

    it("returns null when the token is unknown", async () => {
      mocks.execute.mockResolvedValueOnce({ rows: [] });

      await expect(getShareByToken("missing")).resolves.toBeNull();
    });
  });

  describe("incrementViewCount", () => {
    it("issues an UPDATE keyed on the token and current time", async () => {
      mocks.execute.mockResolvedValueOnce({ rows: [], rowsAffected: 1 });

      const now = 1_700_000_000_000;
      await expect(incrementViewCount("tok-1", now)).resolves.toBe(1);
      expect(mocks.execute).toHaveBeenCalledWith({
        sql: expect.stringContaining("UPDATE shared_resumes"),
        args: ["tok-1", now],
      });
    });

    it("returns 0 when nothing matched (already deleted or expired)", async () => {
      mocks.execute.mockResolvedValueOnce({ rows: [], rowsAffected: 0 });

      await expect(incrementViewCount("missing")).resolves.toBe(0);
    });
  });

  describe("listSharesForUser", () => {
    it("returns rows for the user, summary shape only (no html payload)", async () => {
      mocks.execute.mockResolvedValueOnce({
        rows: [
          {
            id: "tok-1",
            document_title: "Resume",
            created_at: 1_000,
            expires_at: 2_000,
            view_count: 4,
          },
        ],
      });

      const result = await listSharesForUser("user-1");
      expect(mocks.execute).toHaveBeenCalledWith({
        sql: expect.stringContaining("WHERE user_id = ?"),
        args: ["user-1"],
      });
      expect(result).toEqual([
        {
          id: "tok-1",
          documentTitle: "Resume",
          createdAt: 1_000,
          expiresAt: 2_000,
          viewCount: 4,
        },
      ]);
      expect(
        (result[0] as unknown as Record<string, unknown>).documentHtml,
      ).toBeUndefined();
    });
  });

  describe("deleteShare", () => {
    it("returns true when a row was removed", async () => {
      mocks.execute.mockResolvedValueOnce({ rows: [], rowsAffected: 1 });

      await expect(deleteShare("tok-1", "user-1")).resolves.toBe(true);
      expect(mocks.execute).toHaveBeenCalledWith({
        sql: expect.stringContaining("DELETE FROM shared_resumes"),
        args: ["tok-1", "user-1"],
      });
    });

    it("returns false when nothing matched (not owner / not found)", async () => {
      mocks.execute.mockResolvedValueOnce({ rows: [], rowsAffected: 0 });

      await expect(deleteShare("tok-1", "user-1")).resolves.toBe(false);
    });
  });
});
