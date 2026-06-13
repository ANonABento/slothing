// @vitest-environment jsdom
// @vitest-environment-options { "url": "https://careers.acme.com/jobs/123" }

import { afterEach, describe, expect, it } from "vitest";
import {
  deriveCompanyDomain,
  extractCompanyLogoUrl,
  registrableDomain,
} from "./company-logo";

afterEach(() => {
  document.head.innerHTML = "";
  document.body.innerHTML = "";
});

function jsonLd(obj: unknown) {
  const s = document.createElement("script");
  s.type = "application/ld+json";
  s.textContent = JSON.stringify(obj);
  document.head.appendChild(s);
}

describe("extractCompanyLogoUrl", () => {
  it("returns the JSON-LD hiringOrganization.logo (string)", () => {
    jsonLd({
      "@type": "JobPosting",
      hiringOrganization: {
        name: "Acme",
        logo: "https://cdn.acme.com/logo.png",
      },
    });
    expect(extractCompanyLogoUrl(document)).toBe(
      "https://cdn.acme.com/logo.png",
    );
  });

  it("handles logo as an ImageObject and resolves relative URLs", () => {
    jsonLd({
      "@type": "JobPosting",
      hiringOrganization: { name: "Acme", logo: { url: "/brand/logo.svg" } },
    });
    expect(extractCompanyLogoUrl(document)).toBe(
      "https://careers.acme.com/brand/logo.svg",
    );
  });

  it("falls back to a known site logo <img>", () => {
    document.body.innerHTML =
      '<div class="logo-wrapper"><img src="https://cdn.acme.com/site-logo.png" alt="Acme"></div>';
    expect(extractCompanyLogoUrl(document)).toBe(
      "https://cdn.acme.com/site-logo.png",
    );
  });

  it("uses og:image as a last resort", () => {
    const m = document.createElement("meta");
    m.setAttribute("property", "og:image");
    m.setAttribute("content", "https://cdn.acme.com/og.png");
    document.head.appendChild(m);
    expect(extractCompanyLogoUrl(document)).toBe("https://cdn.acme.com/og.png");
  });

  it("prefers JSON-LD logo over og:image and site img", () => {
    jsonLd({
      hiringOrganization: { logo: "https://cdn.acme.com/jsonld.png" },
    });
    document.body.innerHTML =
      '<div class="logo-wrapper"><img src="https://cdn.acme.com/site.png"></div>';
    const m = document.createElement("meta");
    m.setAttribute("property", "og:image");
    m.setAttribute("content", "https://cdn.acme.com/og.png");
    document.head.appendChild(m);
    expect(extractCompanyLogoUrl(document)).toBe(
      "https://cdn.acme.com/jsonld.png",
    );
  });

  it("returns undefined when there is no logo", () => {
    document.body.innerHTML = "<h1>Senior Engineer</h1>";
    expect(extractCompanyLogoUrl(document)).toBeUndefined();
  });
});

describe("deriveCompanyDomain", () => {
  it("uses JSON-LD hiringOrganization.url", () => {
    jsonLd({ hiringOrganization: { url: "https://www.acme.com/about" } });
    expect(
      deriveCompanyDomain(document, "https://boards.greenhouse.io/acme/jobs/1"),
    ).toBe("acme.com");
  });

  it("falls back to the page host for a company career page", () => {
    expect(
      deriveCompanyDomain(document, "https://careers.acme.com/jobs/123"),
    ).toBe("acme.com");
  });

  it("returns undefined for job boards / aggregators", () => {
    expect(
      deriveCompanyDomain(document, "https://boards.greenhouse.io/acme/jobs/1"),
    ).toBeUndefined();
    expect(
      deriveCompanyDomain(document, "https://www.linkedin.com/jobs/view/1"),
    ).toBeUndefined();
  });

  it("returns undefined for localhost", () => {
    expect(
      deriveCompanyDomain(document, "http://localhost:3000/x"),
    ).toBeUndefined();
  });
});

describe("registrableDomain", () => {
  it("strips subdomains and www", () => {
    expect(registrableDomain("careers.acme.com")).toBe("acme.com");
    expect(registrableDomain("www.acme.com")).toBe("acme.com");
    expect(registrableDomain("acme.com")).toBe("acme.com");
  });
});
