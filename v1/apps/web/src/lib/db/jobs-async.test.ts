import { beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";

const mocks = vi.hoisted(() => ({
  execute: vi.fn(),
}));

vi.mock("./client", () => ({
  getClient: () => ({ execute: mocks.execute }),
}));

vi.mock("@/lib/utils", () => ({
  generateId: () => "test-id-123",
}));

import {
  countJobsGroupedByStatus,
  createJob,
  getJob,
  listJobsPaginated,
  makeJobCursor,
  updateJob,
} from "./jobs-async";

const TEST_USER_ID = "test-user";

describe("async job database functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("queries paginated jobs through the async libSQL client", async () => {
    mocks.execute.mockResolvedValueOnce({ rows: [] });

    await listJobsPaginated({
      userId: TEST_USER_ID,
      statuses: ["pending"],
      query: "React",
      remote: true,
      keyword: "TypeScript",
      sortBy: "deadline",
      limit: 25,
    });

    const query = mocks.execute.mock.calls[0][0];
    expect(query.sql).toContain("status IN (?)");
    expect(query.sql).toContain("title LIKE ? ESCAPE");
    expect(query.sql).toContain("remote = ?");
    expect(query.sql).toContain("keywords_json LIKE ? ESCAPE");
    expect(query.sql).toContain(
      "ORDER BY (deadline IS NULL OR deadline = '') ASC",
    );
    expect(query.args).toEqual([
      TEST_USER_ID,
      "pending",
      "%React%",
      "%React%",
      "%React%",
      "%React%",
      "%React%",
      "%React%",
      "%React%",
      "%React%",
      1,
      "%TypeScript%",
      26,
    ]);
  });

  it("uses the sort-specific cursor when sorting by company", async () => {
    mocks.execute.mockResolvedValueOnce({ rows: [] });

    await listJobsPaginated({
      userId: TEST_USER_ID,
      cursor: {
        lastId: "job-2",
        lastCreatedAt: "2026-05-01T10:00:00.000Z",
        lastSortValue: "Acme\u0000Frontend Engineer",
        sortBy: "company",
      },
      sortBy: "company",
      limit: 10,
    });

    const query = mocks.execute.mock.calls[0][0];
    expect(query.sql).toContain("company COLLATE NOCASE > ?");
    expect(query.sql).toContain("ORDER BY company COLLATE NOCASE ASC");
    expect(query.args).toEqual([
      TEST_USER_ID,
      "Acme",
      "Acme",
      "Frontend Engineer",
      "Acme",
      "Frontend Engineer",
      "2026-05-01T10:00:00.000Z",
      "2026-05-01T10:00:00.000Z",
      "job-2",
      11,
    ]);
  });

  it("returns counts keyed by normalized status", async () => {
    mocks.execute.mockResolvedValueOnce({
      rows: [
        { status: "pending", count: 2 },
        { status: "saved", count: 3 },
      ],
    });

    await expect(
      countJobsGroupedByStatus({ userId: TEST_USER_ID, query: "Acme" }),
    ).resolves.toEqual({ pending: 2, saved: 3 });
    expect(mocks.execute.mock.calls[0][0].sql).toContain(
      "GROUP BY COALESCE(status, 'saved')",
    );
  });

  it("maps rows from the async client into job descriptions", async () => {
    mocks.execute.mockResolvedValueOnce({
      rows: [
        {
          id: "job-1",
          title: "Software Engineer",
          company: "Tech Corp",
          location: "Toronto",
          type: "full-time",
          remote: 1,
          salary: "$100k",
          description: "Great job",
          requirements_json: '["JavaScript", "React"]',
          responsibilities_json: '["Build features"]',
          keywords_json: '["frontend"]',
          url: "https://example.com/job",
          status: "saved",
          created_at: "2024-01-15T00:00:00.000Z",
        },
      ],
    });

    await expect(getJob("job-1", TEST_USER_ID)).resolves.toMatchObject({
      id: "job-1",
      remote: true,
      requirements: ["JavaScript", "React"],
      responsibilities: ["Build features"],
      keywords: ["frontend"],
    });
  });

  it("creates a job then reloads it through the async client", async () => {
    mocks.execute
      .mockResolvedValueOnce({ rows: [], rowsAffected: 1 })
      .mockResolvedValueOnce({
        rows: [
          {
            id: "test-id-123",
            title: "New Job",
            company: "New Company",
            description: "Description",
            requirements_json: "[]",
            responsibilities_json: "[]",
            keywords_json: "[]",
            remote: 0,
            status: "saved",
          },
        ],
      });

    const result = await createJob(
      {
        title: "New Job",
        company: "New Company",
        description: "Description",
        requirements: [],
        responsibilities: [],
        keywords: [],
      },
      TEST_USER_ID,
    );

    expect(mocks.execute.mock.calls[0][0].sql).toContain("INSERT INTO jobs");
    expect(mocks.execute.mock.calls[0][0].args).toContain("test-id-123");
    expect(result.id).toBe("test-id-123");
  });

  it("does not update when the job does not exist", async () => {
    mocks.execute.mockResolvedValueOnce({ rows: [] });

    await updateJob("missing", { title: "New Title" }, TEST_USER_ID);

    expect(mocks.execute).toHaveBeenCalledTimes(1);
  });

  it("captures sort values for stable keyset pagination", () => {
    expect(
      makeJobCursor(
        {
          id: "job-1",
          title: "Frontend Engineer",
          company: "Acme",
          description: "Desc",
          requirements: [],
          responsibilities: [],
          keywords: [],
          createdAt: "2026-05-01T10:00:00.000Z",
        },
        "company",
      ),
    ).toEqual({
      lastId: "job-1",
      lastCreatedAt: "2026-05-01T10:00:00.000Z",
      lastSortValue: "Acme\u0000Frontend Engineer",
      sortBy: "company",
    });
  });

  it("does not depend on the legacy or barrel DB modules", () => {
    const testPath = fileURLToPath(import.meta.url);
    const implementation = testPath.replace(".test", "");
    const implementationSource = readFileSync(implementation, "utf8");

    expect(implementationSource).not.toContain("./legacy");
    expect(implementationSource).not.toContain("./index");
    expect(implementationSource).toContain("./client");
  });
});
