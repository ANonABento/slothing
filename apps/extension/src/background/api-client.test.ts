import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getStorage: vi.fn(),
  setStorage: vi.fn(),
}));

vi.mock("./storage", () => ({
  getStorage: mocks.getStorage,
  setStorage: mocks.setStorage,
}));

import { ColumbusAPIClient } from "./api-client";
import type { ScrapedJob } from "@/shared/types";

const job: ScrapedJob = {
  title: "Frontend Engineer",
  company: "Acme",
  description:
    "Build polished TypeScript application experiences for customers.",
  requirements: ["TypeScript"],
  url: "https://example.com/job",
  source: "greenhouse",
};

describe("ColumbusAPIClient one-click generation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getStorage.mockResolvedValue({
      authToken: "token-1",
      apiBaseUrl: "http://localhost:3000",
      settings: {},
    });
    vi.stubGlobal("fetch", vi.fn());
  });

  it("imports the job before tailoring a resume", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ opportunityIds: ["opp-1"], imported: 1 }),
          { status: 200 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ savedResume: { id: "resume-1" }, jobId: "opp-1" }),
          { status: 200 },
        ),
      );

    const client = new ColumbusAPIClient("http://localhost:3000");
    const result = await client.tailorFromJob(job);

    expect(result.savedResume.id).toBe("resume-1");
    expect(fetch).toHaveBeenNthCalledWith(
      2,
      "http://localhost:3000/api/tailor",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          action: "generate",
          jobDescription: job.description,
          jobTitle: job.title,
          company: job.company,
          opportunityId: "opp-1",
        }),
      }),
    );
  });

  it("imports the job before generating a cover letter", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ opportunityIds: ["opp-1"], imported: 1 }),
          { status: 200 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ savedCoverLetter: { id: "cl-1" } }), {
          status: 200,
        }),
      );

    const client = new ColumbusAPIClient("http://localhost:3000");
    const result = await client.generateCoverLetterFromJob(job);

    expect(result.savedCoverLetter.id).toBe("cl-1");
    expect(fetch).toHaveBeenNthCalledWith(
      2,
      "http://localhost:3000/api/cover-letter/generate",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          action: "generate",
          jobDescription: job.description,
          jobTitle: job.title,
          company: job.company,
          opportunityId: "opp-1",
        }),
      }),
    );
  });

  it("does not call the API when the scraped description is too short", async () => {
    const client = new ColumbusAPIClient("http://localhost:3000");

    await expect(
      client.tailorFromJob({ ...job, description: "Too short" }),
    ).rejects.toThrow("Couldn't read the full job description");
    expect(fetch).not.toHaveBeenCalled();
  });
});
