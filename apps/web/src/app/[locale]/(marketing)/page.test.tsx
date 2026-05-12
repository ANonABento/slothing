import { describe, expect, it, vi } from "vitest";
import { getLocalizedMarketingPageMetadata } from "@/lib/seo";

vi.mock("./components/hero", () => ({
  Hero: () => null,
}));

vi.mock("./components/features", () => ({
  Features: () => null,
}));

vi.mock("./components/how-it-works", () => ({
  HowItWorks: () => null,
}));

vi.mock("./components/testimonials", () => ({
  Testimonials: () => null,
}));

vi.mock("./components/cta-section", () => ({
  CTASection: () => null,
}));

import { generateMetadata } from "./page";

describe("marketing landing page metadata", () => {
  it("uses the shared localized marketing metadata", () => {
    expect(generateMetadata({ params: { locale: "ja" } })).toEqual(
      getLocalizedMarketingPageMetadata("ja"),
    );
  });
});
