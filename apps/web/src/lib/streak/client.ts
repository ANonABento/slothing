import type { AchievementUnlock } from "./types";

export function extractUnlockedFromResponse(json: unknown): AchievementUnlock[] {
  if (
    json &&
    typeof json === "object" &&
    Array.isArray((json as { unlocked?: unknown }).unlocked)
  ) {
    return (json as { unlocked: AchievementUnlock[] }).unlocked;
  }

  return [];
}
