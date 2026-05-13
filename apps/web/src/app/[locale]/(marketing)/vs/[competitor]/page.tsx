import { notFound } from "next/navigation";
import { Check, Github, KeyRound, ShieldCheck, TimerReset } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

const competitors = {
  teal: {
    name: "Teal",
    positioning: "career dashboard",
    contrast:
      "Teal is a polished hosted career dashboard. Slothing is for people who want inspectable AI workflows, self-hosting, and no annual lock-in.",
  },
  huntr: {
    name: "Huntr",
    positioning: "job search CRM",
    contrast:
      "Huntr focuses on hosted pipeline management. Slothing keeps the tracker, documents, extension, and AI prompts open so privacy-sensitive users can run it themselves.",
  },
  simplify: {
    name: "Simplify",
    positioning: "autofill platform",
    contrast:
      "Simplify is strongest around application autofill. Slothing pairs autofill with an open-source job-search workspace and BYOK controls.",
  },
} as const;

const rows = [
  ["Open-source core", "AGPL-3.0", "Closed source"],
  ["Self-hosting", "Free forever", "Not the default path"],
  ["AI key control", "BYOK or hosted credits", "Hosted vendor path"],
  ["Billing cadence", "$6.99 weekly or $19.99 monthly", "Monthly-first"],
  ["Privacy posture", "Run locally or delete hosted data", "Hosted SaaS"],
] as const;

export function generateStaticParams() {
  return Object.keys(competitors).map((competitor) => ({ competitor }));
}

export function generateMetadata({
  params,
}: {
  params: { competitor: string };
}) {
  const competitor =
    competitors[params.competitor as keyof typeof competitors] ?? null;
  if (!competitor) return {};
  return {
    title: `Slothing vs ${competitor.name}`,
    description: `Compare Slothing with ${competitor.name} on open source, privacy, BYOK, and weekly pricing.`,
  };
}

export default function CompetitorComparisonPage({
  params,
}: {
  params: { competitor: string };
}) {
  const competitor =
    competitors[params.competitor as keyof typeof competitors] ?? null;
  if (!competitor) notFound();

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b bg-card/40">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[1fr_360px]">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3 text-sm font-semibold uppercase text-primary">
              <ShieldCheck className="h-4 w-4" />
              Open-source alternative
            </div>
            <h1 className="text-4xl font-semibold tracking-normal text-foreground md:text-5xl">
              Slothing vs {competitor.name}
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
              {competitor.contrast}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/pricing">See pricing</Link>
              </Button>
              <Button asChild variant="outline">
                <a href="https://github.com/ANonABento/slothing">
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              </Button>
            </div>
          </div>

          <div className="rounded-lg border bg-background p-5">
            <h2 className="text-base font-semibold">
              Why people pick Slothing
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 text-success" />
                Read and modify the code that handles your resume.
              </li>
              <li className="flex gap-2">
                <KeyRound className="mt-0.5 h-4 w-4 text-success" />
                Bring your own LLM key on hosted free.
              </li>
              <li className="flex gap-2">
                <TimerReset className="mt-0.5 h-4 w-4 text-success" />
                Pay weekly when your search is active.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="overflow-hidden rounded-lg border">
          <div className="grid grid-cols-3 bg-muted px-4 py-3 text-sm font-semibold">
            <div>Category</div>
            <div>Slothing</div>
            <div>{competitor.name}</div>
          </div>
          {rows.map(([category, slothing, other]) => (
            <div
              key={category}
              className="grid grid-cols-3 gap-4 border-t px-4 py-4 text-sm"
            >
              <div className="font-medium">{category}</div>
              <div>{slothing}</div>
              <div className="text-muted-foreground">{other}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
