# Architecture Overview

Columbus is a Next.js 14 application using the App Router pattern.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS + CSS Variables |
| Components | Shadcn/ui patterns (CVA) |
| Database | SQLite (better-sqlite3) |
| LLM | Multi-provider (OpenAI, Anthropic, Ollama, OpenRouter) |
| Testing | Vitest (unit) + Playwright (e2e) |

## Directory Structure

```
columbus-v1/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (app)/              # Authenticated routes
│   │   │   ├── dashboard/
│   │   │   ├── jobs/
│   │   │   ├── interview/
│   │   │   ├── profile/
│   │   │   ├── salary/
│   │   │   └── ...
│   │   ├── (marketing)/        # Public pages
│   │   └── api/                # API routes
│   │       ├── jobs/
│   │       ├── interview/
│   │       ├── salary/
│   │       └── ...
│   ├── components/
│   │   ├── ui/                 # Base components (Button, Card, etc.)
│   │   ├── layout/             # Layout components (Sidebar)
│   │   └── [feature]/          # Feature-specific components
│   ├── lib/
│   │   ├── db/                 # Database schema and queries
│   │   ├── llm/                # LLM client abstraction
│   │   ├── resume/             # Resume parsing/generation
│   │   ├── ats/                # ATS scoring
│   │   ├── interview/          # Interview prep logic
│   │   ├── salary/             # Salary calculations
│   │   └── utils.ts            # Shared utilities
│   ├── hooks/                  # Custom React hooks
│   └── types/                  # TypeScript definitions
├── docs/                       # Documentation
├── e2e/                        # Playwright E2E tests
└── public/                     # Static assets
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              React Components (Client)               │    │
│  │    Dashboard, Jobs, Interview, Profile pages         │    │
│  └────────────────────────┬────────────────────────────┘    │
│                           │ fetch()                          │
│                           ▼                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              API Routes (Server)                      │    │
│  │         /api/jobs, /api/interview, etc.              │    │
│  └──────────┬──────────────────────┬───────────────────┘    │
│             │                      │                         │
│             ▼                      ▼                         │
│  ┌─────────────────┐    ┌─────────────────────┐             │
│  │   SQLite DB     │    │    LLM Provider     │             │
│  │  (better-sqlite3)│    │ (OpenAI/Anthropic)  │             │
│  └─────────────────┘    └─────────────────────┘             │
└─────────────────────────────────────────────────────────────┘
```

## Key Modules

### Database Layer (`/lib/db/`)

- **schema.ts**: Database connection and table definitions
- **jobs.ts**: Job CRUD operations
- **profile.ts**: Profile management
- **interviews.ts**: Interview sessions and answers
- **notifications.ts**: Notification management

All database operations are synchronous using better-sqlite3.

### LLM Client (`/lib/llm/client.ts`)

Unified interface for multiple LLM providers:

```typescript
const client = new LLMClient(config);
const response = await client.complete({
  messages: [{ role: "user", content: "..." }],
  temperature: 0.7,
  maxTokens: 1000,
});
```

Provider-specific implementations handle API differences.

### API Routes (`/app/api/`)

RESTful API endpoints using Next.js route handlers:

- `GET`: List/fetch resources
- `POST`: Create resources or actions
- `PATCH`: Update resources
- `DELETE`: Remove resources

All routes return JSON and handle errors consistently.

## Component Patterns

### UI Components

Built on Shadcn/ui with class-variance-authority (CVA):

```typescript
const buttonVariants = cva("base-classes", {
  variants: {
    variant: { default: "...", outline: "..." },
    size: { default: "...", sm: "...", lg: "..." },
  },
});
```

### Page Components

Standard structure for feature pages:

```typescript
"use client";

export default function FeaturePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen pb-24">
      {/* Hero Section */}
      <div className="hero-gradient border-b">...</div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">...</div>
    </div>
  );
}
```

## State Management

- **Server State**: Fetched via `fetch()` to API routes
- **Client State**: React `useState` for UI state
- **Persistent State**: SQLite database via API

No external state management library needed due to Next.js patterns.

## Styling

### CSS Variables

Theme colors defined in `globals.css`:

```css
:root {
  --primary: 172 66% 45%;  /* Teal */
  --background: 0 0% 100%;
  /* ... */
}

.dark {
  --primary: 172 66% 50%;
  --background: 220 25% 6%;
  /* ... */
}
```

### Tailwind Classes

Standard spacing and sizing:
- Container: `max-w-6xl mx-auto px-6`
- Section gaps: `py-8`, `space-y-6`
- Cards: `rounded-2xl border bg-card p-6`

## Testing Strategy

### Unit Tests (Vitest)

Test business logic and components:
- Database query functions
- Utility functions
- UI component rendering

### E2E Tests (Playwright)

Test critical user flows:
- Profile creation
- Job tracking
- Interview practice

## Security Considerations

- No authentication (single-user MVP)
- SQLite database is local
- API keys stored in `.env.local`
- No user data sent to external servers (except LLM)

## Performance

- Static page generation where possible
- Client-side navigation via Next.js
- SQLite queries are synchronous and fast
- LLM calls are the main latency source

## Scalability Notes

Current limitations for production:
1. SQLite → PostgreSQL migration needed
2. Authentication required for multi-user
3. File storage needed for document uploads
4. Rate limiting for API routes
