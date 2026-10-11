import { describe, expect, it } from "vitest";
import { updateSettingsSchema } from "./llm";

describe("updateSettingsSchema", () => {
  it("accepts kanban lane visibility updates", () => {
    expect(
      updateSettingsSchema.parse({
        kanbanVisibleLanes: ["pending", "closed"],
      }),
    ).toEqual({
      kanbanVisibleLanes: ["pending", "closed"],
    });
  });

  it("accepts digest enabled updates", () => {
    expect(
      updateSettingsSchema.parse({
        digest: { enabled: false },
      }),
    ).toEqual({
      digest: { enabled: false },
    });
  });

  it("accepts Gmail auto-status updates", () => {
    expect(
      updateSettingsSchema.parse({
        gmailAutoStatus: { enabled: false },
      }),
    ).toEqual({
      gmailAutoStatus: { enabled: false },
    });
  });

  it("rejects malformed Gmail auto-status updates", () => {
    expect(() =>
      updateSettingsSchema.parse({ gmailAutoStatus: { enabled: "yes" } }),
    ).toThrow();
  });

  it("rejects empty lane visibility updates", () => {
    expect(() =>
      updateSettingsSchema.parse({ kanbanVisibleLanes: [] }),
    ).toThrow();
  });
});
