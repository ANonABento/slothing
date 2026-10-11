import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  execute: vi.fn(),
}));

vi.mock("./client", () => ({
  getClient: () => ({
    execute: mocks.execute,
  }),
}));

vi.mock("@/lib/utils", () => ({
  generateId: () => "test-draft-id",
}));

import { createEmailDraft } from "./email-drafts";

describe("Email Draft Database Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create drafts without a job link", async () => {
    mocks.execute.mockResolvedValueOnce({ rows: [], rowsAffected: 1 });

    const draft = await createEmailDraft(
      {
        type: "follow_up",
        subject: "Hello",
        body: "Checking in",
      },
      "user-1",
    );

    expect(draft.id).toBe("test-draft-id");
    expect(mocks.execute).toHaveBeenCalledWith({
      sql: expect.not.stringContaining("WHERE EXISTS"),
      args: [
        "test-draft-id",
        "user-1",
        "follow_up",
        null,
        "Hello",
        "Checking in",
        null,
        expect.any(String),
        expect.any(String),
      ],
    });
  });

  it("should reject drafts linked to jobs outside the user", async () => {
    mocks.execute.mockResolvedValueOnce({ rows: [], rowsAffected: 0 });

    await expect(
      createEmailDraft(
        {
          type: "follow_up",
          jobId: "job-1",
          subject: "Hello",
          body: "Checking in",
        },
        "user-1",
      ),
    ).rejects.toThrow("Job not found");

    expect(mocks.execute).toHaveBeenCalledWith({
      sql: expect.stringContaining("WHERE EXISTS"),
      args: [
        "test-draft-id",
        "user-1",
        "follow_up",
        "job-1",
        "Hello",
        "Checking in",
        null,
        expect.any(String),
        expect.any(String),
        "job-1",
        "user-1",
      ],
    });
  });
});
