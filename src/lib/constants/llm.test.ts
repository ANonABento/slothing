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

  it("rejects empty lane visibility updates", () => {
    expect(() =>
      updateSettingsSchema.parse({ kanbanVisibleLanes: [] }),
    ).toThrow();
  });
});
