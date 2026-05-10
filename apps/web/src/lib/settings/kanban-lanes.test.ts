import { beforeEach, describe, expect, it, vi } from "vitest";
import { getSetting, setSetting } from "@/lib/db/queries";
import {
  KANBAN_VISIBLE_LANES_SETTING_KEY,
  getKanbanVisibleLanes,
  parseKanbanVisibleLanes,
  setKanbanVisibleLanes,
} from "./kanban-lanes";

vi.mock("@/lib/db/queries", () => ({
  getSetting: vi.fn(),
  setSetting: vi.fn(),
}));

describe("kanban lane settings", () => {
  beforeEach(() => {
    vi.mocked(getSetting).mockReset();
    vi.mocked(setSetting).mockReset();
  });

  it("parses defaults and invalid JSON defensively", () => {
    expect(parseKanbanVisibleLanes(null)).toEqual([
      "pending",
      "saved",
      "applied",
      "interviewing",
      "offer",
      "closed",
    ]);
    expect(parseKanbanVisibleLanes("not json")).toEqual([
      "pending",
      "saved",
      "applied",
      "interviewing",
      "offer",
      "closed",
    ]);
  });

  it("filters unknown lanes and preserves pipeline order", () => {
    expect(parseKanbanVisibleLanes('["closed","saved","unknown"]')).toEqual([
      "saved",
      "closed",
    ]);
  });

  it("reads and writes through the settings table", () => {
    vi.mocked(getSetting).mockReturnValue('["offer","pending"]');

    expect(getKanbanVisibleLanes("user-1")).toEqual(["pending", "offer"]);
    expect(getSetting).toHaveBeenCalledWith(
      KANBAN_VISIBLE_LANES_SETTING_KEY,
      "user-1",
    );

    setKanbanVisibleLanes(["closed", "saved"], "user-1");
    expect(setSetting).toHaveBeenCalledWith(
      KANBAN_VISIBLE_LANES_SETTING_KEY,
      JSON.stringify(["saved", "closed"]),
      "user-1",
    );
  });
});
