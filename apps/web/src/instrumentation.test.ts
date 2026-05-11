import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { logEnvValidation } from "@/lib/env";
import { register } from "./instrumentation";

vi.mock("@/lib/env", () => ({
  logEnvValidation: vi.fn(),
}));

const mockedLogEnvValidation = vi.mocked(logEnvValidation);

describe("instrumentation register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("logs env validation in the Node runtime", async () => {
    vi.stubEnv("NEXT_RUNTIME", "nodejs");

    await register();

    expect(mockedLogEnvValidation).toHaveBeenCalledTimes(1);
  });

  it("does not log env validation in the Edge runtime", async () => {
    vi.stubEnv("NEXT_RUNTIME", "edge");

    await register();

    expect(mockedLogEnvValidation).not.toHaveBeenCalled();
  });
});
