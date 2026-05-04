export const MARKETING_ROUTES = {
  home: "/",
  features: "/#features",
  howItWorks: "/#how-it-works",
  testimonials: "/#testimonials",
  atsScanner: "/ats-scanner",
  signIn: "/sign-in?redirect_url=/dashboard",
  signUp: "/sign-up?redirect_url=/dashboard",
  privacy: "/privacy",
  terms: "/terms",
} as const;

export const MARKETING_NAV_LINKS = [
  { name: "Features", href: MARKETING_ROUTES.features },
  { name: "How It Works", href: MARKETING_ROUTES.howItWorks },
  { name: "Testimonials", href: MARKETING_ROUTES.testimonials },
] as const;

export const FOOTER_LINK_GROUPS = {
  product: [
    { name: "Features", href: MARKETING_ROUTES.features },
    { name: "How It Works", href: MARKETING_ROUTES.howItWorks },
    { name: "ATS Scanner", href: MARKETING_ROUTES.atsScanner },
  ],
  legal: [
    { name: "Privacy Policy", href: MARKETING_ROUTES.privacy },
    { name: "Terms of Service", href: MARKETING_ROUTES.terms },
  ],
} as const;
