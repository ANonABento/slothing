import { describe, expect, it } from "vitest";
import { parseDeviceName } from "./device-name";

describe("parseDeviceName", () => {
  it.each([
    [
      "Chrome 121 on macOS",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    ],
    [
      "Edge 122 on Windows",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0",
    ],
    [
      "Firefox 128 on Linux",
      "Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0",
    ],
    [
      "Safari 17 on iOS",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1",
    ],
    [
      "Chrome 120 on Android",
      "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
    ],
    ["Unknown browser on Unknown OS", "not a real user agent"],
  ])("returns %s", (expected, userAgent) => {
    expect(parseDeviceName(userAgent)).toBe(expected);
  });
});
