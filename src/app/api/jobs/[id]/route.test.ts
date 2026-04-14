import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock auth
vi.mock("@/lib/auth", () => ({
  requireAuth: vi.fn(),
  isAuthError: vi.fn((result: unknown) => {
    return result && typeof result === "object" && "status" in result;
  }),
}));

// Mock drizzle jobs queries
vi.mock("@/lib/db/drizzle/queries/jobs", () => ({
  getJob: vi.fn(),
  updateJob: vi.fn(),
  deleteJob: vi.fn(),
}));

// Mock analytics
vi.mock("@/lib/db/analytics", () => ({
  recordJobStatusChange: vi.fn(),
}));

import { requireAuth } from "@/lib/auth";
import { getJob, updateJob, deleteJob } from "@/lib/db/drizzle/queries/jobs";
import { recordJobStatusChange } from "@/lib/db/analytics";
import { GET, PUT, PATCH, DELETE } from "./route";

const makeParams = (id: string) => ({ params: { id } });

describe("GET /api/jobs/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    const mockResponse = { status: 401, error: "Unauthorized" };
    vi.mocked(requireAuth).mockResolvedValue(mockResponse as any);

    const request = new NextRequest("http://localhost/api/jobs/job-1");
    const response = await GET(request, makeParams("job-1"));
    expect(response).toBe(mockResponse);
  });

  it("should return 404 when job not found", async () => {
    vi.mocked(requireAuth).mockResolvedValue({ userId: "user-1" });
    vi.mocked(getJob).mockResolvedValue(null);

    const request = new NextRequest("http://localhost/api/jobs/nonexistent");
    const response = await GET(request, makeParams("nonexistent"));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Job not found");
  });

  it("should return job for authenticated user", async () => {
    vi.mocked(requireAuth).mockResolvedValue({ userId: "user-1" });
    const mockJob = { id: "job-1", title: "Engineer", company: "Corp" };
    vi.mocked(getJob).mockResolvedValue(mockJob as any);

    const request = new NextRequest("http://localhost/api/jobs/job-1");
    const response = await GET(request, makeParams("job-1"));
    const data = await response.json();

    expect(getJob).toHaveBeenCalledWith("user-1", "job-1");
    expect(data.job).toEqual(mockJob);
  });

  it("should return 500 on database error", async () => {
    vi.mocked(requireAuth).mockResolvedValue({ userId: "user-1" });
    vi.mocked(getJob).mockRejectedValue(new Error("DB error"));

    const request = new NextRequest("http://localhost/api/jobs/job-1");
    const response = await GET(request, makeParams("job-1"));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to get job");
  });
});

describe("PUT /api/jobs/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 404 when job not found", async () => {
    vi.mocked(requireAuth).mockResolvedValue({ userId: "user-1" });
    vi.mocked(getJob).mockResolvedValue(null);

    const request = new NextRequest("http://localhost/api/jobs/nonexistent", {
      method: "PUT",
      body: JSON.stringify({ title: "Updated" }),
    });
    const response = await PUT(request, makeParams("nonexistent"));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Job not found");
  });

  it("should return 400 for invalid input", async () => {
    vi.mocked(requireAuth).mockResolvedValue({ userId: "user-1" });
    vi.mocked(getJob).mockResolvedValue({ id: "job-1", status: "saved" } as any);

    const request = new NextRequest("http://localhost/api/jobs/job-1", {
      method: "PUT",
      body: JSON.stringify({ status: "invalid-status" }),
    });
    const response = await PUT(request, makeParams("job-1"));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Validation failed");
  });

  it("should update job and record status change", async () => {
    vi.mocked(requireAuth).mockResolvedValue({ userId: "user-1" });
    vi.mocked(getJob).mockResolvedValue({ id: "job-1", status: "saved" } as any);
    const updatedJob = { id: "job-1", status: "applied", title: "Engineer" };
    vi.mocked(updateJob).mockResolvedValue(updatedJob as any);

    const request = new NextRequest("http://localhost/api/jobs/job-1", {
      method: "PUT",
      body: JSON.stringify({ status: "applied" }),
    });
    const response = await PUT(request, makeParams("job-1"));
    const data = await response.json();

    expect(updateJob).toHaveBeenCalledWith("user-1", "job-1", { status: "applied" });
    expect(recordJobStatusChange).toHaveBeenCalledWith("job-1", "saved", "applied");
    expect(data.job).toEqual(updatedJob);
  });
});

describe("PATCH /api/jobs/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 404 when job not found", async () => {
    vi.mocked(requireAuth).mockResolvedValue({ userId: "user-1" });
    vi.mocked(getJob).mockResolvedValue(null);

    const request = new NextRequest("http://localhost/api/jobs/nonexistent", {
      method: "PATCH",
      body: JSON.stringify({ status: "applied" }),
    });
    const response = await PATCH(request, makeParams("nonexistent"));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Job not found");
  });

  it("should update job status via patch", async () => {
    vi.mocked(requireAuth).mockResolvedValue({ userId: "user-1" });
    vi.mocked(getJob).mockResolvedValue({ id: "job-1", status: "saved" } as any);
    const updatedJob = { id: "job-1", status: "interviewing" };
    vi.mocked(updateJob).mockResolvedValue(updatedJob as any);

    const request = new NextRequest("http://localhost/api/jobs/job-1", {
      method: "PATCH",
      body: JSON.stringify({ status: "interviewing" }),
    });
    const response = await PATCH(request, makeParams("job-1"));
    const data = await response.json();

    expect(updateJob).toHaveBeenCalledWith("user-1", "job-1", { status: "interviewing" });
    expect(recordJobStatusChange).toHaveBeenCalledWith("job-1", "saved", "interviewing");
    expect(data.job).toEqual(updatedJob);
  });
});

describe("DELETE /api/jobs/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    const mockResponse = { status: 401, error: "Unauthorized" };
    vi.mocked(requireAuth).mockResolvedValue(mockResponse as any);

    const request = new NextRequest("http://localhost/api/jobs/job-1", {
      method: "DELETE",
    });
    const response = await DELETE(request, makeParams("job-1"));
    expect(response).toBe(mockResponse);
  });

  it("should delete job for authenticated user", async () => {
    vi.mocked(requireAuth).mockResolvedValue({ userId: "user-1" });
    vi.mocked(deleteJob).mockResolvedValue(undefined);

    const request = new NextRequest("http://localhost/api/jobs/job-1", {
      method: "DELETE",
    });
    const response = await DELETE(request, makeParams("job-1"));
    const data = await response.json();

    expect(deleteJob).toHaveBeenCalledWith("user-1", "job-1");
    expect(data.success).toBe(true);
  });

  it("should return 500 on database error", async () => {
    vi.mocked(requireAuth).mockResolvedValue({ userId: "user-1" });
    vi.mocked(deleteJob).mockRejectedValue(new Error("DB error"));

    const request = new NextRequest("http://localhost/api/jobs/job-1", {
      method: "DELETE",
    });
    const response = await DELETE(request, makeParams("job-1"));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to delete job");
  });
});
