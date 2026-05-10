// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  sendMessage: vi.fn(),
}));

vi.mock("@/shared/messages", () => ({
  Messages: {
    captureVisibleTab: () => ({ type: "CAPTURE_VISIBLE_TAB" }),
  },
  sendMessage: mocks.sendMessage,
}));

import { buildPageSnapshot } from "./page-snapshot";

describe("buildPageSnapshot", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = "";
    document.title = "";
    window.history.pushState({}, "", "/jobs/platform-engineer");
  });

  it("captures URL, title, headline, host, and submission timestamp", async () => {
    document.title = "Platform Engineer - Acme";
    document.body.innerHTML = "<h1> Platform Engineer </h1>";

    const snapshot = await buildPageSnapshot({ captureScreenshot: false });

    expect(snapshot).toMatchObject({
      url: "http://localhost:3000/jobs/platform-engineer",
      host: "localhost",
      title: "Platform Engineer - Acme",
      headline: "Platform Engineer",
    });
    expect(new Date(snapshot.submittedAt).toString()).not.toBe("Invalid Date");
  });

  it("skips screenshot capture when disabled", async () => {
    await buildPageSnapshot({ captureScreenshot: false });

    expect(mocks.sendMessage).not.toHaveBeenCalled();
  });

  it("requests a thumbnail when screenshot capture is enabled", async () => {
    mocks.sendMessage.mockResolvedValueOnce({
      success: true,
      data: { dataUrl: "data:image/jpeg;base64,abc" },
    });

    const snapshot = await buildPageSnapshot({ captureScreenshot: true });

    expect(snapshot.thumbnailDataUrl).toBe("data:image/jpeg;base64,abc");
  });
});
