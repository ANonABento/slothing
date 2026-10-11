import { describe, it, expect, vi, beforeEach } from "vitest";

const { fetchMock } = vi.hoisted(() => ({ fetchMock: vi.fn() }));

vi.mock("@/lib/enrichment/fetch-with-timeout", () => ({
  fetchWithTimeout: fetchMock,
}));

import { parseGithubRepo, fetchUrlSource, UrlSourceError } from "./url-source";

function res(
  status: number,
  body: unknown,
  init: {
    headers?: Record<string, string>;
    contentType?: string;
    text?: string;
  } = {},
) {
  const headers = new Map(
    Object.entries({
      ...(init.contentType ? { "content-type": init.contentType } : {}),
      ...(init.headers ?? {}),
    }),
  );
  return {
    ok: true as const,
    response: {
      status,
      headers: { get: (k: string) => headers.get(k.toLowerCase()) ?? null },
      json: async () => body,
      text: async () => init.text ?? "",
    },
  };
}

describe("parseGithubRepo", () => {
  it("parses standard repo URLs", () => {
    expect(parseGithubRepo("https://github.com/Lironktf/flowTO")).toEqual({
      owner: "Lironktf",
      repo: "flowTO",
    });
    expect(parseGithubRepo("https://www.github.com/a/b/")).toEqual({
      owner: "a",
      repo: "b",
    });
    expect(parseGithubRepo("https://github.com/a/b.git")).toEqual({
      owner: "a",
      repo: "b",
    });
    expect(parseGithubRepo("https://github.com/a/b/tree/main/src")).toEqual({
      owner: "a",
      repo: "b",
    });
  });

  it("rejects non-repo and non-github URLs", () => {
    expect(parseGithubRepo("https://github.com/justanowner")).toBeNull();
    expect(parseGithubRepo("https://github.com/features/copilot")).toBeNull();
    expect(parseGithubRepo("https://example.com/a/b")).toBeNull();
    expect(parseGithubRepo("not a url")).toBeNull();
  });
});

describe("fetchUrlSource — GitHub", () => {
  beforeEach(() => fetchMock.mockReset());

  it("extracts name, technologies, and README text", async () => {
    const readme =
      "# FlowTO\nBuilt a city-scale digital twin with cuGraph and Nemotron.";
    // Call order (verified): repo → languages → readme.
    fetchMock
      .mockResolvedValueOnce(
        res(200, { name: "flowTO", description: "A digital twin of Toronto" }),
      )
      .mockResolvedValueOnce(res(200, { Python: 1000, TypeScript: 200 }))
      .mockResolvedValueOnce(
        res(200, {
          content: Buffer.from(readme, "utf8").toString("base64"),
          encoding: "base64",
        }),
      );

    const source = await fetchUrlSource("https://github.com/Lironktf/flowTO");
    expect(source.kind).toBe("github");
    expect(source.suggestedName).toBe("flowTO");
    expect(source.technologies).toEqual(["Python", "TypeScript"]);
    expect(source.text).toContain("digital twin");
    expect(source.text).toContain("cuGraph");
  });

  it("maps 404 to not_found", async () => {
    fetchMock.mockResolvedValue(res(404, { message: "Not Found" }));
    await expect(
      fetchUrlSource("https://github.com/ghost/missing"),
    ).rejects.toMatchObject({ code: "not_found" });
  });

  it("maps rate-limit (403 + remaining 0) to rate_limited", async () => {
    fetchMock.mockResolvedValue(
      res(403, {}, { headers: { "x-ratelimit-remaining": "0" } }),
    );
    await expect(
      fetchUrlSource("https://github.com/a/b"),
    ).rejects.toMatchObject({ code: "rate_limited" });
  });
});

describe("fetchUrlSource — web", () => {
  beforeEach(() => fetchMock.mockReset());

  it("extracts readable text from an HTML page", async () => {
    fetchMock.mockResolvedValue(
      res(200, null, {
        contentType: "text/html",
        text: "<html><head><title>My Project</title></head><body><h1>Cool</h1><p>I built a robot that does many useful things with sensors.</p><script>ignore()</script></body></html>",
      }),
    );
    const source = await fetchUrlSource("https://example.com/project");
    expect(source.kind).toBe("web");
    expect(source.title).toBe("My Project");
    expect(source.text).toContain("robot");
    expect(source.text).not.toContain("ignore()");
  });

  it("rejects non-HTML content", async () => {
    fetchMock.mockResolvedValue(
      res(200, null, { contentType: "application/pdf", text: "%PDF" }),
    );
    await expect(
      fetchUrlSource("https://example.com/file.pdf"),
    ).rejects.toMatchObject({ code: "unsupported_content" });
  });
});

describe("fetchUrlSource — invalid input", () => {
  it("throws invalid_url", async () => {
    await expect(fetchUrlSource("nonsense")).rejects.toBeInstanceOf(
      UrlSourceError,
    );
  });
});
