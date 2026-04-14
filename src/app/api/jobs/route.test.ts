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
  getJobs: vi.fn(),
  createJob: vi.fn(),
}));

// Mock db (for getLLMConfig)
vi.mock("@/lib/db", () => ({
  getLLMConfig: vi.fn(),
}));

// Mock LLM client
vi.mock("@/lib/llm/client", () => ({
  LLMClient: vi.fn(),
  parseJSONFromLLM: vi.fn(),
}));

import { requireAuth } from "@/lib/auth";
import { getJobs, createJob } from "@/lib/db/drizzle/queries/jobs";
import { GET, POST } from "./route";

describe("GET /api/jobs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    const mockResponse = { status: 401, error: "Unauthorized" };
    vi.mocked(requireAuth).mockResolvedValue(mockResponse as any);

    const response = await GET();
    expect(response).toBe(mockResponse);
  });

  it("should return jobs for authenticated user", async () => {
    vi.mocked(requireAuth).mockResolvedValue({ userId: "user-1" });
    const mockJobs = [
      { id: "job-1", title: "Engineer", company: "Corp" },
      { id: "job-2", title: "Designer", company: "Studio" },
    ];
    vi.mocked(getJobs).mockResolvedValue(mockJobs as any);

    const response = await GET();
    const data = await response.json();

    expect(getJobs).toHaveBeenCalledWith("user-1");
    expect(data.jobs).toEqual(mockJobs);
  });

  it("should return 500 on database error", async () => {
    vi.mocked(requireAuth).mockResolvedValue({ userId: "user-1" });
    vi.mocked(getJobs).mockRejectedValue(new Error("DB error"));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to get jobs");
  });
});

describe("POST /api/jobs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    const mockResponse = { status: 401, error: "Unauthorized" };
    vi.mocked(requireAuth).mockResolvedValue(mockResponse as any);

    const request = new NextRequest("http://localhost/api/jobs", {
      method: "POST",
      body: JSON.stringify({}),
    });
    const response = await POST(request);
    expect(response).toBe(mockResponse);
  });

  it("should return 400 for invalid input", async () => {
    vi.mocked(requireAuth).mockResolvedValue({ userId: "user-1" });

    const request = new NextRequest("http://localhost/api/jobs", {
      method: "POST",
      body: JSON.stringify({ title: "" }),
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Validation failed");
  });

  it("should create a job with valid input", async () => {
    vi.mocked(requireAuth).mockResolvedValue({ userId: "user-1" });
    const mockJob = {
      id: "job-new",
      title: "Engineer",
      company: "Corp",
      description: "A great engineering role with lots of potential",
    };
    vi.mocked(createJob).mockResolvedValue(mockJob as any);

    const request = new NextRequest("http://localhost/api/jobs", {
      method: "POST",
      body: JSON.stringify({
        title: "Engineer",
        company: "Corp",
        description: "A great engineering role with lots of potential",
      }),
    });
    const response = await POST(request);
    const data = await response.json();

    expect(createJob).toHaveBeenCalledWith("user-1", expect.objectContaining({
      title: "Engineer",
      company: "Corp",
      description: "A great engineering role with lots of potential",
    }));
    expect(data.job).toEqual(mockJob);
  });

  it("should return 500 on database error", async () => {
    vi.mocked(requireAuth).mockResolvedValue({ userId: "user-1" });
    vi.mocked(createJob).mockRejectedValue(new Error("DB error"));

    const request = new NextRequest("http://localhost/api/jobs", {
      method: "POST",
      body: JSON.stringify({
        title: "Engineer",
        company: "Corp",
        description: "A great engineering role with lots of potential",
      }),
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to create job");
  });
});
