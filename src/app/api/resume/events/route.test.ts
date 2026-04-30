import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuth: vi.fn(),
  recordResumeEvent: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  requireAuth: mocks.requireAuth,
  isAuthError: (value: unknown) => value instanceof Response,
}));

vi.mock("@/lib/db/resume-events", () => ({
  RESUME_EVENT_TYPES: ["view", "download", "share_click"],
  recordResumeEvent: mocks.recordResumeEvent,
}));

import { POST } from "./route";

function eventRequest(body: string) {
  return new NextRequest("http://localhost/api/resume/events", {
    method: "POST",
    body,
    headers: { "content-type": "application/json" },
  });
}

describe("resume events route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAuth.mockResolvedValue({ userId: "user-1" });
    mocks.recordResumeEvent.mockReturnValue({
      id: "event-1",
      userId: "user-1",
      resumeId: "resume-1",
      eventType: "share_click",
      occurredAt: "2024-05-01T12:00:00.000Z",
      metadata: { target: "clipboard" },
    });
  });

  it("records a valid resume event for the authenticated user", async () => {
    const response = await POST(
      eventRequest(
        JSON.stringify({
          resumeId: "resume-1",
          eventType: "share_click",
          metadata: { target: "clipboard" },
        }),
      ),
    );

    expect(response.status).toBe(200);
    expect(mocks.recordResumeEvent).toHaveBeenCalledWith(
      "resume-1",
      "share_click",
      "user-1",
      { target: "clipboard" },
    );
  });

  it("returns 400 for malformed JSON", async () => {
    const response = await POST(eventRequest("{bad-json"));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Invalid resume event",
    });
    expect(mocks.recordResumeEvent).not.toHaveBeenCalled();
  });

  it("returns 404 when the resume is not owned by the user", async () => {
    mocks.recordResumeEvent.mockImplementation(() => {
      throw new Error("Resume not found");
    });

    const response = await POST(
      eventRequest(
        JSON.stringify({
          resumeId: "resume-1",
          eventType: "view",
        }),
      ),
    );

    expect(response.status).toBe(404);
  });
});
