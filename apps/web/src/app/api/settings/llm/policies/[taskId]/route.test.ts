import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuth: vi.fn(),
  isAuthError: vi.fn(),
  api: vi.fn(),
  updateTaskPolicy: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  requireAuth: mocks.requireAuth,
  isAuthError: mocks.isAuthError,
}));

vi.mock("@/lib/llm/bentorouter-client", () => ({
  getBentoRouterClient: vi.fn(async () => ({
    api: mocks.api,
  })),
}));

import { PUT } from "./route";

function request(body: unknown) {
  return new NextRequest(
    "http://localhost/api/settings/llm/policies/slothing.parse_resume",
    {
      method: "PUT",
      body: JSON.stringify(body),
      headers: { "content-type": "application/json" },
    },
  );
}

describe("/api/settings/llm/policies/[taskId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAuth.mockResolvedValue({ userId: "user-a" });
    mocks.isAuthError.mockReturnValue(false);
    mocks.api.mockReturnValue({
      updateTaskPolicy: mocks.updateTaskPolicy,
    });
    mocks.updateTaskPolicy.mockResolvedValue({
      id: "slothing.parse_resume",
      effectivePolicy: { primaryModel: "openrouter/openai/gpt-4o-mini" },
    });
  });

  it("updates task policies in the authenticated user's scope", async () => {
    const patch = { primaryModel: "openrouter/openai/gpt-4o-mini" };
    const response = await PUT(request(patch), {
      params: { taskId: "slothing.parse_resume" },
    });

    expect(response.status).toBe(200);
    expect(mocks.api).toHaveBeenCalledWith("user-a");
    expect(mocks.updateTaskPolicy).toHaveBeenCalledWith(
      "slothing.parse_resume",
      patch,
    );
  });
});
