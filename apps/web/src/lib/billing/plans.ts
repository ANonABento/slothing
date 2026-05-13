import { isCloudBuild } from "@/lib/cloud-flag";
import { getActiveUserSubscription } from "@/lib/db/subscriptions";

export type UserPlan =
  | "self-host"
  | "hosted-free"
  | "pro-weekly"
  | "pro-monthly";

export function getUserPlan(userId: string): UserPlan {
  if (!isCloudBuild()) return "self-host";

  const subscription = getActiveUserSubscription(userId);
  if (subscription?.planKey === "pro_weekly") return "pro-weekly";
  if (subscription?.planKey === "pro_monthly") return "pro-monthly";
  return "hosted-free";
}
