import { expect, test } from "@playwright/test";
import { prepareAppPage } from "./utils/test-helpers";

test.describe("Salary coverage", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/salary/calculate", async (route) => {
      await route.fulfill({
        json: {
          range: {
            min: 120000,
            percentile25: 140000,
            median: 165000,
            percentile75: 190000,
            max: 215000,
          },
        },
      });
    });

    await prepareAppPage(page, "/en/salary");
  });

  test("renders salary tools and tab navigation", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Salary Tools" }),
    ).toBeVisible();

    await page.getByRole("button", { name: /compare offers/i }).click();
    await expect(
      page.getByRole("heading", { name: "Add Offer" }),
    ).toBeVisible();

    await page.getByRole("button", { name: /negotiate/i }).click();
    await expect(
      page.getByRole("heading", { name: "Generate Negotiation Script" }),
    ).toBeVisible();
  });

  test("gates and stubs the salary calculator", async ({ page }) => {
    const calculate = page.getByRole("button", { name: /calculate range/i });
    await expect(calculate).toBeDisabled();

    await page.getByRole("combobox", { name: /select role/i }).click();
    await page
      .getByRole("option", { name: "Senior Software Engineer" })
      .click();
    await page.getByRole("combobox", { name: /select location/i }).click();
    await page.getByRole("option", { name: "Remote" }).click();
    await page.getByPlaceholder("e.g., 5").fill("7");

    await expect(calculate).toBeEnabled();
    await calculate.click();
    await expect(
      page.getByRole("heading", { name: "Market Salary Range" }),
    ).toBeVisible();
    await expect(page.getByText("$165,000")).toBeVisible();
  });

  test("adds and removes an offer comparison card", async ({ page }) => {
    await page.getByRole("button", { name: /compare offers/i }).click();
    await expect(page.getByText("No offers yet")).toBeVisible();

    const addOffer = page.getByRole("button", { name: /^add offer$/i });
    await expect(addOffer).toBeDisabled();
    await page.getByPlaceholder("e.g., Google").fill("Acme");
    await page.getByPlaceholder("e.g., 180000").fill("180000");
    await expect(addOffer).toBeEnabled();
    await addOffer.click();

    await expect(
      page.getByRole("heading", { name: "Your Offers (1)" }),
    ).toBeVisible();
    await expect(page.getByText("Acme")).toBeVisible();
    await page.getByRole("button", { name: /remove acme offer/i }).click();
    await expect(page.getByText("No offers yet")).toBeVisible();
  });

  test("renders negotiate inputs without generating a script", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /negotiate/i }).click();
    await expect(page.getByText("Your Negotiation Script")).toBeVisible();
    await expect(page.getByPlaceholder("e.g., 150000")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /generate script/i }),
    ).toBeDisabled();
  });
});
