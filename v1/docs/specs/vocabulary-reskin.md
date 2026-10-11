# Spec (deferred) — user-facing vocabulary re-skin

**Status:** DEFERRED — roadmap candidate, not approved. Surfaced by the 2026-06-07 UX audit
(`docs/ui-audit/ux-audit-2026-06-07.md`, finding cluster NU-1/2/3/8/14/15 — "jargon is the #1
new-user barrier"). Owner not 100% on the wording, so it's parked here for a future pass rather
than implemented.

## Problem
The product's internal vocabulary ("Components / Bank / Knowledge / Atomize / Strengthen /
Articulate / JD / verified-draft / confidence") doesn't map to how a non-technical job seeker
thinks ("resume, experience, jobs, cover letter"). A confused-new-user audit found this is the
single biggest comprehension barrier — bigger than any layout issue.

## Scope when picked up
Almost all labels live in `apps/web/src/messages/en.json` (i18n) plus a few hardcoded titles
(e.g. `PageHeader title="Components"` in `components-tab.tsx`). Routes (`/components`,
`/opportunities`) and DB table names stay internal — **labels only**. Every locale file under
`apps/web/src/messages/` must be updated together; component tests asserting label strings will
need updates.

## Proposed mapping (starting point — re-litigate wording before implementing)

| Surface | Current | Proposed | Rationale |
|---|---|---|---|
| Nav + page title | Components | **Experience** / "My Experience" | "Components" reads as a parts bin |
| Throughout | "Bank" / "knowledge bank" | "your experience" / "saved content" | same |
| Studio tab | Knowledge | **My Experience** | "Knowledge 37" is meaningless |
| Nav | Answers | **Application Answers** | answers to what? |
| Nav | Review Queue | **Incoming** (under a unified Jobs area) | two job inboxes confuse |
| Nav | Opportunities | **Jobs** | plainest word |
| Nav | ATS Scanner | **Resume Checker** | "ATS" is recruiter jargon |
| Studio AI | "JD" | "job description" | unexplained abbreviation |
| Card badge | Unverified draft | **Needs review** | "unverified" sounds accusatory |
| Studio | LaTeX / WYSIWYG | **Advanced / Visual** | developer/academic terms |
| Landing | "Atomize your career" | "Set up your experience once" | "atomize" is opaque |

**Keep:** the AI action verbs **Strengthen** and **Draft with AI** — reasonably clear, already
tested, and not flagged as confusing.

## Open questions
- Rename "Opportunities" → "Jobs" everywhere, or keep "Opportunities" as a brand term?
- Does "Components" → "Experience" collide with the existing "experience" bank category?
- Coordinate with marketing copy (B4 — segmenting OSS/developer messaging from the consumer
  flow) so landing + app speak the same language.
