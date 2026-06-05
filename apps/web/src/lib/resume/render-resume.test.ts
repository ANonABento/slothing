import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getResumeTemplate: vi.fn(),
  migrateV4ToCollapsed: vi.fn(),
}));

vi.mock("@/lib/db/resume-templates", () => ({
  getResumeTemplate: mocks.getResumeTemplate,
  migrateV4ToCollapsed: mocks.migrateV4ToCollapsed,
}));

import { renderResumeTypstForTemplate } from "./render-resume";
import type { TailoredResume } from "./generator";

const resume = {
  contact: { name: "Jane Doe", email: "jane@example.com" },
  summary: "Builds reliable systems.",
  experiences: [],
  skills: [],
  education: [],
} as unknown as TailoredResume;

describe("renderResumeTypstForTemplate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getResumeTemplate.mockReturnValue(null);
  });

  it("emits Typst for an imported (collapsed) grammar template", () => {
    mocks.getResumeTemplate.mockReturnValue({
      id: "imported-1",
      template: {
        id: "imported-1",
        name: "Imported",
        grammar: {
          columns: "single",
          header: "centered",
          sectionTitle: "full-rule",
          bullets: "disc",
          density: "normal",
        },
        tokens: {
          accent: "#1f4e79",
          fontClass: "sans",
          baseFontSizePt: 10.5,
          lineHeight: 1.35,
        },
      },
    });

    const src = renderResumeTypstForTemplate(resume, "imported-1", "user-1");
    expect(src).toContain("#set page");
    expect(src).toContain("Jane Doe");
  });

  it("falls back to a shared built-in default template", () => {
    const src = renderResumeTypstForTemplate(resume, "classic", "user-1");
    expect(src).toContain("#set document");
    expect(src).toContain("Jane Doe");
  });

  it("returns null for a legacy-only template with no grammar form", () => {
    expect(
      renderResumeTypstForTemplate(resume, "no-such-template", "user-1"),
    ).toBeNull();
  });
});
