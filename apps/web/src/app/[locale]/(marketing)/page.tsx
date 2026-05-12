import { headers } from "next/headers";
import { Hero } from "./components/hero";
import { Features } from "./components/features";
import { HowItWorks } from "./components/how-it-works";
import { Testimonials } from "./components/testimonials";
import { CTASection } from "./components/cta-section";
import { getMarketingPageMetadata } from "@/lib/seo";
import { CSP_NONCE_HEADER } from "@/lib/security/headers";

export const metadata = getMarketingPageMetadata();

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Slothing",
  description:
    "You're not lazy. Your job search system is. AI-powered resume tailoring, interview prep, and application tracking.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default async function LandingPage() {
  const nonce = headers().get(CSP_NONCE_HEADER) ?? undefined;

  return (
    <>
      <script
        nonce={nonce}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {await Hero()}
      <Features />
      <HowItWorks />
      <Testimonials />
      {await CTASection()}
    </>
  );
}
