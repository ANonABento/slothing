# Overnight report (2026-10-16)

## Round 2: the side panel (after "pin mode, all-site access, auto-save to Seen")

**To try:** `npm run extension`, then press **reload** on the Slothing card in `chrome://extensions`
(Chrome otherwise keeps the old background worker; this bit me in testing). Click the icon: the panel
opens beside the page and follows the tab you're on.

| | |
|---|---|
| **Badge on every page** | Classified in the page, nothing sent: **New** (a posting, just recorded), **Seen** (you've opened it before), **✓** (in your jobs), **Fill** (an application form), **Sent** (applied). Sign-in pages and everything else: no badge. |
| **Jobs → Seen** | Postings you open, newest first, with when you last opened them. Structured data only (Greenhouse API, JSON-LD), never AI, so browsing costs nothing. LinkedIn, which rate-limits, falls back to its page title. Off switch on the Extension page. |
| **Panel** | Seen → **Save to my jobs** → **Tailor resume** (AI or not) without leaving the posting → **Fill form** → you submit → the job moves to **Applied** and the job page shows what you sent (every answer, plus links to the exact resume/letter versions). **Mark applied** for forms it didn't fill. |
| **Multi-step forms** | The job you pick on a form is remembered for the tab, so the next step knows it. |
| **Job-specific answers** | A saved answer that names another of your jobs' companies isn't pasted into this one ("Your saved answer names Lakeside Health"); you can draft instead. Found because "Why our Cardiac ICU?" got the Medical ICU job's answer. |

Tested end to end in Chromium on fixtures (New → Seen → Save → Tailor → Fill → submit → Sent, with the
application recorded) and live: Stripe (Greenhouse) and Lever postings recorded as Seen with full
descriptions; Wikipedia, GitHub's sign-in and a Lever listing page got no badge. Not tested: LinkedIn
logged in (headless gets its sign-up wall), the real toolbar click / side panel opening (headless
can't), Workday's multi-step apply. 158 tests pass; `tailorJob` now backs both the job page and the panel.

Not done from the plan: a Workday-specific driver (each step fills with Fill form; the job is
remembered). The floating in-page button became the side panel instead, as you suggested.

### Review and bugbash (round 2)

A code review found 8 issues; a bugbash in Chromium against fixtures and live Greenhouse confirmed and
fixed them (`FRICTION.md`, 2026-10-16 bugbash rows). Scenarios that now pass: a late-rendering form
(first visit says New, not Seen); a submit the form refuses (not counted) then a real one (counted once);
a native form that goes to a thank-you page; recording turned off; a deleted job seen again; Add job with
a Seen posting's link (opens it, no duplicate); a `#hash` change mid-fill (results kept); auto-detected
submit then Mark applied (one record); server stopped (badge still works, panel says so); key reset and
reconnect (panel recovers by itself). Also fixed from review: switching tabs fast could leave the panel
on the previous tab. 159 tests.

## Round 1

You asked for: templates removed (Resume design replaced them), then the extension and the answer bank,
built properly. **All three are done and committed** (8 commits on `v2-rebuild`, nothing pushed).
`npm run typecheck`, `npm test` (153 tests) and `next build` pass. About 3 AI calls in total.

**Start here (5 minutes):**

```bash
cd v2 && npm install && npm run extension     # esbuild is a new dev dependency
```

Chrome → `chrome://extensions` → Developer mode → **Load unpacked** → `v2/extension/dist`. Then open
Slothing → **Extension** (sidebar) → **Connect extension**. Open any posting and click the Slothing icon
(or Alt+Shift+S). Your :3001 dev server already serves the new pages (I checked `/`, `/answers`,
`/extension` load); the answers table and the extension key were created in your real database by
that check, nothing else was written to it.

## What shipped

| | What it does | Where |
|---|---|---|
| Templates placeholder | Removed from the sidebar and the roadmap. | `cb6c4725` |
| **Answer bank** (`/answers`) | Your answers to application questions. Search, edit in place (⌘↵ saves), copy, delete. An empty bank offers the 8 questions most forms ask; once you have answers, the ones you haven't covered stay as chips. "Draft from profile" (AI) writes a first draft in the tone of your other answers. | `882f63a0` |
| **Extension** (`v2/extension`) | One popup for the open tab. **Save job**: reads the page you're looking at (logins and JavaScript pages work) through the same importer as URL import, and says "Already in your jobs" instead of making duplicates. **Fill form**: name, email, phone, links and current role from your profile; every other question from the bank, including dropdowns and radio groups; the job's tailored resume and cover letter attached as PDFs. Filled fields get a rust outline, fields you'd filled are left alone, nothing is submitted. Then a "Left for you" list (click one to jump to it) with the reason, and **Draft N answers with AI** for questions the bank doesn't have. **Save my answers**: what you typed on the form, reviewed with checkboxes, into the bank. | `18d379d9` + 4 fixes |
| **Extension page** (`/extension`) | Replaces its placeholder: build status, the folder to load, one-click connect (or a connection key to paste), key reset. | `18d379d9` |

The popup is the app: same `ui.tsx` components, same tokens, and it follows your Appearance theme.

### How it's put together (staying small)

- The extension is ~1,200 lines and only reads and writes the page. Deciding what goes in each field is
  `src/lib/autofill.ts` and matching questions is `src/lib/answers.ts`, both in v2 and unit-tested.
  v1's extension was ~25k lines of source with per-site scrapers, a field-mapping store, a learning loop,
  a sidebar and multi-step drivers; none of that came over.
- No content scripts on websites: the popup injects its script only when you click. The one content
  script runs on localhost, for one-click connect, and only on pages with Slothing's meta tag.
- API: `POST /api/extension/<op>` with a key from the Extension page. No CORS headers, so a website
  can't read it; the key stops blind writes. (`/api/pdf` stays open as before.)
- One importer: Save job reuses URL import (`importJobFromPage`), and `postingKey()` matches an
  application form to its job (`…/apply`, `…/application`, Greenhouse/LinkedIn ids).
- Size: +2.9k lines including tests and docs. `SegmentedLinks` moved out of `ui.tsx` so that file has
  no Next imports and the popup can use it.

## Tested how

A Chromium with the built extension (Playwright), against a dev server on a **copy** of last night's
test data (:3002, own folder, so your `.next` was never shared) and the made-up nurse profile.

- **Local fixture** (Greenhouse-style form): all 7 profile/bank fields, a select, a radio group, the
  resume PDF attached; AI drafted the "why" question in 2.4 s and every fact in it is in the profile;
  both typed answers saved back with their source.
- **Live, not submitted**: Greenhouse (GitLab): 7 fields + resume attached, two searchable dropdowns
  answered ("No" to sponsorship, "United States of America"). Lever (Spotify) and Ashby (Ramp): identity
  fields; Ashby needed the late-form fix. Save job on Greenhouse (0.4 s), Ashby, LinkedIn (1 s) and
  **Workday** (0.13 s, which URL import can't read).
- Phone width: every page fits 390 px (the mobile nav is icons only now).

## Bugs found and fixed along the way

Listed under 2026-10-16 in `FRICTION.md`. The big one: Greenhouse's Yes/No questions are react-select
dropdowns that ignore synthetic mousedowns (its wrapper opens on mouseup), and my first version filled
their hidden "required" inputs instead.

## Unfinished / unsure

- **Ashby's Yes/No buttons and Lever's location search** aren't filled (custom widgets, not inputs).
  They show under "Left for you".
- **Chrome only.** Firefox would need a second manifest. Not tested in Edge/Brave (should work).
- **Embedded forms** (a Greenhouse iframe on a company's own careers site): the popup offers "Allow
  embedded forms" (all-sites access, asked once). The code path exists; I couldn't test the permission
  prompt headlessly.
- **I couldn't click the real toolbar icon** headlessly, so the tests open the popup as a page pointed at
  the tab (`popup.html?tab=<id>`). Please check `activeTab` works for you on a real click.
- Saving a job-specific answer ("Why our Medical ICU?") puts it in the bank as is. When a saved answer
  would be *replaced*, the box starts unticked and shows the old answer.
- In Docker, the Extension page shows the container's folder path; load the folder on your machine.
- The roadmap said "No autofill" and called the answer bank "later". I changed both because you
  asked; per our deal, please log real friction with them before more gets added.

## Ideas not built

- Use `answerWarning` (posting terms your profile never uses) on cover letters and summaries too: it's
  the fix for last night's "hemodynamic monitoring" grounding gap, and it's one line in `letterWarnings`.
- "Mark as applied" in the popup after filling, to keep the Jobs list current.
- Multi-step forms (Workday's apply flow): Fill again works per step today; a remembered job per tab
  would save re-picking the job on application sites with another domain.
