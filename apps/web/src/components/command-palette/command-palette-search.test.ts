import { beforeEach, describe, expect, it, vi } from "vitest";
import { runSearchProviders } from "./command-palette-search";

function jsonResponse(body: unknown) {
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve(body),
  } as Response);
}

describe("runSearchProviders", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn((input: string | URL | Request) => {
        const url = String(input);
        if (url.startsWith("/api/opportunities")) {
          return jsonResponse({
            items: [
              {
                id: "job-1",
                title: "React Engineer",
                company: "Acme",
                status: "saved",
              },
            ],
          });
        }
        if (url.startsWith("/api/bank")) {
          return jsonResponse({
            items: [
              {
                id: "bank-1",
                content: "Built React dashboards",
                category: "experience",
              },
            ],
          });
        }
        if (url.startsWith("/api/answer-bank")) {
          return jsonResponse({
            items: [
              {
                id: "answer-1",
                question: "Tell me about React",
                answer: "I built production React apps.",
                source: "manual",
              },
            ],
          });
        }
        if (url.startsWith("/api/email/drafts")) {
          return jsonResponse({
            items: [
              {
                id: "draft-1",
                subject: "React follow-up",
                body: "Thanks again",
                type: "follow-up",
              },
            ],
          });
        }
        if (url.startsWith("/api/templates")) {
          return jsonResponse({
            templates: [
              {
                id: "template-1",
                name: "React outreach",
                description: "Template",
                type: "custom",
              },
            ],
          });
        }
        return jsonResponse({});
      }),
    );
  });

  it("returns empty results for short queries", async () => {
    const signal = new AbortController().signal;
    await expect(runSearchProviders("r", signal)).resolves.toEqual([]);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("fans out to supported providers with limit params", async () => {
    const signal = new AbortController().signal;
    const groups = await runSearchProviders("react", signal);

    expect(fetch).toHaveBeenCalledTimes(5);
    expect(vi.mocked(fetch).mock.calls.map(([url]) => url)).toEqual([
      "/api/opportunities?limit=10",
      "/api/bank?q=react&limit=10",
      "/api/answer-bank?limit=10",
      "/api/email/drafts?limit=10",
      "/api/templates",
    ]);
    for (const [, init] of vi.mocked(fetch).mock.calls) {
      expect(init).toMatchObject({ signal });
    }
    expect(groups.map((group) => group.label)).toEqual([
      "Opportunities",
      "Bank",
      "Answer Bank",
      "Emails",
    ]);
  });

  it("maps API records into command items", async () => {
    const signal = new AbortController().signal;
    const groups = await runSearchProviders("react", signal);
    const items = groups.flatMap((group) => group.items);

    expect(items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "opportunity-job-1",
          label: "React Engineer",
          description: "Acme",
          href: "/opportunities?highlight=job-1",
          category: "opportunities",
        }),
        expect.objectContaining({
          id: "bank-bank-1",
          label: "Built React dashboards",
          category: "bank",
        }),
      ]),
    );
  });

  it("keeps fulfilled providers when one fetch rejects", async () => {
    vi.mocked(fetch).mockImplementation((input: string | URL | Request) => {
      const url = String(input);
      if (url.startsWith("/api/bank")) {
        return Promise.reject(new Error("nope"));
      }
      return jsonResponse({ items: [] });
    });

    const signal = new AbortController().signal;
    await expect(runSearchProviders("settings", signal)).resolves.toEqual([
      expect.objectContaining({ id: "settings" }),
    ]);
  });
});
