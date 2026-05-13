import {
  DashList,
  DeepEyebrow,
  DeepGrid,
  DeepSection,
  HighlighterEm,
  MonoCap,
} from "./primitives";

/* ───────────────── 01 · Knowledge Bank ───────────────── */
export function KnowledgeBankSection() {
  return (
    <DeepSection id="feat-bank">
      <DeepGrid>
        <div className="flex flex-col gap-5">
          <DeepEyebrow number="01" label="Knowledge Bank" />
          <h2 className="max-w-[14ch] font-display text-section-h2 text-ink">
            Every story you&rsquo;ve <HighlighterEm>ever told</HighlighterEm>,
            in one place.
          </h2>
          <p className="max-w-[50ch] text-lede text-ink-2">
            Drop in a resume or paste an essay and Slothing extracts the
            evidence — projects, impact, leadership moments, skills — into a
            knowledge bank you can remix for any application.
          </p>
          <DashList
            items={[
              "Extracts STAR stories and quantified impact",
              "Tags by role family, skill, and seniority",
              "Reuses across resumes, cover letters, and interview prep",
            ]}
          />
        </div>

        <div className="rounded-xl border border-rule bg-paper p-6 shadow-paper-card">
          <div className="rounded-lg border border-rule bg-page p-4">
            <MonoCap>Resume_v3.pdf</MonoCap>
            <div className="mt-2 font-display text-[18px] font-bold text-ink">
              Maya Chen — Senior PM
            </div>
            <div className="mt-2 space-y-1.5 text-[12.5px] text-ink-3">
              <div className="rounded-sm bg-brand-soft px-2 py-1 text-ink-2">
                Led 0→1 launch for billing platform — $4.2M ARR yr 1
              </div>
              <div className="px-2 py-1">Standard line of resume copy here</div>
              <div className="rounded-sm bg-brand-soft px-2 py-1 text-ink-2">
                Mentored 6 PMs across two re-orgs
              </div>
              <div className="px-2 py-1">Another standard line</div>
            </div>
          </div>

          <div className="mt-5 grid gap-2">
            {[
              ["Architecture decisions on payment rails", "arch"],
              ["38% retention lift through onboarding", "impact"],
              ["Shipped ML eval harness in 6 weeks", "ml"],
              ["Mentored 6 PMs to senior", "lead"],
              ["Maintains 3 OSS libraries", "oss"],
            ].map(([text, tag]) => (
              <div
                key={tag}
                className="flex items-center gap-3 rounded-full border border-rule bg-page px-3 py-2 text-[13px] text-ink-2"
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand" />
                <span className="flex-1">{text}</span>
                <MonoCap className="text-[10px]">{tag}</MonoCap>
              </div>
            ))}
          </div>
        </div>
      </DeepGrid>
    </DeepSection>
  );
}

/* ───────────────── 02 · Browser scraper (alt band) ───────────────── */
export function ExtensionSection() {
  return (
    <DeepSection id="feat-scrape" alt>
      <DeepGrid reverse>
        <div className="rounded-xl border border-rule bg-paper p-6 shadow-paper-card">
          <div className="flex items-center gap-2 border-b border-rule pb-3">
            <span className="h-3 w-3 rounded-full bg-brand-soft" />
            <span className="h-3 w-3 rounded-full bg-brand-soft" />
            <span className="h-3 w-3 rounded-full bg-brand-soft" />
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-md border border-rule bg-page px-3 py-2 text-[12px] text-ink-3">
            <span>🔒</span>
            <span className="flex-1 truncate">
              linkedin.com/jobs/search?keywords=design+engineer
            </span>
            <MonoCap className="text-[10px]">v0.4</MonoCap>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-md bg-brand-soft px-3 py-2 text-[13px] text-ink-2">
            <span>✓</span>
            <span className="flex-1">
              <strong>Detected:</strong> LinkedIn · 47 listings on this page
            </span>
            <span className="rounded-full bg-paper px-2 py-0.5 font-mono text-[10px] uppercase text-ink-3">
              scraping
            </span>
          </div>

          <ul className="mt-4 space-y-2 text-[13px]">
            {[
              [
                "Linear",
                "Design Engineer · Remote",
                "✓ Imported",
                "text-ink-3",
              ],
              [
                "Notion",
                "Senior Product Designer · NYC",
                "Importing…",
                "text-ink",
              ],
              ["Figma", "Brand Designer · SF", "✓ Imported", "text-ink-3"],
              ["Vercel", "Product Engineer · Remote", "Queued", "text-ink-3"],
              ["Stripe", "Design Engineer · Remote", "Queued", "text-ink-3"],
            ].map(([co, role, status, color]) => (
              <li
                key={co}
                className="flex items-center justify-between gap-3 border-b border-rule pb-2 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-page text-[11px] font-semibold text-ink-2">
                    {(co as string)[0]}
                  </span>
                  <div>
                    <div className="text-ink">{co}</div>
                    <div className="text-[12px] text-ink-3">{role}</div>
                  </div>
                </div>
                <span className={`text-[12.5px] ${color}`}>{status}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex items-center justify-between text-[12px] text-ink-3">
            <MonoCap>3 / 47 imported</MonoCap>
            <span className="rounded-md border border-rule bg-page px-2 py-1 font-mono">
              ⌘ ⇧ I to import current page
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <DeepEyebrow number="02" label="Browser scraper" />
          <h2 className="max-w-[14ch] font-display text-section-h2 text-ink">
            One keystroke from <HighlighterEm>job board</HighlighterEm> to your
            pipeline.
          </h2>
          <p className="max-w-[50ch] text-lede text-ink-2">
            The Slothing browser extension reads any listing on LinkedIn,
            Greenhouse, Workday, or Lever and drops it straight into your review
            queue — with role, company, comp, and full JD captured.
          </p>
          <DashList
            items={[
              "Works on the 5 biggest ATS platforms out of the box",
              "Imports listing pages in bulk with one keystroke",
              "Routes through review before hitting your tracked list",
            ]}
          />
        </div>
      </DeepGrid>
    </DeepSection>
  );
}

/* ───────────────── 03 · ATS match ───────────────── */
export function ATSMatchSection() {
  return (
    <DeepSection id="feat-ats">
      <DeepGrid>
        <div className="flex flex-col gap-5">
          <DeepEyebrow number="03" label="ATS match" />
          <h2 className="max-w-[14ch] font-display text-section-h2 text-ink">
            See exactly why a resume{" "}
            <HighlighterEm>does or doesn&rsquo;t</HighlighterEm> match.
          </h2>
          <p className="max-w-[50ch] text-lede text-ink-2">
            Paste a JD, get a per-keyword breakdown, seniority fit, and the one
            swap that pushes your match score over 90.
          </p>
          <DashList
            items={[
              "Keyword coverage, weighted by recency and impact",
              "Seniority + tenure fit with confidence band",
              "One-click suggested swaps to lift your score",
            ]}
          />
        </div>

        <div className="rounded-xl border border-rule bg-paper p-6 shadow-paper-card">
          <div className="flex items-center justify-between border-b border-rule pb-3">
            <MonoCap>figma-design-engineer.md · 2 min ago</MonoCap>
          </div>

          <div className="mt-5 flex items-center justify-between gap-6">
            <div>
              <div className="text-[14px] text-ink-2">Design Engineer</div>
              <div className="font-display text-[20px] font-bold text-ink">
                Figma · Remote
              </div>
            </div>
            <div className="relative h-24 w-24">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  stroke="var(--rule)"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  stroke="var(--brand)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${0.95 * 2 * Math.PI * 44} ${2 * Math.PI * 44}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-[22px] font-bold text-ink">
                  95
                </span>
                <MonoCap className="text-[9px]">% MATCH</MonoCap>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-[12.5px] text-ink-3">
              <span>Keyword coverage</span>
              <span>88%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-page">
              <div
                className="h-full rounded-full bg-brand"
                style={{ width: "88%" }}
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {["React", "TypeScript", "Design systems", "Figma", "CSS"].map(
                (k) => (
                  <span
                    key={k}
                    className="rounded-full bg-brand-soft px-2.5 py-0.5 text-[11.5px] text-ink-2"
                  >
                    ✓ {k}
                  </span>
                ),
              )}
              {["WebGL", "Motion"].map((k) => (
                <span
                  key={k}
                  className="rounded-full border border-rule bg-page px-2.5 py-0.5 text-[11.5px] text-ink-3"
                >
                  × {k}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2 rounded-md bg-brand-soft p-3 text-[13px] text-ink-2">
            <span>⚡</span>
            <span>
              Swap &ldquo;maintained components&rdquo; →{" "}
              <strong>&ldquo;designed motion system&rdquo;</strong> to push to
              98%
            </span>
          </div>
        </div>
      </DeepGrid>
    </DeepSection>
  );
}

/* ───────────────── 04 · Form autofill (alt band) ───────────────── */
export function FormAutofillSection() {
  return (
    <DeepSection id="feat-autofill" alt>
      <DeepGrid reverse>
        <div className="relative rounded-xl border border-rule bg-paper p-6 shadow-paper-card">
          <div className="flex items-center gap-2 border-b border-rule pb-3">
            <span className="h-3 w-3 rounded-full bg-brand-soft" />
            <span className="h-3 w-3 rounded-full bg-brand-soft" />
            <span className="h-3 w-3 rounded-full bg-brand-soft" />
          </div>
          <div className="mt-3 mb-5 text-[12px] text-ink-3">
            boards.greenhouse.io/apply · Figma
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-[12.5px] text-ink-3">
                Full name
              </label>
              <div className="rounded-md border border-rule bg-page px-3 py-2 text-[14px] text-ink">
                Maya Chen
              </div>
            </div>
            <div>
              <label className="mb-1 block text-[12.5px] text-ink-3">
                Why are you interested?
              </label>
              <div className="rounded-md border-2 border-brand bg-page px-3 py-2 text-[14px] text-ink">
                Figma is one of the rare design tools that ships
                <span className="ml-px inline-block h-4 w-px translate-y-[3px] bg-brand animate-caret-blink" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-[12.5px] text-ink-3">
                Work authorization
              </label>
              <div className="rounded-md border border-rule bg-page px-3 py-2 text-[14px] text-ink">
                US citizen · No sponsorship needed
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-lg bg-inverse p-4 text-inverse-ink">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[12.5px]">
                <span>🦥</span>
                <span>Slothing</span>
              </div>
              <span className="rounded-md bg-page/20 px-2 py-0.5 font-mono text-[10px] uppercase">
                ⌘ ⇧ F
              </span>
            </div>
            <div className="mt-2 text-[13px] opacity-80">
              Drafted from Knowledge Bank using your design-engineer voice
              preset
            </div>
            <div className="mt-3 flex items-center gap-2">
              <button className="rounded-md border border-current/20 px-3 py-1.5 text-[12px]">
                Skip
              </button>
              <button className="rounded-md bg-inverse-ink px-3 py-1.5 text-[12px] text-inverse">
                Fill ↵
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <DeepEyebrow number="04" label="Form autofill" />
          <h2 className="max-w-[14ch] font-display text-section-h2 text-ink">
            Stop <HighlighterEm>retyping</HighlighterEm> your story into every
            form.
          </h2>
          <p className="max-w-[50ch] text-lede text-ink-2">
            Slothing reads any application form and drafts each free-response
            field using examples from your Knowledge Bank — in your voice, with
            evidence you already wrote down once.
          </p>
          <DashList
            items={[
              "Works inside Greenhouse, Lever, Workday, Ashby, and Slothing-native flows",
              "Draws from voice presets you can swap per role family",
              "Always editable before submit — never silent autosubmit",
            ]}
          />
        </div>
      </DeepGrid>
    </DeepSection>
  );
}

/* ───────────────── 05 · Interview prep ───────────────── */
export function InterviewPrepSection() {
  return (
    <DeepSection id="feat-interview">
      <DeepGrid>
        <div className="flex flex-col gap-5">
          <DeepEyebrow number="05" label="Interview prep" />
          <h2 className="max-w-[14ch] font-display text-section-h2 text-ink">
            Real interview prep, not <HighlighterEm>flashcards</HighlighterEm>.
          </h2>
          <p className="max-w-[50ch] text-lede text-ink-2">
            Speak (or type) your answer. Slothing scores structure, specificity,
            and tradeoff-reasoning, and points at a tighter version of the same
            story from your bank.
          </p>
          <DashList
            items={[
              "Voice mode with on-device transcription",
              "Per-axis scoring with specific rewrite suggestions",
              "Tracks recurring weak spots across sessions",
            ]}
          />
        </div>

        <div className="rounded-xl border border-rule bg-paper p-6 shadow-paper-card">
          <div className="space-y-3">
            <div className="max-w-[80%] rounded-2xl bg-page-2 px-4 py-2.5 text-[14px] text-ink-2">
              Tell me about a time you disagreed with your manager.
            </div>
            <div className="ml-auto max-w-[80%] rounded-2xl bg-ink px-4 py-2.5 text-[14px] text-page">
              Our 2024 roadmap had us building a model marketplace, but the data
              said most users wanted better eval tools. I pushed back with a
              3-week prototype that we ended up shipping instead…
            </div>
          </div>

          <div className="mt-5 rounded-lg border border-rule bg-page p-4">
            <MonoCap>Feedback</MonoCap>
            <ul className="mt-2 space-y-1.5 text-[13px]">
              <li className="flex items-center justify-between">
                <span className="text-ink-2">Structure</span>
                <span className="font-mono font-medium text-ink">8.2</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-ink-2">Specificity</span>
                <span className="font-mono font-medium text-ink">7.4</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-ink-2">Tradeoff reasoning</span>
                <span className="font-mono font-medium text-brand">9.1</span>
              </li>
            </ul>
            <p className="mt-3 italic text-[12.5px] text-ink-3">
              &ldquo;Strong tradeoff framing — name the alternative you said no
              to, and you&rsquo;ll land a 9 across the board.&rdquo;
            </p>
          </div>
        </div>
      </DeepGrid>
    </DeepSection>
  );
}
