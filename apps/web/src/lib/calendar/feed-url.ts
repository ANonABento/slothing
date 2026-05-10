import { createCalendarFeedToken } from "@/lib/calendar/feed-token";

export type EventType = "interviews" | "deadlines" | "reminders" | "all";

export function getCalendarFeedUrl(
  baseUrl: string,
  userId: string,
  type: EventType = "all"
): string {
  const url = new URL("/api/calendar/feed", baseUrl);
  url.searchParams.set("token", createCalendarFeedToken(userId));
  url.searchParams.set("type", type);
  return url.toString();
}

export function getWebcalUrl(baseUrl: string, userId: string, type: EventType = "all"): string {
  const httpUrl = getCalendarFeedUrl(baseUrl, userId, type);
  return httpUrl.replace(/^https?:\/\//, "webcal://");
}
