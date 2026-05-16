import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

const mocks = vi.hoisted(() => ({
  getShareByToken: vi.fn(),
  incrementViewCount: vi.fn(),
}));

vi.mock("@/lib/db/shared-resumes", () => ({
  getShareByToken: mocks.getShareByToken,
  incrementViewCount: mocks.incrementViewCount,
}));

import SharedResumePage, { generateMetadata } from "./page";

describe("SharedResumePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the snapshotted HTML when the share exists", () => {
    mocks.getShareByToken.mockReturnValue({
      id: "tok-1",
      userId: "user-1",
      documentHtml:
        "<h1>Jane Doe</h1><p data-testid='resume-body'>Senior engineer</p>",
      documentTitle: "Senior Engineer Resume",
      createdAt: Date.UTC(2026, 0, 1),
      expiresAt: Date.UTC(2026, 0, 8),
      viewCount: 2,
    });

    render(SharedResumePage({ params: { token: "tok-1" } }));

    expect(
      screen.getByRole("heading", { name: "Senior Engineer Resume" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Senior engineer")).toBeInTheDocument();
    expect(screen.getByText(/Shared from Slothing/i)).toBeInTheDocument();
    expect(screen.getByTestId("shared-resume-snapshot")).toBeInTheDocument();
    expect(mocks.incrementViewCount).toHaveBeenCalledWith("tok-1");
  });

  it("renders an expired state when the share is missing or expired", () => {
    mocks.getShareByToken.mockReturnValue(null);

    render(SharedResumePage({ params: { token: "missing" } }));

    expect(
      screen.getByRole("heading", { name: /this share link has expired/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/View-only share links expire/i),
    ).toBeInTheDocument();
    expect(mocks.incrementViewCount).not.toHaveBeenCalled();
  });

  it("still renders content if the view-count increment throws", () => {
    mocks.getShareByToken.mockReturnValue({
      id: "tok-1",
      userId: "user-1",
      documentHtml: "<p>Content survives</p>",
      documentTitle: "Resume",
      createdAt: Date.UTC(2026, 0, 1),
      expiresAt: Date.UTC(2026, 0, 8),
      viewCount: 0,
    });
    mocks.incrementViewCount.mockImplementation(() => {
      throw new Error("db down");
    });

    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    render(SharedResumePage({ params: { token: "tok-1" } }));
    expect(screen.getByText("Content survives")).toBeInTheDocument();

    warn.mockRestore();
  });

  it("emits noindex metadata so snapshots don't get crawled", () => {
    const metadata = generateMetadata({ params: { token: "tok-1" } });
    expect(metadata.robots).toEqual({ index: false, follow: false });
    expect(metadata.title).toMatch(/Slothing/);
  });
});
