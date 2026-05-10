import { getSetting, setSetting } from "@/lib/db/queries";
import {
  KANBAN_LANE_IDS,
  normalizeKanbanVisibleLanes,
  type KanbanLaneId,
} from "@/types/opportunity";

export const KANBAN_VISIBLE_LANES_SETTING_KEY = "kanban_visible_lanes";

export function parseKanbanVisibleLanes(value: string | null): KanbanLaneId[] {
  return normalizeKanbanVisibleLanes(value);
}

export function getKanbanVisibleLanes(
  userId: string = "default",
): KanbanLaneId[] {
  return parseKanbanVisibleLanes(
    getSetting(KANBAN_VISIBLE_LANES_SETTING_KEY, userId),
  );
}

export function setKanbanVisibleLanes(
  lanes: readonly KanbanLaneId[],
  userId: string = "default",
): void {
  const normalized = normalizeKanbanVisibleLanes(lanes);
  const ordered = KANBAN_LANE_IDS.filter((lane) => normalized.includes(lane));
  setSetting(KANBAN_VISIBLE_LANES_SETTING_KEY, JSON.stringify(ordered), userId);
}
