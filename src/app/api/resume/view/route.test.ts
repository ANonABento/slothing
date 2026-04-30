import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuth: vi.fn(),
  getGeneratedResume: vi.fn(),
  recordResumeEvent: vi.fn(),
  getTemplateWithCustom: vi.fn(),
  generateResumeHTML: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  requireAuth: mocks.requireAuth,
  isAuthError: (value: unknown) => value instanceof Response,
}));

vi.mock("@/lib/db", () => ({
  getGeneratedResume: mocks.getGeneratedResume,
  recordResumeEvent: mocks.recordResumeEvent,
}));

vi.mock("@/lib/resume/templates", () => ({
  getTemplateWithCustom: mocks.getTemplateWithCustom,
}));

vi.mock("@/lib/resume/pdf", () => ({
  generateResumeHTML: mocks.generateResumeHTML,
}));

import { GET } from "./route";

const savedResume = {
  id: "resume-1",
  contentJson: JSON.stringify({
    contact: { name: "Jane Doe" },
    summary: "Builds reliable systems.",
    experiences: [],
    skills: [],
    education: [],
  }),
};

describe("resume view route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAuth.mockResolvedValue({ userId: "user-1" });
    mocks.getGeneratedResume.mockReturnValue(savedResume);
    mocks.getTemplateWithCustom.mockReturnValue({ id: "classic" });
    mocks.generateResumeHTML.mockReturnValue("<html>resume</html>");
  });

  it("renders a saved resume and records a view event", async () => {
    const response = await GET(
      new NextRequest("http://localhost/api/resume/view?resumeId=resume-1"),
    );

    expect(mocks.getGeneratedResume).toHaveBeenCalledWith("resume-1", "user-1");
    expect(mocks.recordResumeEvent).toHaveBeenCalledWith(
      "resume-1",
      "view",
      "user-1",
      { source: "resume-view-route" },
    );
    await expect(response.text()).resolves.toBe("<html>resume</html>");
  });

  it("returns 400 when resumeId is missing", async () => {
    const response = await GET(
      new NextRequest("http://localhost/api/resume/view"),
    );

    expect(response.status).toBe(400);
    expect(mocks.recordResumeEvent).not.toHaveBeenCalled();
  });
});
