import { describe, expect, it } from "vitest";
import type { BankEntry } from "@/types";
import { getBulletReviewReason, isBulletNeedsReview } from "./bullet-review";

function entry(overrides: Partial<BankEntry>): BankEntry {
  return {
    id: "entry-1",
    userId: "default",
    category: "bullet",
    content: { description: "Built parser" },
    confidenceScore: 0.9,
    createdAt: "2026-01-01",
    ...overrides,
  };
}

describe("bullet review helpers", () => {
  it("flags bullets without a parent", () => {
    const bullet = entry({ id: "bullet-1" });

    expect(getBulletReviewReason(bullet, [bullet])).toBe("Missing parent");
    expect(isBulletNeedsReview(bullet, [bullet])).toBe(true);
  });

  it("flags bullets whose parent no longer exists", () => {
    const bullet = entry({
      id: "bullet-1",
      content: { description: "Built parser", parentId: "missing-parent" },
    });

    expect(getBulletReviewReason(bullet, [bullet])).toBe("Parent not found");
  });

  it("accepts bullets under experience and project parents", () => {
    const parent = entry({
      id: "exp-1",
      category: "experience",
      content: { title: "Engineer", company: "Acme" },
    });
    const bullet = entry({
      id: "bullet-1",
      content: { description: "Built parser", parentId: "exp-1" },
    });

    expect(getBulletReviewReason(bullet, [parent, bullet])).toBeNull();
    expect(isBulletNeedsReview(bullet, [parent, bullet])).toBe(false);
  });

  it("rejects bullets attached to non-parent categories", () => {
    const parent = entry({
      id: "skill-1",
      category: "skill",
      content: { name: "React" },
    });
    const bullet = entry({
      id: "bullet-1",
      content: { description: "Built parser", parentId: "skill-1" },
    });

    expect(getBulletReviewReason(bullet, [parent, bullet])).toBe(
      "Invalid parent",
    );
  });

  it("flags bullets whose parent type metadata conflicts with the actual parent", () => {
    const parent = entry({
      id: "exp-1",
      category: "experience",
      content: { title: "Engineer", company: "Acme" },
    });
    const bullet = entry({
      id: "bullet-1",
      content: {
        description: "Built parser",
        parentId: "exp-1",
        parentType: "project",
      },
    });

    expect(getBulletReviewReason(bullet, [parent, bullet])).toBe(
      "Parent type mismatch",
    );
  });

  it("flags bullets whose source section conflicts with the parent kind", () => {
    const parent = entry({
      id: "project-1",
      category: "project",
      content: { name: "Parser" },
    });
    const bullet = entry({
      id: "bullet-1",
      content: {
        description: "Built parser",
        parentId: "project-1",
        sourceSection: "experience",
      },
    });

    expect(getBulletReviewReason(bullet, [parent, bullet])).toBe(
      "Source section mismatch",
    );
  });

  it("flags bullets whose parent label points at another component", () => {
    const parent = entry({
      id: "exp-1",
      category: "experience",
      content: { title: "Engineer", company: "Acme" },
    });
    const bullet = entry({
      id: "bullet-1",
      content: {
        description: "Built parser",
        parentId: "exp-1",
        parentLabel: "Designer at Beta",
      },
    });

    expect(getBulletReviewReason(bullet, [parent, bullet])).toBe(
      "Parent label mismatch",
    );
  });

  it("accepts matching parent metadata", () => {
    const parent = entry({
      id: "exp-1",
      category: "experience",
      content: {
        title: "Engineer",
        company: "Acme",
        startDate: "2026",
      },
    });
    const bullet = entry({
      id: "bullet-1",
      content: {
        description: "Built parser",
        parentId: "exp-1",
        parentType: "experience",
        sourceSection: "work experience",
        parentLabel: "Engineer at Acme",
        parentKey: "acme|engineer|2026",
        company: "Acme",
      },
    });

    expect(getBulletReviewReason(bullet, [parent, bullet])).toBeNull();
  });
});
