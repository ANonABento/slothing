import Link from "next/link";
import { Globe, Lock, Plug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeepSection, HighlighterEm, LogoChip, MonoCap } from "./primitives";

/* ───────────────── Integrations strip ───────────────── */
export function IntegrationsStrip() {
  return (
    <DeepSection>
      <div className="flex flex-col items-center gap-4 text-center">
        <MonoCap>Built for the long haul</MonoCap>
        <h2 className="max-w-[20ch] font-display text-section-h2 text-ink">
          Built for everyone who&rsquo;s{" "}
          <HighlighterEm>job hunting</HighlighterEm>.
        </h2>
      </div>

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        <div className="rounded-xl border border-rule bg-paper p-7 shadow-paper-card">
          <Globe className="h-5 w-5 text-brand" />
          <h3 className="mt-4 font-display text-[20px] font-bold text-ink">
            Internationalization
          </h3>
          <p className="mt-2 text-[14px] text-ink-2">
            Localized resumes and forms across nine languages and the résumé/CV
            conventions of US, EU, UK, Japan, and APAC.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <LogoChip>🇺🇸 US résumé</LogoChip>
            <LogoChip>🇨🇦 CA résumé</LogoChip>
            <LogoChip>🇪🇺 Europass</LogoChip>
            <LogoChip>🇬🇧 UK CV</LogoChip>
            <LogoChip>🇯🇵 履歴書</LogoChip>
            <LogoChip>🇸🇬 + APAC</LogoChip>
          </div>
        </div>

        <div className="rounded-xl border border-rule bg-paper p-7 shadow-paper-card">
          <Lock className="h-5 w-5 text-brand" />
          <h3 className="mt-4 font-display text-[20px] font-bold text-ink">
            Local &amp; private by default
          </h3>
          <p className="mt-2 text-[14px] text-ink-2">
            Bring your own keys. Run a local model. Keep your job search out of
            someone else&rsquo;s telemetry.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <LogoChip>Ollama</LogoChip>
            <LogoChip>OpenAI</LogoChip>
            <LogoChip>Anthropic</LogoChip>
            <LogoChip>OpenRouter</LogoChip>
          </div>
        </div>

        <div className="rounded-xl border border-rule bg-paper p-7 shadow-paper-card">
          <Plug className="h-5 w-5 text-brand" />
          <h3 className="mt-4 font-display text-[20px] font-bold text-ink">
            Plays well with your tools
          </h3>
          <p className="mt-2 text-[14px] text-ink-2">
            Sync interviews to Calendar, import résumés from Drive, draft emails
            into Gmail. We don&rsquo;t lock anything up.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <LogoChip>Calendar</LogoChip>
            <LogoChip>Drive</LogoChip>
            <LogoChip>Gmail</LogoChip>
            <LogoChip>Docs</LogoChip>
            <LogoChip>Tasks</LogoChip>
          </div>
        </div>
      </div>
    </DeepSection>
  );
}

/* ───────────────── How it works (1-2-3 numbered) ───────────────── */
export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Drop in your resume",
      body: "Slothing parses, atomizes, and stores every bullet, story, and project in your Knowledge Bank. Use the browser extension to grab jobs from any board in one click.",
    },
    {
      number: "02",
      title: "Score every JD",
      body: "Paste a job description and Slothing scores it against your bank in seconds. Match thresholds tell you whether to apply, tailor, or skip.",
    },
    {
      number: "03",
      title: "Tailor + autofill",
      body: "Studio assembles a tailored resume from your bank. The extension fills application forms with your saved answers. You ship the application, not your weekends.",
    },
  ] as const;

  return (
    <DeepSection id="how-it-works">
      <div className="flex flex-col items-center gap-4 text-center">
        <MonoCap>How it works</MonoCap>
        <h2 className="max-w-[20ch] font-display text-section-h2 text-ink">
          Three steps, then it&rsquo;s a <HighlighterEm>system</HighlighterEm>.
        </h2>
      </div>

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {steps.map((step) => (
          <article
            key={step.number}
            className="flex flex-col rounded-xl border border-rule bg-paper p-7"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
              Step {step.number}
            </span>
            <h3 className="mt-3 font-display text-[22px] font-bold leading-tight text-ink">
              {step.title}
            </h3>
            <p className="mt-3 text-[14px] leading-6 text-ink-2">{step.body}</p>
          </article>
        ))}
      </div>
    </DeepSection>
  );
}

/* ───────────────── Job-queue product preview ───────────────── */
export function JobQueuePreview() {
  const rows: [
    string,
    string,
    string,
    "apply" | "applied" | "interview" | "saved",
    number,
    string,
    string,
  ][] = [
    [
      "Design Engineer",
      "Figma",
      "Apply",
      "apply",
      95,
      "Today",
      "Tailor resume",
    ],
    [
      "Senior PM",
      "Linear",
      "Applied",
      "applied",
      88,
      "2d ago",
      "Wait for reply",
    ],
    [
      "Product Engineer",
      "Vercel",
      "Interview",
      "interview",
      91,
      "5d ago",
      "Phone screen Tue",
    ],
    [
      "Brand Designer",
      "Notion",
      "Saved",
      "saved",
      74,
      "1w ago",
      "Decide by Fri",
    ],
    [
      "Founding Designer",
      "Replicate",
      "Apply",
      "apply",
      86,
      "Today",
      "Write cover letter",
    ],
    ["UX Engineer", "Stripe", "Saved", "saved", 78, "2w ago", "—"],
  ];
  const statusClasses: Record<(typeof rows)[number][3], string> = {
    apply: "bg-brand-soft text-ink-2",
    applied:
      "bg-[color-mix(in_srgb,hsl(var(--success))_18%,transparent)] text-[hsl(var(--success))]",
    interview:
      "bg-[color-mix(in_srgb,hsl(var(--warning))_18%,transparent)] text-[hsl(var(--warning))]",
    saved: "bg-page-2 text-ink-3",
  };

  return (
    <DeepSection>
      <div className="text-center">
        <MonoCap>A look inside</MonoCap>
        <h2 className="mt-4 font-display text-section-h2 text-ink">
          Your <HighlighterEm>job queue</HighlighterEm>, one screen.
        </h2>
      </div>

      <div className="mt-12 rounded-xl border border-rule bg-paper p-6 shadow-paper-elevated">
        <div className="flex items-center justify-between gap-4 border-b border-rule pb-4">
          <div className="flex items-center gap-2 rounded-md border border-rule bg-page px-3 py-1.5 text-[13px] text-ink-3">
            <span>⌘K</span>
            <span>Search opportunities…</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              ["All", 23, true],
              ["To apply", 8, false],
              ["Applied", 10, false],
              ["Interview", 3, false],
              ["Offer", 2, false],
            ].map(([label, count, active]) => (
              <span
                key={label as string}
                className={`rounded-full px-3 py-1 text-[12.5px] ${
                  active ? "bg-page text-ink" : "text-ink-3 hover:text-ink"
                }`}
              >
                {label}{" "}
                <span className="ml-1 text-ink-3 font-mono text-[11px]">
                  {count}
                </span>
              </span>
            ))}
          </div>
        </div>

        <table className="mt-3 w-full text-left text-[13.5px]">
          <thead>
            <tr className="text-ink-3">
              <th className="py-2 font-mono text-mono-cap uppercase">Role</th>
              <th className="py-2 font-mono text-mono-cap uppercase">
                Company
              </th>
              <th className="py-2 font-mono text-mono-cap uppercase">Status</th>
              <th className="py-2 font-mono text-mono-cap uppercase">Match</th>
              <th className="py-2 font-mono text-mono-cap uppercase">Added</th>
              <th className="py-2 font-mono text-mono-cap uppercase">
                Next step
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(
              ([role, company, status, statusKey, match, added, next]) => (
                <tr key={role} className="border-t border-rule">
                  <td className="py-3 text-ink">{role}</td>
                  <td className="py-3 text-ink-2">{company}</td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-medium ${statusClasses[statusKey]}`}
                    >
                      {status}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-14 overflow-hidden rounded-full bg-page-2">
                        <div
                          className="h-full bg-brand"
                          style={{ width: `${match}%` }}
                        />
                      </div>
                      <span className="font-mono text-[11.5px] text-ink-3">
                        {match}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-ink-3">{added}</td>
                  <td className="py-3 text-ink-2">{next}</td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </DeepSection>
  );
}

/* ───────────────── Closer (inverse block) ───────────────── */
export function Closer() {
  return (
    <DeepSection>
      <div className="rounded-2xl bg-inverse p-10 text-inverse-ink md:p-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
          <div>
            <h2 className="font-display text-closer-h2">
              Job-hunting is hard.{" "}
              <em className="not-italic italic text-brand">Slothing</em> helps.
            </h2>
            <p className="mt-4 max-w-[44ch] text-[17px] opacity-80">
              Free to try. Free to self-host. Pay only when you want our cloud
              to handle the boring bits.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" variant="default">
                <Link href="/sign-in">Get started free</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="https://github.com/ANonABento/slothing">
                  ★ Star on GitHub
                </a>
              </Button>
            </div>
          </div>
          <div className="rounded-xl border border-current/20 bg-inverse-ink/5 p-6">
            <p className="font-display text-[19px] italic leading-snug">
              &ldquo;Slothing turned the most chaotic three months of my career
              into something I could actually look at without flinching.&rdquo;
            </p>
            <div className="mt-4 flex items-center gap-3 text-[13px]">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-current/15 font-mono">
                MC
              </span>
              <div>
                <div className="font-medium">Maya Chen</div>
                <div className="opacity-70">Senior PM · landed at Figma</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DeepSection>
  );
}

/* ───────────────── Footer ───────────────── */
export function LandingFooter() {
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto w-full max-w-wrap px-5 py-12 md:px-10 md:py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="font-display text-[18px] font-bold text-ink">
              Slothing
            </div>
            <p className="mt-2 text-[13px] text-ink-3">
              A calmer way to job hunt. Free and open source.
            </p>
          </div>
          <FooterCol
            title="Product"
            links={[
              ["Studio", "/studio"],
              ["Opportunities", "/opportunities"],
              ["Interview prep", "/interview"],
              ["Pricing", "/pricing"],
            ]}
          />
          <FooterCol
            title="Open source"
            links={[
              ["GitHub", "https://github.com/ANonABento/slothing"],
              ["Self-host docs", "/docs/self-host"],
              ["License", "/docs/license"],
              ["Roadmap", "https://github.com/ANonABento/slothing/projects"],
            ]}
          />
          <FooterCol
            title="Community"
            links={[
              ["Discord", "https://discord.gg/slothing"],
              [
                "Discussions",
                "https://github.com/ANonABento/slothing/discussions",
              ],
              ["Issues", "https://github.com/ANonABento/slothing/issues"],
              ["Changelog", "/changelog"],
            ]}
          />
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-rule pt-6 text-[12.5px] text-ink-3 md:flex-row">
          <span>© 2026 Slothing</span>
          <MonoCap>v0.4 · cream · rust · outfit · soft</MonoCap>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: [string, string][];
}) {
  return (
    <div>
      <MonoCap>{title}</MonoCap>
      <ul className="mt-3 space-y-2 text-[13.5px]">
        {links.map(([label, href]) => (
          <li key={label}>
            <a href={href} className="text-ink-2 hover:text-ink">
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
