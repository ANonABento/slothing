"use client";

import { ArrowRight, X } from "lucide-react";
import { DeepSection, HighlighterEm, MonoCap } from "./primitives";

/* ───────────────── Logo strip — "Scrapes from" marquee ─────────────────
 *
 * Horizontal infinite-scroll band of job-board names. Sits under the
 * hero as instant "this works on the boards you actually use"
 * credibility. Marquee is implemented with a 50% translate over
 * duplicated content so the loop is seamless. CSS keyframes inline.
 */
const SCRAPED_BOARDS = [
  { name: "LinkedIn", initial: "in" },
  { name: "WaterlooWorks", initial: "W" },
  { name: "Greenhouse", initial: "G" },
  { name: "Lever", initial: "L" },
  { name: "Workday", initial: "W" },
  { name: "Ashby", initial: "A" },
  { name: "Y Combinator", initial: "YC" },
  { name: "Indeed", initial: "in" },
  { name: "Wellfound", initial: "WF" },
  { name: "Otta", initial: "O" },
] as const;

export function LogoStrip() {
  // Duplicate the list so the marquee can loop cleanly at translate(-50%).
  const doubled = [...SCRAPED_BOARDS, ...SCRAPED_BOARDS];
  return (
    <section className="overflow-hidden border-y border-rule bg-page-2 py-7">
      <div className="mx-auto flex max-w-wrap items-center gap-7 px-8">
        <span className="flex-shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
          Scrapes from
        </span>
        {/* Mask the edges so items fade in/out as they enter/leave. */}
        <div
          className="flex-1 overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
          }}
        >
          <div className="logo-strip-track flex w-max gap-9">
            {doubled.map((board, idx) => (
              <span
                key={`${board.name}-${idx}`}
                className="inline-flex items-center gap-2 whitespace-nowrap text-[15px] font-semibold text-ink-2"
              >
                <span
                  className="grid h-[22px] w-[22px] place-items-center rounded-sm border border-rule bg-paper text-[10px] font-bold text-brand-dark"
                  aria-hidden="true"
                >
                  {board.initial}
                </span>
                {board.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Marquee animation. 38s loop; pauses on hover so users can read.
          Respects prefers-reduced-motion. */}
      <style jsx>{`
        @keyframes logo-strip-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        :global(.logo-strip-track) {
          animation: logo-strip-scroll 38s linear infinite;
        }
        :global(.logo-strip-track:hover) {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          :global(.logo-strip-track) {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}

/* ───────────────── Problem compare — Before / After ─────────────────
 *
 * The setup beat: "Job hunting wasn't supposed to need fifteen tabs."
 * Two cards on desktop, stacked on mobile. Left card = chaos (scattered
 * tab-stack visual). Right card = unified (slim queue mock). Sits
 * between the hero/logo-strip and the feature deep dives so the rest
 * of the landing has emotional context.
 */
const MESSY_TABS = [
  { label: "linkedin.com/jobs", x: 0, y: 0, rot: -3 },
  { label: "resume-final-v7.docx", x: 80, y: 14, rot: 2 },
  { label: "notion · roles tracker", x: 18, y: 34, rot: -1 },
  { label: "workday — page 3 of 5", x: 130, y: 48, rot: 4 },
  { label: "gmail · recruiter thread", x: 60, y: 64, rot: -2 },
  { label: "chatgpt — cover-letter draft", x: 160, y: 80, rot: 1 },
] as const;

export function ProblemCompare() {
  return (
    <DeepSection alt>
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <MonoCap>The problem</MonoCap>
        <h2 className="mt-4 font-display text-section-h2 text-ink">
          Job hunting wasn&rsquo;t supposed to need{" "}
          <HighlighterEm>fifteen tabs</HighlighterEm>.
        </h2>
        <p className="mt-4 text-[17px] leading-relaxed text-ink-2">
          Your career deserves one calm workspace, not a browser full of
          half-saved drafts.
        </p>
      </div>

      <div className="grid items-stretch gap-4 md:grid-cols-[1fr_56px_1fr]">
        {/* BEFORE — tab storm */}
        <article className="flex flex-col rounded-[16px] border border-rule bg-paper p-7 opacity-[0.92]">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-ink-3">
            <span className="mr-1.5 text-[#c75a4a]" aria-hidden>
              ✕
            </span>
            Before · the tab storm
          </span>
          <h3 className="mt-4 font-display text-[22px] font-bold tracking-tight text-ink">
            Everywhere at once
          </h3>
          <p className="mt-3 flex-1 text-[14px] leading-6 text-ink-2">
            Eight tabs to send one application. Resumes scattered across
            folders. The good bullet — somewhere in a 2022 cover letter.
          </p>

          {/* Stack-of-tabs visual */}
          <div className="relative mt-4 h-[110px]">
            {MESSY_TABS.map((tab, idx) => (
              <span
                key={tab.label}
                className="absolute inline-flex h-[26px] items-center gap-1.5 rounded-md border border-rule bg-page px-2.5 font-mono text-[11px] text-ink-3 shadow-paper-card"
                style={{
                  left: `${tab.x}px`,
                  top: `${tab.y}px`,
                  transform: `rotate(${tab.rot}deg)`,
                  zIndex: idx + 1,
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full bg-ink-3/60"
                  aria-hidden
                />
                {tab.label}
              </span>
            ))}
          </div>
        </article>

        {/* Arrow */}
        <div className="flex items-center justify-center text-ink-3 md:rotate-0">
          <ArrowRight className="hidden h-6 w-12 md:block" aria-hidden="true" />
          <ArrowRight
            className="block h-6 w-12 rotate-90 md:hidden"
            aria-hidden="true"
          />
        </div>

        {/* AFTER — unified */}
        <article className="flex flex-col rounded-[16px] border border-rule bg-paper p-7">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-ink-3">
            <span className="mr-1.5 text-brand" aria-hidden>
              ✓
            </span>
            After · one workspace
          </span>
          <h3 className="mt-4 font-display text-[22px] font-bold tracking-tight text-ink">
            Everything in one place
          </h3>
          <p className="mt-3 flex-1 text-[14px] leading-6 text-ink-2">
            One queue for roles, one bank for stories, one editor for tailored
            docs. Your career, in one calm tab.
          </p>

          {/* Mini unified queue mock */}
          <div className="mt-4 overflow-hidden rounded-[10px] border border-rule bg-page">
            <div className="flex items-center gap-1.5 border-b border-rule px-3 py-2 font-mono text-[11px] text-ink-3">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden />
              slothing · job queue
            </div>
            <div className="divide-y divide-rule">
              {[
                {
                  initial: "L",
                  name: "Senior Engineer",
                  co: "Linear",
                  status: "Applied",
                  tone: "applied",
                },
                {
                  initial: "▲",
                  name: "Backend",
                  co: "Vercel",
                  status: "Interview",
                  tone: "interview",
                },
                {
                  initial: "F",
                  name: "Design Eng",
                  co: "Figma",
                  status: "To apply",
                  tone: "apply",
                },
              ].map((row) => (
                <div
                  key={`${row.name}-${row.co}`}
                  className="flex items-center gap-2.5 px-3 py-2 text-[12px]"
                >
                  <span
                    className="grid h-5 w-5 place-items-center rounded-sm border border-rule bg-paper font-bold text-brand-dark"
                    aria-hidden
                  >
                    {row.initial}
                  </span>
                  <span className="flex-1 text-ink-2">
                    <span className="font-medium text-ink">{row.name}</span>
                    <span className="text-ink-3"> · {row.co}</span>
                  </span>
                  <CompareStatusPill tone={row.tone as Tone}>
                    {row.status}
                  </CompareStatusPill>
                </div>
              ))}
            </div>
          </div>
        </article>
      </div>
    </DeepSection>
  );
}

type Tone = "apply" | "applied" | "interview";

function CompareStatusPill({
  tone,
  children,
}: {
  tone: Tone;
  children: React.ReactNode;
}) {
  const cls =
    tone === "apply"
      ? "bg-brand-soft text-brand-dark"
      : tone === "applied"
        ? "bg-[var(--stage-applied-bg)] text-[var(--stage-applied-fg)]"
        : "bg-[var(--stage-interview-bg)] text-[var(--stage-interview-fg)]";
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide ${cls}`}
    >
      {children}
    </span>
  );
}

/* ───────────────── Closer stats — 4 numbers in the closer ─────────────────
 *
 * Sits inside the existing <Closer/>, BUT can also be rendered standalone.
 * Numbers are honest placeholders; swap when we have real data.
 */
const CLOSER_STATS = [
  { num: "BYOK", cap: "Bring your key" },
  { num: "AGPL", cap: "Open license" },
  { num: "$0", cap: "Free forever (hosted free tier)" },
  { num: "100%", cap: "Self-hostable" },
] as const;

export function CloserStats() {
  return (
    <div className="mt-10 flex flex-wrap gap-9 border-t border-[rgba(255,255,255,0.12)] pt-8 dark:border-rule">
      {CLOSER_STATS.map((stat) => (
        <div key={stat.num}>
          <div className="font-display text-[28px] font-bold tracking-tight leading-none text-inverse-ink">
            {stat.num}
          </div>
          <div className="mt-1.5 text-[12.5px] text-inverse-ink/55">
            {stat.cap}
          </div>
        </div>
      ))}
    </div>
  );
}
