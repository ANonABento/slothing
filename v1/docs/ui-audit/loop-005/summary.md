# Loop 005 — Summary & Fix Plan

**Audit run:** 2026-05-13, 75 captures against the post-loop-004 build. 0 capture failures, 195 console errors (all dev-env 500s, unchanged).

## Verification of loop-004 fixes (visual)

| Fix | Loop-005 evidence |
| --- | --- |
| **C1 `<StatusPill />`** | Visible on `opportunities-1280`: "Pending" warning pill, "Saved" secondary pill on Climate Data Sprint / Frontend Platform Engineer rows. Replaces the previous capitalize+outline badge. Distinct from the type badge. |
| **N1 PageHeader icon** | Visible on `opportunities-1280` (Sparkles icon tile next to "Opportunities" title) and across every authenticated route. Icon prop is no longer silently dropped. |
| **B4 profile load-error overlap** | `profile-1280` now renders only an `<ErrorState>` card with "Try Again" button when initial `/api/profile` fails. The active editor + fake 0% completeness is gone. |

Lighter audit this iteration — full 5-agent re-audit reserved for loop-006 (or until a fix lands that warrants re-counting).

## Loop 005 fixes

Picked three high-impact, low-risk wins from the loop-001/004 backlog rather than the bigger C2 OpportunityCard refactor (see deferral note below).

| ID | Fix | Files |
| --- | --- | --- |
| **vs-index H1** | Comparator cards on `/vs` now use `bg-card` + `shadow-sm` + `hover:border-primary/40` instead of empty bordered boxes. They look like product chrome, not stubs. Card body uses `flex flex-col` with `flex-1` summary so the Compare button hugs the bottom even when summaries vary in length. | `apps/web/src/app/[locale]/(marketing)/vs/page.tsx` |
| **ats-scanner M1** | `max-w-3xl` → `max-w-4xl`. The scanner page was stranding content in a 48rem column at 1920, leaving ~576px of empty gutter on each side. Bumping to 56rem closes most of that without making the input fields too wide for comfortable scanning. | `apps/web/src/app/[locale]/(marketing)/ats-scanner/page.tsx` |
| **pricing M1** | Plan-column headers (`Feature` / `Self-host` / `Hosted Free` / `Weekly` / `Monthly`) get `whitespace-nowrap`. The table already wraps in `overflow-x-auto` with `min-w-[820px]`, so the no-wrap headers won't add visible scrollbar at standard widths — they just stop "Self-host" from wrapping inside its column at 1280/1440. | `apps/web/src/app/[locale]/(marketing)/pricing/page.tsx` |

## C2 OpportunityCard — re-evaluated, deferred

Loop-001 flagged three independent OpportunityCard implementations as a Tier C consolidation candidate. After re-reading all three for loop-005:

- **List row** (`opportunities/page.tsx:1093+`, ~100 lines): xl two-column layout, full meta strip with status `<Select>`, salary, deadline, location, external-source button, team-size for hackathons.
- **Kanban card** (`opportunities/_components/kanban-board.tsx:370+`, ~55 lines): compact, draggable (handle, on-drag opacity), no status select, no source button, no salary, limited tags.
- **Review swipe card** (`components/opportunities/review-queue.tsx:249+`, ~80 lines): focused single-card hero treatment with motion drag handlers, dismiss/save/apply tri-action grid below.

Each card serves a visually-distinct UX context. The actual duplication is narrow — primarily the title + company block, which differs in font scale/line-clamp per surface anyway. Forcing all three through `<OpportunityCard variant=…>` would either bloat the props surface or compromise visual differentiation.

**Better path forward (loop-006+):** extract the genuinely-shared sub-piece, the type-badge + StatusPill cluster, into `<OpportunityCardChips>`. That's a 3-line wrapper that hides on the 3 surfaces. The full card refactor is over-engineering and stays Tier C/deferred indefinitely.

## C3 marketing primitives — deferred

Marketing routes still have 27 M findings and 5 different `max-w-*` caps across 8 routes (loop-001). Extracting `<MarketingHero>` / `<MarketingSection>` / `<MarketingSectionHeader>` is high-leverage but needs:

1. Design alignment on a canonical max-w (4xl? 6xl?).
2. Light adoption on home (composes its hero from a separate `./components/hero.tsx`) means refactoring the hero component too.
3. Risk of breaking the pricing page tests (loop-004 agents counted 5 M findings there).

Deferring to loop-006 with proper agent scoping rather than rushing it in this iteration's context budget.

## Exit criteria check

13 H + 80 M [STILL] as of loop-004. Loop-005 shipped 3 targeted M fixes (vs-index card polish, ats-scanner stranding, pricing wrap). Estimated new state: ~13 H + ~77 M. **Continue** to loop-006.
