import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireExtensionAuth: vi.fn(),
  getVariant: vi.fn(),
  trackExposure: vi.fn(),
}));

vi.mock("@/lib/extension-auth", () => ({
  requireExtensionAuth: mocks.requireExtensionAuth,
}));

vi.mock("@/lib/experiments", async () => {
  const actual =
    await vi.importActual<typeof import("@/lib/experiments")>(
      "@/lib/experiments",
    );
  return { ...actual, getVariant: mocks.getVariant };
});

vi.mock("@/lib/experiments/track", () => ({
  trackExposure: mocks.trackExposure,
}));

import { GET } from "./route";

function call(name: string) {
  return GET(new NextRequest(`http://localhost/api/experiments/${name}`), {
    params: { name },
  });
}

describe("GET /api/experiments/[name]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireExtensionAuth.mockReturnValue({
      success: true,
      userId: "user-1",
    });
    mocks.getVariant.mockReturnValue("treatment");
    mocks.trackExposure.mockResolvedValue(undefined);
  });

  it("returns the resolved variant and logs exposure", async () => {
    const response = await call("profilePicker");
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ name: "profilePicker", variant: "treatment" });
    expect(mocks.getVariant).toHaveBeenCalledWith("profilePicker", "user-1");
    expect(mocks.trackExposure).toHaveBeenCalledWith(
      "exp_profile_picker",
      "treatment",
      "user-1",
    );
  });

  it("404s on an unknown experiment name", async () => {
    const response = await call("nope");
    expect(response.status).toBe(404);
    expect(mocks.getVariant).not.toHaveBeenCalled();
  });

  it("still returns the variant when exposure logging throws", async () => {
    mocks.trackExposure.mockRejectedValueOnce(new Error("telemetry down"));
    const response = await call("profilePicker");
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.variant).toBe("treatment");
  });

  it("propagates the auth failure response", async () => {
    mocks.requireExtensionAuth.mockReturnValue({
      success: false,
      response: new Response(JSON.stringify({ error: "No token provided" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }),
    });
    const response = await call("profilePicker");
    expect(response.status).toBe(401);
    expect(mocks.getVariant).not.toHaveBeenCalled();
  });
});
