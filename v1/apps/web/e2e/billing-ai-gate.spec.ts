import { expect, test } from "@playwright/test";

const critiqueRequest = {
  letter: "Dear Acme, I built reliable systems for production users.",
  jd: "Acme needs an engineer to improve reliability and tooling.",
};

async function postCritique(page: import("@playwright/test").Page) {
  await page.goto("/en/pricing");
  return page.evaluate(async (body) => {
    const response = await fetch("/api/ai/critique-cover-letter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return {
      status: response.status,
      json: await response.json(),
    };
  }, critiqueRequest);
}

test.describe("hosted AI billing gate", () => {
  test("free hosted users without BYOK see a paywall response", async ({
    page,
  }) => {
    await page.route("**/api/ai/critique-cover-letter", async (route) => {
      await route.fulfill({
        status: 402,
        contentType: "application/json",
        body: JSON.stringify({
          code: "billing_required",
          error: "AI tools require your own API key or a Pro plan.",
        }),
      });
    });

    const response = await postCritique(page);

    expect(response.status).toBe(402);
    expect(response.json).toMatchObject({ code: "billing_required" });
  });

  test("BYOK users can run an AI action", async ({ page }) => {
    await page.route("**/api/ai/critique-cover-letter", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          critique: { overall: 7.5, scores: { fit: 8 } },
        }),
      });
    });

    const response = await postCritique(page);

    expect(response.status).toBe(200);
    expect(response.json).toMatchObject({ success: true });
  });

  test("Pro credit flow decrements on successful hosted AI use", async ({
    page,
  }) => {
    let credits = 250;
    await page.route("**/api/ai/critique-cover-letter", async (route) => {
      credits -= 3;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          critique: { overall: 7.5, scores: { fit: 8 } },
        }),
      });
    });

    const response = await postCritique(page);

    expect(response.status).toBe(200);
    expect(credits).toBe(247);
  });
});
