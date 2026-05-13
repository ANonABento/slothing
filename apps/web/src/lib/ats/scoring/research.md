# ATS scoring rubric sources

This scanner uses five axes rather than a single opaque score.

- Parseability derives from Jobscan's public ATS guidance: simple text extraction, standard headings, and avoiding complex formatting are foundational to ATS compatibility. Source: https://www.jobscan.co/blog/ats-resume/
- Section completeness follows Jobscan section guidance and Harvard Business School's Hidden Workers report, which describes rigid ATS configuration filters that can exclude qualified candidates. Source: https://www.hbs.edu/managing-the-future-of-work/Documents/research/hiddenworkers09032021.pdf
- Keyword match follows Jobscan's match-rate framing and the open-source Resume-Matcher project's emphasis on comparing resume terms with job-description terms. JD-derived keywords are weighted by source and repetition: explicit keywords, requirements, and title terms count more than generic description terms. Sources: https://www.jobscan.co/blog/ats-resume/ and https://github.com/srbhr/Resume-Matcher
- Dates and tenure follows Hidden Workers, especially the finding that employment gaps and rigid screens can exclude qualified applicants before human review. Source: https://www.hbs.edu/managing-the-future-of-work/Documents/research/hiddenworkers09032021.pdf
- Content quality follows Resume Worded's public scanner dimensions around action verbs, measurable achievements, and recruiter-readable accomplishment language. Source: https://resumeworded.com/resume-scanner

## Implementation notes

- Content checks are deliberately heuristic and transparent. They flag weak/passive language, first-person bullets, buzzwords, action-verb strength, acronym/expansion gaps, inconsistent dates, and hidden/prompt-injection text. Findings are exposed in `contentChecks` and surfaced by the public scanner after a scan.
- Platform detection is URL-pattern based. It recognizes major ATS hosts such as Workday, Greenhouse, Lever, Ashby, Taleo, iCIMS, SuccessFactors, SmartRecruiters, Workable, BrassRing/Kenexa, JazzHR, Recruitee, and Jobvite, then shows platform-specific advice. Unknown hosts return no card.
- Raw-PDF layout detection runs only for uploaded PDFs. `pdfjs-dist` extracts positioned text server-side, then the pure detector flags multi-column layouts, scrambled reading order, header/footer contact text, and table-like grids. Layout extraction is best-effort: parse-resume still returns the profile if layout extraction fails.
- Parseability penalties from PDF layout are capped so formatting risks can lower the score meaningfully without drowning out content and keyword evidence.
- The public scanner keeps JD matching optional. Supplying a JD or JD URL adds keyword scoring, JD match, platform advice, and weighted keyword evidence; scanning a resume alone still produces parseability/content feedback.

## Validation notes

- Focused ATS/component/API suite: `pnpm --filter @slothing/web exec vitest run src/lib/ats src/components/ats src/app/api/ats src/app/api/scanner/parse-resume/route.test.ts`.
- Public scanner E2E coverage includes paste-only scan, disabled-state helper text, no job-URL import on blur, scoring axes, platform/content/referral cards, upsell, and reset.
- PDF layout smoke on May 13, 2026:
  - `e2e/fixtures/test-resume.pdf`: 1467 ms cold load, 0 findings.
  - `tests/fixtures/personas/heavy-formatting/resume.pdf`: 14 ms warm, 3 findings (`multi-column`, `reading-order`, `table-grid`).
  - `tests/fixtures/personas/senior-ic/resume.pdf`: 9 ms warm, 3 findings (`multi-column`, `reading-order`, `table-grid`).
