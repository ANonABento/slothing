import { describe, it, expect, vi, beforeEach } from "vitest";
import type { BankEntry } from "@/types";

const { getBankEntriesMock } = vi.hoisted(() => ({
  getBankEntriesMock: vi.fn(),
}));

vi.mock("@/lib/db/profile-bank", () => ({
  getBankEntries: getBankEntriesMock,
}));

import { selectStyleExemplars } from "./golden-set";

function bullet(
  id: string,
  description: string,
  status: BankEntry["status"] = "verified",
): BankEntry {
  return {
    id,
    userId: "u1",
    category: "bullet",
    content: { description },
    status,
    confidenceScore: 1,
    createdAt: "2026-01-01",
  };
}

describe("selectStyleExemplars", () => {
  beforeEach(() => getBankEntriesMock.mockReset());

  it("returns [] when fewer than two usable verified bullets exist", () => {
    getBankEntriesMock.mockReturnValue([
      bullet("a", "Built a thing that mattered to the team and shipped it"),
    ]);
    expect(selectStyleExemplars("u1")).toEqual([]);
  });

  it("ranks metric-bearing, verb-first, tweet-length bullets highest", () => {
    getBankEntriesMock.mockReturnValue([
      bullet(
        "a",
        "Responsible for various tasks across the platform team here",
      ),
      bullet(
        "b",
        "Cut nightly build time from 22 minutes to 7 by parallelizing the test suite",
      ),
      bullet("c", "Worked on stuff that was sometimes interesting to people"),
    ]);
    const out = selectStyleExemplars("u1", { limit: 2 });
    expect(out[0]).toMatch(/Cut nightly build/);
    expect(out).toHaveLength(2);
  });

  it("excludes drafts and dedupes", () => {
    getBankEntriesMock.mockReturnValue([
      bullet(
        "a",
        "Shipped a feature that lifted activation 12% in one quarter",
      ),
      bullet(
        "b",
        "Shipped a feature that lifted activation 12% in one quarter",
      ),
      bullet(
        "c",
        "Draft bullet that should never be used as an exemplar here",
        "draft",
      ),
      bullet("d", "Reduced infra cost 30% by right-sizing the cluster fleet"),
    ]);
    const out = selectStyleExemplars("u1");
    expect(out).toHaveLength(2);
    expect(out.some((b) => /Draft bullet/.test(b))).toBe(false);
  });
});
