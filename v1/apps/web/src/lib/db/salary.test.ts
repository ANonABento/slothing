import { beforeEach, describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  execute: vi.fn(),
}));

vi.mock("./client", () => ({
  getClient: () => dbMocks,
}));

vi.mock("@/lib/utils", () => ({
  generateId: () => "test-offer-id",
}));

import { createSalaryOffer } from "./salary";

function result(rows: unknown[] = [], rowsAffected = 0) {
  return { rows, rowsAffected };
}

describe("Salary Database Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbMocks.execute.mockResolvedValue(result([], 1));
  });

  it("should create offers without a job link", async () => {
    const offer = await createSalaryOffer(
      {
        company: "Acme",
        role: "Engineer",
        baseSalary: 120000,
      },
      "user-1",
    );

    expect(offer.id).toBe("test-offer-id");
    expect(dbMocks.execute).toHaveBeenCalledWith({
      sql: expect.not.stringContaining("WHERE EXISTS"),
      args: [
        "test-offer-id",
        "user-1",
        null,
        "Acme",
        "Engineer",
        120000,
        null,
        null,
        null,
        null,
        null,
        null,
        expect.any(String),
        expect.any(String),
      ],
    });
  });

  it("should reject offers linked to jobs outside the user", async () => {
    dbMocks.execute.mockResolvedValueOnce(result([], 0));

    await expect(
      createSalaryOffer(
        {
          jobId: "job-1",
          company: "Acme",
          role: "Engineer",
          baseSalary: 120000,
        },
        "user-1",
      ),
    ).rejects.toThrow("Job not found");

    expect(dbMocks.execute).toHaveBeenCalledWith({
      sql: expect.stringContaining("WHERE EXISTS"),
      args: [
        "test-offer-id",
        "user-1",
        "job-1",
        "Acme",
        "Engineer",
        120000,
        null,
        null,
        null,
        null,
        null,
        null,
        expect.any(String),
        expect.any(String),
        "job-1",
        "user-1",
      ],
    });
  });
});
