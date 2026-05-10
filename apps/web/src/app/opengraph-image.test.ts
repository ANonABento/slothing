import { describe, expect, it, vi } from "vitest";
import { OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og/config";

vi.mock("next/og", () => ({
  ImageResponse: vi.fn(function ImageResponse(element, options) {
    return { element, options };
  }),
}));

const OG_ROUTES = [
  () => import("./opengraph-image"),
  () => import("./[locale]/(marketing)/opengraph-image"),
  () => import("./[locale]/(marketing)/ats-scanner/opengraph-image"),
  () => import("./[locale]/(app)/dashboard/opengraph-image"),
  () => import("./[locale]/(app)/studio/opengraph-image"),
  () => import("./[locale]/(app)/opportunities/opengraph-image"),
  () => import("./[locale]/(app)/opportunities/[id]/opengraph-image"),
  () => import("./[locale]/(app)/bank/opengraph-image"),
  () => import("./[locale]/(app)/analytics/opengraph-image"),
  () => import("./[locale]/(app)/calendar/opengraph-image"),
  () => import("./[locale]/(app)/profile/opengraph-image"),
  () => import("./[locale]/(app)/settings/opengraph-image"),
  () => import("./[locale]/privacy/opengraph-image"),
  () => import("./[locale]/terms/opengraph-image"),
];

describe("Open Graph image route modules", () => {
  it.each(OG_ROUTES)("exports the Next image route contract", async (load) => {
    const mod = await load();

    expect(mod.size).toEqual(OG_SIZE);
    expect(mod.contentType).toBe(OG_CONTENT_TYPE);
    expect(typeof mod.default).toBe("function");
  });
});
