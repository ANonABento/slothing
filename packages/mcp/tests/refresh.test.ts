/**
 * Tests for the `refresh` token-health command.
 */
import { describe, expect, it } from "vitest";
import { checkToken, formatRefreshReport } from "../src/refresh.js";
import { parseCommand } from "../src/index.js";
import type { ServerConfig } from "../src/config.js";

const CONFIG: ServerConfig = {
  baseUrl: "https://slothing.test",
  token: "tok",
};

function fetchReturning(status: number, body: unknown): typeof fetch {
  return (async () =>
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    })) as unknown as typeof fetch;
}

function fetchThrowing(): typeof fetch {
  return (async () => {
    throw new TypeError("fetch failed");
  }) as unknown as typeof fetch;
}

describe("checkToken", () => {
  it("reports OK on a 200 from the profile probe", async () => {
    const status = await checkToken(CONFIG, {
      fetchImpl: fetchReturning(200, { profile: {} }),
    });
    expect(status.ok).toBe(true);
    expect(status.status).toBe(200);
  });

  it("flags an expired/revoked token on 401", async () => {
    const status = await checkToken(CONFIG, {
      fetchImpl: fetchReturning(401, { error: "No token provided" }),
    });
    expect(status.ok).toBe(false);
    expect(status.status).toBe(401);
    expect(status.message).toMatch(/expired or revoked/i);
  });

  it("treats 403 the same as 401", async () => {
    const status = await checkToken(CONFIG, {
      fetchImpl: fetchReturning(403, { error: "forbidden" }),
    });
    expect(status.ok).toBe(false);
    expect(status.status).toBe(403);
  });

  it("reports unreachable host on a network error", async () => {
    const status = await checkToken(CONFIG, { fetchImpl: fetchThrowing() });
    expect(status.ok).toBe(false);
    expect(status.status).toBeNull();
    expect(status.message).toMatch(/could not reach/i);
  });
});

describe("formatRefreshReport", () => {
  it("includes re-mint steps only when the token is not ok", () => {
    const ok = formatRefreshReport(
      { ok: true, status: 200, message: "valid" },
      CONFIG,
    );
    expect(ok).not.toMatch(/re-mint a token/i);

    const bad = formatRefreshReport(
      { ok: false, status: 401, message: "expired" },
      CONFIG,
    );
    expect(bad).toMatch(/re-mint a token/i);
    expect(bad).toMatch(/POST \/api\/extension\/auth/);
  });
});

describe("parseCommand", () => {
  it("maps refresh/doctor to refresh", () => {
    expect(parseCommand(["refresh"])).toBe("refresh");
    expect(parseCommand(["doctor"])).toBe("refresh");
  });

  it("maps help flags to help", () => {
    expect(parseCommand(["--help"])).toBe("help");
    expect(parseCommand(["-h"])).toBe("help");
    expect(parseCommand(["help"])).toBe("help");
  });

  it("defaults to serve", () => {
    expect(parseCommand([])).toBe("serve");
    expect(parseCommand(["--whatever"])).toBe("serve");
  });
});
