import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuth: vi.fn(),
  isAuthError: vi.fn(),
  listConfiguredProviders: vi.fn(),
  listTasks: vi.fn(),
  listModels: vi.fn(),
  addConfiguredProvider: vi.fn(),
  removeConfiguredProvider: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  requireAuth: mocks.requireAuth,
  isAuthError: mocks.isAuthError,
}));

vi.mock("@/lib/llm/bentorouter-client", () => ({
  getBentoRouterClient: vi.fn(async () => ({
    api: () => ({
      listConfiguredProviders: mocks.listConfiguredProviders,
      listTasks: mocks.listTasks,
      listModels: mocks.listModels,
      addConfiguredProvider: mocks.addConfiguredProvider,
      removeConfiguredProvider: mocks.removeConfiguredProvider,
    }),
  })),
}));

import { DELETE, GET, POST } from "./route";

function request(body: unknown) {
  return new NextRequest("http://localhost/api/settings/llm/providers", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
  });
}

describe("/api/settings/llm/providers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAuth.mockResolvedValue({ userId: "user-a" });
    mocks.isAuthError.mockReturnValue(false);
    mocks.listConfiguredProviders.mockResolvedValue([]);
    mocks.listTasks.mockResolvedValue([]);
    mocks.listModels.mockResolvedValue([]);
    mocks.addConfiguredProvider.mockResolvedValue({
      id: "openai",
      type: "openai",
      userId: "user-a",
    });
    mocks.removeConfiguredProvider.mockResolvedValue(undefined);
  });

  it("lists only providers for the authenticated user", async () => {
    await GET();

    expect(mocks.listConfiguredProviders).toHaveBeenCalledWith("user-a");
  });

  it("scopes added providers to the authenticated user", async () => {
    const response = await POST(
      request({
        type: "openai",
        displayName: "Work OpenAI",
        apiKey: "sk-test",
        defaultModel: "gpt-4o-mini",
      }),
    );

    expect(response.status).toBe(201);
    expect(mocks.addConfiguredProvider).toHaveBeenCalledWith({
      type: "openai",
      displayName: "Work OpenAI",
      apiKey: "sk-test",
      baseUrl: undefined,
      defaultModel: "gpt-4o-mini",
      userId: "user-a",
    });
  });

  it("removes providers through the authenticated user's scope", async () => {
    const response = await DELETE(request({ id: "openai" }));

    expect(response.status).toBe(200);
    expect(mocks.removeConfiguredProvider).toHaveBeenCalledWith(
      "user-a",
      "openai",
    );
  });

  it("does not accept an explicit userId from the client body", async () => {
    await POST(
      request({
        type: "openai",
        displayName: "Other User Key",
        apiKey: "sk-test",
        userId: "user-b",
      }),
    );

    expect(mocks.addConfiguredProvider).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "user-a" }),
    );
  });
});
