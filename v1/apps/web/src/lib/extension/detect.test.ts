import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  EXTENSION_CONNECTED_STORAGE_KEY,
  hasExtensionConnectionToken,
  isExtensionInstalled,
} from "./detect";

function setChromeRuntime(sendMessage?: unknown) {
  Object.defineProperty(globalThis, "chrome", {
    configurable: true,
    value: sendMessage ? { runtime: { sendMessage } } : { runtime: undefined },
  });
}

describe("extension detection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
    setChromeRuntime(undefined);
    vi.mocked(localStorage.getItem).mockReset();
  });

  it("detects a stored connection token", () => {
    vi.mocked(localStorage.getItem).mockReturnValue("token");

    expect(hasExtensionConnectionToken(localStorage)).toBe(true);
    expect(localStorage.getItem).toHaveBeenCalledWith(
      EXTENSION_CONNECTED_STORAGE_KEY,
    );
  });

  it("returns false when storage throws", () => {
    const storage = {
      getItem: () => {
        throw new Error("blocked");
      },
    } as unknown as Storage;

    expect(hasExtensionConnectionToken(storage)).toBe(false);
  });

  it("returns true immediately when localStorage has a token", async () => {
    vi.mocked(localStorage.getItem).mockReturnValue("token");

    await expect(isExtensionInstalled()).resolves.toBe(true);
  });

  it("returns false without an extension runtime", async () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null);

    await expect(isExtensionInstalled()).resolves.toBe(false);
  });
});
