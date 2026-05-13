# `interview` — `/en/interview`

**Source:** `apps/web/src/app/[locale]/(app)/interview/page.tsx`
**Widths audited:** 1280 / 1440 / 1920
**Loop:** 001

## Screenshots

- 1280: `../screenshots/interview-1280.png`
- 1440: `../screenshots/interview-1440.png`
- 1920: `../screenshots/interview-1920.png`

## Findings

### High

- **[H1]** Error toast stack overlaps category cards — at all three widths a vertical stack of four "Could not load interview jobs / sessions" toasts is anchored to the bottom-right and visually covers the third category card ("Situational"). At 1280 the entire Situational card body is hidden behind the toasts; at 1440 the title and description are partially hidden; at 1920 the toasts still sit on top of the right portion of the Situational card. The page's hero CTA is "Add an Opportunity" but the Situational card is unreadable. Fix: dismiss toasts after the empty-state is shown, dedupe identical toasts (currently 2x duplicate pair), and/or reposition the toast stack so it does not overlap content. Cite `apps/web/src/app/[locale]/(app)/interview/page.tsx:122-152` and the underlying `useInterviewSession` hook fetch failure handling. Width: 1280, 1440, 1920.

- **[H2]** Voice/text mode toggle not visible in the empty state — the page advertises "Practice with AI-generated questions" but the only mode-selection UX (text vs. voice) is rendered inside `InterviewJobSelection` per-job. With zero opportunities the user sees three category cards with no way to start text-only practice from this view. The cards say "start anytime" but are not buttons (compare with the centered "Add an Opportunity" CTA). The "Quick Practice" entry point exists in code (`openQuickPractice`, `apps/web/src/app/[locale]/(app)/interview/page.tsx:65-71`) but is not surfaced in the empty state shown. Width: 1280, 1440, 1920.

### Medium

- **[M1]** IntlError missing-message — the PageHeader title comes from `a11yT("interviewPreparation")` (`apps/web/src/app/[locale]/(app)/interview/page.tsx:131`). Console reports a missing-message intl error in this loop. The title still renders as "Interview Preparation" because the a11y wrapper falls back to the key, but the error is noisy and breaks i18n contracts. Add the key to `messages/en.json`. Width: all (translation gap, not layout).

- **[M2]** Three-card category grid is awkward at 1280 — `Behavioral / Technical / Situational` use `grid-cols-3` with no responsive collapse. At 1280 they're tight; combined with the toast overlay (H1) the third card is effectively invisible. Consider `sm:grid-cols-1 md:grid-cols-3` and ensure cards remain interactive (today they look button-like but only `Add an Opportunity` is the actual CTA). Width: 1280.

- **[M3]** Duplicate "Fresh track • start anytime" microcopy across all three cards adds noise without information. Width: all.

### Low

- **[L1]** "No Opportunities to Practice For" sentence-case is inconsistent with other empty-state titles in the app which use sentence case ("No upcoming events", "No offers yet"). Width: all.

## Cross-cutting observations

- **PageHeader is shared.** This route uses the same `<PageHeader>` from `apps/web/src/components/ui/page-layout.tsx:49` as calendar, emails, analytics, salary. Good: title + description + actions slot is consistent. Bad: the three "category cards" pattern here looks like the document/email-template card pattern but uses different paddings, no border-on-hover, and is non-interactive — three near-identical card grids exist across interview, emails, and documents that could share a `<TemplateCard />` primitive.
- **Toast positioning collides with primary content** in this and other pages where action lives on the right; the toast stack should dismiss on first display when the underlying state is "empty + retryable" rather than persistently re-fire.

## Console / runtime

- IntlError missing-message ("interviewPreparation" / category labels). Flagged as **M1**.
- Network: 4x `/api/interview/jobs` and `/api/interview/sessions` 500s manifesting as toast spam. Skipped per audit rules (dev-env 500s) but the **toast stacking behavior** is in scope (see H1).
