# Slothing — Job Application Assistant

> You're not lazy. Your job search system is.

Your personal job application command center. Upload your career documents, build tailored resumes and cover letters in one workspace, match with opportunities, and prepare for interviews. Slothing does the work for you.

The code lives in the `get-me-job` repo as a pnpm + Turborepo monorepo. Domain: [slothing.work](https://slothing.work).

## Features

- **Knowledge Bank**: Upload resumes, cover letters, and career documents, then extract structured profile data using AI
- **Document Studio**: Build resumes and cover letters from a single `/studio` workspace
- **Studio Files**: Create, select, rename, and delete resume or cover letter files from the Studio file panel
- **Resume/Cover Letter Tabs**: Switch between document types without leaving the Studio
- **Version History**: Track capped resume draft snapshots through Studio version history helpers
- **TipTap Editor Integration**: Convert bank entries into TipTap document JSON for the Studio preview/editor shell
- **AI Panel**: Reserve contextual AI tools in the Studio alongside the document canvas
- **Profile Management**: Edit and manage your professional information
- **Job Matching**: Paste job descriptions and get match scores
- **Interview Prep**: Practice with AI-powered mock interviews (text and voice)

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Workspace**: Turborepo + pnpm workspaces
- **Auth**: NextAuth v5 with Google OAuth, optional Resend magic links
- **Database**: libSQL/Turso with Drizzle schema management
- **AI**: Supports Ollama (free/local) or BYOK (OpenAI, Anthropic, OpenRouter)
- **Document Parsing**: pdf-parse, mammoth, OCR utilities
- **Rich Text Editing**: TipTap
- **UI**: Tailwind CSS + shadcn/ui

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9+
- (Optional) Ollama for free local AI

### Installation

```bash
# Install dependencies
pnpm install

# Configure environment
cp .env.example .env.local

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### Setting up AI

#### Option 1: Ollama (Free, Local)

1. Install Ollama from [ollama.ai](https://ollama.ai)
2. Pull a model: `ollama pull llama3.2`
3. Go to Settings in Slothing and select "Ollama"
4. Test connection

#### Option 2: Bring Your Own Key

1. Go to Settings
2. Select your provider (OpenAI, Anthropic, OpenRouter)
3. Enter your API key
4. Test connection

### Google Integration (Optional)

Connect your Google account to enable:

- **Calendar Sync**: Sync interview schedules with Google Calendar
- **Drive Integration**: Import resumes from Drive, back up documents
- **Gmail**: Import job emails, send emails directly
- **Docs/Sheets**: Export interview notes to Docs, analytics to Sheets
- **Contacts/Tasks**: Save recruiter contacts, sync reminders

**Setup:**

1. Configure `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `NEXTAUTH_SECRET` in `.env.local`
2. Set the Google OAuth redirect URI to `http://localhost:3000/api/auth/callback/google`
3. Go to Settings → Google Integrations
4. Click "Connect Google Account"
5. Grant the requested permissions

See [docs/google-integration/README.md](docs/google-integration/README.md) for detailed setup instructions.

### Columbus Browser Extension (optional)

The Columbus extension auto-fills job applications and imports listings from supported sites directly into your opportunity bank. It's a workspace under `apps/extension/`.

**Quick setup:**

```bash
pnpm --filter @slothing/extension build          # Chrome    → apps/extension/dist/
pnpm --filter @slothing/extension build:firefox  # Firefox   → apps/extension/dist-firefox/
```

**Load it:**

- Chrome: `chrome://extensions` → enable Developer mode → Load unpacked → pick `apps/extension/dist/`
- Firefox: `about:debugging` → Load Temporary Add-on → pick `apps/extension/dist-firefox/manifest.json`

**Try the demo first** (a sample job application form with embedded `JobPosting` JSON-LD, no auth needed):

```bash
node apps/extension/demo/launch-with-extension.mjs
```

Boots a fresh Chromium with the extension pre-loaded and opens the demo form so you can see scraping, the badge, and the popup behavior end-to-end.

**Connect:** click the Columbus icon → **Connect Account**. Opens `/extension/connect` on your locally-running Slothing, generates a token tied to your Slothing session, stores it in extension storage. After connecting, `Cmd+Shift+F` auto-fills, `Cmd+Shift+I` imports a listing.

Full docs: [`apps/extension/README.md`](./apps/extension/README.md).

## Usage

1. **Upload Documents**: Go to Upload and add resumes, cover letters, or supporting career documents
2. **Review Profile**: Check extracted data in My Profile and make corrections
3. **Add Opportunity**: Go to Opportunities and paste a job description
4. **Analyze Match**: Click "Analyze Match" to see how well you fit
5. **Open Document Studio**: Go to `/studio` to create resume and cover letter files
6. **Build Documents**: Use the Resume and Cover Letter tabs, choose a template, select bank entries, and edit the generated draft
7. **Export**: Copy HTML or download a PDF from the Studio
8. **Practice Interview**: Go to Interview Prep and start a mock interview

## Evals

Resume and cover-letter generation evals live under `apps/web/evals/`. Run `pnpm --filter @slothing/web eval -- --mode=resume --limit=5` with an LLM key, or set `EVAL_OFFLINE=1` for a deterministic local smoke run. See [docs/evals.md](docs/evals.md) for cases, metrics, report formats, and judge options.

## Document Studio Architecture

Document Studio is the single document-building surface at `/studio`. Legacy document-building pages redirect there, so one route owns resume and cover letter workflows.

```
/studio
├── Header
│   ├── Resume / Cover Letter tabs
│   ├── Template picker
│   ├── Saved state
│   └── Export actions
├── Left panel
│   ├── Files
│   ├── Version History
│   └── Knowledge bank section picker
├── Center panel
│   └── TipTap-backed document preview/editor shell
└── Right panel
    └── AI Assistant
```

The Studio file panel tracks resume and cover letter files separately while keeping users in the same workspace. Resume drafts use knowledge bank entries, section ordering, visibility controls, template styling, and TipTap document JSON. Version history helpers normalize, compare, and store capped builder snapshots in browser storage under `taida:builder:versions:<document-id>`.

## Project Structure

```
apps/
├── web/
│   ├── src/       # Next.js pages, components, lib, hooks, and types
│   ├── drizzle/   # Database migrations
│   ├── e2e/       # Playwright tests
│   └── evals/     # Resume and cover-letter eval harness
└── extension/     # Columbus browser extension
packages/
└── shared/
    └── src/       # Shared types, Zod schemas, formatters, and scoring logic
```

## Monorepo Workflow

Run commands from the repo root:

```bash
pnpm install
pnpm dev
pnpm run type-check
pnpm run test:run
pnpm run lint
pnpm run build
```

Package-scoped commands:

```bash
pnpm --filter @slothing/web db:migrate
pnpm --filter @slothing/web test:e2e
pnpm --filter @slothing/extension build
pnpm --filter @slothing/extension build:firefox
```

Vercel should use `apps/web` as the project Root Directory, or build from the repo root with the Turborepo pipeline.

## Data Storage

Application data is stored in libSQL/Turso using the schema in `apps/web/src/lib/db/schema.ts`. Local development defaults to `file:./.local.db`; hosted deployments should set `TURSO_DATABASE_URL` and, when required, `TURSO_AUTH_TOKEN`.
Uploaded documents and generated files are stored on disk during local development:

- `.local.db` - Local libSQL database
- `uploads/` - Uploaded documents
- `public/resumes/` - Generated resume files
- Browser storage - Studio version history snapshots

## License

MIT
