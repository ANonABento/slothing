import { ArrowRight, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { getAlternateLanguages } from "@/lib/seo";

const competitors = [
  {
    name: "Teal",
    slug: "teal",
    summary: "Closed job tracker and resume tooling.",
  },
  {
    name: "Huntr",
    slug: "huntr",
    summary: "Hosted job search CRM with paid AI features.",
  },
  {
    name: "Simplify",
    slug: "simplify",
    summary: "Application autofill and job tracking platform.",
  },
] as const;

export function generateMetadata() {
  return {
    title: "Slothing comparisons",
    description:
      "Compare Slothing with Teal, Huntr, and Simplify on open source, privacy, BYOK, and weekly pricing.",
    alternates: {
      canonical: "/vs",
      languages: getAlternateLanguages("/vs"),
    },
  };
}

export default function CompareIndexPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="border-b bg-card/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex max-w-3xl flex-col gap-5">
            <ShieldCheck className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-semibold tracking-normal text-foreground md:text-5xl">
              Compare Slothing
            </h1>
            <p className="text-lg leading-8 text-muted-foreground">
              Slothing is AGPL open source, self-hostable, BYOK-friendly, and
              priced weekly for active searches.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-6 py-12 md:grid-cols-3">
        {competitors.map((competitor) => (
          <article
            key={competitor.slug}
            className="flex flex-col rounded-lg border bg-card p-6 shadow-sm transition-colors hover:border-primary/40"
          >
            <h2 className="text-xl font-semibold">
              Slothing vs {competitor.name}
            </h2>
            <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
              {competitor.summary}
            </p>
            <Button asChild className="mt-6 w-full">
              <Link href={`/vs/${competitor.slug}`}>
                Compare
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </article>
        ))}
      </section>
    </main>
  );
}
