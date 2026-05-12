import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { JobDescription, Profile } from "@/types";

const mocks = vi.hoisted(() => ({
  createEmailSend: vi.fn(),
  hasDailyDigestSentSince: vi.fn(),
  listJobsPaginated: vi.fn(),
  getProfile: vi.fn(),
  getEligibleDigestUsers: vi.fn(),
  isTransactionalEmailConfigured: vi.fn(),
}));

vi.mock("@/lib/db/email-sends", () => ({
  createEmailSend: mocks.createEmailSend,
  hasDailyDigestSentSince: mocks.hasDailyDigestSentSince,
}));

vi.mock("@/lib/db/jobs", () => ({
  listJobsPaginated: mocks.listJobsPaginated,
}));

vi.mock("@/lib/db/queries", () => ({
  getProfile: mocks.getProfile,
}));

vi.mock("./eligible-users", () => ({
  getEligibleDigestUsers: mocks.getEligibleDigestUsers,
}));

vi.mock("@/lib/email/transactional", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/lib/email/transactional")>();
  return {
    ...actual,
    isTransactionalEmailConfigured: mocks.isTransactionalEmailConfigured,
  };
});

vi.mock("./match", () => ({
  MIN_MATCH_SCORE: 30,
  selectTopMatches: (_profile: Profile, jobs: JobDescription[]) =>
    jobs.slice(0, 5).map((job, index) => ({
      job,
      score: 90 - index,
      reasons: [`reason-${index}`],
    })),
}));

import { runDailyDigest } from "./daily";

const profile: Profile = {
  id: "profile-1",
  contact: { name: "Ada" },
  experiences: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
};

function job(id: number): JobDescription {
  return {
    id: `job-${id}`,
    title: `Job ${id}`,
    company: "Acme",
    description: "Build",
    requirements: [],
    responsibilities: [],
    keywords: [],
    status: "saved",
    createdAt: "2026-05-10T07:00:00.000Z",
  };
}

describe("runDailyDigest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-10T08:00:00.000Z"));
    process.env.NEXTAUTH_SECRET = "secret";
    process.env.NEXTAUTH_URL = "https://example.com";
    mocks.getEligibleDigestUsers.mockReturnValue([
      {
        userId: "user-1",
        email: "ada@example.com",
        name: "Ada",
        digestEnabled: true,
      },
    ]);
    mocks.hasDailyDigestSentSince.mockReturnValue(false);
    mocks.getProfile.mockReturnValue(profile);
    mocks.listJobsPaginated.mockReturnValue([1, 2, 3, 4, 5, 6].map(job));
    mocks.isTransactionalEmailConfigured.mockReturnValue(true);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("sends the top five matches and records an email send", async () => {
    const sender = vi.fn().mockResolvedValue({ ok: true, status: 202 });

    const result = await runDailyDigest({
      now: new Date("2026-05-10T08:00:00.000Z"),
      sender,
    });

    expect(result).toMatchObject({ sent: 1, skipped: 0, errors: 0 });
    expect(sender).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "ada@example.com",
        subject: "5 new opportunities matching your profile",
      }),
    );
    expect(mocks.createEmailSend).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "daily_digest",
        status: "sent",
      }),
      "user-1",
    );
  });

  it("skips users already sent today", async () => {
    mocks.hasDailyDigestSentSince.mockReturnValue(true);

    const result = await runDailyDigest();

    expect(result).toMatchObject({ sent: 0, skipped: 1, errors: 0 });
    expect(result.outcomes[0]).toMatchObject({ reason: "already_sent" });
  });

  it("skips users who have disabled daily digests", async () => {
    mocks.getEligibleDigestUsers.mockReturnValue([
      {
        userId: "user-1",
        email: "ada@example.com",
        name: "Ada",
        digestEnabled: false,
      },
    ]);

    const result = await runDailyDigest();

    expect(result).toMatchObject({ sent: 0, skipped: 1, errors: 0 });
    expect(result.outcomes[0]).toMatchObject({ reason: "digest_disabled" });
  });

  it("skips when email is not configured without writing idempotency", async () => {
    mocks.isTransactionalEmailConfigured.mockReturnValue(false);

    const result = await runDailyDigest();

    expect(result).toMatchObject({ sent: 0, skipped: 1, errors: 0 });
    expect(result.outcomes[0]).toMatchObject({
      reason: "email_not_configured",
    });
    expect(mocks.createEmailSend).not.toHaveBeenCalled();
  });

  it("continues after a sender failure and records the failed attempt", async () => {
    const sender = vi
      .fn()
      .mockResolvedValue({ ok: false, status: 500, error: "down" });

    const result = await runDailyDigest({ sender });

    expect(result).toMatchObject({ sent: 0, skipped: 0, errors: 1 });
    expect(mocks.createEmailSend).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "daily_digest",
        status: "failed",
        errorMessage: "down",
      }),
      "user-1",
    );
  });
});
