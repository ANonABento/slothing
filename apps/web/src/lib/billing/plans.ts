import { isCloudBuild } from "@/lib/cloud-flag";
import { getActiveUserSubscription } from "@/lib/db/subscriptions";

export type UserPlan =
  | "self-host"
  | "hosted-free"
  | "pro-weekly"
  | "pro-monthly";

export async function getUserPlan(userId: string): Promise<UserPlan> {
  if (!isCloudBuild()) return "self-host";

  const subscription = await getActiveUserSubscription(userId);
  if (subscription?.planKey === "pro_weekly") return "pro-weekly";
  if (subscription?.planKey === "pro_monthly") return "pro-monthly";
  return "hosted-free";
}
