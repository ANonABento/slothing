import { beforeEach, describe, expect, it, vi } from "vitest";
import BuilderRedirectPage from "./page";

const redirectMock = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

describe("BuilderRedirectPage", () => {
  beforeEach(() => {
    redirectMock.mockClear();
  });

  it("redirects to Document Studio", () => {
    BuilderRedirectPage({ params: { locale: "en" } });

    expect(redirectMock).toHaveBeenCalledWith("/en/studio");
  });

  it("ignores legacy builder mode params", () => {
    const redirectWithLegacyProps = BuilderRedirectPage as unknown as (props: {
      params: { locale: string };
      searchParams: { mode: string };
    }) => void;

    redirectWithLegacyProps({
      params: { locale: "en" },
      searchParams: { mode: "cover-letter" },
    });

    expect(redirectMock).toHaveBeenCalledWith("/en/studio");
  });
});
