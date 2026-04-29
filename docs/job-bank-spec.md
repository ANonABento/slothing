# Job Bank & Opportunity Pipeline — Spec

## Overview

A unified opportunity bank that collects jobs and hackathons from multiple sources (extension scrapers, manual entry, URL paste), lets users review/approve them (tinder-swipe UX), and feeds them into the resume/CV tailoring pipeline.

## Data Model

### Opportunity (Job + Hackathon unified)

```typescript
interface Opportunity {
  id: string;
  type: "job" | "hackathon";
  
  // Core
  title: string;
  company: string;          // or organizer for hackathons
  division?: string;         // e.g., "Hamming AI" under "Forward Inc"
  source: "waterlooworks" | "linkedin" | "indeed" | "greenhouse" | "lever" | "devpost" | "manual" | "url";
  sourceUrl?: string;
  sourceId?: string;
  
  // Location
  city?: string;
  province?: string;
  country?: string;
  postalCode?: string;
  region?: string;
  remoteType?: "remote" | "hybrid" | "onsite";
  additionalLocationInfo?: string;
  
  // Job-specific
  jobType?: "co-op" | "full-time" | "part-time" | "contract" | "internship";
  level?: "junior" | "intermediate" | "senior" | "staff";
  openings?: number;
  workTerm?: string;                  // WaterlooWorks: "2026 - Winter"
  applicationMethod?: string;         // WaterlooWorks: "WaterlooWorks"
  requiredDocuments?: string[];       // ["Resume", "Cover Letter", "Grade Report"]
  targetedDegrees?: string[];         // WaterlooWorks specific
  targetedClusters?: string[];        // WaterlooWorks specific
  
  // Hackathon-specific
  prizes?: string[];
  teamSize?: { min: number; max: number };
  tracks?: string[];                  // themes/categories
  submissionUrl?: string;
  
  // Details (shared)
  summary: string;                    // full description / JD text
  responsibilities?: string[];
  requiredSkills?: string[];
  preferredSkills?: string[];
  techStack?: string[];
  
  // Compensation
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  benefits?: string[];
  
  // Application
  deadline?: string;
  additionalInfo?: string;
  
  // Status & Meta
  status: "pending" | "saved" | "applied" | "interviewing" | "offer" | "rejected" | "expired" | "dismissed";
  scrapedAt?: string;
  savedAt?: string;
  appliedAt?: string;
  tags: string[];
  notes?: string;                     // user notes
  
  // Linked documents
  linkedResumeId?: string;            // tailored resume for this opportunity
  linkedCoverLetterId?: string;       // tailored cover letter
  
  createdAt: string;
  updatedAt: string;
}
```

## Architecture

### Pages

```
/opportunities              — Main bank (list + kanban views, togglable)
/opportunities/[id]         — Detail view + apply actions
/opportunities/review       — Tinder swipe review queue (mobile-first)
```

### Views

#### 1. List View (default)
- Table/card list of all opportunities
- Filters: type (job/hackathon), status, source, tags, remote, tech stack
- Sort: deadline, date scraped, company, salary
- Search: full-text across title, company, description, skills
- Tabs or filter toggle: Jobs | Hackathons | All

#### 2. Kanban View (togglable)
Columns:
```
Pending → Saved → Applied → Interviewing → Offer
                                              ↓
                                          Rejected
```
- Drag cards between columns
- Cards show: title, company, deadline, salary range, tags
- "Pending" column = scraped but not yet approved

#### 3. Detail View (/opportunities/[id])
- Full job/hackathon details (all fields rendered)
- Edit any field inline
- Actions sidebar:
  - "Tailor Resume" → opens Document Studio with this JD pre-loaded
  - "Generate Cover Letter" → same, cover letter mode
  - "Apply" → marks as applied, opens sourceUrl
  - "Dismiss" → removes from active view
- Linked documents section (tailored resume/CV attached to this opportunity)
- Notes text area

#### 4. Swipe Review (/opportunities/review)
- Mobile-first card stack UI
- Shows one opportunity at a time, nicely formatted:
  - Company logo (if available)
  - Title, company, location
  - Key details: salary, remote, tech stack, deadline
  - Truncated description (expand on tap)
- Swipe right = Save (moves to "Saved")
- Swipe left = Dismiss
- Swipe up = Apply now (opens application)
- Configurable: enable/disable in Settings
- Works as PWA on phone while extension scrapes on desktop

## Input Sources

### 1. Extension Scraper (auto)
- Extension scrapes job page → POST /api/opportunities with scraped data
- Status = "pending" (awaits user approval via swipe or manual)
- Extension sends: all fields it can extract + sourceUrl + source type

### 2. Manual Form (/opportunities + "Add" button)
- Form with all fields, grouped by section
- Type toggle: Job | Hackathon (shows/hides relevant fields)
- Smart defaults based on type

### 3. URL Paste (in manual form or dedicated input)
- Paste a job URL → backend scrapes it using existing scraper logic
- Auto-fills the form
- User reviews and saves

### 4. Import from WaterlooWorks (extension-specific)
- Extension detects WaterlooWorks pages
- Scrapes the structured table format (Work Term, Job Type, Level, Region, etc.)
- Maps to Opportunity schema including WW-specific fields

## Integration with Document Studio

### Tailoring Flow
1. User views an opportunity in the bank
2. Clicks "Tailor Resume" → redirects to `/studio?mode=resume&opportunityId=<id>`
3. Document Studio loads the opportunity's description into the AI panel JD input
4. AI panel shows gap analysis for this specific opportunity
5. User tailors resume → saves → resume linked back to opportunity

### Cover Letter Flow
Same but with `/studio?mode=cover-letter&opportunityId=<id>`

### Job Selector in AI Panel
- In Document Studio AI panel, add "Select from Job Bank" button
- Opens a picker showing saved opportunities
- Selecting one loads its JD into the tailor input
- Replaces manual JD paste for saved jobs

## API Routes

```
GET    /api/opportunities              — List (with filters, pagination)
POST   /api/opportunities              — Create (manual or from extension)
GET    /api/opportunities/:id          — Get one
PATCH  /api/opportunities/:id          — Update (edit, status change)
DELETE /api/opportunities/:id          — Delete
POST   /api/opportunities/scrape       — Scrape from URL
PATCH  /api/opportunities/:id/status   — Move status (for kanban drag)
GET    /api/opportunities/review       — Get pending queue for swipe
POST   /api/opportunities/:id/link     — Link resume/cover letter to opportunity
```

## Database

New table `opportunities` with all fields from the schema above. Indexed on: status, type, source, deadline, createdAt. Full-text search on title + company + summary.

For MVP (no Neon): use localStorage like Document Studio. Migration path to Neon same as rest of app.

## Implementation Phases

### Phase 1: Foundation
1. **Create Opportunity data model + API routes** — Schema, CRUD endpoints, localStorage persistence. Type validation.
2. **Build opportunity bank list view** — Table/card list with filters (type, status, source), search, sort. Add opportunity form (manual entry).

### Phase 2: Views & UX  
3. **Add kanban view** — Drag-and-drop columns (Pending → Saved → Applied → Interview → Offer/Rejected). Toggle between list and kanban.
4. **Build opportunity detail page** — Full details, inline editing, action sidebar (Tailor Resume, Generate CV, Apply, Dismiss), linked documents, notes.
5. **Build swipe review queue** — Mobile-first card stack, swipe gestures (right=save, left=dismiss, up=apply). Configurable in settings.

### Phase 3: Integration
6. **Wire opportunity selector into Document Studio AI panel** — "Select from Job Bank" button in AI panel, loads JD, links tailored document back.
7. **Add URL scrape endpoint** — Paste URL → server-side scrape using existing scraper modules → auto-fill form.

### Phase 4: Extension
8. **Wire extension → opportunity bank pipeline** — Extension POST to /api/opportunities, status=pending. Auth via existing extension token system.

### Phase 5: Hackathon Support
9. **Add hackathon-specific UI** — DevPost-style fields (prizes, tracks, team size), hackathon templates in the form, filtered view in the bank.
