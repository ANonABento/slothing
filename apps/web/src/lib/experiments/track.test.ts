import { beforeEach, describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  execute: vi.fn(),
  batch: vi.fn(),
}));

vi.mock("@/lib/db/client", () => ({
  getClient: () => dbMocks,
}));

vi.mock("@/lib/utils", () => ({
  generateId: () => "event-1",
}));

import {
  EXPERIMENT_EXPOSURE_EVENT,
  getExperimentResults,
  trackExperimentEvent,
  trackExposure,
} from "./track";

function lastInsertArgs(): unknown[] {
  const call = dbMocks.execute.mock.calls.find((c) => {
    const sql = typeof c[0] === "string" ? c[0] : c[0]?.sql;
    return (
      typeof sql === "string" && sql.includes("INSERT INTO product_events")
    );
  });
  if (!call) throw new Error("no insert call recorded");
  return (call[0] as { args: unknown[] }).args;
}

describe("experiment telemetry", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbMocks.batch.mockResolvedValue([]);
    dbMocks.execute.mockResolvedValue({ rows: [], rowsAffected: 1 });
  });

  it("records exposure with the experiment key as source and variant in metadata", async () => {
    await trackExposure("exp_profile_picker", "treatment", "user-1");
    const args = lastInsertArgs();
    // args: [id, user_id, event, source, metadata_json, created_at]
    expect(args[2]).toBe(EXPERIMENT_EXPOSURE_EVENT);
    expect(args[3]).toBe("exp_profile_picker");
    expect(args[1]).toBe("user-1");
    expect(JSON.parse(args[4] as string)).toEqual({ variant: "treatment" });
  });

  it("attributes an outcome event to a variant and merges extra metadata", async () => {
    await trackExperimentEvent(
      "exp_profile_picker",
      "control",
      "resume_tailored",
      "user-2",
      { baseResumeId: "r-9" },
    );
    const args = lastInsertArgs();
    expect(args[2]).toBe("resume_tailored");
    expect(args[3]).toBe("exp_profile_picker");
    expect(JSON.parse(args[4] as string)).toEqual({
      baseResumeId: "r-9",
      variant: "control",
    });
  });

  it("aggregates per-variant event counts", async () => {
    // ensureProductAnalyticsSchema uses getClient().batch (mocked above), not
    // execute — so the only execute call here is the SELECT.
    dbMocks.execute.mockResolvedValue({
      rows: [
        { variant: "control", event: "experiment_exposure", count: 10 },
        { variant: "treatment", event: "experiment_exposure", count: 11 },
        { variant: "treatment", event: "resume_tailored", count: 4 },
      ],
      rowsAffected: 0,
    });

    const rows = await getExperimentResults("exp_profile_picker");
    expect(rows).toContainEqual({
      variant: "treatment",
      event: "resume_tailored",
      count: 4,
    });
    expect(rows).toHaveLength(3);
  });
});
