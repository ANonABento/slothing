import { describe, expect, it } from "vitest";
import { computeOnboardingActive } from "./state";

const emptyStats = {
  documentsCount: 0,
  resumesGenerated: 0,
  jobsByStatus: {},
};

describe("computeOnboardingActive", () => {
  it("is inactive once onboarding has been dismissed", () => {
    expect(
      computeOnboardingActive({
        dismissedAt: "2026-05-09T10:00:00.000Z",
        stats: emptyStats,
      }),
    ).toBe(false);
  });

  it("is active when any basic step is incomplete", () => {
    expect(
      computeOnboardingActive({ dismissedAt: null, stats: emptyStats }),
    ).toBe(true);
  });

  it("is inactive when all basic steps are complete", () => {
    expect(
      computeOnboardingActive({
        dismissedAt: null,
        stats: {
          documentsCount: 1,
          extensionInstalled: true,
          resumesGenerated: 1,
          jobsByStatus: { interviewing: 1 },
        },
      }),
    ).toBe(false);
  });
});
