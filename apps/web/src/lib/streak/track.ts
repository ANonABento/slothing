import { trackActivity } from "@/lib/db/streak";
import type { ActivityType, TrackActivityResult } from "./types";

export async function safeTrackActivity(
  userId: string,
  type: ActivityType,
): Promise<TrackActivityResult> {
  try {
    return await trackActivity(userId, type);
  } catch (error) {
    console.error("[streak] Failed to track activity:", error);
    return { unlocked: [] };
  }
}
