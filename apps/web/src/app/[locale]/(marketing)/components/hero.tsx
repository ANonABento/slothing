import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Clock,
  FileText,
  Plus,
  ScanSearch,
  Sparkles,
  Target,
  Upload,
} from "lucide-react";
import { getLocale } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export async function Hero() {
  const locale = await getLocale();
  const callbackUrl = `/${locale}/dashboard`;

  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 hero-gradient overflow-hidden grain">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-bl from-primary/8 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-accent/6 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <ScanSearch className="h-4 w-4" />
            <span>AI-Powered Resume Intelligence</span>
            <Sparkles className="h-4 w-4" />
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            <span className="block">You&apos;re not lazy.</span>
            <span className="block gradient-text">Your system is.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Slothing builds a knowledge bank from your career history, then
            generates perfectly tailored resumes for every job — so you can stop
            rewriting and start interviewing.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <Button asChild size="lg" variant="outline">
              <Link href="/ats-scanner" prefetch={false}>
                <ScanSearch className="mr-2 h-5 w-5" />
                Try Free ATS Scanner
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="gradient-bg text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/25"
            >
              <Link
                href={{ pathname: "/sign-in", query: { callbackUrl } }}
                prefetch={false}
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Social proof */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-background flex items-center justify-center text-xs font-medium"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <span>Join 10,000+ job seekers</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-border" />
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg
                  key={i}
                  className="w-4 h-4 text-amber-400 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-1">4.9/5 rating</span>
            </div>
          </div>
          <p className="mt-3 text-xs italic text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
            Stats and ratings are illustrative — Slothing is in active
            development.
          </p>
        </div>

        {/* App Preview */}
        <div className="mt-16 relative animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
          <div className="rounded-2xl border bg-card shadow-2xl overflow-hidden">
            <div className="p-4 border-b bg-muted/30 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex-1 text-center text-sm text-muted-foreground">
                Slothing Dashboard
              </div>
            </div>
            <div className="p-8 bg-gradient-to-br from-muted/20 to-muted/50">
              <div aria-label="Dashboard preview" className="space-y-3">
                <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-base font-semibold text-foreground">
                      Dashboard
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      You have a few clear moves to keep your search moving.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-lg border bg-card px-2.5 py-1 text-xs font-medium text-foreground">
                      <Plus className="h-3.5 w-3.5 text-primary" />
                      Add opportunity
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-lg border bg-card px-2.5 py-1 text-xs font-medium text-foreground">
                      <Upload className="h-3.5 w-3.5 text-primary" />
                      Upload document
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {[
                    { label: "Readiness", value: "78%", icon: Target },
                    { label: "Documents", value: "4", icon: FileText },
                    { label: "Tailored docs", value: "6", icon: FileText },
                    { label: "Pipeline", value: "9", icon: Briefcase },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className="rounded-lg border bg-card p-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <p className="text-[0.68rem] font-medium uppercase text-muted-foreground">
                              {item.label}
                            </p>
                            <p className="mt-1 text-xl font-semibold text-foreground">
                              {item.value}
                            </p>
                          </div>
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Icon className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="grid gap-2 lg:grid-cols-[1.45fr_0.85fr]">
                  <div className="rounded-lg border bg-card p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">
                          Today
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Two focused moves, then you are done.
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {[
                        {
                          icon: Briefcase,
                          title: "Review 3 new opportunities",
                          context: "Decide what belongs in your pipeline.",
                        },
                        {
                          icon: FileText,
                          title: "Create a tailored document",
                          context: "4 documents ready to reuse.",
                        },
                      ].map((action) => {
                        const Icon = action.icon;
                        return (
                          <div
                            key={action.title}
                            className="flex items-center gap-3 rounded-lg border bg-background/40 p-3"
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0 flex-1 text-left">
                              <div className="truncate text-sm font-medium text-foreground">
                                {action.title}
                              </div>
                              <p className="truncate text-xs text-muted-foreground">
                                {action.context}
                              </p>
                            </div>
                            <span className="inline-flex shrink-0 items-center gap-1 rounded-lg border bg-card px-2 py-1 text-xs font-medium text-foreground">
                              Open
                              <ArrowRight className="h-3 w-3" />
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-lg border bg-card p-4">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-foreground">
                          Readiness
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Materials at a glance.
                        </p>
                      </div>
                      <span className="text-xl font-bold text-primary">
                        78%
                      </span>
                    </div>
                    <div className="mb-4 h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: "78%" }}
                      />
                    </div>
                    <div className="space-y-2">
                      {[
                        { title: "Profile", detail: "Strong foundation" },
                        { title: "Documents", detail: "4 files in your bank" },
                      ].map((item) => (
                        <div
                          key={item.title}
                          className="flex items-center gap-3 rounded-lg bg-background/40 p-2"
                        >
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <CheckCircle2 className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 text-left">
                            <div className="text-xs font-medium text-foreground">
                              {item.title}
                            </div>
                            <p className="truncate text-xs text-muted-foreground">
                              {item.detail}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border bg-card p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Briefcase className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">
                        Pipeline
                      </div>
                      <p className="text-xs text-muted-foreground">
                        9 active opportunities across your search.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {[
                      { label: "Saved", count: 3, width: "33%" },
                      { label: "Applied", count: 4, width: "44%" },
                      { label: "Interviewing", count: 2, width: "22%" },
                      { label: "Offer", count: 0, width: "0%" },
                    ].map((stage) => (
                      <div
                        key={stage.label}
                        className="rounded-lg border bg-background/40 p-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-xs text-muted-foreground">
                            {stage.label}
                          </span>
                          <span className="text-sm font-semibold text-foreground">
                            {stage.count}
                          </span>
                        </div>
                        <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: stage.width }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
