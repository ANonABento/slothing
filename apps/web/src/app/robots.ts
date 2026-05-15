import type { MetadataRoute } from "next";
import { getMetadataBase } from "@/lib/seo";

const PRIVATE_ROUTE_PREFIXES = [
  "/api/",
  "/dashboard/",
  "/profile/",
  "/settings/",
  "/studio/",
  "/bank/",
  "/answer-bank/",
  "/opportunities/",
  "/calendar/",
  "/emails/",
  "/analytics/",
  "/salary/",
  "/interview/",
  "/extension/connect/",
  "/jobs/",
  "/sign-in",
  "/sign-up/",
  "/forgot-password/",
] as const;

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getMetadataBase().toString().replace(/\/$/, "");
  const disallow = PRIVATE_ROUTE_PREFIXES.flatMap((prefix) => [
    prefix,
    `/*${prefix}`,
  ]);

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
