import { describe, expect, it, vi } from "vitest";
import TailorRedirectPage from "./page";

const redirectMock = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

describe("TailorRedirectPage", () => {
  it("redirects to Document Studio", () => {
    TailorRedirectPage({ params: { locale: "en" } });

    expect(redirectMock).toHaveBeenCalledWith("/en/studio");
  });

  it("preserves extension tailor params for Studio loading", () => {
    TailorRedirectPage({
      params: { locale: "en" },
      searchParams: { from: "extension", tailorId: "resume-1" },
    });

    expect(redirectMock).toHaveBeenCalledWith(
      "/en/studio?from=extension&tailorId=resume-1",
    );
  });
});
