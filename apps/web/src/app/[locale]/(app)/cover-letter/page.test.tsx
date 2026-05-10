import { describe, expect, it, vi } from "vitest";
import CoverLetterRedirectPage from "./page";

const redirectMock = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

describe("CoverLetterRedirectPage", () => {
  it("redirects to Document Studio", () => {
    CoverLetterRedirectPage({ params: { locale: "en" } });

    expect(redirectMock).toHaveBeenCalledWith("/en/studio");
  });

  it("preserves extension query params for Studio loading", () => {
    CoverLetterRedirectPage({
      params: { locale: "en" },
      searchParams: { from: "extension", id: "cl-1" },
    });

    expect(redirectMock).toHaveBeenCalledWith(
      "/en/studio?from=extension&coverLetterId=cl-1",
    );
  });
});
