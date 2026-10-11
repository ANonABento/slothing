import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth", () =>
  globalThis.__contractRouteMocks!.createAuthModuleMock(),
);

vi.mock("@/lib/db/profile-bank", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock(
    "@/lib/db/profile-bank",
  ),
);

vi.mock("@/lib/parse/pdf-cache", () => ({
  getCachedPdfBytes: vi.fn(() => null),
}));

vi.mock("@/lib/parse/pdf-positions", () => ({
  extractPdfPositions: vi.fn(async () => ({ items: [], pageDimensions: [] })),
  findPositionsWithDiagnostic: vi.fn(() => ({
    needle: "",
    needleTokens: [],
    attempts: [],
    winningTier: null,
    bboxes: [],
  })),
  deriveSearchNeedles: vi.fn(() => []),
}));

import { GET } from "./route";
import {
  getRequest,
  invokeRouteHandler,
  resetContractMocks,
  routeContext,
  setAuthFailure,
  setAuthSuccess,
} from "@/test/contract";

describe("/api/bank/documents/[id]/match-report route contract", () => {
  beforeEach(() => {
    resetContractMocks();
    vi.stubEnv("NODE_ENV", "test");
  });

  it("returns 401 when auth fails", async () => {
    setAuthFailure();
    const response = await invokeRouteHandler(
      GET,
      getRequest("http://localhost/api/bank/documents/item-1/match-report"),
      routeContext({ id: "item-1" }),
    );
    expect(response.status).toBe(401);
  });

  it("returns 404 when PDF bytes are not cached", async () => {
    setAuthSuccess();
    const response = await invokeRouteHandler(
      GET,
      getRequest("http://localhost/api/bank/documents/item-1/match-report"),
      routeContext({ id: "item-1" }),
    );
    expect(response.status).toBe(404);
  });

  it("returns 404 in production regardless of cache state", async () => {
    setAuthSuccess();
    vi.stubEnv("NODE_ENV", "production");
    const response = await invokeRouteHandler(
      GET,
      getRequest("http://localhost/api/bank/documents/item-1/match-report"),
      routeContext({ id: "item-1" }),
    );
    expect(response.status).toBe(404);
    vi.unstubAllEnvs();
  });
});
