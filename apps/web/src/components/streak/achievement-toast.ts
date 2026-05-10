import type { AchievementUnlock } from "@/lib/streak/types";

interface AddToast {
  (
    toast: {
      type: "success" | "error" | "warning" | "info";
      title: string;
      description?: string;
    },
    durationMs?: number,
  ): string;
}

export function showAchievementToasts(
  unlocked: AchievementUnlock[],
  addToast: AddToast,
): void {
  for (const achievement of unlocked) {
    addToast({
      type: "success",
      title: `${achievement.emoji} ${achievement.title}`,
      description: achievement.description,
    });
  }
}
