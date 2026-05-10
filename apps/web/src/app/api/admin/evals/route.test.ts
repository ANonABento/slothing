import { beforeEach, describe, expect, it, vi } from "vitest";
import { SAMPLE_COMPARISON_REPORTS } from "@/lib/admin/evals/sample-data";

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  configured: vi.fn(),
  load: vi.fn(),
}));

vi.mock("@/auth", () => ({
  auth: mocks.auth,
  isNextAuthConfigured: mocks.configured,
}));

vi.mock("@/lib/admin/evals/loader", async () => {
  const actual = await vi.importActual<
    typeof import("@/lib/admin/evals/loader")
  >("@/lib/admin/evals/loader");
  return { ...actual, loadComparisonReports: mocks.load };
});

import { GET } from "./route";

describe("/api/admin/evals", () => {
  beforeEach(() => {
    mocks.auth.mockReset();
    mocks.configured.mockReset();
    mocks.load.mockReset();
    mocks.load.mockReturnValue([]);
  });

  it("returns 401 when NextAuth is configured and the user is missing", async () => {
    mocks.configured.mockReturnValue(true);
    mocks.auth.mockResolvedValue(null);

    const response = await GET();

    expect(response.status).toBe(401);
  });

  it("returns 403 when the signed-in user is not an owner", async () => {
    mocks.configured.mockReturnValue(true);
    mocks.auth.mockResolvedValue({
      user: { id: "user-1", email: "user@example.com" },
    });

    const response = await GET();

    expect(response.status).toBe(403);
  });

  it("returns sample data when no reports exist", async () => {
    mocks.configured.mockReturnValue(false);
    mocks.auth.mockResolvedValue(null);

    const response = await GET();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.source).toBe("sample");
    expect(payload.runs.length).toBeGreaterThan(0);
  });

  it("returns real reports for an owner", async () => {
    mocks.configured.mockReturnValue(true);
    mocks.auth.mockResolvedValue({
      user: { id: "user-1", email: "owner@example.com" },
    });
    vi.stubEnv("OWNER_EMAIL", "owner@example.com");
    mocks.load.mockReturnValue([SAMPLE_COMPARISON_REPORTS[0]]);

    const response = await GET();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.source).toBe("reports");
    expect(payload.runs).toHaveLength(1);
    vi.unstubAllEnvs();
  });
});
