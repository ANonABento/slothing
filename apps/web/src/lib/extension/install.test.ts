import { describe, expect, it } from "vitest";
import {
  detectBrowserFromUserAgent,
  getExtensionStoresForBrowser,
} from "./install";

describe("detectBrowserFromUserAgent", () => {
  it.each([
    [
      "chrome",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    ],
    [
      "edge",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0",
    ],
    [
      "firefox",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:124.0) Gecko/20100101 Firefox/124.0",
    ],
    [
      "safari",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
    ],
    ["unknown", "curl/8.0"],
  ] as const)("detects %s", (browser, userAgent) => {
    expect(detectBrowserFromUserAgent(userAgent)).toBe(browser);
  });
});

describe("getExtensionStoresForBrowser", () => {
  it("orders the detected browser first", () => {
    expect(getExtensionStoresForBrowser("firefox")[0]?.key).toBe("firefox");
  });

  it("keeps Safari disabled", () => {
    const [safari] = getExtensionStoresForBrowser("safari");

    expect(safari?.key).toBe("safari");
    expect(safari?.disabled).toBe(true);
    expect(safari?.url).toBeNull();
  });
});
