import Link from "next/link";
import { ArrowRight, ScanSearch, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative pt-32 lg:pt-40 hero-gradient overflow-hidden grain">
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
            You&apos;re not lazy.{" "}
            <span className="gradient-text">You&apos;re efficient.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Taida builds a knowledge bank from your career history, then
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
              className="gradient-bg text-white hover:opacity-90 shadow-lg shadow-primary/25"
            >
              <Link href="/sign-up?redirect_url=/dashboard" prefetch={false}>
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
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
                Taida Dashboard
              </div>
            </div>
            <div className="p-8 bg-gradient-to-br from-muted/20 to-muted/50">
              <div className="grid grid-cols-3 gap-4">
                {/* Mock stats */}
                <div className="p-4 rounded-xl bg-card border">
                  <div className="text-2xl font-bold text-primary">12</div>
                  <div className="text-sm text-muted-foreground">
                    Jobs Tracked
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-card border">
                  <div className="text-2xl font-bold text-success">8</div>
                  <div className="text-sm text-muted-foreground">Applied</div>
                </div>
                <div className="p-4 rounded-xl bg-card border">
                  <div className="text-2xl font-bold text-amber-500">3</div>
                  <div className="text-sm text-muted-foreground">
                    Interviews
                  </div>
                </div>
              </div>
              <div className="mt-4 h-32 rounded-xl bg-card border flex items-center justify-center text-muted-foreground">
                <span className="text-sm">Your personalized job dashboard</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
