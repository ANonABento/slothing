import { expect, test } from "@playwright/test";

test.describe("disabled auth sign-in", () => {
  test("renders an explicit disabled state instead of redirecting", async ({
    page,
    request,
  }) => {
    test.skip(
      Boolean(
        process.env.GOOGLE_CLIENT_ID &&
        process.env.GOOGLE_CLIENT_SECRET &&
        process.env.NEXTAUTH_SECRET,
      ),
      "Auth is configured for this Playwright run.",
    );

    const response = await request.get("/en/sign-in", { maxRedirects: 0 });
    expect(response.status()).toBe(200);
    expect(response.headers().location).toBeUndefined();

    await page.goto("/en/sign-in");
    await expect(
      page.getByRole("heading", {
        name: "Sign-in is disabled in this environment",
      }),
    ).toBeVisible();
    await expect(page.getByText("GOOGLE_CLIENT_ID")).toBeVisible();
    await expect(page.getByText("GOOGLE_CLIENT_SECRET")).toBeVisible();
    await expect(page.getByText("NEXTAUTH_SECRET")).toBeVisible();
    await expect(page.getByText(".env.example")).toBeVisible();
  });
});
