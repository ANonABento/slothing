import { describe, expect, it } from "vitest";
import type { ApprovedDraftPayload } from "@/shared/types";
import {
  findMatchingDraft,
  jobUrlsMatch,
  normalizeJobUrl,
} from "./draft-match";

function draft(id: string, url: string | null): ApprovedDraftPayload {
  return {
    id,
    jobId: `job-${id}`,
    status: "approved",
    questions: [],
    answers: [],
    job: url === null ? null : { title: "T", company: "C", url },
  };
}

describe("normalizeJobUrl", () => {
  it("strips query, hash, www, and trailing slash", () => {
    expect(
      normalizeJobUrl(
        "https://www.boards.greenhouse.io/acme/jobs/123/?gh_src=x#app",
      ),
    ).toBe("boards.greenhouse.io/acme/jobs/123");
  });

  it("strips a trailing /apply segment", () => {
    expect(normalizeJobUrl("https://jobs.lever.co/acme/uuid/apply")).toBe(
      "jobs.lever.co/acme/uuid",
    );
  });

  it("returns null for non-urls", () => {
    expect(normalizeJobUrl("not a url")).toBeNull();
  });
});

describe("jobUrlsMatch", () => {
  it("matches identical postings with cosmetic drift", () => {
    expect(
      jobUrlsMatch(
        "https://boards.greenhouse.io/acme/jobs/123?gh_src=abc",
        "https://boards.greenhouse.io/acme/jobs/123",
      ),
    ).toBe(true);
  });

  it("matches a listing url against its /apply route", () => {
    expect(
      jobUrlsMatch(
        "https://jobs.lever.co/acme/uuid/apply",
        "https://jobs.lever.co/acme/uuid",
      ),
    ).toBe(true);
  });

  it("does not match different postings", () => {
    expect(
      jobUrlsMatch(
        "https://boards.greenhouse.io/acme/jobs/123",
        "https://boards.greenhouse.io/acme/jobs/999",
      ),
    ).toBe(false);
  });

  it("does not treat a partial path segment as a match", () => {
    expect(
      jobUrlsMatch(
        "https://jobs.lever.co/acme/uuid-extra",
        "https://jobs.lever.co/acme/uuid",
      ),
    ).toBe(false);
  });
});

describe("findMatchingDraft", () => {
  const current = "https://boards.greenhouse.io/acme/jobs/123";

  it("returns the single matching draft", () => {
    const drafts = [
      draft("a", "https://boards.greenhouse.io/acme/jobs/123"),
      draft("b", "https://jobs.lever.co/other/uuid"),
    ];
    expect(findMatchingDraft(current, drafts)?.id).toBe("a");
  });

  it("returns null when nothing matches", () => {
    expect(
      findMatchingDraft(current, [draft("b", "https://jobs.lever.co/x/y")]),
    ).toBeNull();
  });

  it("returns null when the match is ambiguous", () => {
    const drafts = [
      draft("a", "https://boards.greenhouse.io/acme/jobs/123"),
      draft("b", "https://boards.greenhouse.io/acme/jobs/123?gh_src=2"),
    ];
    expect(findMatchingDraft(current, drafts)).toBeNull();
  });

  it("ignores drafts with no job url", () => {
    expect(findMatchingDraft(current, [draft("a", null)])).toBeNull();
  });
});
