import type { MetadataRoute } from "next";
import { locales } from "@/i18n";
import { nowDate } from "@/lib/format/time";
import { getMetadataBase } from "@/lib/seo";

const PUBLIC_ROUTES = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/ats-scanner", priority: 0.8, changeFrequency: "weekly" },
  { path: "/sign-in", priority: 0.5, changeFrequency: "weekly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "monthly" },
  { path: "/terms", priority: 0.3, changeFrequency: "monthly" },
] as const satisfies ReadonlyArray<{
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}>;

function absoluteUrl(path: string) {
  return new URL(path, getMetadataBase()).toString();
}

function localePath(locale: string, path: string) {
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = nowDate();
  const entries = PUBLIC_ROUTES.flatMap((route) =>
    locales.map((locale) => ({
      url: absoluteUrl(localePath(locale, route.path)),
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
  );

  return [
    {
      url: absoluteUrl("/"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...entries,
  ];
}
