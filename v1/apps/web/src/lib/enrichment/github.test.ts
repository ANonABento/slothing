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
        resolvedSlug: "acme",
        totalStars: 10,
        topLanguages: ["TypeScript", "Go"],
      },
    });
  });

  it("tries fallback candidates until one resolves", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(new Response("", { status: 404 }))
        .mockResolvedValueOnce(
          Response.json({
            login: "anthropics",
            html_url: "https://github.com/anthropics",
            public_repos: 1,
            followers: 20,
          }),
        )
        .mockResolvedValueOnce(Response.json([])),
    );

    await expect(
      fetchGithubOrg(["anthropic", "anthropics", "anthropic-inc"]),
    ).resolves.toMatchObject({
      ok: true,
      data: { resolvedSlug: "anthropics", org: "anthropics" },
    });
  });

  it("stops fallback on non-not-found errors", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response("", {
        status: 403,
        headers: { "X-RateLimit-Remaining": "0" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchGithubOrg(["limited", "next"])).resolves.toEqual({
      ok: false,
      error: "rate_limited",
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
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
