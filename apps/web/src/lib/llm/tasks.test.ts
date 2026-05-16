import { describe, expect, it } from "vitest";
import { TaskRegistry } from "@anonabento/bento-router";
import {
  SLOTHING_MODEL_PROFILES,
  SLOTHING_TASK_IDS,
  registerSlothingTasks,
} from "./tasks";

describe("Slothing BentoRouter tasks", () => {
  it("registers the expected task surface", () => {
    const registry = new TaskRegistry();

    registerSlothingTasks(registry);

    expect(registry.list().map((task) => task.id)).toEqual([
      ...SLOTHING_TASK_IDS,
    ]);
  });

  it("has model profiles for every default policy model", () => {
    const registry = new TaskRegistry();
    registerSlothingTasks(registry);
    const modelIds = new Set(SLOTHING_MODEL_PROFILES.map((model) => model.id));

    for (const task of registry.list()) {
      expect(modelIds.has(task.defaultPolicy.primaryModel)).toBe(true);
      for (const fallback of task.defaultPolicy.fallbacks ?? []) {
        expect(modelIds.has(fallback)).toBe(true);
      }
    }
  });
});
