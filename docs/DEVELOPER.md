# Developer Setup Guide

This guide will help you set up Slothing for local development.

## Prerequisites

- Node.js 18+
- npm 9+
- Git

## Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd slothing-v1

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env.local` file with the following:

```env
# LLM Providers (at least one required for AI features)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
OPENROUTER_API_KEY=sk-or-...

# Optional: Local Ollama
OLLAMA_BASE_URL=http://localhost:11434
```

### LLM Provider Options

| Provider | Environment Variable | Notes |
|----------|---------------------|-------|
| OpenAI | `OPENAI_API_KEY` | GPT-4, GPT-3.5 |
| Anthropic | `ANTHROPIC_API_KEY` | Claude models |
| OpenRouter | `OPENROUTER_API_KEY` | Multi-model access |
| Ollama | `OLLAMA_BASE_URL` | Local, free |

Configure your provider in the app at `/settings`.

## Google Integration Setup

Google integration uses NextAuth for OAuth. Configure the Google OAuth credentials in `.env.local`.

### Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create or select a project
3. Create OAuth 2.0 credentials (Web application type)
4. Add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI
5. Copy the Client ID and Secret to `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
6. Configure OAuth scopes:

```
openid
email
profile
https://www.googleapis.com/auth/calendar
https://www.googleapis.com/auth/calendar.events
https://www.googleapis.com/auth/drive.file
https://www.googleapis.com/auth/drive.readonly
https://www.googleapis.com/auth/gmail.readonly
https://www.googleapis.com/auth/gmail.send
https://www.googleapis.com/auth/documents
https://www.googleapis.com/auth/spreadsheets
https://www.googleapis.com/auth/contacts.readonly
https://www.googleapis.com/auth/tasks
```

### Google API Setup

1. Enable these APIs:
   - Google Calendar API
   - Google Drive API
   - Gmail API
   - Google Docs API
   - Google Sheets API
   - People API
   - Tasks API

### Testing Locally

```bash
# After setup, test in the app:
# 1. Start dev server
npm run dev

# 2. Go to /settings
# 3. Click "Connect Google Account"
# 4. Grant permissions
# 5. Test each feature
```

## Database

Slothing uses Drizzle ORM with libSQL/SQLite. Local development defaults to `file:./.local.db`; hosted deployments can point `TURSO_DATABASE_URL` at Turso and set `TURSO_AUTH_TOKEN` when required.

**Reset database:**
```bash
rm .local.db
npm run dev  # Database recreated on startup
```

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── (app)/          # Authenticated app routes
│   ├── (marketing)/    # Public pages
│   └── api/            # API routes
├── components/
│   ├── ui/             # Base UI components
│   └── [feature]/      # Feature components
├── lib/
│   ├── db/             # Database queries
│   ├── llm/            # LLM client
│   └── [feature]/      # Business logic
├── hooks/              # Custom React hooks
└── types/              # TypeScript types
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 3000) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests |
| `npm run test:run` | Run tests once (CI) |
| `npm run test:e2e` | Run Playwright E2E tests |

## Testing

### Unit Tests (Vitest)

```bash
# Run in watch mode
npm run test

# Run once
npm run test:run

# With coverage
npm run test:coverage
```

### E2E Tests (Playwright)

```bash
# Run all
npm run test:e2e

# Interactive mode
npm run test:e2e:ui

# Specific browser
npm run test:e2e:chromium
```

## Code Style

- TypeScript strict mode
- ESLint with Next.js config
- Tailwind CSS for styling
- Functional React components
- Named exports for components

### Import Order

```tsx
// 1. External packages
import { useState } from "react";
import Link from "next/link";

// 2. Internal absolute imports
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// 3. Relative imports
import { LocalComponent } from "./local";
```

## Debugging

### TypeScript Errors

Restart the TypeScript server:
- VS Code: `Cmd+Shift+P` → "TypeScript: Restart TS Server"

### Database Issues

```bash
# Check database exists
ls -la slothing.db

# Reset if corrupted
rm .local.db && npm run dev
```

### LLM Not Working

1. Check API key in `.env.local`
2. Verify provider config at `/settings`
3. Check browser console for errors

## Making Changes

1. Create a feature branch
2. Make changes
3. Run tests: `npm run test:run`
4. Run lint: `npm run lint`
5. Build check: `npm run build`
6. Submit PR

## Common Issues

### "Database locked" error
Restart the dev server. SQLite WAL mode can cause locks.

### Styles not updating
Clear Next.js cache:
```bash
rm -rf .next && npm run dev
```

### Port 3000 in use
```bash
lsof -i :3000
kill -9 <PID>
```
