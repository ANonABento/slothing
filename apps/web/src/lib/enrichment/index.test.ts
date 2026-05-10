import { beforeEach, describe, expect, it, vi } from "vitest";
import { enrichCompany } from "./index";

const mocks = vi.hoisted(() => ({
  fetchGithubOrg: vi.fn(),
  fetchNews: vi.fn(),
  fetchLevels: vi.fn(),
  fetchEngBlog: vi.fn(),
  fetchHnMentions: vi.fn(),
  saveCompanyEnrichment: vi.fn(),
}));

vi.mock("./github", () => ({ fetchGithubOrg: mocks.fetchGithubOrg }));
vi.mock("./news", () => ({ fetchNews: mocks.fetchNews }));
vi.mock("./levels", () => ({ fetchLevels: mocks.fetchLevels }));
vi.mock("./blog", () => ({ fetchEngBlog: mocks.fetchEngBlog }));
vi.mock("./hn", () => ({ fetchHnMentions: mocks.fetchHnMentions }));
vi.mock("@/lib/db/company-research", () => ({
  saveCompanyEnrichment: mocks.saveCompanyEnrichment,
}));

describe("enrichCompany", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.fetchGithubOrg.mockResolvedValue({ ok: true, data: { org: "acme" } });
    mocks.fetchNews.mockResolvedValue({ ok: true, data: { headlines: [] } });
    mocks.fetchLevels.mockResolvedValue({ ok: false, error: "not_found" });
    mocks.fetchEngBlog.mockResolvedValue({ ok: false, error: "not_found" });
    mocks.fetchHnMentions.mockResolvedValue({
      ok: true,
      data: { stories: [] },
    });
  });

  it("settles all sources and persists one snapshot", async () => {
    mocks.fetchLevels.mockRejectedValueOnce(new Error("boom"));

    const snapshot = await enrichCompany({
      companyName: "Acme Inc",
      companyUrl: "https://acme.com/jobs",
      userId: "user-1",
    });

    expect(mocks.fetchGithubOrg).toHaveBeenCalledWith("acmeinc");
    expect(mocks.fetchEngBlog).toHaveBeenCalledWith("acme.com");
    expect(snapshot.version).toBe(1);
    expect(snapshot.levels).toEqual({ ok: false, error: "unknown" });
    expect(mocks.saveCompanyEnrichment).toHaveBeenCalledWith(
      "user-1",
      "Acme Inc",
      snapshot,
    );
  });
});
