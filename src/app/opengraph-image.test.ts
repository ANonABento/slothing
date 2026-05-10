import { describe, expect, it, vi } from "vitest";
import { OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og/config";

vi.mock("next/og", () => ({
  ImageResponse: vi.fn(function ImageResponse(element, options) {
    return { element, options };
  }),
}));

const OG_ROUTES = [
  () => import("./opengraph-image"),
  () => import("./(marketing)/opengraph-image"),
  () => import("./(marketing)/ats-scanner/opengraph-image"),
  () => import("./(app)/dashboard/opengraph-image"),
  () => import("./(app)/studio/opengraph-image"),
  () => import("./(app)/opportunities/opengraph-image"),
  () => import("./(app)/opportunities/[id]/opengraph-image"),
  () => import("./(app)/bank/opengraph-image"),
  () => import("./(app)/analytics/opengraph-image"),
  () => import("./(app)/calendar/opengraph-image"),
  () => import("./(app)/profile/opengraph-image"),
  () => import("./(app)/settings/opengraph-image"),
  () => import("./privacy/opengraph-image"),
  () => import("./terms/opengraph-image"),
];

describe("Open Graph image route modules", () => {
  it.each(OG_ROUTES)("exports the Next image route contract", async (load) => {
    const mod = await load();

    expect(mod.size).toEqual(OG_SIZE);
    expect(mod.contentType).toBe(OG_CONTENT_TYPE);
    expect(typeof mod.default).toBe("function");
  });
});
