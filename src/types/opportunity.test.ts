import { describe, expect, it } from "vitest";
import {
  DEFAULT_KANBAN_VISIBLE_LANES,
  KANBAN_LANE_GROUPS,
  inferLaneFromStatus,
  isClosedSubStatus,
  kanbanVisibleLanesSchema,
  normalizeKanbanVisibleLanes,
} from "./opportunity";

describe("kanban lane helpers", () => {
  it("maps underlying statuses to display lanes", () => {
    expect(KANBAN_LANE_GROUPS.closed).toEqual([
      "rejected",
      "expired",
      "dismissed",
    ]);
    expect(inferLaneFromStatus("saved")).toBe("saved");
    expect(inferLaneFromStatus("rejected")).toBe("closed");
    expect(inferLaneFromStatus("expired")).toBe("closed");
    expect(inferLaneFromStatus("dismissed")).toBe("closed");
  });

  it("detects closed substates", () => {
    expect(isClosedSubStatus("rejected")).toBe(true);
    expect(isClosedSubStatus("expired")).toBe(true);
    expect(isClosedSubStatus("dismissed")).toBe(true);
    expect(isClosedSubStatus("offer")).toBe(false);
  });

  it("normalizes lane visibility from unknown input", () => {
    expect(normalizeKanbanVisibleLanes(null)).toEqual(
      DEFAULT_KANBAN_VISIBLE_LANES,
    );
    expect(normalizeKanbanVisibleLanes("[\"offer\",\"pending\"]")).toEqual([
      "pending",
      "offer",
    ]);
    expect(normalizeKanbanVisibleLanes(["saved", "unknown"])).toEqual([
      "saved",
    ]);
    expect(normalizeKanbanVisibleLanes(["unknown"])).toEqual(
      DEFAULT_KANBAN_VISIBLE_LANES,
    );
  });

  it("validates persisted lane arrays", () => {
    expect(kanbanVisibleLanesSchema.parse(["saved", "closed"])).toEqual([
      "saved",
      "closed",
    ]);
    expect(() => kanbanVisibleLanesSchema.parse([])).toThrow();
    expect(() => kanbanVisibleLanesSchema.parse(["rejected"])).toThrow();
  });
});
