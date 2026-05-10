import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchGithubOrg } from "./github";

vi.mock("@/lib/security/ssrf", () => ({
  SsrfBlockedError: class SsrfBlockedError extends Error {},
  assertSafeOutboundUrl: vi.fn(async (url: string) => new URL(url)),
}));

describe("fetchGithubOrg", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("aggregates public org and repo data", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(
          Response.json({
            login: "acme",
            html_url: "https://github.com/acme",
            public_repos: 2,
            followers: 10,
            blog: "https://acme.com/blog",
          }),
        )
        .mockResolvedValueOnce(
          Response.json([
            {
              name: "web",
              html_url: "https://github.com/acme/web",
              stargazers_count: 7,
              language: "TypeScript",
              description: "UI",
              pushed_at: "2026-05-01T00:00:00Z",
            },
            {
              name: "api",
              html_url: "https://github.com/acme/api",
              stargazers_count: 3,
              language: "Go",
              description: null,
              pushed_at: null,
            },
          ]),
        ),
    );

    const result = await fetchGithubOrg("acme");

    expect(result).toMatchObject({
      ok: true,
      data: {
        totalStars: 10,
        topLanguages: ["TypeScript", "Go"],
      },
    });
  });

  it("maps not found and rate limit responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("", { status: 404 })),
    );
    await expect(fetchGithubOrg("missing")).resolves.toEqual({
      ok: false,
      error: "not_found",
    });

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response("", {
          status: 403,
          headers: { "X-RateLimit-Remaining": "0" },
        }),
      ),
    );
    await expect(fetchGithubOrg("limited")).resolves.toEqual({
      ok: false,
      error: "rate_limited",
    });
  });
});
