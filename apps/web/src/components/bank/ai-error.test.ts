import { describe, it, expect } from "vitest";
import { aiErrorMessage } from "./ai-error";

describe("aiErrorMessage", () => {
  it("maps a known code to its friendly message", () => {
    expect(aiErrorMessage({ code: "not_found" })).toMatch(/private or the URL/);
    expect(aiErrorMessage({ code: "rate_limited" })).toMatch(/Rate limited/);
  });

  it("falls back to the server error string for unknown codes", () => {
    expect(
      aiErrorMessage({ code: "weird", error: "Specific server detail" }),
    ).toBe("Specific server detail");
  });

  it("uses the generic fallback when nothing usable is present", () => {
    expect(aiErrorMessage(null, "custom fallback")).toBe("custom fallback");
    expect(aiErrorMessage({})).toMatch(/Something went wrong/);
  });
});
