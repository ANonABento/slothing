"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Info } from "lucide-react";

interface HonestyPanelProps {
  className?: string;
}

const FACTS: Array<{
  q: string;
  a: React.ReactNode;
  sources?: React.ReactNode;
}> = [
  {
    q: "Does this score come from a real ATS?",
    a: (
      <>
        <strong>No.</strong> No major ATS — Workday, Greenhouse, Lever, iCIMS,
        Taleo — publishes a 0–100 match score to recruiters. The score you see
        here is a heuristic simulation of the signals real parsers and
        recruiters care about. The same is true of every other scanner you will
        find online, including Jobscan and ResumeWorded.
      </>
    ),
  },
  {
    q: 'Is the "75% of resumes rejected by AI" stat real?',
    a: (
      <>
        It&apos;s a 2012 sales pitch from a company called Preptel that went out
        of business in 2013 and never published its methodology. Recruiter
        surveys put actual human-review rates at <strong>90–95%</strong> of
        applications received. Where automated rejection does happen, it is
        almost always via deterministic <em>knockout questions</em> you can see
        on the application form — not opaque AI.
      </>
    ),
  },
  {
    q: "Then what is actually filtering my resume?",
    a: (
      <>
        Two real things. <strong>(1) Knockout questions</strong>: work
        authorization, years of experience, location, salary expectations —
        these instantly disqualify when you don&apos;t match.{" "}
        <strong>(2) Recruiter time budget</strong>: requisitions get hundreds to
        thousands of applicants and recruiters stop scrolling after the first
        page or two of a sorted list. Being low-ranked is functionally
        equivalent to being rejected, but the rejection itself is human or
        rule-based, not algorithmic.
      </>
    ),
  },
  {
    q: "Does the ATS I'm applying to matter?",
    a: (
      <>
        Yes, significantly. Workday and Taleo do <em>literal</em> keyword
        matching with no synonym expansion. Greenhouse explicitly does not rank
        or auto-reject. iCIMS reads left-to-right across the page width (so
        two-column resumes get scrambled). The same resume can land very
        differently across the same role posted on different platforms.
      </>
    ),
  },
  {
    q: "What actually moves the needle in a job search?",
    a: (
      <>
        Referrals. Cold online applications convert to offers at{" "}
        <strong>0.1–2%</strong>. Referrals convert at <strong>~30%</strong> —
        roughly a <strong>30× lift</strong>. An hour spent finding one warm
        intro beats an hour tailoring a resume by roughly an order of magnitude.
        Use this scanner to catch real formatting and content problems; use the
        rest of your time to find a human at the company.
      </>
    ),
  },
  {
    q: "What about white text, prompt injection, and other 'hacks'?",
    a: (
      <>
        Don&apos;t. Modern ATS extract all text regardless of color and show it
        on the recruiter profile page. Prompt-injection works occasionally
        against naive LLM screeners and fails against everything else.
        Greenhouse, Workday, and Lever now flag hidden text and can attach a
        fraud marker to your candidate record — which follows you across every
        requisition at that company. We flag these in your scan so you
        don&apos;t accidentally tank your own application.
      </>
    ),
  },
];

export function HonestyPanel({ className }: HonestyPanelProps) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-card/60 p-6",
        className,
      )}
      aria-labelledby="honesty-panel-heading"
    >
      <div className="flex items-start gap-3 mb-4">
        <Info className="h-5 w-5 mt-0.5 text-primary shrink-0" />
        <div>
          <h2
            id="honesty-panel-heading"
            className="text-base font-semibold leading-tight"
          >
            How this scanner actually works
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            We don&apos;t pretend the score is a real ATS readout. Here&apos;s
            what&apos;s actually happening behind it.
          </p>
        </div>
      </div>
      <div className="divide-y divide-border">
        {FACTS.map((fact, index) => {
          const isOpen = open === index;
          return (
            <div key={fact.q} className="py-3">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : index)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-3 text-left text-sm font-medium text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
              >
                <span>{fact.q}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                    isOpen && "rotate-180",
                  )}
                />
              </button>
              {isOpen ? (
                <div className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {fact.a}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
