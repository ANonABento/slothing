import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchHnMentions } from "./hn";

vi.mock("@/lib/security/ssrf", () => ({
  SsrfBlockedError: class SsrfBlockedError extends Error {},
  assertSafeOutboundUrl: vi.fn(async (url: string) => new URL(url)),
}));

describe("fetchHnMentions", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("maps Algolia hits to HN stories", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        Response.json({
          hits: [
            {
              objectID: "123",
              title: "Acme launches",
              url: "https://acme.com",
              points: 42,
              num_comments: 9,
              created_at: "2026-05-01T00:00:00Z",
            },
          ],
        }),
      ),
    );

    const result = await fetchHnMentions("Acme");

    expect(result).toEqual({
      ok: true,
      data: {
        stories: [
          {
            title: "Acme launches",
            url: "https://acme.com",
            points: 42,
            comments: 9,
            createdAt: "2026-05-01T00:00:00Z",
            hnUrl: "https://news.ycombinator.com/item?id=123",
          },
        ],
      },
    });
  });

  it("treats empty hits as successful no data", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(Response.json({ hits: [] })),
    );

    await expect(fetchHnMentions("Acme")).resolves.toEqual({
      ok: true,
      data: { stories: [] },
    });
  });
});
