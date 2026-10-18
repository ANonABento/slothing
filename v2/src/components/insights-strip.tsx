import type { Insights, Stage } from "@/lib/insights";
import { Eyebrow } from "./ui";

const CELLS: { stage: Stage; label: string; title: string }[] = [
  { stage: "seen", label: "Seen", title: "Every posting you've opened or added" },
  { stage: "saved", label: "Saved", title: "Postings you moved to your jobs" },
  { stage: "applied", label: "Applied", title: "Jobs you applied to (applying twice counts once)" },
  { stage: "replied", label: "Replies", title: "Applications that got an answer: an interview, an offer or a rejection" },
  { stage: "interviewing", label: "Interviews", title: "Jobs that reached an interview, even if a rejection came after" },
  { stage: "offer", label: "Offers", title: "Jobs that reached an offer" },
];

/** On Jobs: how far your search has got, as counts. Each job counts once per stage, in the week it got there. */
export function InsightsStrip({ insights }: { insights: Insights }) {
  return (
    <section aria-label="Your search so far" className="grid grid-cols-3 gap-px overflow-hidden rounded-card border border-rule bg-rule shadow-paper md:grid-cols-6">
      {CELLS.map(({ stage, label, title }) => {
        const week = insights.week[stage];
        return (
          <div key={stage} title={title} className="bg-paper px-4 py-3">
            <Eyebrow>{label}</Eyebrow>
            <div className="mt-1 font-display text-2xl font-semibold tabular-nums tracking-tight">{insights.total[stage]}</div>
            <div className={week ? "text-xs text-ink-2" : "text-xs text-ink-3"}>{week} this week</div>
          </div>
        );
      })}
    </section>
  );
}
