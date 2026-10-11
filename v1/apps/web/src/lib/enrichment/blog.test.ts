import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchEngBlog, parseBlogHtml } from "./blog";

vi.mock("@/lib/security/ssrf", () => ({
  SsrfBlockedError: class SsrfBlockedError extends Error {},
  assertSafeOutboundUrl: vi.fn(async (url: string) => new URL(url)),
}));

describe("blog enrichment", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("extracts latest post cards", () => {
    const posts = parseBlogHtml(
      `<article><a href="/one"><h2>Launch notes</h2></a><p>First paragraph.</p></article>`,
      "https://eng.acme.com",
    );

    expect(posts).toEqual([
      {
        title: "Launch notes",
        url: "https://eng.acme.com/one",
        excerpt: "First paragraph.",
      },
    ]);
  });

  it("tries alternate blog hosts after a 404", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(new Response("", { status: 404 }))
        .mockResolvedValueOnce(
          new Response(
            `<article><a href="/post"><h2>Engineering update</h2></a><p>What shipped.</p></article>`,
          ),
        ),
    );

    const result = await fetchEngBlog("acme.com");

    expect(result).toMatchObject({
      ok: true,
      data: { posts: [{ title: "Engineering update" }] },
    });
  });
});
