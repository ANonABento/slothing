import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  FileText,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Target,
  Wand2,
} from "lucide-react";
import { getLocale } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { getA11yTranslations } from "@/lib/i18n/get-a11y-translations";
import { SlothMascot } from "./sloth-mascot";

const trustCues = [
  { icon: ScanSearch, label: "Free ATS scan" },
  { icon: ShieldCheck, label: "No credit card" },
  { icon: Sparkles, label: "Open early access" },
  { icon: CheckCircle2, label: "Your data, your control" },
];

export async function Hero() {
  const locale = await getLocale();
  const a11yT = await getA11yTranslations();
  const callbackUrl = `/${locale}/dashboard`;

  return (
    <section className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-40 lg:pb-32 hero-gradient overflow-hidden grain">
      {/* Background ambient washes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/3 h-[120%] w-[80%] rounded-full bg-gradient-to-bl from-primary/10 via-transparent to-transparent blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/3 h-[120%] w-[80%] rounded-full bg-gradient-to-tr from-accent/8 via-transparent to-transparent blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16">
          {/* Left column — copy + CTAs */}
          <div className="text-center lg:text-left">
            {/* Inline mascot for mobile */}
            <div
              className="mx-auto mb-5 h-20 w-20 text-primary sm:hidden"
              aria-hidden="true"
            >
              <SlothMascot />
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary animate-in fade-in slide-in-from-bottom-4 duration-700">
              <ScanSearch className="h-4 w-4" />
              <span>AI-Powered Resume Intelligence</span>
              <Sparkles className="h-4 w-4" />
            </div>

            {/* Headline */}
            <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl xl:text-[4.25rem] xl:leading-[1.05] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              <span className="block">You&apos;re not lazy.</span>
              <span className="block gradient-text">Your system is.</span>
            </h1>

            {/* Subheadline */}
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground md:text-xl lg:mx-0 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              Slothing remembers your full career history in one place, then
              writes a perfectly tailored resume for every job — so you can stop
              rewriting and start interviewing.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-4 lg:items-start lg:justify-start lg:flex-row animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <Button
                asChild
                size="lg"
                variant="gradient"
                className="w-full shadow-lg shadow-primary/25 sm:w-auto"
              >
                <Link href="/ats-scanner" prefetch={false}>
                  <ScanSearch className="mr-2 h-5 w-5" />
                  Scan your resume free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
              >
                <Link
                  href={{ pathname: "/sign-in", query: { callbackUrl } }}
                  prefetch={false}
                >
                  Create a free account
                </Link>
              </Button>
            </div>

            {/* Trust cues */}
            <div
              data-testid="hero-social-proof"
              className="mx-auto mt-10 flex max-w-xl flex-wrap justify-center gap-x-5 gap-y-3 rounded-2xl border bg-card/80 px-4 py-3 text-sm font-medium text-foreground shadow-sm backdrop-blur lg:mx-0 lg:max-w-2xl lg:justify-start sm:border-0 sm:bg-transparent sm:p-0 sm:text-muted-foreground sm:shadow-none sm:backdrop-blur-none animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500"
            >
              {trustCues.map((cue) => {
                const Icon = cue.icon;
                return (
                  <div
                    key={cue.label}
                    className="inline-flex items-center gap-2"
                  >
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span>{cue.label}</span>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground lg:text-left animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
              Slothing is in active development — features ship weekly.
            </p>
          </div>

          {/* Right column — mascot + product preview */}
          <div className="relative mx-auto w-full max-w-md sm:max-w-lg lg:mx-0 lg:max-w-none animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
            {/* Glow behind preview */}
            <div className="pointer-events-none absolute inset-0 -z-10 rounded-[2.5rem] bg-gradient-to-br from-primary/15 via-accent/10 to-transparent blur-2xl" />

            {/* Sloth mascot peeking from the top-right */}
            <div
              className="pointer-events-none absolute -top-12 -right-4 z-20 hidden h-44 w-44 text-primary sm:block lg:-top-16 lg:-right-8 lg:h-56 lg:w-56"
              aria-hidden="true"
            >
              <SlothMascot />
            </div>

            {/* Product preview card */}
            <div className="relative overflow-hidden rounded-3xl border bg-card shadow-2xl shadow-primary/10">
              {/* Faux browser chrome */}
              <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-destructive/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-warning/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-success/80" />
                </div>
                <div className="flex-1 text-center text-xs text-muted-foreground">
                  slothing.work/dashboard
                </div>
              </div>

              {/* Preview body */}
              <div
                aria-label={a11yT("dashboardPreview")}
                className="space-y-3 bg-gradient-to-br from-muted/15 via-card to-muted/40 p-5"
              >
                {/* Greeting + headline metric */}
                <div className="flex items-center justify-between rounded-2xl border bg-card p-4">
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Today
                    </div>
                    <div className="mt-1 text-base font-semibold text-foreground">
                      Two focused moves, then you&apos;re done.
                    </div>
                  </div>
                  <div className="hidden shrink-0 rounded-xl border bg-primary/10 px-3 py-2 text-center text-primary sm:block">
                    <div className="text-[0.65rem] font-medium uppercase tracking-wide opacity-80">
                      Readiness
                    </div>
                    <div className="text-xl font-bold leading-none">78%</div>
                  </div>
                </div>

                {/* Tailored resume preview */}
                <div className="rounded-2xl border bg-card p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Wand2 className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">
                        Tailored resume drafted
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Senior Product Designer · 12 matched keywords
                      </p>
                    </div>
                    <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                      <CheckCircle2 className="h-3 w-3" />
                      Ready
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                        <span className="block h-full w-[92%] rounded-full bg-gradient-to-r from-primary to-accent" />
                      </span>
                      <span className="text-xs font-semibold text-foreground">
                        92
                      </span>
                    </div>
                    <p className="text-[0.7rem] text-muted-foreground">
                      ATS compatibility · keyword + section match
                    </p>
                  </div>
                </div>

                {/* Pipeline strip */}
                <div className="rounded-2xl border bg-card p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Briefcase className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">
                          Pipeline
                        </div>
                        <p className="text-xs text-muted-foreground">
                          9 opportunities, focused
                        </p>
                      </div>
                    </div>
                    <span className="hidden text-xs font-medium text-primary sm:block">
                      View all
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: "Saved", count: 3, w: "33%" },
                      { label: "Applied", count: 4, w: "44%" },
                      { label: "Interview", count: 2, w: "22%" },
                      { label: "Offer", count: 0, w: "0%" },
                    ].map((stage) => (
                      <div
                        key={stage.label}
                        className="rounded-xl border bg-background/40 p-2"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="truncate text-[0.65rem] uppercase tracking-wide text-muted-foreground">
                            {stage.label}
                          </span>
                          <span className="text-sm font-semibold text-foreground">
                            {stage.count}
                          </span>
                        </div>
                        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: stage.w }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating accent card — bottom-left */}
            <div
              className="pointer-events-none absolute -left-4 bottom-6 hidden translate-y-1/3 items-center gap-3 rounded-2xl border bg-card p-3 shadow-xl shadow-primary/10 md:flex"
              aria-hidden="true"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-medium text-muted-foreground">
                  Cover letter
                </div>
                <div className="text-sm font-semibold text-foreground">
                  Drafted in 38s
                </div>
              </div>
            </div>

            {/* Floating accent card — top-left */}
            <div
              className="pointer-events-none absolute -left-3 top-12 hidden items-center gap-3 rounded-2xl border bg-card p-3 shadow-xl shadow-primary/10 lg:flex"
              aria-hidden="true"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Target className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-medium text-muted-foreground">
                  Match score
                </div>
                <div className="text-sm font-semibold text-foreground">
                  92 / 100
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
