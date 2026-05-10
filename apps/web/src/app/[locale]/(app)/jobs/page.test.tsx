import { describe, expect, it, vi } from "vitest";

const redirectMock = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

import JobsCompatibilityPage from "./page";

describe("JobsCompatibilityPage", () => {
  it("redirects the stale jobs route to opportunities", () => {
    JobsCompatibilityPage({ params: { locale: "en" } });

    expect(redirectMock).toHaveBeenCalledWith("/en/opportunities");
  });

  it("preserves highlight query compatibility", () => {
    JobsCompatibilityPage({
      params: { locale: "en" },
      searchParams: { highlight: "job 1" },
    });

    expect(redirectMock).toHaveBeenCalledWith(
      "/en/opportunities?highlight=job%201",
    );
  });
});
