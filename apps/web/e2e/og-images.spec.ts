import { expect, test } from "@playwright/test";

const EN_ROUTES = [
  "/en/opengraph-image",
  "/en/dashboard/opengraph-image",
  "/en/profile/opengraph-image",
  "/en/studio/opengraph-image",
  "/en/bank/opengraph-image",
  "/en/answer-bank/opengraph-image",
  "/en/calendar/opengraph-image",
  "/en/emails/opengraph-image",
  "/en/interview/opengraph-image",
  "/en/salary/opengraph-image",
  "/en/analytics/opengraph-image",
  "/en/settings/opengraph-image",
  "/en/opportunities/opengraph-image",
  "/en/opportunities/review/opengraph-image",
] as const;

const NON_EN_SAMPLES = [
  "/es/dashboard/opengraph-image",
  "/zh-CN/dashboard/opengraph-image",
  "/pt-BR/dashboard/opengraph-image",
] as const;

const INFRASTRUCTURE_FILES: Array<{ path: string; type: RegExp }> = [
  { path: "/robots.txt", type: /^text\/plain/ },
  { path: "/sitemap.xml", type: /^(application|text)\/xml/ },
  { path: "/manifest.webmanifest", type: /(manifest\+json|application\/json)/ },
  { path: "/favicon.ico", type: /image\/(x-icon|vnd\.microsoft\.icon)/ },
];

test.describe("OG image endpoints @smoke", () => {
  for (const url of [...EN_ROUTES, ...NON_EN_SAMPLES]) {
    test(`OG image ${url} returns image/png`, async ({ request }) => {
      const res = await request.get(url);

      expect(res.status()).toBe(200);
      expect(res.headers()["content-type"]).toContain("image/png");
    });
  }
});

test.describe("Static infrastructure files @smoke", () => {
  for (const file of INFRASTRUCTURE_FILES) {
    test(`${file.path} returns 200`, async ({ request }) => {
      const res = await request.get(file.path);

      expect(res.status()).toBe(200);
      expect(res.headers()["content-type"]).toMatch(file.type);
    });
  }
});
