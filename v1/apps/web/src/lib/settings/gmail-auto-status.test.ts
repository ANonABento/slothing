import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db/queries", () => ({
  getSetting: vi.fn(),
  setSetting: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  getDb: vi.fn(),
}));

import { getSetting, setSetting } from "@/lib/db/queries";
import {
  getGmailAutoStatusEnabled,
  parseGmailAutoStatusEnabled,
  setGmailAutoStatusEnabled,
} from "./gmail-auto-status";

describe("gmail auto-status settings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("defaults to off", () => {
    expect(parseGmailAutoStatusEnabled(null)).toBe(false);
  });

  it("parses persisted true and false values", () => {
    expect(parseGmailAutoStatusEnabled("true")).toBe(true);
    expect(parseGmailAutoStatusEnabled("false")).toBe(false);
  });

  it("reads and writes per user", () => {
    vi.mocked(getSetting).mockReturnValue("true");
    expect(getGmailAutoStatusEnabled("user-1")).toBe(true);
    expect(getSetting).toHaveBeenCalledWith(
      "gmail_auto_status_enabled",
      "user-1",
    );

    setGmailAutoStatusEnabled(false, "user-2");
    expect(setSetting).toHaveBeenCalledWith(
      "gmail_auto_status_enabled",
      "false",
      "user-2",
    );
  });
});
