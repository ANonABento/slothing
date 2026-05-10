import { describe, expect, it } from "vitest";
import {
  ADVANCED_ONBOARDING_STEPS,
  BASIC_ONBOARDING_STEPS,
  countCompletedSteps,
  getActiveStepIndex,
} from "./steps";
import type { OnboardingStats } from "./types";

function stats(overrides: Partial<OnboardingStats> = {}): OnboardingStats {
  return {
    documentsCount: 0,
    resumesGenerated: 0,
    jobsByStatus: {},
    ...overrides,
  };
}

describe("onboarding step registry", () => {
  it("defines the basic onboarding steps in product order", () => {
    expect(BASIC_ONBOARDING_STEPS.map((step) => step.id)).toEqual([
      "upload-resume",
      "add-opportunity",
      "create-tailored-doc",
    ]);
    expect(BASIC_ONBOARDING_STEPS).toHaveLength(3);
    expect(BASIC_ONBOARDING_STEPS.every((step) => step.tier === "basic")).toBe(
      true,
    );
  });

  it("reserves advanced onboarding without rendering steps yet", () => {
    expect(ADVANCED_ONBOARDING_STEPS).toEqual([]);
  });

  it("returns the first incomplete step index", () => {
    expect(getActiveStepIndex(BASIC_ONBOARDING_STEPS, stats())).toBe(0);
    expect(
      getActiveStepIndex(BASIC_ONBOARDING_STEPS, stats({ documentsCount: 1 })),
    ).toBe(1);
    expect(
      getActiveStepIndex(
        BASIC_ONBOARDING_STEPS,
        stats({ documentsCount: 1, jobsByStatus: { applied: 1 } }),
      ),
    ).toBe(2);
    expect(
      getActiveStepIndex(
        BASIC_ONBOARDING_STEPS,
        stats({
          documentsCount: 1,
          jobsByStatus: { applied: 1 },
          resumesGenerated: 1,
        }),
      ),
    ).toBe(-1);
  });

  it("counts completed steps from registry predicates", () => {
    expect(countCompletedSteps(BASIC_ONBOARDING_STEPS, stats())).toBe(0);
    expect(
      countCompletedSteps(
        BASIC_ONBOARDING_STEPS,
        stats({ documentsCount: 1, jobsByStatus: { pending: 1 } }),
      ),
    ).toBe(2);
    expect(
      countCompletedSteps(
        BASIC_ONBOARDING_STEPS,
        stats({
          documentsCount: 1,
          jobsByStatus: { offered: 1 },
          resumesGenerated: 1,
        }),
      ),
    ).toBe(3);
  });
});
