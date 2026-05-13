# Route inventory

All routes prefixed with `/en` (default locale; `localePrefix: "always"`). Dev server runs on `:3010`.

## Marketing / public

| Slug | Path | Notes |
| ---- | ---- | ----- |
| home | `/en` | Landing page |
| pricing | `/en/pricing` | |
| ats-scanner | `/en/ats-scanner` | Public scanner |
| extension-marketing | `/en/extension` | Slothing marketing page |
| vs-index | `/en/vs` | Competitor comparison hub |
| vs-competitor | `/en/vs/<slug>` | Hit a real comparator (e.g. `teal`, `huntr`) — gather slugs from `/en/vs` |
| privacy | `/en/privacy` | |
| terms | `/en/terms` | |

## Auth

| Slug | Path | Notes |
| ---- | ---- | ----- |
| sign-in | `/en/sign-in` | Should still be auditable while bypass is on |

## App workspace (auth-bypass mode, default user)

| Slug | Path | Notes |
| ---- | ---- | ----- |
| dashboard | `/en/dashboard` | Onboarding cards likely visible on fresh DB |
| profile | `/en/profile` | |
| upload | `/en/upload` | |
| documents | `/en/documents` | |
| bank | `/en/bank` | |
| answer-bank | `/en/answer-bank` | |
| studio | `/en/studio` | Document Studio (heavy) |
| builder | `/en/builder` | Redirect → `/studio` |
| tailor | `/en/tailor` | Redirect → `/studio` |
| cover-letter | `/en/cover-letter` | Redirect → `/studio` |
| opportunities | `/en/opportunities` | |
| opportunities-review | `/en/opportunities/review` | Inbound queue |
| opportunity-detail | `/en/opportunities/<id>` | Need a real ID; fall back to placeholder if empty |
| opportunity-research | `/en/opportunities/<id>/research` | Same |
| applications | `/en/applications` | |
| jobs | `/en/jobs` | Redirect → `/opportunities` |
| interview | `/en/interview` | |
| analytics | `/en/analytics` | |
| salary | `/en/salary` | |
| calendar | `/en/calendar` | |
| emails | `/en/emails` | |
| settings | `/en/settings` | |
| extension-connect | `/en/extension/connect` | Companion page for the Chrome extension |

## Audit ordering

For each loop, audit in this order. Marketing first (public, lower data prereqs), then app surfaces:

1. Marketing routes
2. Auth (sign-in)
3. Dashboard, settings (entry points)
4. Profile, upload, documents, bank, answer-bank
5. Studio (heavy; touches builder/tailor/cover-letter redirects)
6. Opportunities tree
7. Applications, interview, calendar, emails, analytics, salary
8. Extension connect

## Sample data needs

- **Opportunity detail / research** — requires at least one row in `jobs` table. If the audit run finds the opportunities list empty, skip these and note in findings.
- **Studio** — needs at least a profile + bank entry. Note empty-state appearance even if data is missing.
