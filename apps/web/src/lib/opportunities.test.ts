import { beforeEach, describe, expect, it, vi } from "vitest";
import type { JobDescription } from "@/types";

const mocks = vi.hoisted(() => ({
  getJob: vi.fn(),
  getJobs: vi.fn(),
  listJobsPaginated: vi.fn(),
  updateJob: vi.fn(),
}));

vi.mock("@/lib/db/jobs", () => ({
  getJob: mocks.getJob,
  getJobs: mocks.getJobs,
  listJobsPaginated: mocks.listJobsPaginated,
  updateJob: mocks.updateJob,
}));

import {
  getOpportunity,
  jobToOpportunity,
  linkOpportunityDocument,
  listOpportunities,
} from "./opportunities";

function job(overrides: Partial<JobDescription> = {}): JobDescription {
  return {
    id: "job-1",
    title: "Frontend Engineer",
    company: "Acme",
    description: "Build polished product interfaces.",
    requirements: [],
    responsibilities: [],
    keywords: ["React", "TypeScript"],
    status: "saved",
    createdAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("opportunities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("maps existing jobs to opportunity records", () => {
    expect(
      jobToOpportunity(
        job({
          description: "  Build polished product interfaces.  ",
          url: "https://example.com/job",
          linkedResumeId: "resume-1",
          linkedCoverLetterId: "cover-1",
        }),
      ),
    ).toEqual({
      id: "job-1",
      type: "job",
      title: "Frontend Engineer",
      company: "Acme",
      source: "manual",
      sourceUrl: "https://example.com/job",
      city: undefined,
      province: undefined,
      country: undefined,
      remoteType: undefined,
      jobType: undefined,
      summary: "Build polished product interfaces.",
      responsibilities: [],
      requiredSkills: [],
      salaryMin: undefined,
      salaryMax: undefined,
      status: "saved",
      appliedAt: undefined,
      deadline: undefined,
      tags: ["React", "TypeScript"],
      notes: undefined,
      linkedResumeId: "resume-1",
      linkedCoverLetterId: "cover-1",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    });
  });

  it("preserves legacy job metadata in opportunity fields", () => {
    expect(
      jobToOpportunity(
        job({
          location: "Toronto, ON, Canada",
          remote: true,
          salary: "100,000 - 120,000",
          type: "full-time",
          requirements: ["React"],
          responsibilities: ["Build interfaces"],
          appliedAt: "2026-02-01",
        }),
      ),
    ).toMatchObject({
      city: "Toronto",
      province: "ON",
      country: "Canada",
      remoteType: "remote",
      jobType: "full-time",
      salaryMin: 100000,
      salaryMax: 120000,
      requiredSkills: ["React"],
      responsibilities: ["Build interfaces"],
      appliedAt: "2026-02-01",
    });
  });

  it("normalizes legacy job statuses to opportunity statuses", () => {
    expect(jobToOpportunity(job({ status: "offered" })).status).toBe("offer");
    expect(jobToOpportunity(job({ status: "withdrawn" })).status).toBe(
      "dismissed",
    );
  });

  it("lists only requested opportunity statuses", () => {
    mocks.listJobsPaginated.mockReturnValue([
      job({ id: "saved", status: "saved" }),
      job({ id: "applied", status: "applied" }),
      job({ id: "offered", status: "offered" }),
    ]);

    expect(
      listOpportunities({
        userId: "user-1",
        statuses: ["saved", "applied", "offered"],
        limit: 50,
      }).items.map((item) => item.id),
    ).toEqual(["saved", "applied", "offered"]);
    expect(mocks.listJobsPaginated).toHaveBeenCalledWith({
      userId: "user-1",
      statuses: ["saved", "applied", "offered"],
      cursor: undefined,
      limit: 50,
    });
  });

  it("does not treat unknown status filters as unfiltered requests", () => {
    mocks.listJobsPaginated.mockReturnValue([]);

    expect(
      listOpportunities({ userId: "user-1", statuses: ["unknown"], limit: 50 }),
    ).toEqual({ items: [], nextCursor: null, hasMore: false });
  });

  it("loads a single opportunity by id", () => {
    mocks.getJob.mockReturnValue(job({ id: "job-2" }));

    expect(getOpportunity("job-2", "user-1")?.id).toBe("job-2");
    expect(mocks.getJob).toHaveBeenCalledWith("job-2", "user-1");
  });

  it("links generated document ids without clearing existing links", () => {
    mocks.getJob
      .mockReturnValueOnce(job({ linkedCoverLetterId: "cover-1" }))
      .mockReturnValueOnce(
        job({ linkedResumeId: "resume-1", linkedCoverLetterId: "cover-1" }),
      );

    const opportunity = linkOpportunityDocument(
      "job-1",
      { resumeId: "resume-1" },
      "user-1",
    );

    expect(mocks.updateJob).toHaveBeenCalledWith(
      "job-1",
      {
        linkedResumeId: "resume-1",
        linkedCoverLetterId: "cover-1",
      },
      "user-1",
    );
    expect(opportunity?.linkedResumeId).toBe("resume-1");
  });

  it("ignores blank document ids when linking", () => {
    mocks.getJob
      .mockReturnValueOnce(
        job({ linkedResumeId: "resume-1", linkedCoverLetterId: "cover-1" }),
      )
      .mockReturnValueOnce(
        job({ linkedResumeId: "resume-1", linkedCoverLetterId: "cover-1" }),
      );

    linkOpportunityDocument(
      "job-1",
      { resumeId: "  ", coverLetterId: "cover-2" },
      "user-1",
    );

    expect(mocks.updateJob).toHaveBeenCalledWith(
      "job-1",
      {
        linkedResumeId: "resume-1",
        linkedCoverLetterId: "cover-2",
      },
      "user-1",
    );
  });
});
