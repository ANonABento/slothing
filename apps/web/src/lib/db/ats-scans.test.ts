import { describe, expect, it, vi, beforeEach } from "vitest";

const dbMocks = vi.hoisted(() => ({
  execute: vi.fn(),
}));

vi.mock("./client", () => ({
  getClient: () => dbMocks,
}));

vi.mock("@/lib/utils", () => ({
  generateId: () => "test-scan-id",
}));

import { saveScanResult } from "./ats-scans";

const report = {
  score: {
    overall: 80,
    formatting: 90,
    structure: 85,
    content: 75,
    keywords: 70,
  },
  letterGrade: "B",
  issues: [],
  keywords: [],
  scannedAt: "2026-04-26T00:00:00.000Z",
} as any;

function result(rows: unknown[] = [], rowsAffected = 0) {
  return { rows, rowsAffected };
}

describe("ATS Scan Database Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbMocks.execute.mockResolvedValue(result([], 1));
  });

  it("should save scans without a job link", async () => {
    const id = await saveScanResult("user-1", report, []);

    expect(id).toBe("test-scan-id");
    expect(dbMocks.execute).toHaveBeenCalledWith({
      sql: expect.not.stringContaining("WHERE EXISTS"),
      args: [
        "test-scan-id",
        "user-1",
        null,
        80,
        "B",
        90,
        85,
        75,
        70,
        0,
        0,
        expect.any(String),
        "2026-04-26T00:00:00.000Z",
      ],
    });
  });

  it("should reject scans linked to jobs outside the user", async () => {
    dbMocks.execute.mockResolvedValueOnce(result([], 0));

    await expect(saveScanResult("user-1", report, [], "job-1")).rejects.toThrow(
      "Job not found",
    );
    expect(dbMocks.execute).toHaveBeenCalledWith({
      sql: expect.stringContaining("WHERE EXISTS"),
      args: [
        "test-scan-id",
        "user-1",
        "job-1",
        80,
        "B",
        90,
        85,
        75,
        70,
        0,
        0,
        expect.any(String),
        "2026-04-26T00:00:00.000Z",
        "job-1",
        "user-1",
      ],
    });
  });
});
