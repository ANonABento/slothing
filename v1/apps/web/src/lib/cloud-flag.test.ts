import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { isCloudBuild } from "./cloud-flag";

describe("isCloudBuild", () => {
  const ORIGINAL = process.env.SLOTHING_CLOUD;

  beforeEach(() => {
    delete process.env.SLOTHING_CLOUD;
  });

  afterEach(() => {
    if (ORIGINAL === undefined) {
      delete process.env.SLOTHING_CLOUD;
    } else {
      process.env.SLOTHING_CLOUD = ORIGINAL;
    }
  });

  it("returns false when SLOTHING_CLOUD is unset", () => {
    expect(isCloudBuild()).toBe(false);
  });

  it("returns false when SLOTHING_CLOUD is '0'", () => {
    process.env.SLOTHING_CLOUD = "0";
    expect(isCloudBuild()).toBe(false);
  });

  it("returns true when SLOTHING_CLOUD is exactly '1'", () => {
    process.env.SLOTHING_CLOUD = "1";
    expect(isCloudBuild()).toBe(true);
  });

  it("returns false for non-'1' truthy strings (strict opt-in)", () => {
    process.env.SLOTHING_CLOUD = "true";
    expect(isCloudBuild()).toBe(false);
  });
});
