import {
  Check,
  GraduationCap,
  Hourglass,
  Rocket,
  Sparkles,
} from "lucide-react";
import { getLocale } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { FREE_TIER_TAILOR_MONTHLY_LIMIT } from "@/lib/constants";
import { getA11yTranslations } from "@/lib/i18n/get-a11y-translations";
import { getLocalizedPageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export function generateMetadata({ params }: { params: { locale: string } }) {
  return getLocalizedPageMetadata("pricing", params.locale);
}

const tiers = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    description: `Create ${FREE_TIER_TAILOR_MONTHLY_LIMIT} tailored resumes each month. No credit card.`,
    icon: Sparkles,
    cta: "Start free",
    href: null,
    highlighted: false,
    features: [
      `${FREE_TIER_TAILOR_MONTHLY_LIMIT} tailored resumes/month`,
      "Free ATS scanner",
      "Career profile uploads",
      "Application tracker",
    ],
  },
  {
    name: "Pro",
    price: "$8/mo",
    cadence: "waitlist",
    description: "For active searches where every application needs polish.",
    icon: Rocket,
    cta: "Email us for waitlist access",
    href: "mailto:waitlist@slothing.work?subject=Pro%20waitlist",
    highlighted: true,
    features: [
      "Unlimited tailored resumes",
      "Priority generation",
      "Advanced resume variants",
      "Early access to new tools",
    ],
  },
  {
    name: "Student",
    price: "$3/mo",
    cadence: "with verification",
    description: "Lower pricing for students moving from class to career.",
    icon: GraduationCap,
    cta: "Email us to verify student status",
    href: "mailto:students@slothing.work?subject=Student%20verification",
    highlighted: false,
    features: [
      "Unlimited tailored resumes",
      "Student-friendly pricing",
      "Internship and early-career workflows",
      "All Pro features after verification",
    ],
  },
] as const;

const faqs = [
  {
    question: "Do I need a credit card for Free?",
    answer:
      "No. Start with the ATS scanner, your career profile, tracker, and five tailored resumes each month.",
  },
  {
    question: "Can I buy Pro today?",
    answer:
      "Pro is waitlist-only while billing is being built. Joining the waitlist helps us prioritize access.",
  },
  {
    question: "Can I cancel Pro anytime?",
    answer:
      "Yes. Pro is monthly and you can cancel before the next renewal from your account settings.",
  },
  {
    question: "Are prices in USD?",
    answer: "Yes. Local taxes may apply depending on your billing country.",
  },
  {
    question: "What happens to my Free tier resumes if I upgrade?",
    answer:
      "All resumes you've already generated stay in your account. Upgrading just removes the monthly cap.",
  },
  {
    question: "When does Pro launch?",
    answer:
      "We will email everyone on the waitlist when Pro is ready. We are not promising a launch date until billing is live.",
  },
  {
    question: "Is there a refund policy?",
    answer:
      "Yes. If Pro does not fit your search, contact support within 14 days of purchase and we will review the charge.",
  },
  {
    question: "Is annual pricing available?",
    answer:
      "Not yet. Pro will launch as a monthly plan first so you can keep it only while your search is active.",
  },
  {
    question: "How does Student verification work?",
    answer:
      "Email from a school account and we will follow up with the lightweight verification path.",
  },
] as const;

const comparisonRows = [
  {
    feature: "Tailored resumes",
    free: `${FREE_TIER_TAILOR_MONTHLY_LIMIT}/month`,
    pro: "Unlimited",
    student: "Unlimited after verification",
  },
  {
    feature: "Generation priority",
    free: "Standard",
    pro: "Priority",
    student: "Priority",
  },
  {
    feature: "Resume variants",
    free: "Core tailoring",
    pro: "Advanced variants",
    student: "Advanced variants",
  },
  {
    feature: "New tools",
    free: "General release",
    pro: "Early access",
    student: "Early access",
  },
  {
    feature: "Best for",
    free: "Light search",
    pro: "Active search",
    student: "Students and new grads",
  },
] as const;

export default async function PricingPage() {
  const locale = await getLocale();
  const a11yT = await getA11yTranslations();
  const callbackUrl = `/${locale}/dashboard`;

  return (
    <main className="px-4 py-16">
      <section className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm font-medium text-muted-foreground">
            <Hourglass className="h-4 w-4 text-primary" />
            Pro is invite-only while billing ships. Email us for early access.
          </div>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Pricing for every job search pace
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Start free, keep the cap honest, and move to Pro or Student when
            your search needs unlimited tailored resumes.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {tiers.map((tier) => {
            const Icon = tier.icon;
            const isFree = tier.name === "Free";

            return (
              <article
                key={tier.name}
                className={cn(
                  "flex flex-col rounded-lg border bg-card p-6 shadow-sm",
                  tier.highlighted && "border-primary ring-2 ring-primary/30",
                )}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="text-2xl font-semibold">{tier.name}</h2>
                  </div>
                  {tier.highlighted && (
                    <span className="rounded-lg bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      Most flexible
                    </span>
                  )}
                </div>

                <div className="mt-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold tracking-tight">
                      {tier.price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {tier.cadence}
                    </span>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    {tier.description}
                  </p>
                </div>

                <ul className="mt-6 space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-3 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  {isFree ? (
                    <Button asChild className="w-full">
                      <Link
                        href={{
                          pathname: "/sign-in",
                          query: { callbackUrl },
                        }}
                        prefetch={false}
                        aria-label={a11yT("startFreeWithSlothing")}
                      >
                        {tier.cta}
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      asChild
                      className="w-full"
                      variant={tier.highlighted ? "default" : "outline"}
                    >
                      <a
                        href={tier.href ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-pro-cta={
                          tier.name === "Pro" ? "waitlist" : undefined
                        }
                      >
                        {tier.cta}
                      </a>
                    </Button>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <section
          className="mt-10 overflow-hidden rounded-lg border bg-card"
          aria-labelledby="plan-comparison-heading"
        >
          <div className="border-b px-5 py-4">
            <h2
              id="plan-comparison-heading"
              className="text-lg font-semibold tracking-tight"
            >
              Compare plans
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-muted/40 text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-medium" scope="col">
                    Feature
                  </th>
                  <th className="px-5 py-3 font-medium" scope="col">
                    Free
                  </th>
                  <th className="px-5 py-3 font-medium" scope="col">
                    Pro
                  </th>
                  <th className="px-5 py-3 font-medium" scope="col">
                    Student
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {comparisonRows.map((row) => (
                  <tr key={row.feature}>
                    <th className="px-5 py-4 font-medium" scope="row">
                      {row.feature}
                    </th>
                    <td className="px-5 py-4 text-muted-foreground">
                      {row.free}
                    </td>
                    <td className="px-5 py-4 font-medium text-primary">
                      {row.pro}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {row.student}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-16 border-t pt-10">
          <h2 className="text-2xl font-semibold tracking-tight">
            Plan questions
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="font-medium">{faq.question}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
