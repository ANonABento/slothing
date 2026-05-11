import { describe, expect, it, vi } from "vitest";

const redirectMock = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

import ApplicationsCompatibilityPage from "./page";

describe("ApplicationsCompatibilityPage", () => {
  it("redirects applications to active opportunity statuses", () => {
    ApplicationsCompatibilityPage({ params: { locale: "en" } });

    expect(redirectMock.mock.calls).toMatchInlineSnapshot(`
      [
        [
          "/en/opportunities?status=applied%2Cinterviewing%2Coffered",
        ],
      ]
    `);
  });

  it("preserves an explicit status query", () => {
    ApplicationsCompatibilityPage({
      params: { locale: "en" },
      searchParams: { status: "applied" },
    });

    expect(redirectMock).toHaveBeenCalledWith(
      "/en/opportunities?status=applied",
    );
  });
});
