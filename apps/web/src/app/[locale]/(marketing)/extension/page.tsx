import {
  ArrowRight,
  CheckCircle2,
  Database,
  Globe2,
  Mail,
  MousePointerClick,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Image from "next/image";

import { ExtensionInstallButtons } from "@/components/marketing/extension-install-buttons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { getCurrentUserId } from "@/lib/auth";
import { getA11yTranslations } from "@/lib/i18n/get-a11y-translations";
import { getLocalizedPageMetadata } from "@/lib/seo";

export function generateMetadata({ params }: { params: { locale: string } }) {
  return getLocalizedPageMetadata("extension", params.locale);
}

const featureBlocks = [
  {
    title: "Auto-capture from job boards",
    description:
      "Save roles from LinkedIn, Indeed, Greenhouse, Lever, Workable, and niche boards without copying details by hand.",
    icon: Globe2,
    screenshot: "/marketing/extension/job-board-capture.png",
    visualLabel: "Slothing Columbus popover saving a LinkedIn job posting",
  },
  {
    title: "Gmail recruiter import",
    description:
      "Turn recruiter outreach into pending opportunities so promising leads do not disappear inside your inbox.",
    icon: Mail,
    screenshot: "/marketing/extension/gmail-import.png",
    visualLabel: "Gmail recruiter import view showing pending opportunities",
  },
  {
    title: "One-click review queue",
    description:
      "Send captured roles straight into Slothing for review, prioritization, and tailored document work.",
    icon: MousePointerClick,
    screenshot: "/marketing/extension/review-queue.png",
    visualLabel: "Review queue with three captured roles",
  },
] as const;

const steps = [
  {
    title: "Install",
    description: "Add Columbus to your browser from the store.",
  },
  {
    title: "Sign in",
    description: "Connect the extension to your Slothing account.",
  },
  {
    title: "Capture",
    description: "Open any role and send it to your review queue.",
  },
] as const;

const faqs = [
  {
    question: "Which browsers are supported?",
    answer:
      "Chrome, Microsoft Edge, and Firefox are the first supported browsers. Safari support is planned.",
  },
  {
    question: "Does it work on Safari?",
    answer:
      "Not yet. The Safari extension is not available in v1, but the landing page will point to it when it is ready.",
  },
  {
    question: "Can I import existing Gmail history?",
    answer:
      "The Gmail import is designed for recruiter outreach and can bring messages into your pending opportunity workflow once connected.",
  },
  {
    question: "How do I uninstall?",
    answer:
      "Remove Columbus from your browser's extensions page. Your saved opportunities stay in your Slothing account.",
  },
] as const;

export default async function ExtensionLandingPage() {
  const userId = await getCurrentUserId();
  const a11yT = await getA11yTranslations();

  return (
    <main className="pt-24">
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:py-20">
        <div>
          <Badge variant="secondary" className="mb-5">
            Columbus browser extension
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Capture jobs from any site, instantly.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            Columbus, the Slothing browser extension, turns any LinkedIn,
            Indeed, or company careers page into a one-click save.
          </p>
          <div className="mt-8">
            <ExtensionInstallButtons variant="primary" />
          </div>
        </div>

        <HeroMockup ariaLabel={a11yT("extensionPopoverPreviewOnAJobPosting")} />
      </section>

      <section id="features" className="border-t bg-card/45 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase text-primary">
              What it does
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              Less copying, more deciding
            </h2>
          </div>
          <div className="mt-10 space-y-6">
            {featureBlocks.map((feature, index) => {
              const Icon = feature.icon;
              const reversed = index % 2 === 1;

              return (
                <article
                  key={feature.title}
                  className="grid gap-6 rounded-lg border bg-background p-6 shadow-sm md:grid-cols-2 md:items-center"
                >
                  <div className={reversed ? "md:order-2" : undefined}>
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-2xl font-semibold">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                  <div className="rounded-lg border bg-muted/40 p-5">
                    <FeatureVisual
                      src={feature.screenshot}
                      ariaLabel={feature.visualLabel}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold tracking-tight">How it works</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <article key={step.title} className="rounded-lg border p-6">
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y bg-card/45 px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <ShieldCheck className="h-10 w-10 text-primary" />
            <h2 className="mt-4 text-3xl font-bold tracking-tight">
              Privacy and trust
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Your data stays in your Slothing account. We don&apos;t sell or
              share.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Tabs", "Used to read the current job page when you capture."],
              ["Storage", "Keeps a secure connection token on your device."],
              [
                "Gmail read",
                "Optional, and only for recruiter import workflows.",
              ],
            ].map(([title, description]) => (
              <div key={title} className="rounded-lg border bg-background p-5">
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </div>
          <div className="lg:col-start-2">
            <div className="flex flex-wrap gap-3 text-sm font-medium">
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight">FAQ</h2>
          <div className="mt-6 divide-y rounded-lg border">
            {faqs.map((faq) => (
              <details key={faq.question} className="group p-5">
                <summary className="cursor-pointer list-none font-semibold">
                  {faq.question}
                </summary>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t px-6 py-16">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <Sparkles className="h-10 w-10 text-primary" />
          <h2 className="mt-4 text-3xl font-bold tracking-tight">
            Start capturing while you browse
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            Install the extension now, then send the next promising role
            straight to Slothing.
          </p>
          <div className="mt-7">
            <ExtensionInstallButtons variant="primary" />
          </div>
          {userId ? (
            <Button asChild variant="link" className="mt-4">
              <Link href="/extension/connect">
                Already installed? Connect it <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          ) : null}
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
            <span>Version 0.1</span>
            <a href="mailto:support@slothing.work" className="hover:underline">
              support@slothing.work
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureVisual({
  src,
  ariaLabel,
}: {
  src: (typeof featureBlocks)[number]["screenshot"];
  ariaLabel: string;
}) {
  return (
    <Image
      src={src}
      alt={ariaLabel}
      width={960}
      height={600}
      sizes="(min-width: 768px) 50vw, 100vw"
      className="aspect-[8/5] w-full rounded-lg border bg-background object-cover shadow-sm"
    />
  );
}

function HeroMockup({ ariaLabel }: { ariaLabel: string }) {
  return (
    <div
      className="relative min-h-[420px] rounded-lg border bg-card p-4 shadow-xl"
      aria-label={ariaLabel}
    >
      <div className="mb-4 flex items-center gap-2 border-b pb-3">
        <span className="h-3 w-3 rounded-full bg-destructive/70" />
        <span className="h-3 w-3 rounded-full bg-warning/70" />
        <span className="h-3 w-3 rounded-full bg-success/70" />
        <span className="ml-3 h-8 flex-1 rounded-lg bg-muted" />
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_220px]">
        <div className="space-y-4 rounded-lg border bg-background p-5">
          <div className="h-5 w-28 rounded bg-primary/20" />
          <div className="h-8 w-3/4 rounded bg-foreground/15" />
          <div className="h-4 w-44 rounded bg-muted" />
          <div className="space-y-2 pt-4">
            <div className="h-3 rounded bg-muted" />
            <div className="h-3 rounded bg-muted" />
            <div className="h-3 w-5/6 rounded bg-muted" />
          </div>
        </div>
        <div className="rounded-lg border border-primary/20 bg-background p-4 shadow-lg">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            <span className="font-semibold">Save to Slothing</span>
          </div>
          <div className="mt-4 space-y-3 text-sm">
            {["Frontend Engineer", "Acme Labs", "Remote"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <Button className="mt-5 w-full">Capture role</Button>
        </div>
      </div>
    </div>
  );
}
