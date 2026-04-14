import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the drizzle index module
const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
const mockFrom = vi.fn();
const mockWhere = vi.fn();
const mockOrderBy = vi.fn();
const mockSet = vi.fn();
const mockValues = vi.fn();

vi.mock("../index", () => {
  const mockDb = {
    select: () => ({ from: mockFrom }),
    insert: () => ({ values: mockValues }),
    update: () => ({ set: mockSet }),
    delete: () => ({ where: mockDelete }),
  };

  return {
    db: mockDb,
    jobs: { id: "id", userId: "user_id", status: "status", createdAt: "created_at" },
    eq: vi.fn((a, b) => ({ type: "eq", field: a, value: b })),
    and: vi.fn((...args: unknown[]) => ({ type: "and", conditions: args })),
    desc: vi.fn((field) => ({ type: "desc", field })),
  };
});

vi.mock("@/lib/utils", () => ({
  generateId: () => "test-id-123",
}));

import {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getJobsByStatus,
  countJobsByStatus,
} from "./jobs";

describe("Drizzle Job Query Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default chain: from → where → orderBy resolves
    mockFrom.mockReturnValue({ where: mockWhere });
    mockWhere.mockReturnValue({ orderBy: mockOrderBy });
    mockOrderBy.mockResolvedValue([]);

    // For insert: values resolves
    mockValues.mockResolvedValue(undefined);

    // For update: set → where resolves
    mockSet.mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) });

    // For delete: where resolves
    mockDelete.mockResolvedValue(undefined);
  });

  describe("getJobs", () => {
    it("should return all jobs for a user", async () => {
      const mockRow = {
        id: "job-1",
        title: "Software Engineer",
        company: "Tech Corp",
        location: "NYC",
        type: "full-time",
        remote: true,
        salary: "$100k",
        description: "Great job",
        requirementsJson: '["JavaScript", "React"]',
        responsibilitiesJson: '["Build features"]',
        keywordsJson: '["frontend"]',
        url: "https://example.com/job",
        status: "saved",
        appliedAt: null,
        deadline: null,
        notes: null,
        createdAt: new Date("2024-01-15T00:00:00.000Z"),
        userId: "user-1",
      };

      mockOrderBy.mockResolvedValue([mockRow]);

      const result = await getJobs("user-1");

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: "job-1",
        title: "Software Engineer",
        company: "Tech Corp",
        location: "NYC",
        type: "full-time",
        remote: true,
        salary: "$100k",
        description: "Great job",
        requirements: ["JavaScript", "React"],
        responsibilities: ["Build features"],
        keywords: ["frontend"],
        url: "https://example.com/job",
        status: "saved",
      });
    });

    it("should return empty array when no jobs exist", async () => {
      mockOrderBy.mockResolvedValue([]);

      const result = await getJobs("user-1");

      expect(result).toEqual([]);
    });

    it("should handle null JSON fields", async () => {
      const mockRow = {
        id: "job-1",
        title: "Job",
        company: "Company",
        location: null,
        type: null,
        remote: false,
        salary: null,
        description: "Desc",
        requirementsJson: null,
        responsibilitiesJson: null,
        keywordsJson: null,
        url: null,
        status: "saved",
        appliedAt: null,
        deadline: null,
        notes: null,
        createdAt: new Date(),
        userId: "user-1",
      };

      mockOrderBy.mockResolvedValue([mockRow]);

      const result = await getJobs("user-1");

      expect(result[0].requirements).toEqual([]);
      expect(result[0].responsibilities).toEqual([]);
      expect(result[0].keywords).toEqual([]);
      expect(result[0].remote).toBe(false);
    });
  });

  describe("getJob", () => {
    it("should return job by id for a user", async () => {
      const mockRow = {
        id: "job-1",
        title: "Software Engineer",
        company: "Tech Corp",
        location: null,
        type: null,
        remote: false,
        salary: null,
        description: "Great job",
        requirementsJson: '["JavaScript"]',
        responsibilitiesJson: "[]",
        keywordsJson: "[]",
        url: null,
        status: "applied",
        appliedAt: null,
        deadline: null,
        notes: null,
        createdAt: new Date(),
        userId: "user-1",
      };

      mockWhere.mockResolvedValue([mockRow]);

      const result = await getJob("user-1", "job-1");

      expect(result?.id).toBe("job-1");
      expect(result?.title).toBe("Software Engineer");
      expect(result?.status).toBe("applied");
    });

    it("should return null for non-existent job", async () => {
      mockWhere.mockResolvedValue([]);

      const result = await getJob("user-1", "non-existent");

      expect(result).toBeNull();
    });
  });

  describe("createJob", () => {
    it("should create a new job and return it", async () => {
      const createdRow = {
        id: "test-id-123",
        title: "New Job",
        company: "New Company",
        location: null,
        type: null,
        remote: false,
        salary: null,
        description: "Description",
        requirementsJson: "[]",
        responsibilitiesJson: "[]",
        keywordsJson: "[]",
        url: null,
        status: "saved",
        appliedAt: null,
        deadline: null,
        notes: null,
        createdAt: new Date(),
        userId: "user-1",
      };

      // After insert, getJob is called which uses select → from → where
      mockWhere.mockResolvedValue([createdRow]);

      const result = await createJob("user-1", {
        title: "New Job",
        company: "New Company",
        description: "Description",
        requirements: [],
        responsibilities: [],
        keywords: [],
      });

      expect(result.id).toBe("test-id-123");
      expect(result.title).toBe("New Job");
    });
  });

  describe("updateJob", () => {
    it("should update existing job and return it", async () => {
      const existingRow = {
        id: "job-1",
        title: "Old Title",
        company: "Company",
        location: null,
        type: null,
        remote: false,
        salary: null,
        description: "Desc",
        requirementsJson: "[]",
        responsibilitiesJson: "[]",
        keywordsJson: "[]",
        url: null,
        status: "saved",
        appliedAt: null,
        deadline: null,
        notes: null,
        createdAt: new Date(),
        userId: "user-1",
      };

      const updatedRow = { ...existingRow, title: "New Title" };

      // First call: getJob to check existence (select → from → where)
      // Then update (set → where)
      // Then getJob again after update (select → from → where)
      let fromCallCount = 0;
      mockFrom.mockImplementation(() => {
        fromCallCount++;
        if (fromCallCount === 1) {
          // First getJob call - returns existing
          return { where: vi.fn().mockResolvedValue([existingRow]) };
        }
        // Second getJob call - returns updated
        return { where: vi.fn().mockResolvedValue([updatedRow]) };
      });

      const result = await updateJob("user-1", "job-1", { title: "New Title" });

      expect(result?.title).toBe("New Title");
    });

    it("should return null for non-existent job", async () => {
      mockWhere.mockResolvedValue([]);

      const result = await updateJob("user-1", "non-existent", { title: "New Title" });

      expect(result).toBeNull();
    });
  });

  describe("deleteJob", () => {
    it("should delete job by id for a user", async () => {
      await deleteJob("user-1", "job-1");

      expect(mockDelete).toHaveBeenCalled();
    });
  });

  describe("getJobsByStatus", () => {
    it("should return jobs filtered by status", async () => {
      const mockRow = {
        id: "job-1",
        title: "Applied Job",
        company: "Company",
        location: null,
        type: null,
        remote: false,
        salary: null,
        description: "Desc",
        requirementsJson: "[]",
        responsibilitiesJson: "[]",
        keywordsJson: "[]",
        url: null,
        status: "applied",
        appliedAt: "2024-01-15",
        deadline: null,
        notes: null,
        createdAt: new Date(),
        userId: "user-1",
      };

      mockOrderBy.mockResolvedValue([mockRow]);

      const result = await getJobsByStatus("user-1", "applied");

      expect(result).toHaveLength(1);
      expect(result[0].status).toBe("applied");
    });
  });

  describe("countJobsByStatus", () => {
    it("should count jobs grouped by status", async () => {
      const mockRows = [
        { status: "saved", id: "1", title: "", company: "", description: "", remote: false, createdAt: new Date(), userId: "user-1", requirementsJson: null, responsibilitiesJson: null, keywordsJson: null, location: null, type: null, salary: null, url: null, appliedAt: null, deadline: null, notes: null },
        { status: "saved", id: "2", title: "", company: "", description: "", remote: false, createdAt: new Date(), userId: "user-1", requirementsJson: null, responsibilitiesJson: null, keywordsJson: null, location: null, type: null, salary: null, url: null, appliedAt: null, deadline: null, notes: null },
        { status: "applied", id: "3", title: "", company: "", description: "", remote: false, createdAt: new Date(), userId: "user-1", requirementsJson: null, responsibilitiesJson: null, keywordsJson: null, location: null, type: null, salary: null, url: null, appliedAt: null, deadline: null, notes: null },
      ];

      // countJobsByStatus uses select → from → where (no orderBy)
      mockWhere.mockResolvedValue(mockRows);

      const result = await countJobsByStatus("user-1");

      expect(result.saved).toBe(2);
      expect(result.applied).toBe(1);
      expect(result.interviewing).toBe(0);
    });

    it("should return all zeros when no jobs exist", async () => {
      mockWhere.mockResolvedValue([]);

      const result = await countJobsByStatus("user-1");

      expect(result.saved).toBe(0);
      expect(result.applied).toBe(0);
      expect(result.interviewing).toBe(0);
      expect(result.offered).toBe(0);
      expect(result.rejected).toBe(0);
    });
  });
});
