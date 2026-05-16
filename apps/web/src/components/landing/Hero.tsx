import Image from "next/image";
import Link from "next/link";
import { Edit3, FileText, Mic2, Search, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FeaturePill,
  HaloEyebrow,
  HighlighterEm,
  MonoCap,
  PropCard,
} from "./primitives";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto w-full max-w-wrap px-5 pb-20 pt-9 md:px-10 md:pb-[80px] md:pt-[36px]">
        <div className="grid gap-14 md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-14">
          {/* Copy column */}
          <div className="flex flex-col gap-6">
            <HaloEyebrow>A calmer way to job hunt</HaloEyebrow>

            <h1 className="max-w-[12ch] font-display text-hero-h1 text-ink">
              A job search that <HighlighterEm>doesn&rsquo;t</HighlighterEm>{" "}
              wear you out.
            </h1>

            <p className="max-w-[46ch] text-hero-sub text-ink-2">
              One workspace for resumes, opportunities, application forms, and
              interview prep. Built by people who got tired of switching between
              fifteen tools to send one email.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href="/sign-in">
                  Try Slothing free{" "}
                  <span className="ml-1 transition-transform group-hover:translate-x-[3px]">
                    →
                  </span>
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <a href="#feat-bank">See how it works</a>
              </Button>
            </div>

            {/* Hero meta — social proof line, replaces what would be a
                "trusted by X companies" logo bar for SaaS. Open-source
                + permissive license + free is the angle. */}
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-ink-3">
              <a
                href="https://github.com/ANonABento/slothing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 transition-colors hover:text-ink-2"
              >
                <span aria-hidden>★</span>
                <span>Star on GitHub</span>
              </a>
              <span className="h-1 w-1 rounded-full bg-ink-3/40" aria-hidden />
              <span>AGPL-3.0 open source</span>
              <span className="h-1 w-1 rounded-full bg-ink-3/40" aria-hidden />
              <span>BYOK · self-hostable</span>
            </div>

            <div className="mt-3 flex flex-col gap-3 border-t border-rule pt-5">
              <MonoCap>Inside Slothing</MonoCap>
              <div className="flex flex-wrap gap-2">
                <FeaturePill href="#feat-bank" icon={<FileText size={14} />}>
                  Knowledge Bank
                </FeaturePill>
                <FeaturePill href="#feat-scrape" icon={<Search size={14} />}>
                  Browser scraper
                </FeaturePill>
                <FeaturePill href="#feat-ats" icon={<Target size={14} />}>
                  ATS match
                </FeaturePill>
                <FeaturePill href="#feat-autofill" icon={<Edit3 size={14} />}>
                  Form autofill
                </FeaturePill>
                <FeaturePill href="#feat-interview" icon={<Mic2 size={14} />}>
                  Interview prep
                </FeaturePill>
              </div>
            </div>
          </div>

          {/* Visual column */}
          <div className="relative mx-auto h-[420px] w-full max-w-[460px] md:h-[520px]">
            <Image
              src="/landing/mascot.png"
              alt="A friendly sloth holding a tablet"
              fill
              priority
              className="object-contain drop-shadow-[0_30px_40px_rgba(80,60,30,0.18)] dark:drop-shadow-[0_30px_40px_rgba(0,0,0,0.5)]"
              sizes="(max-width: 768px) 360px, 460px"
            />

            <PropCard
              rotate={-5}
              className="absolute left-0 top-2 w-[220px] hidden md:block"
            >
              <MonoCap>Resume.pdf</MonoCap>
              <div className="mt-2 font-display text-[20px] font-bold text-ink">
                Senior PM resume
              </div>
              <div className="mt-1 text-[12.5px] text-ink-3">
                Tailored for Notion · v3
              </div>
              <ul className="mt-3 space-y-1 text-[12.5px] text-ink-2">
                <li>• Led 0→1 launch for billing platform</li>
                <li>• Mentored 6 PMs across two re-orgs</li>
                <li>• Drove 38% retention lift in 2024</li>
              </ul>
            </PropCard>

            <PropCard
              rotate={4}
              className="absolute right-0 top-8 w-[210px] hidden md:block"
            >
              <span className="inline-flex items-center rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-page">
                95% MATCH
              </span>
              <div className="mt-3 font-display text-[18px] font-bold text-ink">
                Design Engineer
              </div>
              <div className="text-[12.5px] text-ink-3">Figma · Remote</div>
              <ul className="mt-3 space-y-1 text-[12.5px] text-ink-2">
                <li>✓ Strong design-eng overlap</li>
                <li>✓ Built component systems</li>
                <li>✓ Ships fast</li>
              </ul>
            </PropCard>

            <PropCard
              rotate={3}
              className="absolute bottom-0 right-2 w-[230px] hidden md:block"
            >
              <MonoCap>Next up · today</MonoCap>
              <ul className="mt-3 space-y-2 text-[13px]">
                <li className="flex items-center gap-2 text-ink-3 line-through">
                  <span className="inline-block h-3 w-3 rounded-full bg-brand" />
                  Email Maya re: interview
                </li>
                <li className="flex items-center gap-2 text-ink-3 line-through">
                  <span className="inline-block h-3 w-3 rounded-full bg-brand" />
                  Tailor resume for Linear
                </li>
                <li className="flex items-center gap-2 text-ink">
                  <span className="inline-block h-3 w-3 rounded-full border-2 border-brand" />
                  Prep STAR stories
                </li>
              </ul>
            </PropCard>
          </div>
        </div>
      </div>
    </section>
  );
}
